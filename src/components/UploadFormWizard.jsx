// src/components/UploadFormWizard.jsx
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useToast } from 'context/ToastContext';
import DropZone from './process/DropZone';
import FileGrid from './process/FileGrid';
import ConfigureSection from './process/ConfigureSection';
import ProcessingModal from './process/ProcessingModal';
import SuccessSection from './process/SuccessSection';
import LimitErrorModal from './process/LimitErrorModal';
import useR2Upload from '../hooks/useR2Upload';
import { useProcessingLimits } from '../hooks/useProcessingLimits';
import { MAX_FILES_PER_BATCH, humanFileSize } from 'shared/uploadLimits';

const PER_FILE_LIMIT_BYTES = 10 * 1024 * 1024;
const TOTAL_BATCH_LIMIT_BYTES = 100 * 1024 * 1024;

const UploadFormWizard = ({ preUploadedFiles = [] }) => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('webp');
  const [omitFilename, setOmitFilename] = useState(true);
  const [processPhase, setProcessPhase] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [completedFiles, setCompletedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitError, setLimitError] = useState(null);
  const [processedImageCount, setProcessedImageCount] = useState(0);
  const renamedFilesRef = useRef({});

  const { addToast } = useToast();
  const { uploadProgress, uploadFiles, processFromR2 } = useR2Upload();
  const { canProcess, incrementUsage, deductScoops, planLimits } =
    useProcessingLimits();

  const totalSize = useMemo(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);

  // Handle pre-uploaded files from marketing page
  useEffect(() => {
    if (preUploadedFiles.length > 0) {
      const newFiles = [...preUploadedFiles];
      const newStatuses = newFiles.map((file) => ({
        id: file.path || file.name,
        name: file.name,
        size: file.size,
        status: 'pending',
        editableName: file.name,
        file,
      }));

      setFiles(newFiles);
      setFileStatuses(newStatuses);
    }
  }, [preUploadedFiles]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      const currentFileCount = files.length;
      const newFileCount = acceptedFiles.length;
      const totalFileCount = currentFileCount + newFileCount;

      if (totalFileCount > MAX_FILES_PER_BATCH) {
        addToast(
          `You can only upload up to ${MAX_FILES_PER_BATCH} files per batch`,
          'danger',
        );
        return;
      }

      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > PER_FILE_LIMIT_BYTES) {
          addToast(
            `${file.name} exceeds ${humanFileSize(PER_FILE_LIMIT_BYTES)} limit`,
            'danger',
          );
          return false;
        }
        return true;
      });

      const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);
      const newTotalSize = validFiles.reduce(
        (sum, file) => sum + file.size,
        currentTotalSize,
      );

      if (newTotalSize > TOTAL_BATCH_LIMIT_BYTES) {
        addToast(
          `Total batch size cannot exceed ${humanFileSize(TOTAL_BATCH_LIMIT_BYTES)}`,
          'danger',
        );
        return;
      }

      const newFileStatuses = validFiles.map((file) => ({
        file,
        name: file.name,
        editableName: file.name,
        status: 'pending',
      }));

      const rejectedStatuses = rejectedFiles.map((rejected) => ({
        file: rejected.file,
        name: rejected.file.name,
        editableName: rejected.file.name,
        status: 'rejected',
        reason: rejected.errors[0]?.message || 'Invalid file',
      }));

      setFiles((prev) => [...prev, ...validFiles]);
      setFileStatuses((prev) => [
        ...prev,
        ...newFileStatuses,
        ...rejectedStatuses,
      ]);
    },
    [files, addToast],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
    disabled: loading,
    noClick: true, // Disable click on the root element
    noKeyboard: true, // Disable keyboard events on root
  });

  const handleBrowseClick = () => {
    open();
  };

  const handleRemoveFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileStatuses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRenameFile = useCallback((index, newName) => {
    setFileStatuses((prev) =>
      prev.map((status, i) => {
        if (i === index) {
          const updatedStatus = { ...status, editableName: newName };
          renamedFilesRef.current[status.name] = newName;
          return updatedStatus;
        }
        return status;
      }),
    );
  }, []);

  const handleOptimize = useCallback(async () => {
    // Check limits before processing
    const fileSizes = files.map((f) => f.size);
    const limitCheck = canProcess(files.length, fileSizes);

    if (!limitCheck.allowed) {
      setLimitError({ reason: limitCheck.reason, limit: limitCheck.limit });
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setProcessPhase('uploading');
    setStartTime(Date.now());

    try {
      const currentStatuses = fileStatuses.filter(
        (status) => status.status === 'pending',
      );

      const filesWithRenames = currentStatuses.map((status) => {
        const editableName = status.editableName || status.name;
        return new File([status.file], editableName, {
          type: status.file.type,
        });
      });

      setFileStatuses([]);
      setTimeout(() => {
        setFileStatuses(
          filesWithRenames.map((file) => ({
            file,
            name: file.name,
            editableName: file.name,
            status: 'processing',
          })),
        );
      }, 100);

      const { batchId, uploadedFiles } = await uploadFiles(filesWithRenames);

      setProcessPhase('processing');

      const result = await processFromR2(
        batchId,
        uploadedFiles,
        exportType,
        omitFilename,
      );

      const imageCount = uploadedFiles.length;

      // Update usage after successful processing (for daily tracking)
      await incrementUsage(imageCount);

      // Deduct scoops only if using scoop-based limit (PAYG or Plus/Pro fallback)
      if (limitCheck.limit === 'scoops') {
        await deductScoops(imageCount);
      }

      setProcessedImageCount(imageCount);
      setEndTime(Date.now());
      setProcessPhase('complete');
      setCompletedFiles(uploadedFiles.map((f) => f.originalName));
      setDownloadUrl(result.downloadUrl);

      // Show success section
      setTimeout(() => {
        setShowSuccess(true);
        setProcessPhase(null);
      }, 1000);

      addToast('Images processed successfully!', 'success');
    } catch (error) {
      console.error('Processing error:', error);
      addToast(error.message || 'Failed to process images', 'danger');
      setProcessPhase(null);
    } finally {
      setLoading(false);
    }
  }, [
    files,
    fileStatuses,
    exportType,
    omitFilename,
    uploadFiles,
    processFromR2,
    addToast,
    canProcess,
    incrementUsage,
    deductScoops,
    planLimits,
  ]);

  const handleCancel = useCallback(() => {
    setLoading(false);
    setFileStatuses([]);
    setFiles([]);
    setProcessPhase(null);
    addToast('Processing cancelled', 'warning');
  }, [addToast]);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    const timestamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace('T', '-')
      .replace(/:/g, '');
    link.download = `ImageScoop-${timestamp}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Download started!', 'success');
  }, [downloadUrl, addToast]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setFileStatuses([]);
    setProcessPhase(null);
    setStartTime(null);
    setEndTime(null);
    setCompletedFiles([]);
    setShowSuccess(false);
    setDownloadUrl(null);
    renamedFilesRef.current = {};
  }, []);

  const processingTime = useMemo(() => {
    if (startTime && endTime) {
      return endTime - startTime;
    }
    return 0;
  }, [startTime, endTime]);

  const progress = useMemo(() => {
    if (processPhase === 'uploading') {
      return (
        Math.round((uploadProgress?.loaded / uploadProgress?.total) * 100) || 0
      );
    }
    if (processPhase === 'processing') {
      return 75;
    }
    if (processPhase === 'complete') {
      return 100;
    }
    return 0;
  }, [processPhase, uploadProgress]);

  return (
    <div {...getRootProps()} style={{ minHeight: '400px' }}>
      {/* Drop Zone - Shows empty state or drag overlay */}
      {!showSuccess && (
        <DropZone
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          hasFiles={files.length > 0}
          onBrowseClick={handleBrowseClick}
        />
      )}

      {/* Upload Section - Always visible unless success is shown */}
      {!showSuccess && files.length > 0 && (
        <>
          {/* File Grid */}
          <FileGrid
            fileStatuses={fileStatuses}
            onRemove={handleRemoveFile}
            onRename={handleRenameFile}
          />

          {/* Configure Section - Show when files are present */}
          <ConfigureSection
            exportType={exportType}
            setExportType={setExportType}
            omitFilename={omitFilename}
            setOmitFilename={setOmitFilename}
            onOptimize={handleOptimize}
            filesCount={files.length}
          />
        </>
      )}

      {/* Processing Modal */}
      {processPhase && (
        <ProcessingModal
          phase={processPhase}
          progress={progress}
          onCancel={processPhase !== 'complete' ? handleCancel : null}
        />
      )}

      {/* Success Section */}
      {showSuccess && (
        <SuccessSection
          totalSize={totalSize}
          optimizedSize={totalSize * 0.3}
          processingTime={processingTime}
          completedFiles={completedFiles}
          processedFiles={files}
          fileCount={files.length}
          processedImageCount={processedImageCount}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}

      {/* Limit Error Modal */}
      {showLimitModal && limitError && (
        <LimitErrorModal
          limitType={limitError.limit}
          reason={limitError.reason}
          onClose={() => setShowLimitModal(false)}
        />
      )}
    </div>
  );
};

UploadFormWizard.propTypes = {
  preUploadedFiles: PropTypes.arrayOf(PropTypes.object),
};

export default UploadFormWizard;
