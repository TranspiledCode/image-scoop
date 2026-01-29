// src/components/process/FileGrid.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { X, Edit2, Check } from 'lucide-react';
import processTheme from '../../style/processTheme';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 24px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const FileCard = styled.div`
  background: ${processTheme.cardBg};
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  animation: ${slideIn} 0.4s ease-out;
  animation-delay: ${({ index }) => index * 0.05}s;
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(236, 72, 153, 0.3);
    box-shadow: ${processTheme.shadowCardHover};
  }
`;

const FilePreview = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FileInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FileName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${processTheme.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const FileNameInput = styled.input`
  background: #1f2937;
  border: 1px solid ${processTheme.borderActive};
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 13px;
  color: ${processTheme.textPrimary};
  font-family: inherit;
  flex: 1;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

const FileSize = styled.span`
  font-size: 11px;
  color: ${processTheme.textMuted};
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  color: ${processTheme.textSecondary};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    border-color: ${processTheme.borderActive};
    color: ${processTheme.textPrimary};
  }

  &.success {
    border-color: #10b981;
    color: #10b981;

    &:hover {
      background: rgba(16, 185, 129, 0.1);
    }
  }

  &.danger {
    border-color: #ef4444;
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const FileGrid = ({ fileStatuses, onRemove, onRename }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (index, currentName) => {
    setEditingIndex(index);
    const nameWithoutExt = currentName.split('.').slice(0, -1).join('.');
    setEditValue(nameWithoutExt);
  };

  const handleSaveEdit = (index) => {
    if (editValue.trim()) {
      const ext = fileStatuses[index].name.split('.').pop();
      onRename(index, `${editValue.trim()}.${ext}`);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  if (!fileStatuses || fileStatuses.length === 0) {
    return null;
  }

  return (
    <Grid>
      {fileStatuses.map((status, index) => {
        const isEditing = editingIndex === index;
        const previewUrl = status.file
          ? URL.createObjectURL(status.file)
          : null;

        return (
          <FileCard key={index} index={index}>
            <FilePreview>
              {previewUrl && <img src={previewUrl} alt={status.name} />}
            </FilePreview>
            <FileInfo>
              <FileNameWrapper>
                {isEditing ? (
                  <FileNameInput
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(index);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  <FileName title={status.editableName || status.name}>
                    {status.editableName || status.name}
                  </FileName>
                )}
              </FileNameWrapper>
              <FileSize>{formatBytes(status.file?.size || 0)}</FileSize>
              <FileActions>
                {isEditing ? (
                  <>
                    <IconButton
                      className="success"
                      onClick={() => handleSaveEdit(index)}
                      title="Save"
                    >
                      <Check />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} title="Cancel">
                      <X />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      onClick={() =>
                        handleStartEdit(
                          index,
                          status.editableName || status.name,
                        )
                      }
                      title="Rename"
                    >
                      <Edit2 />
                    </IconButton>
                    <IconButton
                      className="danger"
                      onClick={() => onRemove(index)}
                      title="Remove"
                    >
                      <X />
                    </IconButton>
                  </>
                )}
              </FileActions>
            </FileInfo>
          </FileCard>
        );
      })}
    </Grid>
  );
};

FileGrid.propTypes = {
  fileStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.object,
      name: PropTypes.string.isRequired,
      editableName: PropTypes.string,
      status: PropTypes.string,
    }),
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
};

export default FileGrid;
