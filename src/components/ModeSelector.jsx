// components/ModeSelector.jsx
import React from 'react';
import styled from '@emotion/styled';

const RadioGroup = styled.div`
  margin-bottom: 15px;

  label {
    margin-right: 10px;
  }
`;

const ModeSelector = ({ processingMode, setProcessingMode }) => (
  <RadioGroup>
    <label>
      <input
        type='radio'
        value='local'
        checked={processingMode === 'local'}
        onChange={(e) => setProcessingMode(e.target.value)}
      />
      Download Locally
    </label>
    <label>
      <input
        type='radio'
        value='aws'
        checked={processingMode === 'aws'}
        onChange={(e) => setProcessingMode(e.target.value)}
      />
      Upload to AWS
    </label>
  </RadioGroup>
);

export default ModeSelector;
