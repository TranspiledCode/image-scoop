// src/components/ExportTypeSelector.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from './Button'; // Import the reusable Button component

const SelectorContainer = styled.div`
  margin-top: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ExportTypeSelector = ({
  exportType = 'webp',
  setExportType,
  disabled = false,
}) => {
  const handleSelect = (type) => {
    if (!disabled) {
      setExportType(type);
    }
  };

  return (
    <SelectorContainer>
      <Label htmlFor="export-type-selector">Select Export File Type</Label>
      <ButtonGroup id="export-type-selector">
        <Button
          variant={exportType === 'png' ? 'primary' : 'ghost'}
          size="medium"
          onClick={() => handleSelect('png')}
          disabled={disabled}
          aria-pressed={exportType === 'png'}
          fullWidth
        >
          PNG
        </Button>
        <Button
          variant={exportType === 'webp' ? 'primary' : 'ghost'}
          size="medium"
          onClick={() => handleSelect('webp')}
          disabled={disabled}
          aria-pressed={exportType === 'webp'}
          fullWidth
        >
          WebP
        </Button>
        <Button
          variant={exportType === 'jpg' ? 'primary' : 'ghost'}
          size="medium"
          onClick={() => handleSelect('jpg')}
          disabled={disabled}
          aria-pressed={exportType === 'jpg'}
          fullWidth
        >
          JPG
        </Button>
      </ButtonGroup>
    </SelectorContainer>
  );
};

ExportTypeSelector.propTypes = {
  exportType: PropTypes.oneOf(['png', 'webp', 'jpg']),
  setExportType: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ExportTypeSelector;
