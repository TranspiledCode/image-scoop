import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes, Global, css } from '@emotion/react';
import { useDropzone } from 'react-dropzone';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import {
  Upload,
  Download,
  Loader,
  XCircle,
  Zap,
  Sparkles,
  Info,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import useAnalytics from '../../hooks/useAnalytics';

const driverStyles = css`
  .driver-popover {
    background: #1f2937;
    color: #ffffff;
    border-radius: 12px;
    padding: 16px;
    padding-right: 40px;
    max-width: 280px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .driver-popover-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #f472b6 0%, #fb923c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .driver-popover-description {
    font-size: 13px;
    line-height: 1.5;
    color: #d1d5db;
  }

  .driver-popover-progress-text {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 12px;
    font-weight: 600;
  }

  .driver-popover-navigation-btns {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .driver-popover-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .driver-popover-next-btn {
    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    color: white;
  }

  .driver-popover-next-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }

  .driver-popover-prev-btn {
    background: #374151;
    color: #d1d5db;
  }

  .driver-popover-prev-btn:hover {
    background: #4b5563;
  }

  .driver-popover-close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    color: #ffffff !important;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent !important;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 20px;
    line-height: 1;
    opacity: 1 !important;
  }

  .driver-popover-close-btn:hover {
    color: #ffffff !important;
    opacity: 1 !important;
  }

  .driver-popover-close-btn:focus {
    color: #ffffff !important;
    outline: none;
  }

  .driver-popover-close-btn svg {
    color: #ffffff !important;
    fill: #ffffff !important;
  }

  .driver-popover-arrow {
    border-color: #1f2937;
  }

  @media (max-width: 768px) {
    .driver-popover {
      max-width: 240px;
      padding: 12px;
      padding-right: 36px;
    }

    .driver-popover-title {
      font-size: 14px;
    }

    .driver-popover-description {
      font-size: 12px;
    }

    .driver-popover-btn {
      padding: 6px 12px;
      font-size: 12px;
    }

    .driver-popover-close-btn {
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      font-size: 18px;
      color: #ffffff !important;
    }

    .driver-popover-close-btn svg {
      color: #ffffff !important;
      fill: #ffffff !important;
    }
  }
`;

const DEMO_FILE_LIMIT = 5 * 1024 * 1024;
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};
const TOUR_STORAGE_KEY = 'imagescoop_tour_shown';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const DemoContainer = styled.div`
  background: #374151;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 1024px) {
    padding: 20px;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 12px;
  }
`;

const DemoHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 10;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  align-items: center;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const FilenameInputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
`;

const FilenameInput = styled.input`
  background: #1f2937;
  border: 2px solid #374151;
  border-radius: 8px;
  padding: 12px 16px;
  padding-right: 40px;
  font-size: 16px;
  color: white;
  font-family: inherit;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    background: #374151;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: #6b7280;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    transform: scale(1);
    -webkit-transform: scale(1);
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    padding-right: 36px;
    font-size: 14px;
  }
`;

const SparkleIcon = styled(Sparkles)`
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  color: #fbbf24;
  pointer-events: none;
  animation: ${keyframes`
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  `} 2s ease-in-out infinite;
`;

const InfoButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(31, 41, 55, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  backdrop-filter: blur(8px);
  pointer-events: auto;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(31, 41, 55, 1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    bottom: 12px;
    right: 12px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const FormatSelector = styled.div`
  display: flex;
  gap: 8px;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  ${({ hidden }) =>
    hidden &&
    `
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    position: absolute;
  `}

  @media (max-width: 768px) {
    gap: 8px;
    width: 100%;

    ${({ hidden }) =>
      hidden &&
      `
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
      position: absolute;
    `}
  }

  @media (max-width: 480px) {
    gap: 6px;
    width: 100%;

    ${({ hidden }) =>
      hidden &&
      `
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
      position: absolute;
    `}
  }
