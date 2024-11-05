// components/FileList.jsx
import React from 'react';
import styled from '@emotion/styled';
import ClipLoader from 'react-spinners/ClipLoader';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import ProgressBar from './ProgressBar';

const FileListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const FileName = styled.span`
  flex: 1;
`;

const StatusText = styled.span`
  margin-left: 10px;
  text-transform: capitalize;
`;

const RemoveButton = styled.button`
  margin-left: 10px;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;

const SuccessIcon = styled(AiOutlineCheckCircle)`
  color: green;
  margin-left: 5px;
`;

const ErrorIcon = styled(AiOutlineCloseCircle)`
  color: red;
  margin-left: 5px;
`;

const FileList = ({ fileStatuses, handleRemoveFile, loading }) => (
  <FileListContainer>
    {fileStatuses.map((fileStatus, index) => (
      <FileItem key={index}>
        <FileName>{fileStatus.name}</FileName>
        {fileStatus.status === 'processing' && <ClipLoader size={15} />}
        {fileStatus.status === 'success' && <SuccessIcon />}
        {fileStatus.status === 'error' && <ErrorIcon />}
        <StatusText>{fileStatus.status}</StatusText>
        <ProgressBar percentage={fileStatus.progress} />
        {!loading && (
          <RemoveButton onClick={() => handleRemoveFile(index)}>
            Remove
          </RemoveButton>
        )}
      </FileItem>
    ))}
  </FileListContainer>
);

export default FileList;
