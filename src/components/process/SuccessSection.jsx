// src/components/process/SuccessSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Download, RotateCcw, CheckCircle } from 'lucide-react';
import processTheme from '../../style/processTheme';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const Section = styled.div`
  background: ${processTheme.cardBg};
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 20px;
  padding: 48px 32px;
  margin-top: 24px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 32px 24px;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  animation: ${bounce} 0.6s ease-out;

  svg {
    width: 40px;
    height: 40px;
    color: #10b981;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    width: 64px;
    height: 64px;

    svg {
      width: 32px;
      height: 32px;
    }
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${processTheme.textPrimary};
  text-align: center;
  margin: 0 0 32px 0;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 20px;
    margin-bottom: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: ${processTheme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid ${processTheme.borderDefault};

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 16px 12px;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${processTheme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const FilePreview = styled.div`
  background: #1f2937;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 16px;
    max-height: 200px;
  }
`;

const FileItem = styled.div`
  font-size: 13px;
  color: ${processTheme.textSecondary};
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const FileThumbnail = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    width: 32px;
    height: 32px;
  }
`;

const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 32px;
  background: ${processTheme.primaryGradient};
  color: ${processTheme.textPrimary};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 16px 28px;
    font-size: 15px;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 32px;
  background: transparent;
  color: ${processTheme.textPrimary};
  border: 2px solid #374151;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    border-color: #4b5563;
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 16px 28px;
    font-size: 15px;
  }
`;

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const formatTime = (ms) => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

const SuccessSection = ({
  totalSize,
  optimizedSize,
  processingTime,
  completedFiles,
  processedFiles,
  fileCount,
  onDownload,
  onReset,
}) => {
  const savings =
    totalSize > 0 ? ((1 - optimizedSize / totalSize) * 100).toFixed(1) : 0;

  // Calculate total variants (typically 6 variants per image)
  const variantsPerImage = 6;
  const totalVariants = fileCount * variantsPerImage;

  // Helper to remove file extension
  const removeExtension = (fileName) => {
    return fileName.split('.').slice(0, -1).join('.');
  };

  return (
    <Section>
      <SuccessIcon>
        <CheckCircle />
      </SuccessIcon>

      <Title>Images Processed Successfully!</Title>

      <StatsGrid>
        <StatCard>
          <StatValue>{fileCount}</StatValue>
          <StatLabel>{fileCount === 1 ? 'Image' : 'Images'}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalVariants}</StatValue>
          <StatLabel>Variants Created</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatBytes(totalSize)}</StatValue>
          <StatLabel>Total Original</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatBytes(optimizedSize)}</StatValue>
          <StatLabel>Total Optimized</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>-{savings}%</StatValue>
          <StatLabel>Total Saved</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatTime(processingTime)}</StatValue>
          <StatLabel>Time</StatLabel>
        </StatCard>
      </StatsGrid>

      {processedFiles && processedFiles.length > 0 && (
        <FilePreview>
          {processedFiles.map((file, index) => {
            const previewUrl = URL.createObjectURL(file);
            const fileName = completedFiles[index] || file.name;
            const displayName = removeExtension(fileName);

            return (
              <FileItem key={index}>
                <FileThumbnail src={previewUrl} alt={displayName} />
                <FileName title={fileName}>{displayName}</FileName>
              </FileItem>
            );
          })}
        </FilePreview>
      )}

      <ButtonGroup>
        <PrimaryButton onClick={onDownload}>
          <Download />
          Download ZIP
        </PrimaryButton>
        <SecondaryButton onClick={onReset}>
          <RotateCcw />
          Process More
        </SecondaryButton>
      </ButtonGroup>
    </Section>
  );
};

SuccessSection.propTypes = {
  totalSize: PropTypes.number.isRequired,
  optimizedSize: PropTypes.number.isRequired,
  processingTime: PropTypes.number.isRequired,
  completedFiles: PropTypes.arrayOf(PropTypes.string),
  processedFiles: PropTypes.arrayOf(PropTypes.object),
  fileCount: PropTypes.number.isRequired,
  onDownload: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default SuccessSection;
