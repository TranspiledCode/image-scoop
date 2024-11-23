// src/components/ProcessingMode.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Cloud, Download } from 'lucide-react';

const Container = styled.div`
  margin-top: 1.5rem;
`;

const ModeButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModeButton = styled.button`
  flex: 1;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 2px solid;
  border-color: ${(props) => (props.isSelected ? '#3B82F6' : '#E5E7EB')};
  background-color: ${(props) =>
    props.isSelected ? '#EFF6FF' : 'transparent'};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$loading ? 0.5 : 1)};
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'pointer')};

  &:hover {
    border-color: ${(props) =>
      !props.$loading && (props.isSelected ? '#3B82F6' : '#93C5FD')};
  }
`;

const ModeButtonIcon = styled.div`
  margin: 0 auto;
  margin-bottom: 0.5rem;
`;

const ModeButtonText = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
`;

const ProcessingMode = ({ processingMode, setProcessingMode, loading }) => (
  <Container>
    <ModeButtonContainer>
      <ModeButton
        type="button"
        onClick={() => setProcessingMode('local')}
        isSelected={processingMode === 'local'}
        $loading={loading}
        disabled={loading}
      >
        <ModeButtonIcon>
          <Download size={30} />
        </ModeButtonIcon>
        <ModeButtonText>Download Locally</ModeButtonText>
      </ModeButton>
      <ModeButton
        type="button"
        onClick={() => setProcessingMode('aws')}
        isSelected={processingMode === 'aws'}
        $loading={loading}
        disabled={loading}
      >
        <ModeButtonIcon>
          <Cloud size={30} />
        </ModeButtonIcon>
        <ModeButtonText>Upload to AWS</ModeButtonText>
      </ModeButton>
    </ModeButtonContainer>
  </Container>
);

ProcessingMode.propTypes = {
  processingMode: PropTypes.string.isRequired,
  setProcessingMode: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ProcessingMode;
