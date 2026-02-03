// src/components/process/ConfigureSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Zap, ChevronDown } from 'lucide-react';
import processTheme from '../../style/processTheme';

const expandIn = keyframes`
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }
`;

const Section = styled.div`
  background: ${processTheme.cardBg};
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 20px;
  padding: 32px;
  margin-top: 24px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${expandIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 24px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${processTheme.textPrimary};
  margin: 0 0 20px 0;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const FormatSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    gap: 8px;
  }
`;

const FormatButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: ${({ active }) =>
    active ? processTheme.primaryGradient : '#1f2937'};
  border-radius: 12px;
  font-size: 15px;
  color: ${({ active }) =>
    active ? processTheme.textPrimary : processTheme.textSecondary};
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  min-height: 48px;

  &:hover {
    background: ${({ active }) =>
      active ? processTheme.primaryGradient : '#374151'};
    color: ${processTheme.textPrimary};
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const AdvancedToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  background: transparent;
  border: none;
  color: ${processTheme.textSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
    transform: rotate(${({ expanded }) => (expanded ? '180deg' : '0deg')});
  }

  &:hover {
    color: ${processTheme.textPrimary};
  }
`;

const AdvancedOptions = styled.div`
  max-height: ${({ expanded }) => (expanded ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: ${({ expanded }) => (expanded ? '16px' : '0')};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #1f2937;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #374151;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  span {
    font-size: 14px;
    color: ${processTheme.textPrimary};
    font-weight: 500;
  }

  small {
    font-size: 12px;
    color: ${processTheme.textMuted};
    margin-left: auto;
  }
`;

const ProcessButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px 32px;
  background: ${processTheme.successGradient};
  color: ${processTheme.textPrimary};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  margin-top: 24px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    padding: 16px 28px;
    font-size: 15px;
  }
`;

const ConfigureSection = ({
  exportType,
  setExportType,
  omitFilename,
  setOmitFilename,
  onOptimize,
  filesCount,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <Section>
      <SectionTitle>Output Settings</SectionTitle>

      <FormatSelector>
        <FormatButton
          active={exportType === 'webp'}
          onClick={() => setExportType('webp')}
        >
          WebP
        </FormatButton>
        <FormatButton
          active={exportType === 'avif'}
          onClick={() => setExportType('avif')}
        >
          AVIF
        </FormatButton>
        <FormatButton
          active={exportType === 'jpeg'}
          onClick={() => setExportType('jpeg')}
        >
          JPEG
        </FormatButton>
        <FormatButton
          active={exportType === 'png'}
          onClick={() => setExportType('png')}
        >
          PNG
        </FormatButton>
      </FormatSelector>

      <AdvancedToggle
        expanded={showAdvanced}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <span>Advanced Options</span>
        <ChevronDown />
      </AdvancedToggle>

      <AdvancedOptions expanded={showAdvanced}>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={omitFilename}
            onChange={(e) => setOmitFilename(e.target.checked)}
          />
          <span>Omit filename from variants</span>
          <small>Shorter file paths</small>
        </CheckboxLabel>
      </AdvancedOptions>

      <ProcessButton onClick={onOptimize} disabled={filesCount === 0}>
        <Zap />
        Process {filesCount} {filesCount === 1 ? 'Image' : 'Images'}
      </ProcessButton>
    </Section>
  );
};

ConfigureSection.propTypes = {
  exportType: PropTypes.string.isRequired,
  setExportType: PropTypes.func.isRequired,
  omitFilename: PropTypes.bool.isRequired,
  setOmitFilename: PropTypes.func.isRequired,
  onOptimize: PropTypes.func.isRequired,
  filesCount: PropTypes.number.isRequired,
};

export default ConfigureSection;
