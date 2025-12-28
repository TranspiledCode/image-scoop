// src/components/SettingsPanel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Settings } from 'lucide-react';
import ExportTypeSelector from './ExportTypeSelector';

const PanelContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.primary + '20'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary + '15'};
`;

const PanelTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
`;

const SettingsIcon = styled(Settings)`
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const SettingsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SettingLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.6 : 0.8)};
  }
`;

const Checkbox = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const SettingDescription = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.gray};
  margin: 0;
  padding-left: 1.6rem;
  line-height: 1.4;
`;

const SettingsPanel = ({
  exportType,
  setExportType,
  omitFilename,
  setOmitFilename,
  disabled = false,
}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <SettingsIcon />
        <PanelTitle>Output Settings</PanelTitle>
      </PanelHeader>

      <SettingsGroup>
        <SettingItem>
          <ExportTypeSelector
            exportType={exportType}
            setExportType={setExportType}
            disabled={disabled}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel disabled={disabled}>
            <Checkbox
              type="checkbox"
              checked={omitFilename}
              onChange={(e) => setOmitFilename(e.target.checked)}
              disabled={disabled}
            />
            <span>Omit original filename from output files</span>
          </SettingLabel>
          <SettingDescription>
            When enabled, files will be named by size only (e.g., t.webp instead
            of photo_t.webp)
          </SettingDescription>
        </SettingItem>
      </SettingsGroup>
    </PanelContainer>
  );
};

SettingsPanel.propTypes = {
  exportType: PropTypes.string.isRequired,
  setExportType: PropTypes.func.isRequired,
  omitFilename: PropTypes.bool.isRequired,
  setOmitFilename: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SettingsPanel;