`;

const FormatOption = styled.button`
  padding: 10px 20px;
  background: ${({ active }) =>
    active ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' : '#1f2937'};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ active }) => (active ? 'white' : '#9ca3af')};
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  pointer-events: auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex: 1;
    padding: 10px 6px;
    font-size: 13px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 12px 4px;
    font-size: 12px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

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
  width: 100%;
  max-width: 100%;
  background: ${({ hasImage }) =>
    hasImage
      ? '#1f2937'
      : 'url(https://imagedelivery.net/AjKAvtYVvwYZJx-5TwXk4w/image-scoop/backgrounds/mountains/small) center/cover no-repeat'};
  ${({ isDragActive, hasImage }) =>
    isDragActive ? '#ec4899' : hasImage ? 'transparent' : '#4b5563'};
  cursor: ${({ isProcessing }) => (isProcessing ? 'default' : 'pointer')};
  transition: all 0.3s;
  filter: ${({ hasImage }) => (hasImage ? 'none' : 'brightness(0.8)')};

  @media (max-width: 1024px) {
    aspect-ratio: 16/9;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    aspect-ratio: 4/3;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    aspect-ratio: 1/1;
    border-radius: 10px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ hasImage }) =>
      hasImage ? 'transparent' : 'rgba(0, 0, 0, 0.5)'};
    backdrop-filter: ${({ hasImage }) => (hasImage ? 'none' : 'blur(2px)')};
    pointer-events: none;
    transition: all 0.3s;
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

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
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

  @media (max-width: 1024px) {
    width: 56px;
    height: 56px;
    margin-bottom: 14px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const DropZoneTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;

  &.mobile-only {
    display: none;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    margin-bottom: 6px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 6px;

    &.desktop-only {
      display: none;
    }

    &.mobile-only {
      display: block;
    }
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const DropZoneText = styled.p`
  font-size: 14px;
  color: #d1d5db;

  &.mobile-only {
    display: none;
  }

  span {
    color: #f9a8d4;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;

    &.desktop-only {
      display: none;
    }

    &.mobile-only {
      display: block;
    }
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  display: block;
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

  .mobile-status-message {
    color: #10b981;
    font-weight: 500;
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  width: 100%;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    row-gap: 20px;
  }
`;

const Metric = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #a3e635 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const MetricLabel = styled.div`
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 10px;
    letter-spacing: 0.3px;
    margin-top: 6px;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  width: 100%;

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
  flex-shrink: 0;
  white-space: nowrap;

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

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 13px;
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
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [mobileStatusMessage, setMobileStatusMessage] = useState('');
  const { addToast } = useToast();
  const { trackConversionStats } = useAnalytics();
  const inputRef = useRef(null);
  const formatSelectorRef = useRef(null);
  const processButtonRef = useRef(null);
  const driverObj = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  const placeholderExamples = [
    'my-image',
    'profile-pic',
    'banner-image',
    'product-shot',
  ];

  // Helper function to show toast on desktop, status message on mobile
  const showNotification = useCallback(
    (message, type = 'info') => {
      if (window.innerWidth <= 768) {
        // Mobile: Set status message
        setMobileStatusMessage(message);
        // Clear message after 3 seconds
        setTimeout(() => setMobileStatusMessage(''), 3000);
      } else {
        // Desktop: Show toast
        addToast(message, type);
      }
    },
    [addToast],
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!driverObj.current) {
      driverObj.current = driver({
        showProgress: true,
        steps: [
          {
            element: '[data-tour="format-selector"]',
            popover: {
              title: 'Choose Format',
              description: 'Select your output format',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '[data-tour="filename-input"]',
            popover: {
              title: 'Rename',
              description: 'Customize filename (optional)',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '[data-tour="process-button"]',
            popover: {
              title: 'Process',
              description: 'Click to optimize your image!',
              side: 'top',
              align: 'end',
            },
          },
        ],
        popoverClass: 'driver-popover-custom',
        progressText: '{{current}} of {{total}}',
        showButtons: ['next', 'previous', 'close'],
        onDestroyed: () => {
          // Mark tour as shown in localStorage
          try {
            localStorage.setItem(TOUR_STORAGE_KEY, 'true');
          } catch (e) {
            // Handle localStorage errors silently
            console.warn('Could not save tour preference:', e);
          }
        },
      });
    }

    return () => {
      // Cleanup driver instance on unmount
      if (driverObj.current) {
        driverObj.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Check if tour has been shown before
    const tourShown = localStorage.getItem(TOUR_STORAGE_KEY);

    if (
      file &&
      !tourShown &&
      !isProcessing &&
      !processedData &&
      driverObj.current
    ) {
      setTimeout(() => {
        driverObj.current.drive();
      }, 500);
    }
  }, [file, isProcessing, processedData]);

  useEffect(() => {
    if (!file || isProcessing || processedData || customFilename) return;

    const currentExample = placeholderExamples[placeholderIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      if (!isDeleting && charIndex < currentExample.length) {
        setPlaceholderText(currentExample.substring(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(type, 100);
      } else if (!isDeleting && charIndex === currentExample.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholderText(currentExample.substring(0, charIndex - 1));
        charIndex--;
        timeoutId = setTimeout(type, 50);
      } else if (isDeleting && charIndex === 0) {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [
    file,
    isProcessing,
    processedData,
    customFilename,
    placeholderIndex,
    placeholderExamples,
  ]);

  const processImage = useCallback(
    async (file, format) => {
      setIsProcessing(true);
      setError(null);
      const startTime = performance.now();

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

        // Calculate elapsed time
        const endTime = performance.now();
        const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);

        const baseFilename = file.name ? file.name.split('.')[0] : 'optimized';

        setProcessedData({
          url: processedUrl,
          originalSize,
          newSize: avgVariantSize,
          savings,
          format,
          filename: `${baseFilename}.zip`,
          isZip: true,
          elapsedTime,
        });

        // Track demo conversion stats
        const storageSaved = Math.max(0, originalSize - avgVariantSize);
        await trackConversionStats(1, storageSaved);
      } catch (err) {
        console.error('Processing error:', err);
        setError('Failed to process image. Please try again.');
        showNotification('Processing failed. Please try again.', 'danger');
      } finally {
        setIsProcessing(false);

        // Scroll demo area back into view after processing (for mobile keyboard)
        if (window.innerWidth <= 768) {
          scrollTimeoutRef.current = setTimeout(() => {
            const demoContainer = document.querySelector(
              '[data-demo-container]',
            );
            if (demoContainer) {
              const offset = 80;
              const elementPosition = demoContainer.getBoundingClientRect().top;
              const offsetPosition =
                elementPosition + window.pageYOffset - offset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });
            }
          }, 300); // Small delay to ensure processing state is updated
        }
      }
    },
    [showNotification, customFilename, trackConversionStats],
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          showNotification('File must be under 5MB for demo', 'danger');
        } else {
          showNotification('Invalid file type', 'danger');
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

        // Scroll demo area into view on mobile and tablet after image is loaded
        if (window.innerWidth <= 768) {
          scrollTimeoutRef.current = setTimeout(() => {
            const demoContainer = document.querySelector(
              '[data-demo-container]',
            );
            if (demoContainer) {
              const containerRect = demoContainer.getBoundingClientRect();
              const targetY = window.pageYOffset + containerRect.top - 80;
              window.scrollTo({
                top: targetY,
                behavior: 'smooth',
              });
            }
          }, 100);
        }
      };
      reader.readAsDataURL(selectedFile);
    },
    [showNotification],
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

    // Close tour if it's running
    if (driverObj.current && driverObj.current.isActive()) {
      driverObj.current.destroy();
    }

    processImage(file, selectedFormat);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // If tour is active, move to next step instead of processing
      if (driverObj.current && driverObj.current.isActive()) {
        e.preventDefault();
        driverObj.current.moveNext();
        return;
      }
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

    showNotification('Images downloaded successfully!', 'success');

    // Reset demo after download with a brief delay
    resetTimeoutRef.current = setTimeout(() => {
      // Clean up object URL to prevent memory leaks
      if (processedData.url) {
        URL.revokeObjectURL(processedData.url);
      }
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      // Reset all state
      setFile(null);
      setPreview(null);
      setProcessedData(null);
      setError(null);
      setCustomFilename('');
      setIsProcessing(false);

      // Show ready message
      showNotification('Ready for another image!', 'info');
    }, 1500);
  };

  const handleShowTutorial = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to dropzone
    if (driverObj.current) {
      driverObj.current.drive();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <>
      <Global styles={driverStyles} />
      <DemoContainer style={{ position: 'relative' }} data-demo-container>
        <DemoHeader>
          <FormatSelector
            ref={formatSelectorRef}
            data-tour="format-selector"
            hidden={
              isProcessing ||
              processedData ||
              (!file && window.innerWidth <= 768)
            }
          >
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

            {file && !isProcessing && !processedData && (
              <InfoButton onClick={handleShowTutorial} title="Show tutorial">
                <Info />
              </InfoButton>
            )}

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
                <DropZoneTitle className="desktop-only">
                  Drop an image to try it out
                </DropZoneTitle>
                <DropZoneTitle className="mobile-only">
                  Tap to upload an image
                </DropZoneTitle>
                <DropZoneText className="desktop-only">
                  or <span>browse files</span> • Max 5MB
                </DropZoneText>
                <DropZoneText className="mobile-only">Max 5MB</DropZoneText>
              </DropZoneContent>
            )}
          </DropZoneArea>

          <DemoFooter>
            {!file && !isProcessing && !processedData && (
              <FooterIdle>
                {mobileStatusMessage ? (
                  <span className="mobile-status-message">
                    {mobileStatusMessage}
                  </span>
                ) : (
                  <>Upload an image to see the magic happen ✨</>
                )}
              </FooterIdle>
            )}

            {file && !isProcessing && !processedData && (
              <FooterComplete>
                <InputGroup>
                  <FilenameInputWrapper data-tour="filename-input">
                    <FilenameInput
                      ref={inputRef}
                      type="text"
                      placeholder={
                        placeholderText || 'Enter custom filename...'
                      }
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={(e) => e.target.select()}
                    />
                    <SparkleIcon />
                  </FilenameInputWrapper>
                  <ProcessButton
                    ref={processButtonRef}
                    onClick={handleProcess}
                    data-tour="process-button"
                  >
                    <Zap />
                    Process Image
                  </ProcessButton>
                </InputGroup>
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
                <DownloadButton onClick={handleDownload}>
                  <Download />
                  Download
                </DownloadButton>

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
                  <Metric>
                    <MetricValue>{processedData.elapsedTime}s</MetricValue>
                    <MetricLabel>Time</MetricLabel>
                  </Metric>
                </MetricsGrid>
              </FooterComplete>
            )}
          </DemoFooter>
        </>
      </DemoContainer>
    </>
  );
};

export default InteractiveDemo;
