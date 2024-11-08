import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Cloud,
  Download,
} from 'lucide-react';
import useFileProcessor from '../hooks/useFileProcessor';

const FormContainer = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const DropZoneContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  border: 2px dashed;
  border-color: ${(props) => (props.isDragActive ? '#3B82F6' : '#D1D5DB')};
  border-radius: 0.5rem;
  text-align: center;
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: border-color 0.2s ease;
  background-color: ${(props) =>
    props.isDragActive ? '#EFF6FF' : 'transparent'};
  opacity: ${(props) => (props.$loading ? 0.5 : 1)};

  &:hover {
    border-color: ${(props) => !props.$loading && '#60A5FA'};
  }
`;

const UploadIcon = styled(Upload)`
  margin: 0 auto;
  height: 3rem;
  width: 3rem;
  color: #9ca3af;
`;

const DropzoneText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const DropzoneLimitText = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const ProcessingModeContainer = styled.div`
  margin-top: 1.5rem;
`;

const ModeButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModeButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid;
  border-color: ${(props) => (props.isSelected ? '#3B82F6' : '#E5E7EB')};
  background-color: ${(props) =>
    props.isSelected ? '#EFF6FF' : 'transparent'};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$loading ? 0.5 : 1)};
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'pointer')};

  &:hover {
    border-color: ${(props) =>
      !props.$loading && (props.isSelected ? '#3B82F6' : '#93C5FD')};
  }
`;

const ModeButtonIcon = styled.div`
  margin: 0 auto;
  margin-bottom: 0.5rem;
`;

const ModeButtonText = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
`;

const FilesList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.75rem;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;

  &:hover {
    color: #ef4444; /* Slight color change on hover for better UX */
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid #60a5fa;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const BucketInput = styled.div`
  margin-top: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: white;
  transition: background-color 0.2s ease;
  margin-top: 1rem;

  ${(props) =>
    props.variant === 'primary' &&
    `
    background-color: ${props.disabled ? '#93C5FD' : '#3B82F6'};
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};

    &:hover {
      background-color: ${!props.disabled && '#2563EB'};
    }
  `}

  ${(props) =>
    props.variant === 'danger' &&
    `
    background-color: #EF4444;
    
    &:hover {
      background-color: #DC2626;
    }
  `}

  ${(props) =>
    props.variant === 'secondary' &&
    `
    background-color: #D1D5DB;
    color: #374151;

    &:hover {
      background-color: #9CA3AF;
    }
  `}
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  ${(props) =>
    props.variant === 'error'
      ? `
    background-color: #FEE2E2;
    color: #B91C1C;
  `
      : `
    background-color: #ECFDF5;
    color: #047857;
  `}
`;

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [processingMode, setProcessingMode] = useState('local');
  const [bucketLocation, setBucketLocation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { processFiles, cancelProcessing, controllers } = useFileProcessor({
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
      }))
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
      }))
    );

    setLoading(true);
    processFiles();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color='#10B981' />;
      case 'error':
        return <AlertCircle size={20} color='#EF4444' />;
      case 'processing':
        return <LoadingSpinner />;
      case 'pending':
      default:
        return null; // No icon for 'pending' status
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <DropZoneContainer
          {...getRootProps()}
          isDragActive={isDragActive}
          $loading={loading}
        >
          <input {...getInputProps()} />
          <UploadIcon />
          <DropzoneText>
            {isDragActive
              ? 'Drop the files here...'
              : "Drag 'n' drop images here, or click to select files"}
          </DropzoneText>
          <DropzoneLimitText>Up to 5 images allowed</DropzoneLimitText>
        </DropZoneContainer>

        {files.length > 0 && (
          <FilesList>
            {fileStatuses.map((file, index) => (
              <FileItem key={index}>
                <FileInfo>
                  <FileName>{file.name}</FileName>
                  {/* Removed ProgressBarContainer */}
                </FileInfo>
                <FileActions>
                  {getStatusIcon(file.status)}
                  {!loading && (
                    <RemoveButton onClick={(e) => handleRemoveFile(index, e)}>
                      <X size={16} color='#6B7280' />
                    </RemoveButton>
                  )}
                </FileActions>
              </FileItem>
            ))}
          </FilesList>
        )}

        <ProcessingModeContainer>
          <ModeButtonContainer>
            <ModeButton
              type='button'
              onClick={() => setProcessingMode('local')}
              isSelected={processingMode === 'local'}
              $loading={loading}
              disabled={loading}
            >
              <ModeButtonIcon>
                <Download size={20} />
              </ModeButtonIcon>
              <ModeButtonText>Download Locally</ModeButtonText>
            </ModeButton>
            <ModeButton
              type='button'
              onClick={() => setProcessingMode('aws')}
              isSelected={processingMode === 'aws'}
              $loading={loading}
              disabled={loading}
            >
              <ModeButtonIcon>
                <Cloud size={20} />
              </ModeButtonIcon>
              <ModeButtonText>Upload to AWS</ModeButtonText>
            </ModeButton>
          </ModeButtonContainer>
        </ProcessingModeContainer>

        {processingMode === 'aws' && (
          <BucketInput>
            <InputLabel>AWS Bucket Location</InputLabel>
            <Input
              type='text'
              value={bucketLocation}
              onChange={(e) => setBucketLocation(e.target.value)}
              placeholder='s3://my-bucket/path'
              disabled={loading}
            />
          </BucketInput>
        )}

        <Button
          type='submit'
          variant='primary'
          disabled={loading || files.length === 0}
        >
          {loading ? 'Processing...' : 'Process Images'}
        </Button>

        {loading && (
          <Button type='button' variant='danger' onClick={cancelProcessing}>
            Cancel Processing
          </Button>
        )}

        {(files.length > 0 || fileStatuses.length > 0 || bucketLocation) && (
          <Button
            type='button'
            variant='secondary'
            onClick={clearForm}
            disabled={loading}
          >
            Clear Form
          </Button>
        )}

        {message && (
          <Message variant={message.includes('error') ? 'error' : 'success'}>
            {message}
          </Message>
        )}
      </form>
    </FormContainer>
  );
};

export default UploadForm;
