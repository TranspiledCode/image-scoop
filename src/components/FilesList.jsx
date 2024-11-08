// src/components/FilesList.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Icon from './Icon';
import { useTheme } from '@emotion/react';

// Styled Components with Theme-Based Colors
const FilesListContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
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
  color: ${({ theme }) => theme.colors.black};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.primaryAccent};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const getStatusIcon = (status, theme) => {
  switch (status) {
    case 'success':
      return <CheckCircle size={20} color={theme.colors.success} />;
    case 'error':
      return <AlertCircle size={20} color={theme.colors.error} />;
    case 'processing':
      return <LoadingSpinner />;
    case 'pending':
    default:
      return null;
  }
};

// React Component with Prop-Types and Default Parameters
const FilesList = ({ fileStatuses, handleRemoveFile, loading = false }) => {
  const theme = useTheme();

  return (
    <FilesListContainer>
      {fileStatuses.map((file, index) => (
        <FileItem key={index}>
          <FileInfo>
            <FileName title={file.name}>{file.name}</FileName>
            {/* You can add a progress bar here if needed */}
          </FileInfo>
          <FileActions>
            {getStatusIcon(file.status, theme)}
            {!loading && (
              <RemoveButton
                onClick={(e) => handleRemoveFile(index, e)}
                aria-label={`Remove ${file.name}`}
              >
                <Icon name="FaTrash" size={15} />
              </RemoveButton>
            )}
          </FileActions>
        </FileItem>
      ))}
    </FilesListContainer>
  );
};

// Prop-Types Definitions
FilesList.propTypes = {
  fileStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['success', 'error', 'processing', 'pending']),
    }),
  ).isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default FilesList;
