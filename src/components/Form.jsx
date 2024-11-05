// components/Form.jsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import FileInput from './FileInput';
import ModeSelector from './ModeSelector';
import BucketInput from './BucketInput';
import FileList from './FileList';
import useFileProcessor from '../hooks/useFileProcessor';

const FormContainer = styled.form`
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 400px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  margin-top: 10px;
`;

const Message = styled.p`
  color: ${(props) => (props.error ? 'red' : 'green')};
`;

const Form = () => {
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      setMessage('You can only upload up to 5 images at a time.');
      return;
    }

    setFiles(selectedFiles);
    setFileStatuses(
      selectedFiles.map((file) => ({
        name: file.name,
        status: 'pending',
        progress: 0,
        file: file,
      }))
    );
  };

  const handleRemoveFile = (index) => {
    if (loading) return; // Prevent removal during processing

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

    processFiles();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FileInput handleFileChange={handleFileChange} />

      {files.length > 0 && (
        <FileList
          fileStatuses={fileStatuses}
          handleRemoveFile={handleRemoveFile}
          loading={loading}
        />
      )}

      <ModeSelector
        processingMode={processingMode}
        setProcessingMode={setProcessingMode}
      />

      {processingMode === 'aws' && (
        <BucketInput
          bucketLocation={bucketLocation}
          setBucketLocation={setBucketLocation}
        />
      )}

      <SubmitButton type='submit' disabled={loading || files.length === 0}>
        {loading ? 'Processing...' : 'Process Images'}
      </SubmitButton>

      {loading && (
        <CancelButton type='button' onClick={cancelProcessing}>
          Cancel Processing
        </CancelButton>
      )}

      {message && <Message>{message}</Message>}
    </FormContainer>
  );
};

export default Form;
