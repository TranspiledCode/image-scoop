import { useCallback } from 'react';

const useAnalytics = () => {
  const trackEvent = useCallback((eventName, eventParams = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  }, []);

  const trackImageUpload = useCallback(
    (fileCount, totalSize) => {
      trackEvent('image_upload', {
        file_count: fileCount,
        total_size_bytes: totalSize,
      });
    },
    [trackEvent],
  );

  const trackFormatConversion = useCallback(
    (fromFormat, toFormat, fileCount) => {
      trackEvent('format_conversion', {
        from_format: fromFormat,
        to_format: toFormat,
        file_count: fileCount,
      });
    },
    [trackEvent],
  );

  const trackExportDownload = useCallback(
    (exportType, fileCount, totalSize) => {
      trackEvent('export_download', {
        export_type: exportType,
        file_count: fileCount,
        total_size_bytes: totalSize,
      });
    },
    [trackEvent],
  );

  const trackError = useCallback(
    (errorType, errorMessage) => {
      trackEvent('error_occurred', {
        error_type: errorType,
        error_message: errorMessage,
      });
    },
    [trackEvent],
  );

  const trackConversionComplete = useCallback(
    (fileCount, processingTime) => {
      trackEvent('conversion_complete', {
        file_count: fileCount,
        processing_time_ms: processingTime,
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackImageUpload,
    trackFormatConversion,
    trackExportDownload,
    trackError,
    trackConversionComplete,
  };
};

export default useAnalytics;
