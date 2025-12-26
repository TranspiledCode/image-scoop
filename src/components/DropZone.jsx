// src/components/DropZone.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Upload, IceCream } from 'lucide-react';

// Styled Components with Theme-Based Colors
const DropZoneContainer = styled.div`
  margin-top: 2rem;
  padding: 3rem 2.5rem;
  border: 3px dashed;
  border-color: ${({ theme, isDragActive }) =>
    isDragActive ? theme.colors.secondary : theme.colors.primary};
  border-radius: 1rem;
  text-align: center;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
  background-color: ${({ theme, isDragActive }) =>
    isDragActive
      ? theme.colors.secondary + '1A' /* Adding opacity */
      : theme.colors.primary + '0A'};
  opacity: ${({ $loading }) => ($loading ? 0.5 : 1)};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme, $loading }) =>
      !$loading && theme.colors.secondary};
    transform: ${({ $loading }) => !$loading && 'scale(1.01)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    background-color: ${({ theme }) => theme.colors.secondaryLight};
    width: 100px;
    height: 100px;
    border-radius: 50%;
    opacity: 0.2;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: -50px;
    background-color: ${({ theme }) => theme.colors.tertiaryLight};
    width: 100px;
    height: 100px;
    border-radius: 50%;
    opacity: 0.2;
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const UploadIcon = styled(Upload)`
  height: 3.5rem;
  width: 3.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 1rem;
`;

const IceCreamIcon = styled(IceCream)`
  height: 3.5rem;
  width: 3.5rem;
  color: ${({ theme }) => theme.colors.secondary};
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const DropzoneText = styled.p`
  margin-top: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
`;

const DropzoneLimitText = styled.p`
  margin-top: 0.5rem;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 400;
`;

const DropZone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  loading = false,
  limitText = null,
}) => (
  <DropZoneContainer
    {...getRootProps()}
    isDragActive={isDragActive}
    $loading={loading}
    aria-disabled={loading}
    aria-label="File Upload Dropzone"
  >
    <ContentWrapper>
      <input {...getInputProps()} />
      <IconContainer>
        <UploadIcon aria-hidden="true" />
        <IceCreamIcon aria-hidden="true" />
      </IconContainer>
      <DropzoneText>
        {isDragActive
          ? 'Drop your images here!'
          : "Drag 'n' drop your images, or click to select files"}
      </DropzoneText>
      {limitText && <DropzoneLimitText>{limitText}</DropzoneLimitText>}
    </ContentWrapper>
  </DropZoneContainer>
);

// Prop-Types Definitions
DropZone.propTypes = {
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  isDragActive: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  limitText: PropTypes.node,
};

export default DropZone;
