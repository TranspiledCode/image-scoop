// src/components/wizard/SuccessStep.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { CheckCircle, Download, RefreshCw, Folder } from 'lucide-react';

const StepContainer = styled.div`
  width: 100%;
  max-width: 700px;
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

const SuccessIcon = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes successPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.success};
    filter: drop-shadow(0 4px 12px rgba(72, 187, 120, 0.3));
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${({ color }) => color};
  animation: confettiFall 3s ease-out forwards;
  animation-delay: ${({ delay }) => delay}s;
  opacity: 0;

  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(${({ distance }) => distance}px)
        translateX(${({ horizontal }) => horizontal}px)
        rotate(${({ rotation }) => rotation}deg);
      opacity: 0;
    }
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success},
    ${({ theme }) => theme.colors.primary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray};
  margin: -1rem 0 0 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StatsCard = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 2px solid ${({ theme }) => theme.colors.success + '20'};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: ${({ noBorder, theme }) =>
    noBorder ? 'none' : `1px solid ${theme.colors.lightGray}`};

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  color: ${({ theme, highlight }) =>
    highlight ? theme.colors.success : theme.colors.black};
  font-weight: 700;
`;

const ZipPreview = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lightGray + '50'};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const ZipTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 1rem;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 2rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const DownloadButton = styled.button`
  width: 100%;
  padding: 1.75rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success},
    ${({ theme }) => theme.colors.primary}
  );
  color: white;
  border: none;
  border-radius: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(72, 187, 120, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(72, 187, 120, 0.4);
  }

  &:active {
    transform: translateY(-2px);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    font-size: 1.25rem;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const TimeStamp = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SuccessStep = ({
  totalSize,
  optimizedSize = 0,
  processingTime = 0,
  completedFiles = [],
  onDownload,
  onReset,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const humanFileSize = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const savingsPercent =
    totalSize > 0
      ? Math.round(((totalSize - optimizedSize) / totalSize) * 100)
      : 0;

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const confettiColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
  ];
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    delay: i * 0.05,
    distance: 300 + Math.random() * 200,
    horizontal: (Math.random() - 0.5) * 400,
    rotation: Math.random() * 720,
  }));

  return (
    <StepContainer>
      <SuccessIcon>
        <CheckCircle />
        {showConfetti &&
          confettiPieces.map((piece) => (
            <Confetti
              key={piece.id}
              color={piece.color}
              delay={piece.delay}
              distance={piece.distance}
              horizontal={piece.horizontal}
              rotation={piece.rotation}
            />
          ))}
      </SuccessIcon>

      <div>
        <Title>All Done!</Title>
        <Subtitle>Your images have been optimized</Subtitle>
      </div>

      <StatsCard>
        <StatRow>
          <StatLabel>Original Size:</StatLabel>
          <StatValue>{humanFileSize(totalSize)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Optimized Size:</StatLabel>
          <StatValue>{humanFileSize(optimizedSize)}</StatValue>
        </StatRow>
        <StatRow noBorder>
          <StatLabel>You Saved:</StatLabel>
          <StatValue highlight>
            {humanFileSize(totalSize - optimizedSize)} ({savingsPercent}%)
          </StatValue>
        </StatRow>

        <ZipPreview>
          <ZipTitle>
            <Folder size={20} />
            <span>ImageScoop-{new Date().toISOString().slice(0, 10)}.zip</span>
          </ZipTitle>
          <FolderList>
            {completedFiles.slice(0, 5).map((file, index) => (
              <div key={index}>• {file}/ (6 sizes)</div>
            ))}
            {completedFiles.length > 5 && (
              <div>• ... and {completedFiles.length - 5} more</div>
            )}
          </FolderList>
        </ZipPreview>
      </StatsCard>

      <DownloadButton onClick={onDownload}>
        <Download />
        Download ZIP ({humanFileSize(optimizedSize)})
      </DownloadButton>

      <SecondaryButton onClick={onReset}>
        <RefreshCw />
        Process More Images
      </SecondaryButton>

      <TimeStamp>⏱️ Completed in {formatTime(processingTime)}</TimeStamp>
    </StepContainer>
  );
};

SuccessStep.propTypes = {
  totalSize: PropTypes.number.isRequired,
  optimizedSize: PropTypes.number,
  processingTime: PropTypes.number,
  completedFiles: PropTypes.array,
  onDownload: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default SuccessStep;
