// src/components/wizard/ProcessingStep.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Upload, Cog, ChevronDown, ChevronUp } from 'lucide-react';

const StepContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ProcessingIcon = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.primary};
    animation: spin 3s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProgressRing = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const ProgressSVG = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const ProgressCircleBackground = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.lightGray};
  stroke-width: 12;
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: url(#progressGradient);
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: ${({ circumference }) => circumference};
  stroke-dashoffset: ${({ circumference, progress }) =>
    circumference - (progress / 100) * circumference};
  transition: stroke-dashoffset 0.5s ease;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatusText = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TimeEstimate = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DetailsToggle = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.lightGray};
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray + '20'};
  }
`;

const FileProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.white};
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

const FileProgressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: 0.5rem;
  font-size: 0.9rem;
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
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  min-width: 50px;
  text-align: right;
`;

const CancelButton = styled.button`
  padding: 0.75rem 2rem;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const ProcessingStep = ({
  phase,
  uploadProgress,
  filesCount,
  processedCount,
  startTime,
  onCancel,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const calculateOverallProgress = () => {
    if (phase === 'processing')
      return 50 + (processedCount / (filesCount * 6)) * 50;
    if (phase === 'uploading' && Object.keys(uploadProgress).length > 0) {
      const total = Object.values(uploadProgress).reduce(
        (sum, progress) => sum + progress,
        0,
      );
      return (total / Object.keys(uploadProgress).length) * 0.5;
    }
    return 0;
  };

  const getStatusText = () => {
    if (phase === 'uploading') {
      const uploaded = Object.values(uploadProgress).filter(
        (p) => p === 100,
      ).length;
      return `Uploading: ${uploaded}/${filesCount} files`;
    }
    if (phase === 'processing') {
      return `Processing: ${processedCount}/${filesCount * 6} images`;
    }
    return 'Preparing...';
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const estimateTimeRemaining = () => {
    if (elapsedTime === 0) return null;
    const progress = calculateOverallProgress();
    if (progress === 0) return null;
    const totalEstimate = (elapsedTime / progress) * 100;
    const remaining = totalEstimate - elapsedTime;
    return remaining > 0 ? formatTime(remaining) : null;
  };

  const progress = Math.round(calculateOverallProgress());
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  return (
    <StepContainer>
      <ProcessingIcon>
        {phase === 'uploading' ? <Upload /> : <Cog />}
      </ProcessingIcon>

      <Title>
        {phase === 'uploading' ? 'Uploading...' : 'Processing Images...'}
      </Title>

      <ProgressContainer>
        <ProgressRing>
          <ProgressSVG>
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#4ECDC4" />
              </linearGradient>
            </defs>
            <ProgressCircleBackground cx="100" cy="100" r={radius} />
            <ProgressCircle
              cx="100"
              cy="100"
              r={radius}
              circumference={circumference}
              progress={progress}
            />
          </ProgressSVG>
          <ProgressText>{progress}%</ProgressText>
        </ProgressRing>

        <StatusText>{getStatusText()}</StatusText>

        {estimateTimeRemaining() && (
          <TimeEstimate>⏱️ ~{estimateTimeRemaining()} remaining</TimeEstimate>
        )}

        <DetailsToggle onClick={() => setShowDetails(!showDetails)}>
          <span>{showDetails ? 'Hide' : 'Show'} file details</span>
          {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </DetailsToggle>

        {showDetails && (
          <FileProgressList>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <FileProgressItem key={fileName}>
                <FileName>{fileName}</FileName>
                <FileProgress>{Math.round(progress)}%</FileProgress>
              </FileProgressItem>
            ))}
          </FileProgressList>
        )}
      </ProgressContainer>

      <CancelButton onClick={onCancel}>Cancel Processing</CancelButton>
    </StepContainer>
  );
};

ProcessingStep.propTypes = {
  phase: PropTypes.string,
  uploadProgress: PropTypes.object,
  filesCount: PropTypes.number,
  processedCount: PropTypes.number,
  startTime: PropTypes.number,
  onCancel: PropTypes.func.isRequired,
};

export default ProcessingStep;
