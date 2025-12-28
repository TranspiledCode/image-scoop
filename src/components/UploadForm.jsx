// src/components/UploadForm.jsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';
import { useToast } from 'context/ToastContext';
import FormContainer from './FormContainer';
import DropZone from './DropZone';
import FilesList from './FilesList';
import SettingsPanel from './SettingsPanel';
import WorkflowSteps from './WorkflowSteps';
import Button from './Button';
import useR2Upload from '../hooks/useR2Upload';
import ProcessSummary from './ProcessSummary';
import { MAX_FILES_PER_BATCH, humanFileSize } from 'shared/uploadLimits';

const PER_FILE_LIMIT_BYTES = 10 * 1024 * 1024;
const TOTAL_BATCH_LIMIT_BYTES = 100 * 1024 * 1024;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('webp');
  const [omitFilename, setOmitFilename] = useState(false);
  const [processPhase, setProcessPhase] = useState(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [completedFiles, setCompletedFiles] = useState([]);
  const { addToast } = useToast();

  // Track renamed files immediately to avoid state timing issues
  const renamedFilesRef = useRef(new Map());

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
        editableName: file.name,
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

  const handleRenameFile = useCallback(
    (index, newName) => {
      if (loading) return;

      setFileStatuses((prevStatuses) => {
        const updated = prevStatuses.map((status, i) => {
          if (i === index) {
            // Store rename in ref immediately
            renamedFilesRef.current.set(status.file, newName);
            return { ...status, editableName: newName };
          }
          return status;
        });
        return updated;
      });

      logToast(`File renamed to: ${newName}`, 'success');
    },
    [loading, logToast],
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

      const currentStatuses = fileStatuses;

      setFileStatuses([]);

      setTimeout(() => {
        setFileStatuses(
          files.map((file) => {
            const existingStatus = currentStatuses.find((s) => s.file === file);
            return {
              name: file.name,
              editableName: existingStatus?.editableName || file.name,
              status: 'processing',
              progress: 0,
              file,
            };
          }),
        );
      }, 0);

      try {
        const start = Date.now();
        setStartTime(start);
        setProcessPhase('uploading');
        logToast('Uploading files...', 'info');

        // Create files array with renamed names - use ref for immediate access
        const filesWithRenames = files.map((file) => {
          // Check ref first for immediate rename tracking
          const renamedName = renamedFilesRef.current.get(file) || file.name;

          // Create a new File object with the renamed name if it was changed
          if (renamedName !== file.name) {
            return new File([file], renamedName, { type: file.type });
          }
          return file;
        });

        const { batchId, uploadedFiles } = await uploadFiles(filesWithRenames);

        setProcessPhase('processing');
        logToast('Processing images...', 'info');
        setFileStatuses((prev) =>
          prev.map((file) => ({ ...file, status: 'processing' })),
        );

        const result = await processFromR2(
          batchId,
          uploadedFiles,
          exportType,
          omitFilename,
        );

        const end = Date.now();
        setEndTime(end);
        setProcessPhase('complete');
        setProcessedCount(result.filesProcessed || files.length);
        setCompletedFiles(filesWithRenames.map((file) => file.name));
        setFileStatuses((prev) =>
          prev.map((file) => ({ ...file, status: 'success' })),
        );
        setLoading(false);

        logToast('Processing complete!', 'success');

        // Create timestamp for unique filename (YYYYMMDD-HHMM format)
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `ImageScoop-${timestamp}.zip`;
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
      omitFilename,
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

  // Calculate current workflow step
  const currentStep = useMemo(() => {
    if (processPhase === 'complete') return 4; // Download
    if (processPhase === 'processing' || processPhase === 'uploading') return 3; // Process
    if (fileStatuses.length > 0) return 2; // Configure
    return 1; // Upload
  }, [processPhase, fileStatuses.length]);

  return (
    <FormContainer>
      {fileStatuses.length > 0 && <WorkflowSteps currentStep={currentStep} />}

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
            handleRenameFile={handleRenameFile}
            loading={loading}
            totalSize={totalSize}
            maxFiles={MAX_FILES_PER_BATCH}
            maxTotalSize={TOTAL_BATCH_LIMIT_BYTES}
          />
        )}

        {fileStatuses.length > 0 && (
          <SettingsPanel
            exportType={exportType}
            setExportType={setExportType}
            omitFilename={omitFilename}
            setOmitFilename={setOmitFilename}
            disabled={loading}
          />
        )}

        <ButtonGroup>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || files.length === 0}
            fullWidth
            size="large"
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

          {fileStatuses.length > 0 && !loading && (
            <Button
              type="button"
              fullWidth
              variant="outline"
              onClick={clearForm}
            >
              Clear Form
            </Button>
          )}
        </ButtonGroup>
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
