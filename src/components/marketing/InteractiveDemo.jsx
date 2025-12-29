import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Loader, XCircle, Zap } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DEMO_FILE_LIMIT = 5 * 1024 * 1024;
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const DemoContainer = styled.div`
  background: #374151;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
`;

const DemoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FilenameInput = styled.input`
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: white;
  font-family: inherit;
  font-weight: 500;
  flex: 1;
  max-width: 300px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    background: #374151;
  }

  &::placeholder {
    color: #6b7280;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormatSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const FormatOption = styled.button`
  padding: 6px 12px;
  background: ${({ active }) =>
    active ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' : '#1f2937'};
  border-radius: 6px;
  font-size: 12px;
  color: ${({ active }) => (active ? 'white' : '#9ca3af')};
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  pointer-events: auto;
  position: relative;
  z-index: 1;

  &:hover {
    background: ${({ active }) =>
      active ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' : '#374151'};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropZoneArea = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16/10;
  background: #1f2937;
  border: 2px dashed
    ${({ isDragActive, hasImage }) =>
      isDragActive ? '#ec4899' : hasImage ? 'transparent' : '#4b5563'};
  cursor: ${({ isProcessing }) => (isProcessing ? 'default' : 'pointer')};
  transition: all 0.3s;

  &:hover {
    border-color: ${({ isProcessing, hasImage }) =>
      isProcessing ? (hasImage ? 'transparent' : '#4b5563') : '#ec4899'};
  }
`;

const DropZoneContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const DropZoneTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const DropZoneText = styled.p`
  font-size: 14px;
  color: #d1d5db;

  span {
    color: #f9a8d4;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProcessingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Spinner = styled(Loader)`
  width: 48px;
  height: 48px;
  color: #ec4899;
  animation: ${spin} 1s linear infinite;
`;

const ProcessingText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const DemoFooter = styled.div`
  margin-top: 16px;
  padding: 20px;
  background: #1f2937;
  border-radius: 12px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterIdle = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
`;

const FooterProcessing = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 14px;
`;

const SmallSpinner = styled(Loader)`
  width: 20px;
  height: 20px;
  color: #ec4899;
  animation: ${spin} 1s linear infinite;
`;

const FooterComplete = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  flex: 1;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetricLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(236, 72, 153, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ProcessButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  font-size: 14px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const InteractiveDemo = () => {
  const [selectedFormat, setSelectedFormat] = useState('webp');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [error, setError] = useState(null);
  const [customFilename, setCustomFilename] = useState('');
  const { addToast } = useToast();

  const processImage = useCallback(
    async (file, format) => {
      setIsProcessing(true);
      setError(null);

      try {
        console.warn('Starting image processing with format:', format);
        const formData = new FormData();
        formData.append('file', file);

        const headers = {
          'X-Output-Format': format,
        };

        // Pass custom filename if provided
        if (customFilename) {
          headers['X-Custom-Filename'] = customFilename;
        }

        console.warn('Sending request with headers:', headers);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('/.netlify/functions/process-single', {
          method: 'POST',
          body: formData,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.warn('Response received:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error('Processing failed');
        }

        console.warn('Converting response to blob...');
        const blob = await response.blob();
        console.warn('Blob created, size:', blob.size);
        const processedUrl = URL.createObjectURL(blob);
        const originalSize = file.size;

        // Calculate average size per variant (6 variants total)
        const variantCount = 6;
        const avgVariantSize = blob.size / variantCount;
        const savings = ((1 - avgVariantSize / originalSize) * 100).toFixed(1);

        const baseFilename = file.name ? file.name.split('.')[0] : 'optimized';

        setProcessedData({
          url: processedUrl,
          originalSize,
          newSize: avgVariantSize,
          savings,
          format,
          filename: `${baseFilename}.zip`,
          isZip: true,
        });
      } catch (err) {
        console.error('Processing error:', err);
        setError('Failed to process image. Please try again.');
        addToast('Processing failed. Please try again.', 'danger');
      } finally {
        setIsProcessing(false);
      }
    },
    [addToast, customFilename],
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          addToast('File must be under 5MB for demo', 'danger');
        } else {
          addToast('Invalid file type', 'danger');
        }
        return;
      }

      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setProcessedData(null);
      setError(null);

      // Set custom filename to original filename (without extension)
      const originalName = selectedFile.name.split('.').slice(0, -1).join('.');
      setCustomFilename(originalName);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    },
    [addToast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: DEMO_FILE_LIMIT,
    multiple: false,
    disabled: isProcessing,
  });

  const handleProcess = () => {
    if (!file) return;
    processImage(file, selectedFormat);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleProcess();
    }
  };

  const handleDownload = () => {
    if (!processedData) return;

    const filename = customFilename
      ? `${customFilename}.zip`
      : processedData.filename;

    const link = document.createElement('a');
    link.href = processedData.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Images downloaded successfully!', 'success');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <DemoContainer>
      <DemoHeader>
        <FormatSelector>
          <FormatOption
            active={selectedFormat === 'webp'}
            onClick={() => setSelectedFormat('webp')}
          >
            WebP
          </FormatOption>
          <FormatOption
            active={selectedFormat === 'png'}
            onClick={() => setSelectedFormat('png')}
          >
            PNG
          </FormatOption>
          <FormatOption
            active={selectedFormat === 'jpeg'}
            onClick={() => setSelectedFormat('jpeg')}
          >
            JPEG
          </FormatOption>
        </FormatSelector>
      </DemoHeader>

      <>
        <DropZoneArea
          {...getRootProps()}
          isDragActive={isDragActive}
          hasImage={!!preview}
          isProcessing={isProcessing}
        >
          <input {...getInputProps()} />

          {preview ? (
            <>
              <ImagePreview src={preview} alt="Preview" />
              {isProcessing && (
                <ProcessingOverlay>
                  <Spinner />
                  <ProcessingText>Optimizing your image...</ProcessingText>
                </ProcessingOverlay>
              )}
            </>
          ) : (
            <DropZoneContent>
              <UploadIcon>
                <Upload />
              </UploadIcon>
              <DropZoneTitle>Drop an image to try it out</DropZoneTitle>
              <DropZoneText>
                or <span>browse files</span> • Max 5MB
              </DropZoneText>
            </DropZoneContent>
          )}
        </DropZoneArea>

        <DemoFooter>
          {!file && !isProcessing && !processedData && (
            <FooterIdle>Upload an image to see the magic happen ✨</FooterIdle>
          )}

          {file && !isProcessing && !processedData && (
            <FooterComplete>
              <FilenameInput
                type="text"
                placeholder="Enter filename"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => e.target.select()}
              />
              <ProcessButton onClick={handleProcess}>
                <Zap />
                Process Image
              </ProcessButton>
            </FooterComplete>
          )}

          {isProcessing && (
            <FooterProcessing>
              <SmallSpinner />
              <span>Processing your image...</span>
            </FooterProcessing>
          )}

          {error && (
            <ErrorMessage>
              <XCircle />
              <span>{error}</span>
            </ErrorMessage>
          )}

          {processedData && !isProcessing && (
            <FooterComplete>
              <MetricsGrid>
                <Metric>
                  <MetricValue>
                    {formatBytes(processedData.originalSize)}
                  </MetricValue>
                  <MetricLabel>Original</MetricLabel>
                </Metric>
                <Metric>
                  <MetricValue>
                    {formatBytes(processedData.newSize)}
                  </MetricValue>
                  <MetricLabel>Optimized</MetricLabel>
                </Metric>
                <Metric>
                  <MetricValue>-{processedData.savings}%</MetricValue>
                  <MetricLabel>Saved</MetricLabel>
                </Metric>
              </MetricsGrid>

              <DownloadButton onClick={handleDownload}>
                <Download />
                Download
              </DownloadButton>
            </FooterComplete>
          )}
        </DemoFooter>
      </>
    </DemoContainer>
  );
};

export default InteractiveDemo;
