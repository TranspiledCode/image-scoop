// src/components/FilesList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
// Direct imports from lucide-react
import { CheckCircle } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Image } from 'lucide-react';
import { useTheme } from '@emotion/react';

// Styled Components with Theme-Based Colors
const FilesListContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid
    ${({ status, theme }) => {
      switch (status) {
        case 'success':
          return theme.colors.success;
        case 'error':
          return theme.colors.error;
        case 'processing':
          return theme.colors.secondary;
        case 'pending':
        default:
          return theme.colors.tertiary;
      }
    }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FileIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primaryLight + '30'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const FileSize = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
  margin: 0.25rem 0 0 0;
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.black};
  transition: all 0.2s ease;
  border-radius: 50%;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => theme.colors.error + '15'};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${({ theme }) => theme.colors.secondary + '50'};
  border-top-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const formatFileSize = (size) => {
  if (!size) return '';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(1) +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
};

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

// React Component
const FilesList = ({ fileStatuses, handleRemoveFile, loading = false }) => {
  const theme = useTheme();

  return (
    <FilesListContainer>
      {fileStatuses.map((file, index) => (
        <FileItem key={index} status={file.status}>
          <FileIconWrapper>
            <Image size={20} color={theme.colors.primary} />
          </FileIconWrapper>
          <FileInfo>
            <FileName title={file.name}>{file.name}</FileName>
            {file.file && <FileSize>{formatFileSize(file.file.size)}</FileSize>}
          </FileInfo>
          <FileActions>
            {getStatusIcon(file.status, theme)}
            {!loading && (
              <RemoveButton
                onClick={(e) => handleRemoveFile(index, e)}
                aria-label={`Remove ${file.name}`}
                type="button"
              >
                <Trash2 size={18} />
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
      file: PropTypes.object,
    }),
  ).isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default FilesList;
