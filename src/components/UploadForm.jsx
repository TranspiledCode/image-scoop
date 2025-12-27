// src/components/UploadForm.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from 'context/ToastContext';
import FormContainer from './FormContainer';
import DropZone from './DropZone';
import FilesList from './FilesList';
import ExportTypeSelector from './ExportTypeSelector';
import Button from './Button';
import useR2Upload from '../hooks/useR2Upload';
import ProcessSummary from './ProcessSummary';
import { MAX_FILES_PER_BATCH, humanFileSize } from 'shared/uploadLimits';

const PER_FILE_LIMIT_BYTES = 10 * 1024 * 1024;
const TOTAL_BATCH_LIMIT_BYTES = 100 * 1024 * 1024;

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('webp');
  const [processPhase, setProcessPhase] = useState(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [completedFiles, setCompletedFiles] = useState([]);
  const { addToast } = useToast();

  const logToast = useCallback(
    (message, variant = 'info') => {
      // eslint-disable-next-line no-console
      console.log(`[toast:${variant}] ${message}`);
      addToast(message, variant);
    },
    [addToast],
  );

  const clearForm = useCallback(() => {
    setFiles([]);
    setFileStatuses([]);
    setLoading(false);
    setExportType('webp');
    setProcessPhase(null);
    setProcessedCount(0);
    setStartTime(null);
    setEndTime(null);
    setCompletedFiles([]);
  }, []);

  const { uploadFiles, processFromR2, uploadProgress } = useR2Upload();

  const limitMessages = useMemo(
    () => ({
      maxFiles: MAX_FILES_PER_BATCH,
      perFile: humanFileSize(PER_FILE_LIMIT_BYTES),
      total: humanFileSize(TOTAL_BATCH_LIMIT_BYTES),
    }),
    [],
  );

  const validateDroppedFiles = useCallback(
    (incomingFiles) => {
      const validFiles = [];
      const rejectedFiles = [];
      let runningTotal = 0;

      for (const file of incomingFiles) {
        if (validFiles.length >= MAX_FILES_PER_BATCH) {
          rejectedFiles.push({
            file,
            reason: `Maximum ${MAX_FILES_PER_BATCH} files per batch`,
          });
          continue;
        }

        if (file.size > PER_FILE_LIMIT_BYTES) {
          rejectedFiles.push({
            file,
            reason: `Exceeds ${limitMessages.perFile} limit (${humanFileSize(file.size)})`,
          });
          continue;
        }

        if (runningTotal + file.size > TOTAL_BATCH_LIMIT_BYTES) {
          rejectedFiles.push({
            file,
            reason: `Would exceed ${limitMessages.total} batch limit`,
          });
          continue;
        }

        validFiles.push(file);
        runningTotal += file.size;
      }

      return { validFiles, rejectedFiles, totalSize: runningTotal };
    },
    [limitMessages.perFile, limitMessages.total],
  );

  const handleDrop = useCallback(
    (acceptedFiles, fileRejections = []) => {
      if (loading) return;

      const dropzoneRejected = fileRejections.map((rejection) => {
        let reason = 'File rejected';
        rejection.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            reason = `Exceeds ${limitMessages.perFile} limit (${humanFileSize(rejection.file.size)})`;
          } else if (error.code === 'too-many-files') {
            reason = `Maximum ${MAX_FILES_PER_BATCH} files per batch`;
          } else {
            reason = error.message || 'File rejected';
          }
        });
        return { file: rejection.file, reason };
      });

      if (acceptedFiles.length === 0 && dropzoneRejected.length > 0) {
        const rejectedStatuses = dropzoneRejected.map(({ file, reason }) => ({
          name: file.name,
          status: 'rejected',
          progress: 0,
          file,
          reason,
        }));
        setFiles([]);
        setFileStatuses(rejectedStatuses);
        logToast(
          `All ${dropzoneRejected.length} file${dropzoneRejected.length === 1 ? '' : 's'} rejected. See list below.`,
          'danger',
        );
        return;
      }

      const { validFiles, rejectedFiles, totalSize } =
        validateDroppedFiles(acceptedFiles);

      const allRejected = [...dropzoneRejected, ...rejectedFiles];

      if (validFiles.length === 0 && allRejected.length > 0) {
        const rejectedStatuses = allRejected.map(({ file, reason }) => ({
          name: file.name,
          status: 'rejected',
          progress: 0,
          file,
          reason,
        }));
        setFiles([]);
        setFileStatuses(rejectedStatuses);
        logToast(
          `All ${allRejected.length} file${allRejected.length === 1 ? '' : 's'} rejected. See list below.`,
          'danger',
        );
        return;
      }

      const validStatuses = validFiles.map((file) => ({
        name: file.name,
        status: 'pending',
        progress: 0,
        file,
      }));

      const rejectedStatuses = allRejected.map(({ file, reason }) => ({
        name: file.name,
        status: 'rejected',
        progress: 0,
        file,
        reason,
      }));

      const allStatuses = [...validStatuses, ...rejectedStatuses];

      setFiles(validFiles);
      setFileStatuses(allStatuses);

      // Clear previous summary when new files are dropped
      setProcessPhase(null);
      setProcessedCount(0);
      setStartTime(null);
      setEndTime(null);
      setCompletedFiles([]);

      if (allRejected.length > 0) {
        const exceededLimit = allRejected.some((r) =>
          r.reason.includes('Maximum'),
        );
        if (exceededLimit && validFiles.length === MAX_FILES_PER_BATCH) {
          logToast(
            `Accepted first ${MAX_FILES_PER_BATCH} files. ${allRejected.length} additional file${allRejected.length === 1 ? '' : 's'} rejected (limit: ${MAX_FILES_PER_BATCH} per batch).`,
            'warning',
          );
        } else {
          logToast(
            `${validFiles.length} accepted, ${allRejected.length} rejected. See list below.`,
            'warning',
          );
        }
      } else {
        const readyMessage = `${validFiles.length} file${validFiles.length === 1 ? '' : 's'} ready (${humanFileSize(
          totalSize,
        )} total).`;
        logToast(readyMessage, 'info');
      }
    },
    [limitMessages.perFile, loading, logToast, validateDroppedFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    disabled: loading,
    maxSize: PER_FILE_LIMIT_BYTES,
  });

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  const handleRemoveFile = useCallback(
    (index, event) => {
      if (loading) return;
      event.stopPropagation();
      event.preventDefault();

      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setFileStatuses((prevStatuses) =>
        prevStatuses.filter((_, i) => i !== index),
      );
    },
    [loading],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (files.length === 0) {
        logToast('Please select at least one file', 'danger');
        return;
      }

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      if (files.length > MAX_FILES_PER_BATCH) {
        const message = `You can upload up to ${MAX_FILES_PER_BATCH} files per batch.`;
        logToast(message, 'danger');
        return;
      }

      if (totalSize > TOTAL_BATCH_LIMIT_BYTES) {
        const message = `Total upload size exceeds ${limitMessages.total}. Please remove some files.`;
        logToast(message, 'danger');
        return;
      }

      setLoading(true);
      setProcessPhase(null);
      setStartTime(null);
      setEndTime(null);
      setProcessedCount(0);

      // Clear old statuses first
      setFileStatuses([]);

      // Then set new statuses in next tick
      setTimeout(() => {
        setFileStatuses(
          files.map((file) => ({
            name: file.name,
            status: 'processing',
            progress: 0,
            file,
          })),
        );
      }, 0);

      try {
        const start = Date.now();
        setStartTime(start);
        setProcessPhase('uploading');
        logToast('Uploading files...', 'info');
        const { batchId, uploadedFiles } = await uploadFiles(files);

        setProcessPhase('processing');
        logToast('Processing images...', 'info');
        setFileStatuses((prev) =>
          prev.map((file) => ({ ...file, status: 'processing' })),
        );

        const result = await processFromR2(batchId, uploadedFiles, exportType);

        const end = Date.now();
        setEndTime(end);
        setProcessPhase('complete');
        setProcessedCount(result.filesProcessed || files.length);
        setCompletedFiles(files.map((file) => file.name));
        setFileStatuses((prev) =>
          prev.map((file) => ({ ...file, status: 'success' })),
        );
        setLoading(false);

        logToast('Processing complete!', 'success');

        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `processed-images-${batchId}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clear files after successful processing to prevent reprocessing
        setTimeout(() => {
          setFiles([]);
          setFileStatuses([]);
        }, 2000);
      } catch (error) {
        console.error('Processing error:', error);
        setFileStatuses((prev) =>
          prev.map((file) => ({ ...file, status: 'error' })),
        );
        logToast(error.message || 'Processing failed', 'danger');
        setLoading(false);
        setProcessPhase(null);
      }
    },
    [
      files,
      limitMessages.total,
      logToast,
      uploadFiles,
      processFromR2,
      exportType,
      clearForm,
    ],
  );

  const handleCancel = useCallback(() => {
    setLoading(false);
    setFileStatuses([]);
    setFiles([]);
    setProcessPhase(null);
    logToast('Processing cancelled', 'warning');
  }, [logToast]);

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <DropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          loading={loading}
          limitText={
            <>
              Up to {MAX_FILES_PER_BATCH} images •{' '}
              {humanFileSize(PER_FILE_LIMIT_BYTES)} each •{' '}
              {humanFileSize(TOTAL_BATCH_LIMIT_BYTES)} total per batch
            </>
          }
        />

        {fileStatuses.length > 0 && (
          <FilesList
            fileStatuses={fileStatuses}
            handleRemoveFile={handleRemoveFile}
            loading={loading}
            totalSize={totalSize}
            maxFiles={MAX_FILES_PER_BATCH}
            maxTotalSize={TOTAL_BATCH_LIMIT_BYTES}
          />
        )}

        <ExportTypeSelector
          exportType={exportType}
          setExportType={setExportType}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={loading || files.length === 0}
          fullWidth
        >
          {loading ? 'Processing...' : 'Process Images'}
        </Button>

        {loading && (
          <Button
            type="button"
            fullWidth
            variant="danger"
            onClick={handleCancel}
          >
            Cancel Processing
          </Button>
        )}

        {fileStatuses.length > 0 && (
          <Button
            type="button"
            fullWidth
            variant="secondary"
            onClick={clearForm}
            disabled={loading}
          >
            Clear Form
          </Button>
        )}
      </form>

      <ProcessSummary
        phase={processPhase}
        uploadProgress={uploadProgress}
        filesCount={files.length}
        totalSize={totalSize}
        processedCount={processedCount}
        startTime={startTime}
        endTime={endTime}
        completedFiles={completedFiles}
      />
    </FormContainer>
  );
};

export default UploadForm;
