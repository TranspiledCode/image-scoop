import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import {
  ChevronDown,
  ChevronUp,
  Upload,
  Cog,
  CheckCircle,
  Timer,
} from 'lucide-react';
import { useTheme } from '@emotion/react';
import { humanFileSize } from 'shared/uploadLimits';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const DrawerContainer = styled.div`
  margin-top: 2rem;
  border-radius: 1rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.lightGray};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const DrawerHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary + '10'};
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary + '20'};
  }
`;

const DrawerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  flex: 1;
`;

const CompactStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray};
  margin-right: 1rem;
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
`;

const PulsingIcon = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
`;

const DrawerContent = styled.div`
  max-height: ${({ isExpanded }) => (isExpanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${({ isExpanded }) => (isExpanded ? '1.5rem' : '0 1.5rem')};
`;

const SummarySection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  margin: 0 0 0.75rem 0;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const StatValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.secondary};
  transition: width 0.3s ease;
`;

const FileProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const FileProgressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  font-size: 0.85rem;
`;

const FileName = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 1rem;
`;

const FileProgress = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
  min-width: 50px;
  text-align: right;
`;

const ProcessSummary = ({
  phase = null,
  uploadProgress = {},
  filesCount = 0,
  totalSize = 0,
  processedCount = 0,
  startTime = null,
  endTime = null,
  completedFiles = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const theme = useTheme();

  // Auto-expand during active processing
  useEffect(() => {
    if (phase === 'uploading' || phase === 'processing') {
      setIsExpanded(true);
    }
  }, [phase]);

  useEffect(() => {
    if (phase && phase !== 'complete' && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    } else if (phase === 'complete' && startTime && endTime) {
      setElapsedTime(endTime - startTime);
    }
  }, [phase, startTime, endTime]);

  const getPhaseIcon = () => {
    switch (phase) {
      case 'uploading':
        return <Upload size={20} color={theme.colors.secondary} />;
      case 'processing':
        return <Cog size={20} color={theme.colors.secondary} />;
      case 'complete':
        return <CheckCircle size={20} color={theme.colors.success} />;
      default:
        return null;
    }
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing Images...';
      case 'complete':
        return 'Processing Complete';
      default:
        return 'Process Summary';
    }
  };

  const calculateOverallProgress = () => {
    if (phase === 'complete') return 100;
    if (phase === 'processing') return 50;
    if (phase === 'uploading' && Object.keys(uploadProgress).length > 0) {
      const total = Object.values(uploadProgress).reduce(
        (sum, progress) => sum + progress,
        0,
      );
      return Math.round(total / Object.keys(uploadProgress).length);
    }
    return 0;
  };

  const overallProgress = calculateOverallProgress();

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  if (!phase) return null;

  return (
    <DrawerContainer>
      <DrawerHeader onClick={() => setIsExpanded(!isExpanded)} type="button">
        <DrawerTitle>
          {getPhaseIcon()}
          {getPhaseTitle()}
        </DrawerTitle>
        {!isExpanded && (
          <CompactStatus>
            <StatusBadge>
              {phase === 'complete' ? (
                <CheckCircle size={14} color={theme.colors.success} />
              ) : (
                <Timer size={14} color={theme.colors.secondary} />
              )}
              {phase === 'complete'
                ? `${processedCount} files`
                : `${filesCount} files`}
            </StatusBadge>
            {elapsedTime > 0 && (
              <StatusBadge>
                <Timer size={14} />
                {formatTime(elapsedTime)}
              </StatusBadge>
            )}
            {phase !== 'complete' && (
              <StatusBadge>{overallProgress}%</StatusBadge>
            )}
          </CompactStatus>
        )}
        {isExpanded ? (
          <ChevronUp size={20} color={theme.colors.black} />
        ) : (
          <PulsingIcon>
            <ChevronDown size={20} color={theme.colors.black} />
          </PulsingIcon>
        )}
      </DrawerHeader>

      <DrawerContent isExpanded={isExpanded}>
        <SummarySection>
          <SectionTitle>Overall Progress</SectionTitle>
          <ProgressBar>
            <ProgressFill progress={overallProgress} />
          </ProgressBar>
          <StatGrid style={{ marginTop: '1rem' }}>
            <StatItem>
              <StatLabel>Files</StatLabel>
              <StatValue>
                {phase === 'complete' ? processedCount : filesCount}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Total Size</StatLabel>
              <StatValue>{humanFileSize(totalSize)}</StatValue>
            </StatItem>
            {elapsedTime > 0 && (
              <StatItem>
                <StatLabel>
                  {phase === 'complete' ? 'Total Time' : 'Elapsed Time'}
                </StatLabel>
                <StatValue>{formatTime(elapsedTime)}</StatValue>
              </StatItem>
            )}
            {phase === 'complete' && startTime && endTime && (
              <StatItem>
                <StatLabel>Avg per File</StatLabel>
                <StatValue>
                  {formatTime((endTime - startTime) / processedCount)}
                </StatValue>
              </StatItem>
            )}
          </StatGrid>
        </SummarySection>

        {phase === 'uploading' && Object.keys(uploadProgress).length > 0 && (
          <SummarySection>
            <SectionTitle>
              <Upload size={16} />
              Upload Progress
            </SectionTitle>
            <FileProgressList>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <FileProgressItem key={fileName}>
                  <FileName title={fileName}>{fileName}</FileName>
                  <FileProgress>{Math.round(progress)}%</FileProgress>
                </FileProgressItem>
              ))}
            </FileProgressList>
          </SummarySection>
        )}

        {phase === 'processing' && (
          <SummarySection>
            <SectionTitle>
              <Cog size={16} />
              Processing Status
            </SectionTitle>
            <StatItem>
              <StatLabel>Status</StatLabel>
              <StatValue>Resizing and optimizing images...</StatValue>
            </StatItem>
          </SummarySection>
        )}

        {phase === 'complete' && completedFiles.length > 0 && (
          <SummarySection>
            <SectionTitle>
              <CheckCircle size={16} />
              Completed Files
            </SectionTitle>
            <FileProgressList>
              {completedFiles.map((fileName) => (
                <FileProgressItem key={fileName}>
                  <FileName title={fileName}>{fileName}</FileName>
                  <FileProgress>
                    <CheckCircle size={14} color={theme.colors.success} />
                  </FileProgress>
                </FileProgressItem>
              ))}
            </FileProgressList>
          </SummarySection>
        )}
      </DrawerContent>
    </DrawerContainer>
  );
};

ProcessSummary.propTypes = {
  phase: PropTypes.oneOf(['uploading', 'processing', 'complete', null]),
  uploadProgress: PropTypes.object,
  filesCount: PropTypes.number,
  totalSize: PropTypes.number,
  processedCount: PropTypes.number,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  completedFiles: PropTypes.array,
};

export default ProcessSummary;
