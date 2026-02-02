import { useState, useCallback } from 'react';
import { useToast } from 'context/ToastContext';
import useAnalytics from './useAnalytics';

const useR2Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const { addToast } = useToast();
  const {
    trackImageUpload,
    trackFormatConversion,
    trackExportDownload,
    trackError,
    trackConversionComplete,
    trackConversionStats,
  } = useAnalytics();

  const toastWithLog = (message, variant = 'info') => {
    // eslint-disable-next-line no-console
    console.log(`[toast:${variant}] ${message}`);
    addToast(message, variant);
  };

  const getUploadUrls = useCallback(async (files) => {
    const response = await fetch('/.netlify/functions/get-upload-urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: files.map((file) => ({
          name: file.name,
          type: file.type,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get upload URLs');
    }

    return response.json();
  }, []);

  const uploadFileToR2 = useCallback(async (file, uploadUrl, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }, []);

  const uploadFiles = useCallback(
    async (files) => {
      setUploading(true);
      setUploadProgress({});

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      trackImageUpload(files.length, totalSize);

      try {
        const { batchId, uploadUrls } = await getUploadUrls(files);

        const uploadPromises = uploadUrls.map(async (urlData, index) => {
          const file = files[index];

          await uploadFileToR2(file, urlData.uploadUrl, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          });

          return {
            key: urlData.key,
            originalName: file.name,
            size: file.size,
          };
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        setUploading(false);
        return { batchId, uploadedFiles };
      } catch (error) {
        setUploading(false);
        trackError('upload_error', error.message || 'Upload failed');

        // Capture upload error in Sentry
        if (window.Sentry) {
          window.Sentry.captureException(error, {
            tags: {
              operation: 'r2_upload',
              errorType: 'upload_error',
            },
            extra: {
              errorMessage: error.message,
              fileCount: files?.length,
            },
          });
        }

        toastWithLog(error.message || 'Upload failed', 'danger');
        throw error;
      }
    },
    [getUploadUrls, uploadFileToR2, trackImageUpload, trackError],
  );

  const processFromR2 = useCallback(
    async (batchId, uploadedFiles, format, omitFilename = false) => {
      const startTime = Date.now();
      const fromFormat =
        uploadedFiles[0]?.originalName?.split('.').pop() || 'unknown';
      trackFormatConversion(fromFormat, format, uploadedFiles.length);

      try {
        const response = await fetch('/.netlify/functions/process-from-r2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batchId,
            files: uploadedFiles,
            format,
            omitFilename,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Processing failed');
        }

        const result = await response.json();
        const processingTime = Date.now() - startTime;
        trackConversionComplete(uploadedFiles.length, processingTime);
        trackExportDownload(format, uploadedFiles.length, result.size || 0);

        // Calculate storage saved (original size - processed size)
        const originalSize = uploadedFiles.reduce(
          (sum, file) => sum + (file.size || 0),
          0,
        );
        const processedSize = result.size || 0;
        const storageSaved = Math.max(0, originalSize - processedSize);

        // Update Firebase stats
        await trackConversionStats(uploadedFiles.length, storageSaved);

        return result;
      } catch (error) {
        trackError('processing_error', error.message || 'Processing failed');

        // Capture processing error in Sentry
        if (window.Sentry) {
          window.Sentry.captureException(error, {
            tags: {
              operation: 'r2_processing',
              errorType: 'processing_error',
              format,
            },
            extra: {
              errorMessage: error.message,
              fileCount: uploadedFiles?.length,
            },
          });
        }

        toastWithLog(error.message || 'Processing failed', 'danger');
        throw error;
      }
    },
    [
      trackFormatConversion,
      trackConversionComplete,
      trackExportDownload,
      trackError,
      trackConversionStats,
    ],
  );

  return {
    uploading,
    uploadProgress,
    uploadFiles,
    processFromR2,
  };
};

export default useR2Upload;
