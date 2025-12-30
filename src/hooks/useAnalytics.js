import { useCallback } from 'react';
import { auth } from '../config/firebase';

const useAnalytics = () => {
  const updateStats = useCallback(async (statsData) => {
    try {
      await fetch('/.netlify/functions/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statsData),
      });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }, []);

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

  const trackConversionStats = useCallback(
    async (fileCount, storageSaved) => {
      const userId =
        auth.currentUser?.uid ||
        `anon_${localStorage.getItem('anonUserId') || Date.now()}`;

      if (!localStorage.getItem('anonUserId') && !auth.currentUser) {
        localStorage.setItem('anonUserId', userId);
      }

      await updateStats({
        conversions: fileCount,
        storageSaved: storageSaved,
        userId: userId,
      });
    },
    [updateStats],
  );

  return {
    trackEvent,
    trackImageUpload,
    trackFormatConversion,
    trackExportDownload,
    trackError,
    trackConversionComplete,
    trackConversionStats,
  };
};

export default useAnalytics;
