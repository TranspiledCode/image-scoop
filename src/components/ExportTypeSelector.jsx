// src/components/ExportTypeSelector.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

const SelectorContainer = styled.div`
  margin-top: 2rem;
`;

const SelectorLabel = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.black};
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const OptionLabel = styled.label`
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledOption = styled.div`
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors[theme.colorName] : theme.colors.lightGray};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.darkGray};
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? '0 4px 8px rgba(0, 0, 0, 0.15)'
      : '0 2px 4px rgba(0, 0, 0, 0.05)'};

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-2px)')};
    border-color: ${({ theme, disabled }) =>
      disabled ? 'transparent' : theme.colors[theme.colorName]};
  }
`;

const formatOptions = [
  { value: 'webp', label: 'WebP', color: 'tertiary' },
  { value: 'avif', label: 'AVIF', color: 'blueberry' },
  { value: 'png', label: 'PNG', color: 'secondary' },
  { value: 'jpeg', label: 'JPEG', color: 'primary' },
];

const ExportTypeSelector = ({
  exportType,
  setExportType,
  disabled = false,
}) => {
  return (
    <SelectorContainer>
      <SelectorLabel>Select Output Format</SelectorLabel>
      <OptionsContainer>
        {formatOptions.map((option) => (
          <OptionLabel key={option.value} disabled={disabled}>
            <HiddenRadio
              type="radio"
              name="exportType"
              value={option.value}
              checked={exportType === option.value}
              onChange={() => setExportType(option.value)}
              disabled={disabled}
            />
            <StyledOption
              isSelected={exportType === option.value}
              disabled={disabled}
              theme={{
                ...useTheme(),
                colorName: option.color,
              }}
            >
              {option.label}
            </StyledOption>
          </OptionLabel>
        ))}
      </OptionsContainer>
    </SelectorContainer>
  );
};

ExportTypeSelector.propTypes = {
  exportType: PropTypes.string.isRequired,
  setExportType: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ExportTypeSelector;
