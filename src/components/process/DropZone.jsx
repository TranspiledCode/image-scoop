// src/components/process/DropZone.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Upload } from 'lucide-react';
import processTheme from '../../style/processTheme';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Full-page drop zone overlay that appears when dragging
const DragOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(236, 72, 153, 0.95);
  backdrop-filter: blur(8px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  animation: ${fadeIn} 0.2s ease-out;
  pointer-events: none;
`;

const OverlayIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: white;
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

const OverlayText = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-align: center;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

// Small empty state message when no files
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 40px 20px;
  }
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 28px;
    height: 28px;
    color: ${processTheme.textSecondary};
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    width: 48px;
    height: 48px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${processTheme.textPrimary};
  margin: 0 0 8px 0;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: ${processTheme.textSecondary};
  margin: 0 0 20px 0;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const BrowseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: ${processTheme.primaryGradient};
  color: ${processTheme.textPrimary};
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  box-shadow: ${processTheme.shadowButton};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const DropZone = ({ getInputProps, isDragActive, hasFiles, onBrowseClick }) => {
  return (
    <>
      {/* Show drag overlay when dragging files over the page */}
      {isDragActive && (
        <DragOverlay>
          <OverlayIcon>
            <Upload />
          </OverlayIcon>
          <OverlayText>Drop your images here</OverlayText>
        </DragOverlay>
      )}

      {/* Show empty state only when no files */}
      {!hasFiles && (
        <EmptyState>
          <EmptyIcon>
            <Upload />
          </EmptyIcon>
          <EmptyTitle>Drag & drop images anywhere</EmptyTitle>
          <EmptyText>or click below to browse your files</EmptyText>
          <input {...getInputProps()} />
          <BrowseButton onClick={onBrowseClick}>
            <Upload />
            Choose Images
          </BrowseButton>
        </EmptyState>
      )}
    </>
  );
};

DropZone.propTypes = {
  getInputProps: PropTypes.func.isRequired,
  isDragActive: PropTypes.bool.isRequired,
  hasFiles: PropTypes.bool.isRequired,
  onBrowseClick: PropTypes.func.isRequired,
};

export default DropZone;
