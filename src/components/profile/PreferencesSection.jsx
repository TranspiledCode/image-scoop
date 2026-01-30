import React from 'react';
import styled from '@emotion/styled';
import { FileImage, FileType } from 'lucide-react';
import { useFirebasePreferences } from '../../hooks/useFirebasePreferences';
import { useToast } from '../../context/ToastContext';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: #f9fafb;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

const PreferenceItem = styled.div`
  padding: 20px;
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PreferenceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

const PreferenceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PreferenceContent = styled.div`
  flex: 1;
`;

const PreferenceLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const PreferenceDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleSwitch = styled.button`
  width: 52px;
  height: 30px;
  background: ${({ active }) =>
    active ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' : '#e5e7eb'};
  border: none;
  border-radius: 100px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    top: 4px;
    left: ${({ active }) => (active ? '26px' : '4px')};
    transition: left 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const PreferencesSection = () => {
  const { preferences, updatePreference, loading } = useFirebasePreferences();
  const { addToast } = useToast();

  const handleFormatChange = async (e) => {
    const newFormat = e.target.value;
    try {
      await updatePreference('defaultExportFormat', newFormat);
      addToast(
        `Default format changed to ${newFormat.toUpperCase()}`,
        'success',
      );
    } catch (error) {
      console.error('Error updating format:', error);
      addToast('Failed to update preference', 'error');
    }
  };

  const handleOmitFilenameToggle = async () => {
    const newValue = !preferences.omitFilename;
    try {
      await updatePreference('omitFilename', newValue);
      addToast(
        `Filename ${newValue ? 'will be omitted' : 'will be included'} in exports`,
        'success',
      );
    } catch (error) {
      console.error('Error updating omit filename:', error);
      addToast('Failed to update preference', 'error');
    }
  };

  if (loading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Section>
      <Card>
        <CardTitle>App Preferences</CardTitle>

        <PreferenceItem>
          <PreferenceHeader>
            <PreferenceIcon
              background="rgba(236, 72, 153, 0.1)"
              color="#ec4899"
            >
              <FileImage />
            </PreferenceIcon>
            <PreferenceContent>
              <PreferenceLabel>Default Export Format</PreferenceLabel>
              <PreferenceDescription>
                Choose the default image format for your exports. You can always
                change this for individual exports.
              </PreferenceDescription>
            </PreferenceContent>
          </PreferenceHeader>

          <Select
            value={preferences.defaultExportFormat}
            onChange={handleFormatChange}
          >
            <option value="webp">WebP (Recommended)</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="avif">AVIF</option>
          </Select>
        </PreferenceItem>

        <PreferenceItem>
          <PreferenceHeader>
            <PreferenceIcon
              background="rgba(59, 130, 246, 0.1)"
              color="#3b82f6"
            >
              <FileType />
            </PreferenceIcon>
            <PreferenceContent>
              <PreferenceLabel>Omit Filename in Exports</PreferenceLabel>
              <PreferenceDescription>
                When enabled, exported files will not include the original
                filename in the output. Useful for batch processing.
              </PreferenceDescription>
            </PreferenceContent>
          </PreferenceHeader>

          <Toggle>
            <ToggleSwitch
              active={preferences.omitFilename}
              onClick={handleOmitFilenameToggle}
            />
            <ToggleLabel>
              {preferences.omitFilename ? 'Enabled' : 'Disabled'}
            </ToggleLabel>
          </Toggle>
        </PreferenceItem>
      </Card>
    </Section>
  );
};

export default PreferencesSection;
