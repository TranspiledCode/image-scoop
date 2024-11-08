// src/components/UploadForm.js
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import FormContainer from './FormContainer';
import DropZone from './DropZone';
import FilesList from './FilesList';
import ProcessingMode from './ProcessingMode';
import BucketInput from './BucketInput';
import Button from './Button';
import Message from './Message';
import useFileProcessor from '../hooks/useFileProcessor';

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [processingMode, setProcessingMode] = useState('local');
  const [bucketLocation, setBucketLocation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { processFiles, cancelProcessing } = useFileProcessor({
    files,
    processingMode,
    bucketLocation,
    setFileStatuses,
    setLoading,
    setMessage,
  });

  const clearForm = () => {
    setFiles([]);
    setFileStatuses([]);
    setBucketLocation('');
    setMessage('');
    setLoading(false);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      setMessage('You can only upload up to 5 images at a time.');
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
      setMessage('Please select at least one file.');
      return;
    }
    if (processingMode === 'aws' && !bucketLocation) {
      setMessage('Please enter a bucket location.');
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
          size="large"
        >
          {loading ? 'Processing...' : 'Process Images'}
        </Button>

        {loading && (
          <Button
            type="button"
            variant="danger"
            onClick={cancelProcessing}
            fullWidth
            size="large"
          >
            Cancel Processing
          </Button>
        )}

        {(files.length > 0 || fileStatuses.length > 0 || bucketLocation) && (
          <Button
            type="button"
            variant="secondary"
            onClick={clearForm}
            disabled={loading}
            fullWidth
            size="large"
          >
            Clear Form
          </Button>
        )}

        {message && (
          <Message
            variant={
              message.toLowerCase().includes('error') ? 'error' : 'success'
            }
          >
            {message}
          </Message>
        )}
      </form>
    </FormContainer>
  );
};

export default UploadForm;
