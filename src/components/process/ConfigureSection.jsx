// src/components/process/ConfigureSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Zap, ChevronDown, Lock } from 'lucide-react';
import processTheme from '../../style/processTheme';
import { useToast } from '../../context/ToastContext';
import SliderControl from './SliderControl';
import VariantSelector from './VariantSelector';

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

  input[type='checkbox'] {
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

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${processTheme.textPrimary};
  margin-bottom: 8px;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #1f2937;
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 8px;
  color: ${processTheme.textPrimary};
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${processTheme.primary};
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: ${processTheme.textMuted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: #1f2937;
  border: 1px solid ${processTheme.borderDefault};
  border-radius: 8px;
  color: ${processTheme.textPrimary};
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${processTheme.primary};
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  option {
    background: #1f2937;
    color: ${processTheme.textPrimary};
  }
`;

const HintText = styled.p`
  font-size: 12px;
  color: ${processTheme.textMuted};
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

const PresetInfo = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: ${processTheme.textSecondary};
  line-height: 1.5;

  strong {
    color: ${processTheme.primary};
    font-weight: 600;
  }
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

const PreferenceControls = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${processTheme.borderDefault};

  @media (max-width: ${processTheme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PreferenceButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ variant }) =>
    variant === 'save'
      ? `
    background: ${processTheme.primaryGradient};
    color: ${processTheme.textPrimary};
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  `
      : `
    background: transparent;
    color: ${processTheme.textSecondary};
    border: 1px solid ${processTheme.borderDefault};

    &:hover {
      border-color: ${processTheme.textSecondary};
      color: ${processTheme.textPrimary};
    }
  `}

  &:active {
    transform: translateY(0);
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

const FilenamePreview = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
`;

const PreviewLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${processTheme.textSecondary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PreviewExample = styled.div`
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: ${processTheme.textSecondary};
  line-height: 1.6;

  div {
    margin: 4px 0;
  }

  .folder {
    color: ${processTheme.textSecondary};
  }
`;

const ConfigureSection = ({
  exportType,
  setExportType,
  onOptimize,
  filesCount,
  advancedOptionsHook,
}) => {
  const {
    options,
    setOption,
    savePreferences,
    clearSavedPreferences,
    isCategoryLocked,
    getAllowedRange,
    getCategoryUpgradeMessage,
  } = advancedOptionsHook;

  const { addToast } = useToast();
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    quality: false,
    size: false,
    naming: false,
    processing: false,
  });
  const [justSavedPreferences, setJustSavedPreferences] = React.useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleOmitFilenameChange = (checked) => {
    setOption('omitFilename', checked);
  };

  // Handle size preset changes - update BOTH variants AND aspect ratio
  const handleSizePresetChange = (preset) => {
    setOption('sizePreset', preset);

    // Don't update for custom selection (user manages both themselves)
    if (preset === 'custom') {
      return;
    }

    // Define comprehensive preset packages (variants + aspect ratio)
    const presetPackages = {
      standard: {
        variants: ['t', 's', 'm', 'l', 'xl', 'xxl'],
        aspectRatio: 'original',
        description: 'All sizes, original aspect ratio',
      },
      social: {
        variants: ['l', 'xl', 'xxl'],
        aspectRatio: '1:1',
        description: 'Large sizes, square for social media',
      },
      web: {
        variants: ['s', 'm', 'l', 'xl'],
        aspectRatio: 'original',
        description: 'Web sizes, original aspect ratio',
      },
    };

    const presetConfig = presetPackages[preset];
    if (presetConfig) {
      setOption('selectedVariants', presetConfig.variants);
      setOption('aspectRatio', presetConfig.aspectRatio);
    }
  };

  // Generate filename preview examples
  const getFilenamePreview = () => {
    const { filenamePrefix, filenameSuffix, omitFilename, folderOrganization } =
      options;
    const exampleBasename = 'photo';
    const exampleSize = 'm';
    const format = exportType;

    let folderName = '';
    let fileName = '';

    if (omitFilename) {
      // When omitting filename: prefix+size+suffix
      fileName = `${filenamePrefix}${exampleSize}${filenameSuffix}.${format}`;
    } else {
      // When including filename: prefix+basename+suffix_size
      const processedName = `${filenamePrefix}${exampleBasename}${filenameSuffix}`;
      fileName = `${processedName}_${exampleSize}.${format}`;
    }

    if (folderOrganization === 'by-original') {
      folderName = exampleBasename;
    } else if (folderOrganization === 'by-size') {
      folderName = exampleSize;
      if (omitFilename) {
        const processedName = `${filenamePrefix}${exampleBasename}${filenameSuffix}`;
        fileName = `${processedName}.${format}`;
      }
    } else {
      // flat - no folders
      folderName = '';
      if (omitFilename) {
        if (filenamePrefix || filenameSuffix) {
          // Must include basename for uniqueness in flat mode when using prefix/suffix
          fileName = `${filenamePrefix}${exampleBasename}_${exampleSize}${filenameSuffix}.${format}`;
        }
        // else: fileName already set to prefix+size+suffix from line 430
      }
      // else: fileName already set with basename from line 434
    }

    return { folderName, fileName };
  };

  const preview = getFilenamePreview();

  // Get preset configuration description
  const getPresetDescription = () => {
    const presetDescriptions = {
      standard: {
        variants: 'T, S, M, L, XL, XXL (all sizes)',
        aspectRatio: 'Original (preserves input)',
      },
      social: {
        variants: 'L, XL, XXL (large sizes)',
        aspectRatio: 'Square 1:1 (crops to square)',
      },
      web: {
        variants: 'S, M, L, XL (web sizes)',
        aspectRatio: 'Original (preserves input)',
      },
    };

    return presetDescriptions[options.sizePreset] || null;
  };

  const presetInfo = getPresetDescription();

  // Debug: Log current prefix/suffix values
  React.useEffect(() => {
    console.warn('ConfigureSection - Current naming options:', {
      filenamePrefix: options.filenamePrefix,
      filenameSuffix: options.filenameSuffix,
      omitFilename: options.omitFilename,
    });
  }, [options.filenamePrefix, options.filenameSuffix, options.omitFilename]);

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

              <InputGroup>
                <InputLabel htmlFor="filename-prefix">
                  Filename Prefix
                </InputLabel>
                <TextInput
                  id="filename-prefix"
                  type="text"
                  value={options.filenamePrefix}
                  onChange={(e) => {
                    const newValue = e.target.value.slice(0, 20);
                    console.warn('Prefix changed to:', newValue);
                    setOption('filenamePrefix', newValue);
                  }}
                  placeholder="e.g., thumb_"
                  maxLength={20}
                />
                <HintText>
                  Add a prefix to all exported filenames (max 20 characters)
                </HintText>
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="filename-suffix">
                  Filename Suffix
                </InputLabel>
                <TextInput
                  id="filename-suffix"
                  type="text"
                  value={options.filenameSuffix}
                  onChange={(e) =>
                    setOption('filenameSuffix', e.target.value.slice(0, 20))
                  }
                  placeholder="e.g., _optimized"
                  maxLength={20}
                />
                <HintText>
                  Add a suffix to all exported filenames (max 20 characters)
                </HintText>
              </InputGroup>

              {(options.filenamePrefix ||
                options.filenameSuffix ||
                !options.omitFilename) && (
                <FilenamePreview>
                  <PreviewLabel>Preview:</PreviewLabel>
                  <PreviewExample>
                    {preview.folderName ? (
                      <div>
                        <div className="folder">
                          {preview.folderName}/{preview.fileName}
                        </div>
                      </div>
                    ) : (
                      <div className="file">{preview.fileName}</div>
                    )}
                  </PreviewExample>
                </FilenamePreview>
              )}

              <InputGroup>
                <InputLabel htmlFor="folder-organization">
                  Folder Organization
                </InputLabel>
                <Select
                  id="folder-organization"
                  value={options.folderOrganization}
                  onChange={(e) =>
                    setOption('folderOrganization', e.target.value)
                  }
                >
                  <option value="by-original">
                    By Original (folder per image)
                  </option>
                  <option value="by-size">By Size (folder per variant)</option>
                  <option value="flat">Flat (no folders)</option>
                </Select>
                <HintText>
                  Choose how files are organized in the exported ZIP
                </HintText>
              </InputGroup>
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
                <>
                  <VariantSelector
                    selectedVariants={options.selectedVariants}
                    onChange={(variants) => {
                      setOption('selectedVariants', variants);
                      // When manually changing variants, switch to custom preset
                      setOption('sizePreset', 'custom');
                    }}
                    aspectRatio={options.aspectRatio}
                  />

                  <InputGroup>
                    <InputLabel htmlFor="size-preset">Size Preset</InputLabel>
                    <Select
                      id="size-preset"
                      value={options.sizePreset}
                      onChange={(e) => handleSizePresetChange(e.target.value)}
                    >
                      <option value="custom">Custom (Manual control)</option>
                      <option value="standard">
                        Standard (All sizes, original ratio)
                      </option>
                      <option value="social">
                        Social Media (Large sizes, square 1:1)
                      </option>
                      <option value="web">
                        Web Optimized (Web sizes, original ratio)
                      </option>
                    </Select>
                    <HintText>
                      Presets configure both variant sizes and aspect ratio
                      together
                    </HintText>
                    {presetInfo && (
                      <PresetInfo>
                        <strong>Variants:</strong> {presetInfo.variants}
                        <br />
                        <strong>Aspect Ratio:</strong> {presetInfo.aspectRatio}
                      </PresetInfo>
                    )}
                  </InputGroup>

                  <InputGroup>
                    <InputLabel htmlFor="aspect-ratio">Aspect Ratio</InputLabel>
                    <Select
                      id="aspect-ratio"
                      value={options.aspectRatio}
                      onChange={(e) => {
                        setOption('aspectRatio', e.target.value);
                        // When manually changing aspect ratio, switch to custom preset
                        setOption('sizePreset', 'custom');
                      }}
                    >
                      <option value="original">Keep Original</option>
                      <option value="1:1">Square (1:1)</option>
                      <option value="16:9">Landscape (16:9)</option>
                      <option value="9:16">Portrait (9:16)</option>
                      <option value="4:3">Classic (4:3)</option>
                      <option value="3:2">Photo (3:2)</option>
                    </Select>
                    <HintText>
                      Force images to a specific aspect ratio (crops if needed)
                    </HintText>
                  </InputGroup>

                  <SliderControl
                    label="Max Dimension"
                    value={options.maxDimension}
                    onChange={(value) => setOption('maxDimension', value)}
                    min={getAllowedRange('maxDimension').min || 1000}
                    max={getAllowedRange('maxDimension').max || 8000}
                    step={100}
                    tooltip="Maximum width or height for exported images (in pixels)"
                  />
                </>
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
                <>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={options.stripMetadata}
                      onChange={(e) =>
                        setOption('stripMetadata', e.target.checked)
                      }
                    />
                    <span>Strip Metadata</span>
                    <small>Remove EXIF data</small>
                  </CheckboxLabel>

                  <InputGroup>
                    <InputLabel htmlFor="sharpening">Sharpening</InputLabel>
                    <Select
                      id="sharpening"
                      value={options.sharpening}
                      onChange={(e) => setOption('sharpening', e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="light">Light (subtle enhancement)</option>
                      <option value="medium">Medium (balanced)</option>
                      <option value="strong">Strong (maximum clarity)</option>
                    </Select>
                    <HintText>
                      Apply sharpening to enhance image detail
                    </HintText>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel htmlFor="color-space">Color Space</InputLabel>
                    <Select
                      id="color-space"
                      value={options.colorSpace}
                      onChange={(e) => setOption('colorSpace', e.target.value)}
                    >
                      <option value="srgb">sRGB (standard)</option>
                      <option value="original">Keep Original</option>
                      <option value="linear-rgb">Linear RGB</option>
                    </Select>
                    <HintText>
                      Choose the color space for exported images
                    </HintText>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel htmlFor="resize-algorithm">
                      Resize Algorithm
                    </InputLabel>
                    <Select
                      id="resize-algorithm"
                      value={options.resizeAlgorithm}
                      onChange={(e) =>
                        setOption('resizeAlgorithm', e.target.value)
                      }
                    >
                      <option value="lanczos3">Lanczos3 (best quality)</option>
                      <option value="lanczos2">Lanczos2 (balanced)</option>
                      <option value="cubic">Cubic (faster)</option>
                      <option value="mitchell">Mitchell (smooth)</option>
                      <option value="nearest">Nearest (pixelated)</option>
                    </Select>
                    <HintText>Algorithm used for resizing images</HintText>
                  </InputGroup>

                  {exportType === 'jpeg' && (
                    <InputGroup>
                      <InputLabel htmlFor="chroma-subsampling">
                        Chroma Subsampling
                      </InputLabel>
                      <Select
                        id="chroma-subsampling"
                        value={options.chromaSubsampling}
                        onChange={(e) =>
                          setOption('chromaSubsampling', e.target.value)
                        }
                      >
                        <option value="4:2:0">
                          4:2:0 (standard, smallest)
                        </option>
                        <option value="4:2:2">4:2:2 (better quality)</option>
                        <option value="4:4:4">
                          4:4:4 (best quality, largest)
                        </option>
                      </Select>
                      <HintText>
                        Color sampling method for JPEG compression
                      </HintText>
                    </InputGroup>
                  )}
                </>
              )}
            </AccordionInner>
          </AccordionContent>
        </AccordionSection>

        {/* Preference Management Controls */}
        <PreferenceControls>
          <PreferenceButton
            variant="save"
            onClick={() => {
              const success = savePreferences();
              if (success) {
                setJustSavedPreferences(true);
                addToast(
                  'Preferences saved! Will be applied on next visit.',
                  'success',
                );
                // Reset the saved state after 2 seconds
                setTimeout(() => {
                  setJustSavedPreferences(false);
                }, 2000);
              } else {
                addToast('Failed to save preferences', 'danger');
              }
            }}
          >
            {justSavedPreferences ? '✓ Preferences Saved' : 'Save Preferences'}
          </PreferenceButton>
          <PreferenceButton
            variant="reset"
            onClick={() => {
              const success = clearSavedPreferences();
              if (success) {
                addToast('Preferences cleared. Reset to defaults.', 'success');
              } else {
                addToast('Failed to clear preferences', 'danger');
              }
            }}
          >
            Reset to Defaults
          </PreferenceButton>
        </PreferenceControls>
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
  onOptimize: PropTypes.func.isRequired,
  filesCount: PropTypes.number.isRequired,
  advancedOptionsHook: PropTypes.shape({
    options: PropTypes.object.isRequired,
    setOption: PropTypes.func.isRequired,
    savePreferences: PropTypes.func.isRequired,
    clearSavedPreferences: PropTypes.func.isRequired,
    isCategoryLocked: PropTypes.func.isRequired,
    getAllowedRange: PropTypes.func.isRequired,
    getCategoryUpgradeMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default ConfigureSection;
