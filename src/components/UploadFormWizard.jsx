// src/components/UploadFormWizard.jsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from 'context/ToastContext';
import WizardContainer from './WizardContainer';
import UploadStep from './wizard/UploadStep';
import ReviewStep from './wizard/ReviewStep';
import ProcessingStep from './wizard/ProcessingStep';
import SuccessStep from './wizard/SuccessStep';
import useR2Upload from '../hooks/useR2Upload';
import { MAX_FILES_PER_BATCH, humanFileSize } from 'shared/uploadLimits';

const PER_FILE_LIMIT_BYTES = 10 * 1024 * 1024;
const TOTAL_BATCH_LIMIT_BYTES = 100 * 1024 * 1024;

const UploadFormWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const renamedFilesRef = useRef({});

  const { addToast } = useToast();
  const { uploadProgress, uploadFiles, processFromR2 } = useR2Upload();

  const totalSize = useMemo(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);

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

      if (validFiles.length > 0) {
        // If already on step 2, force a scroll by briefly changing step
        if (currentStep === 2) {
          setCurrentStep(1);
          setTimeout(() => {
            setCurrentStep(2);
          }, 50);
        } else {
          setTimeout(() => {
            setCurrentStep(2);
          }, 100);
        }
      }
    },
    [files, addToast, currentStep],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
    disabled: loading,
  });

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
    setLoading(true);
    setProcessPhase('uploading');
    setStartTime(Date.now());
    setCurrentStep(3);

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

      setEndTime(Date.now());
      setProcessPhase('complete');
      setProcessedCount(uploadedFiles.length);
      setCompletedFiles(uploadedFiles.map((f) => f.originalName));

      const link = document.createElement('a');
      link.href = result.downloadUrl;
      const timestamp = new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', '-')
        .replace(/:/g, '');
      link.download = `ImageScoop-${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCurrentStep(4);
      addToast('Images processed successfully!', 'success');
    } catch (error) {
      console.error('Processing error:', error);
      addToast(error.message || 'Failed to process images', 'danger');
      setProcessPhase(null);
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  }, [
    fileStatuses,
    exportType,
    omitFilename,
    uploadFiles,
    processFromR2,
    addToast,
  ]);

  const handleCancel = useCallback(() => {
    setLoading(false);
    setFileStatuses([]);
    setFiles([]);
    setProcessPhase(null);
    setCurrentStep(1);
    addToast('Processing cancelled', 'warning');
  }, [addToast]);

  const handleDownload = useCallback(() => {
    addToast('Download started', 'success');
  }, [addToast]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setFileStatuses([]);
    setProcessPhase(null);
    setProcessedCount(0);
    setStartTime(null);
    setEndTime(null);
    setCompletedFiles([]);
    setCurrentStep(1);
    renamedFilesRef.current = {};
  }, []);

  const processingTime = useMemo(() => {
    if (startTime && endTime) {
      return endTime - startTime;
    }
    return 0;
  }, [startTime, endTime]);

  return (
    <WizardContainer currentStep={currentStep} onStepChange={setCurrentStep}>
      {/* Step 1: Upload */}
      <UploadStep
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />

      {/* Step 2: Review & Configure */}
      <ReviewStep
        fileStatuses={fileStatuses}
        handleRemoveFile={handleRemoveFile}
        handleRenameFile={handleRenameFile}
        exportType={exportType}
        setExportType={setExportType}
        omitFilename={omitFilename}
        setOmitFilename={setOmitFilename}
        onOptimize={handleOptimize}
      />

      {/* Step 3: Processing */}
      <ProcessingStep
        phase={processPhase}
        uploadProgress={uploadProgress}
        filesCount={files.length}
        processedCount={processedCount}
        startTime={startTime}
        onCancel={handleCancel}
      />

      {/* Step 4: Success */}
      <SuccessStep
        totalSize={totalSize}
        optimizedSize={totalSize * 0.3}
        processingTime={processingTime}
        completedFiles={completedFiles}
        onDownload={handleDownload}
        onReset={handleReset}
      />
    </WizardContainer>
  );
};

export default UploadFormWizard;
