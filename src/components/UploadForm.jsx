// src/components/UploadForm.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from 'context/ToastContext';
import FormContainer from './FormContainer';
import DropZone from './DropZone';
import FilesList from './FilesList';
import ExportTypeSelector from './ExportTypeSelector';
import Button from './Button';
import useFileProcessor from '../hooks/useFileProcessor';

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('webp');
  const { addToast } = useToast();

  const clearForm = useCallback(() => {
    setFiles([]);
    setFileStatuses([]);
    setLoading(false);
    setExportType('webp');
  }, []);

  const { processFiles, cancelProcessing, isCancelled } = useFileProcessor({
    files,
    exportType,
    setFileStatuses,
    setLoading,
    clearForm,
    addToast,
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        addToast('Maximum of 5 files allowed', 'danger');
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        status: 'pending',
        progress: 0,
        file,
      }));
      setFiles(acceptedFiles);
      setFileStatuses(newFiles);
    },
    [addToast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'], // Added .webp support
    },
    disabled: loading,
    maxFiles: 5,
  });

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
    (e) => {
      e.preventDefault();
      if (files.length === 0) {
        addToast('Please select at least one file', 'danger');
        return;
      }

      setFileStatuses((prev) =>
        prev.map((file) => ({ ...file, status: 'processing', progress: 0 })),
      );
      setLoading(true);
      processFiles();
    },
    [files.length, processFiles, addToast],
  );

  const handleCancel = useCallback(() => {
    cancelProcessing();
    addToast('Processing cancelled', 'warning');
  }, [cancelProcessing, addToast]);

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <DropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          loading={loading}
        />

        {fileStatuses.length > 0 && (
          <FilesList
            fileStatuses={fileStatuses}
            handleRemoveFile={handleRemoveFile}
            loading={loading}
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
            disabled={isCancelled}
          >
            {isCancelled ? 'Cancelling...' : 'Cancel Processing'}
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
    </FormContainer>
  );
};

export default UploadForm;
