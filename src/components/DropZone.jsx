// src/components/DropZone.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Upload } from 'lucide-react';

// Styled Components with Theme-Based Colors
const DropZoneContainer = styled.div`
  margin-top: 2rem;
  padding: 2.5rem;
  border: 2px dashed;
  border-color: ${({ theme, isDragActive }) =>
    isDragActive ? theme.colors.primaryLight : theme.colors.lightGray};
  border-radius: 0.5rem;
  text-align: center;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
  background-color: ${({ theme, isDragActive }) =>
    isDragActive
      ? theme.colors.primaryLight + '1A' /* Adding opacity */
      : 'transparent'};
  opacity: ${({ $loading }) => ($loading ? 0.5 : 1)};

  &:hover {
    border-color: ${({ theme, $loading }) =>
      !$loading && theme.colors.primaryAccent};
  }
`;

const UploadIcon = styled(Upload)`
  margin: 0 auto;
  height: 5rem;
  width: 5rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const DropzoneText = styled.p`
  margin-top: 1.5rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const DropzoneLimitText = styled.p`
  margin-top: 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const DropZone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  loading = false,
}) => (
  <DropZoneContainer
    {...getRootProps()}
    isDragActive={isDragActive}
    $loading={loading}
    aria-disabled={loading}
    aria-label="File Upload Dropzone"
  >
    <input {...getInputProps()} />
    <UploadIcon aria-hidden="true" />
    <DropzoneText>
      {isDragActive
        ? 'Drop the files here...'
        : "Drag 'n' drop images here, or click to select files"}
    </DropzoneText>
    <DropzoneLimitText>Up to 5 images allowed</DropzoneLimitText>
  </DropZoneContainer>
);

// Prop-Types Definitions
DropZone.propTypes = {
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  isDragActive: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
};

export default DropZone;
