// src/components/UploadForm.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from 'context/ToastContext'; // Import useToast hook

import FormContainer from './FormContainer';
import DropZone from './DropZone';
import FilesList from './FilesList';
import ProcessingMode from './ProcessingMode';
import ExportTypeSelector from './ExportTypeSelector'; // Import the new component
import BucketInput from './BucketInput';
import Button from './Button';
import useFileProcessor from '../hooks/useFileProcessor';

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [processingMode, setProcessingMode] = useState('local');
  const [bucketLocation, setBucketLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('webp'); // New state for export type
  const { addToast } = useToast(); // Get the addToast function from ToastContext

  const { processFiles, cancelProcessing } = useFileProcessor({
    files,
    processingMode,
    bucketLocation,
    exportType,
    setFileStatuses,
    setLoading,
  });

  const clearForm = () => {
    setFiles([]);
    setFileStatuses([]);
    setBucketLocation('');
    setLoading(false);
    setExportType('webp');
  };

  const handleDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      addToast('Maximum number of files exceeded', 'danger');
      return;
    }

    setFiles(acceptedFiles);
    setFileStatuses(
      acceptedFiles.map((file) => ({
        name: file.name,
        status: 'pending',
        progress: 0,
        file,
      })),
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    disabled: loading,
    maxFiles: 5,
  });

  const handleRemoveFile = (index, event) => {
    if (loading) return;
    event.stopPropagation();
    event.preventDefault();

    const updatedFiles = [...files];
    const updatedStatuses = [...fileStatuses];
    updatedFiles.splice(index, 1);
    updatedStatuses.splice(index, 1);
    setFiles(updatedFiles);
    setFileStatuses(updatedStatuses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      addToast('Please select at least one file.', 'danger');
      return;
    }
    if (processingMode === 'aws' && !bucketLocation) {
      addToast('Please enter a bucket location.', 'danger');
      return;
    }

    // Update file statuses to 'processing'
    setFileStatuses((prevStatuses) =>
      prevStatuses.map((file) => ({
        ...file,
        status: 'processing',
      })),
    );

    setLoading(true);
    processFiles();
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <DropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          loading={loading}
        />

        {files.length > 0 && (
          <FilesList
            fileStatuses={fileStatuses}
            handleRemoveFile={handleRemoveFile}
            loading={loading}
          />
        )}

        <ProcessingMode
          processingMode={processingMode}
          setProcessingMode={setProcessingMode}
          loading={loading}
        />

        <ExportTypeSelector
          exportType={exportType}
          setExportType={setExportType}
          disabled={loading}
        />

        {processingMode === 'aws' && (
          <BucketInput
            bucketLocation={bucketLocation}
            setBucketLocation={setBucketLocation}
            loading={loading}
          />
        )}

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
            onClick={cancelProcessing}
          >
            Cancel Processing
          </Button>
        )}

        {(files.length > 0 || fileStatuses.length > 0 || bucketLocation) && (
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
