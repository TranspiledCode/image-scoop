// src/components/process/ProcessingModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { X } from 'lucide-react';
import processTheme from '../../style/processTheme';

const fadeIn = keyframes`
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const spin = keyframes`
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -314;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${processTheme.cardBg};
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: ${scaleIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 90vw;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 32px 24px;
    border-radius: 20px;
    gap: 20px;
  }
`;

const ProgressRing = styled.svg`
  width: 200px;
  height: 200px;
  transform: rotate(-90deg);

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    width: 150px;
    height: 150px;
  }
`;

const ProgressCircleBackground = styled.circle`
  fill: none;
  stroke: #1f2937;
  stroke-width: 8;
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 314;
  stroke-dashoffset: ${({ progress }) => 314 - (314 * progress) / 100};
  transition: stroke-dashoffset 0.3s ease;

  ${({ isIndeterminate }) =>
    isIndeterminate &&
    `
    animation: ${spin} 2s linear infinite;
  `}
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ProgressPercentage = styled.span`
  font-size: 32px;
  font-weight: 700;
  background: ${processTheme.primaryGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const StatusText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${processTheme.textPrimary};
  margin: 0;
  text-align: center;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const SubText = styled.p`
  font-size: 14px;
  color: ${processTheme.textSecondary};
  margin: 0;
  text-align: center;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 13px;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: ${processTheme.textSecondary};
  border: 2px solid #374151;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: #4b5563;
    color: ${processTheme.textPrimary};
  }
`;

const ProcessingModal = ({ phase, progress = 0, onCancel }) => {
  const getStatusText = () => {
    switch (phase) {
      case 'uploading':
        return 'Uploading images...';
      case 'processing':
        return 'Processing images...';
      case 'complete':
        return 'Complete!';
      default:
        return 'Processing...';
    }
  };

  const getSubText = () => {
    switch (phase) {
      case 'uploading':
        return 'Securely transferring your images';
      case 'processing':
        return 'Optimizing and generating variants';
      case 'complete':
        return 'Download will start automatically';
      default:
        return '';
    }
  };

  const isIndeterminate = phase === 'uploading' || phase === 'processing';
  const displayProgress = phase === 'complete' ? 100 : progress;

  return (
    <Overlay>
      <Modal>
        <div style={{ position: 'relative' }}>
          <ProgressRing>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <ProgressCircleBackground cx="100" cy="100" r="50" />
            <ProgressCircle
              cx="100"
              cy="100"
              r="50"
              progress={displayProgress}
              isIndeterminate={isIndeterminate}
            />
          </ProgressRing>
          <ProgressText>
            <ProgressPercentage>
              {Math.round(displayProgress)}%
            </ProgressPercentage>
          </ProgressText>
        </div>

        <StatusText>{getStatusText()}</StatusText>
        <SubText>{getSubText()}</SubText>

        {onCancel && phase !== 'complete' && (
          <CancelButton onClick={onCancel}>
            <X />
            Cancel
          </CancelButton>
        )}
      </Modal>
    </Overlay>
  );
};

ProcessingModal.propTypes = {
  phase: PropTypes.oneOf(['uploading', 'processing', 'complete']).isRequired,
  progress: PropTypes.number,
  onCancel: PropTypes.func,
};

export default ProcessingModal;
