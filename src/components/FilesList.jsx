// src/components/FilesList.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
// Direct imports from lucide-react
import { CheckCircle } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Image } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { humanFileSize } from 'shared/uploadLimits';

// Styled Components with Theme-Based Colors
const FilesListContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilesSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.colors.primary + '10'};
  border-radius: 0.75rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.black};
`;

const SummaryItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
        case 'rejected':
          return theme.colors.error;
        case 'processing':
          return theme.colors.secondary;
        case 'pending':
        default:
          return theme.colors.tertiary;
      }
    }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  opacity: ${({ status }) => (status === 'rejected' ? 0.8 : 1)};

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

const ReasonBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error + '15'};
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
  font-weight: 500;
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

const getStatusIcon = (status, theme) => {
  switch (status) {
    case 'success':
      return <CheckCircle size={20} color={theme.colors.success} />;
    case 'error':
    case 'rejected':
      return <AlertCircle size={20} color={theme.colors.error} />;
    case 'processing':
      return <LoadingSpinner />;
    case 'pending':
    default:
      return null;
  }
};

// React Component
const FilesList = ({
  fileStatuses,
  handleRemoveFile,
  loading = false,
  totalSize = 0,
  maxFiles,
  maxTotalSize,
}) => {
  const theme = useTheme();
  const summary = useMemo(() => {
    const currentTotal = humanFileSize(totalSize);
    const maxTotal = humanFileSize(maxTotalSize);
    return {
      fileCount: `${fileStatuses.length} / ${maxFiles} files`,
      size: `${currentTotal} / ${maxTotal}`,
    };
  }, [fileStatuses.length, maxFiles, maxTotalSize, totalSize]);

  return (
    <FilesListContainer>
      <FilesSummary>
        <SummaryItem>
          <strong>Files:</strong>
          <span>{summary.fileCount}</span>
        </SummaryItem>
        <SummaryItem>
          <strong>Total size:</strong>
          <span>{summary.size}</span>
        </SummaryItem>
      </FilesSummary>
      {fileStatuses.map((file, index) => (
        <FileItem key={index} status={file.status}>
          <FileIconWrapper>
            <Image size={20} color={theme.colors.primary} />
          </FileIconWrapper>
          <FileInfo>
            <FileName title={file.name}>{file.name}</FileName>
            {file.file && <FileSize>{humanFileSize(file.file.size)}</FileSize>}
            {file.reason && <ReasonBadge>{file.reason}</ReasonBadge>}
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
      status: PropTypes.oneOf([
        'success',
        'error',
        'processing',
        'pending',
        'rejected',
      ]),
      file: PropTypes.object,
      reason: PropTypes.string,
    }),
  ).isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  totalSize: PropTypes.number,
  maxFiles: PropTypes.number.isRequired,
  maxTotalSize: PropTypes.number.isRequired,
};

export default FilesList;
