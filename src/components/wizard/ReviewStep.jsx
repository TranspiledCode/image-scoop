// src/components/wizard/ReviewStep.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';

const StepContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGray};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FileCount = styled.span`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
`;

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const FileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease-out;
  animation-delay: ${({ index }) => index * 0.05}s;
  animation-fill-mode: backwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  svg {
    width: 60px;
    height: 60px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const FileInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileSize = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.gray};

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SettingsCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid ${({ theme }) => theme.colors.primary + '20'};
`;

const SettingsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  margin: 0 0 1.5rem 0;
`;

const FormatSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormatOption = styled.button`
  flex: 1;
  padding: 1.25rem;
  border: 2px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.lightGray};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.primary + '10' : theme.colors.white};
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.gray};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + '05'};
  }
`;

const AdvancedToggle = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.lightGray};
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray + '20'};
  }
`;

const AdvancedOptions = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.lightGray + '50'};
  border-radius: 0.75rem;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 200px;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.black};

  input {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: white;
  border: none;
  border-radius: 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    font-size: 1.1rem;
  }
`;

const ReviewStep = ({
  fileStatuses,
  handleRemoveFile,
  handleRenameFile,
  exportType,
  setExportType,
  omitFilename,
  setOmitFilename,
  onOptimize,
}) => {
  const [thumbnails, setThumbnails] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fileStatuses.forEach((fileStatus) => {
      if (fileStatus.file && fileStatus.file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnails((prev) => ({
            ...prev,
            [fileStatus.name]: e.target.result,
          }));
        };
        reader.readAsDataURL(fileStatus.file);
      }
    });
  }, [fileStatuses]);

  const humanFileSize = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <StepContainer>
      <Header>
        <Title>Review Your Images</Title>
        <FileCount>{fileStatuses.length} files ready</FileCount>
      </Header>

      <FileGrid>
        {fileStatuses.map((file, index) => (
          <FileCard key={index} index={index}>
            <ThumbnailContainer>
              {thumbnails[file.name] ? (
                <Thumbnail src={thumbnails[file.name]} alt={file.name} />
              ) : (
                <ThumbnailPlaceholder>
                  <ImageIcon />
                </ThumbnailPlaceholder>
              )}
            </ThumbnailContainer>
            <FileInfo>
              <FileName title={file.editableName || file.name}>
                {file.editableName || file.name}
              </FileName>
              {file.file && (
                <FileSize>{humanFileSize(file.file.size)}</FileSize>
              )}
              <FileActions>
                <IconButton
                  onClick={() =>
                    handleRenameFile(index, file.editableName || file.name)
                  }
                  title="Rename"
                >
                  <Edit2 />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveFile(index)}
                  title="Remove"
                >
                  <Trash2 />
                </IconButton>
              </FileActions>
            </FileInfo>
          </FileCard>
        ))}
      </FileGrid>

      <SettingsCard>
        <SettingsTitle>Output Settings</SettingsTitle>

        <FormatSelector>
          <FormatOption
            selected={exportType === 'webp'}
            onClick={() => setExportType('webp')}
          >
            WebP
          </FormatOption>
          <FormatOption
            selected={exportType === 'jpeg'}
            onClick={() => setExportType('jpeg')}
          >
            JPEG
          </FormatOption>
          <FormatOption
            selected={exportType === 'png'}
            onClick={() => setExportType('png')}
          >
            PNG
          </FormatOption>
        </FormatSelector>

        <AdvancedToggle onClick={() => setShowAdvanced(!showAdvanced)}>
          <span>Advanced Options</span>
          {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </AdvancedToggle>

        {showAdvanced && (
          <AdvancedOptions>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={omitFilename}
                onChange={(e) => setOmitFilename(e.target.checked)}
              />
              <span>Omit original filename from output files</span>
            </CheckboxLabel>
          </AdvancedOptions>
        )}
      </SettingsCard>

      <CTAButton onClick={onOptimize}>
        Optimize {fileStatuses.length} Images →
      </CTAButton>
    </StepContainer>
  );
};

ReviewStep.propTypes = {
  fileStatuses: PropTypes.array.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  handleRenameFile: PropTypes.func.isRequired,
  exportType: PropTypes.string.isRequired,
  setExportType: PropTypes.func.isRequired,
  omitFilename: PropTypes.bool.isRequired,
  setOmitFilename: PropTypes.func.isRequired,
  onOptimize: PropTypes.func.isRequired,
};

export default ReviewStep;
