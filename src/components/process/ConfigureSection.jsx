// src/components/process/ConfigureSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Zap, ChevronDown, Lock } from 'lucide-react';
import processTheme from '../../style/processTheme';
import { useAdvancedOptions } from '../../hooks/useAdvancedOptions';
import SliderControl from './SliderControl';

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
    transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
  }

  &:hover {
    color: ${processTheme.textPrimary};
  }
`;

const AdvancedOptionsContainer = styled.div`
  max-height: ${({ $expanded }) => ($expanded ? '2000px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: ${({ $expanded }) => ($expanded ? '16px' : '0')};
`;

const AccordionSection = styled.div`
  margin-bottom: 16px;
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 12px;
  overflow: hidden;
  background: #1a1f2e;
`;

const AccordionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 18px;
  background: ${({ $expanded }) => ($expanded ? '#1f2937' : 'transparent')};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    background: #1f2937;
  }
`;

const AccordionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textPrimary};

  svg {
    width: 14px;
    height: 14px;
    color: ${processTheme.textMuted};
  }
`;

const ChevronWrapper = styled.span`
  display: inline-flex;
  width: 16px;
  height: 16px;
  color: ${processTheme.textSecondary};
  transition: transform 0.2s;
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
`;

const AccordionContent = styled.div`
  max-height: ${({ $expanded }) => ($expanded ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const AccordionInner = styled.div`
  padding: 16px 18px;
  background: #111827;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
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

const PlaceholderText = styled.p`
  font-size: 13px;
  color: ${processTheme.textMuted};
  margin: 0;
  font-style: italic;
`;

const UpgradePrompt = styled.div`
  text-align: center;
  padding: 24px;
  background: rgba(31, 41, 55, 0.8);
  border-radius: 8px;
  border: 1px dashed ${processTheme.borderDefault};

  p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: ${processTheme.textSecondary};
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: ${processTheme.primaryGradient};
    color: ${processTheme.textPrimary};
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
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
  const {
    options,
    setOption,
    isCategoryLocked,
    getAllowedRange,
    getCategoryUpgradeMessage,
  } = useAdvancedOptions();

  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    quality: false,
    size: false,
    naming: false,
    processing: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Sync omitFilename with advanced options
  React.useEffect(() => {
    if (options.omitFilename !== omitFilename) {
      setOmitFilename(options.omitFilename);
    }
  }, [options.omitFilename, omitFilename, setOmitFilename]);

  const handleOmitFilenameChange = (checked) => {
    setOption('omitFilename', checked);
    setOmitFilename(checked);
  };

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
        $expanded={showAdvanced}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <span>Advanced Options</span>
        <ChevronDown />
      </AdvancedToggle>

      <AdvancedOptionsContainer $expanded={showAdvanced}>
        {/* Naming & Organization Section */}
        <AccordionSection>
          <AccordionHeader
            $expanded={expandedSections.naming}
            onClick={() => toggleSection('naming')}
          >
            <AccordionTitle>Naming & Organization</AccordionTitle>
            <ChevronWrapper $expanded={expandedSections.naming}>
              <ChevronDown />
            </ChevronWrapper>
          </AccordionHeader>
          <AccordionContent $expanded={expandedSections.naming}>
            <AccordionInner>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={options.omitFilename}
                  onChange={(e) => handleOmitFilenameChange(e.target.checked)}
                />
                <span>
                  Omit filename from variants{' '}
                  <small>(Shorter file paths)</small>
                </span>
              </CheckboxLabel>
              <PlaceholderText style={{ marginTop: '12px' }}>
                Examples: imageName_xl.webp vs. xl.webp
              </PlaceholderText>
            </AccordionInner>
          </AccordionContent>
        </AccordionSection>

        {/* Quality & Compression Section */}
        <AccordionSection>
          <AccordionHeader
            $expanded={expandedSections.quality}
            onClick={() => toggleSection('quality')}
          >
            <AccordionTitle>
              {isCategoryLocked('quality') && <Lock />}
              Quality & Compression
            </AccordionTitle>
            <ChevronWrapper $expanded={expandedSections.quality}>
              <ChevronDown />
            </ChevronWrapper>
          </AccordionHeader>
          <AccordionContent $expanded={expandedSections.quality}>
            <AccordionInner>
              {isCategoryLocked('quality') ? (
                <UpgradePrompt>
                  <p>{getCategoryUpgradeMessage('quality')}</p>
                  <a href="/plan-selection">View Plans</a>
                </UpgradePrompt>
              ) : (
                <>
                  {exportType === 'jpeg' && (
                    <>
                      <SliderControl
                        label="JPEG Quality"
                        value={options.jpegQuality}
                        onChange={(value) => setOption('jpegQuality', value)}
                        min={getAllowedRange('jpegQuality').min || 60}
                        max={getAllowedRange('jpegQuality').max || 100}
                        step={1}
                        tooltip="Higher quality = larger files, better image detail"
                      />
                      <CheckboxLabel>
                        <input
                          type="checkbox"
                          checked={options.progressiveJpeg}
                          onChange={(e) =>
                            setOption('progressiveJpeg', e.target.checked)
                          }
                        />
                        <span>Progressive JPEG</span>
                        <small>Loads gradually on web</small>
                      </CheckboxLabel>
                    </>
                  )}

                  {exportType === 'png' && (
                    <SliderControl
                      label="PNG Compression"
                      value={options.pngCompression}
                      onChange={(value) => setOption('pngCompression', value)}
                      min={0}
                      max={9}
                      step={1}
                      tooltip="Higher values = smaller files (slower). 0 is fastest, 9 is smallest."
                    />
                  )}

                  {exportType === 'webp' && (
                    <SliderControl
                      label="WebP Quality"
                      value={options.webpQuality}
                      onChange={(value) => setOption('webpQuality', value)}
                      min={getAllowedRange('webpQuality').min || 60}
                      max={getAllowedRange('webpQuality').max || 100}
                      step={1}
                      tooltip="Higher quality = larger files, better image detail"
                    />
                  )}

                  {exportType === 'avif' && (
                    <SliderControl
                      label="AVIF Quality"
                      value={options.avifQuality}
                      onChange={(value) => setOption('avifQuality', value)}
                      min={getAllowedRange('avifQuality').min || 60}
                      max={getAllowedRange('avifQuality').max || 100}
                      step={1}
                      tooltip="Higher quality = larger files, better image detail"
                    />
                  )}
                </>
              )}
            </AccordionInner>
          </AccordionContent>
        </AccordionSection>

        {/* Size & Dimensions Section */}
        <AccordionSection>
          <AccordionHeader
            $expanded={expandedSections.size}
            onClick={() => toggleSection('size')}
          >
            <AccordionTitle>
              {isCategoryLocked('size') && <Lock />}
              Size & Dimensions
            </AccordionTitle>
            <ChevronWrapper $expanded={expandedSections.size}>
              <ChevronDown />
            </ChevronWrapper>
          </AccordionHeader>
          <AccordionContent $expanded={expandedSections.size}>
            <AccordionInner>
              {isCategoryLocked('size') ? (
                <UpgradePrompt>
                  <p>{getCategoryUpgradeMessage('size')}</p>
                  <a href="/plan-selection">View Plans</a>
                </UpgradePrompt>
              ) : (
                <PlaceholderText>
                  Variant selection, presets, and dimension controls (coming
                  soon)
                </PlaceholderText>
              )}
            </AccordionInner>
          </AccordionContent>
        </AccordionSection>

        {/* Advanced Processing Section */}
        <AccordionSection>
          <AccordionHeader
            $expanded={expandedSections.processing}
            onClick={() => toggleSection('processing')}
          >
            <AccordionTitle>
              {isCategoryLocked('processing') && <Lock />}
              Advanced Processing
            </AccordionTitle>
            <ChevronWrapper $expanded={expandedSections.processing}>
              <ChevronDown />
            </ChevronWrapper>
          </AccordionHeader>
          <AccordionContent $expanded={expandedSections.processing}>
            <AccordionInner>
              {isCategoryLocked('processing') ? (
                <UpgradePrompt>
                  <p>{getCategoryUpgradeMessage('processing')}</p>
                  <a href="/plan-selection">View Plans</a>
                </UpgradePrompt>
              ) : (
                <PlaceholderText>
                  Metadata, sharpening, color space controls (coming soon)
                </PlaceholderText>
              )}
            </AccordionInner>
          </AccordionContent>
        </AccordionSection>
      </AdvancedOptionsContainer>

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
