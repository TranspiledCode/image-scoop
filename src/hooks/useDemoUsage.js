import { useState, useEffect } from 'react';

const DEMO_STORAGE_KEY = 'imageScoopDemo';
const DEMO_IMAGE_LIMIT = 3;

/**
 * Hook for managing demo usage via localStorage
 * Tracks images processed by unauthenticated users
 */
export const useDemoUsage = () => {
  const [demoData, setDemoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data from localStorage on mount and when updated
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(DEMO_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDemoData(parsed);
        } else {
          // Initialize empty demo data
          const initial = {
            imagesProcessed: 0,
            firstUsed: null,
            lastUsed: null,
          };
          setDemoData(initial);
        }
      } catch (error) {
        // localStorage unavailable or corrupt - start fresh
        console.error('Failed to load demo usage:', error);
        setDemoData({
          imagesProcessed: 0,
          firstUsed: null,
          lastUsed: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Load on mount
    loadFromStorage();

    // Listen for demo updates from other components
    const handleUpdate = () => {
      loadFromStorage();
    };

    window.addEventListener('demoUsageChanged', handleUpdate);
    return () => window.removeEventListener('demoUsageChanged', handleUpdate);
  }, []);

  /**
   * Increment demo usage count
   * @param {number} count - Number of images processed
   */
  const incrementDemo = (count = 1) => {
    const now = Date.now();
    const updated = {
      imagesProcessed: (demoData?.imagesProcessed || 0) + count,
      firstUsed: demoData?.firstUsed || now,
      lastUsed: now,
    };

    // Update state
    setDemoData(updated);

    // Save to localStorage immediately
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save demo usage:', error);
    }

    // Notify other components
    window.dispatchEvent(new CustomEvent('demoUsageChanged'));
  };

  /**
   * Check if demo limit has been reached
   * @returns {boolean}
   */
  const isDemoLimitReached = () => {
    return (demoData?.imagesProcessed || 0) >= DEMO_IMAGE_LIMIT;
  };

  /**
   * Get remaining demo images
   * @returns {number}
   */
  const getRemainingDemoImages = () => {
    const used = demoData?.imagesProcessed || 0;
    return Math.max(0, DEMO_IMAGE_LIMIT - used);
  };

  /**
   * Check if user can process in demo mode
   * @param {number} fileCount - Number of files to process
   * @returns {boolean}
   */
  const canProcessDemo = (fileCount) => {
    const remaining = getRemainingDemoImages();
    return remaining >= fileCount;
  };

  /**
   * Reset demo usage (for testing or admin purposes)
   */
  const resetDemo = () => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      const initial = {
        imagesProcessed: 0,
        firstUsed: null,
        lastUsed: null,
      };
      setDemoData(initial);
      // Notify other components
      window.dispatchEvent(new CustomEvent('demoUsageChanged'));
    } catch (error) {
      console.error('Failed to reset demo usage:', error);
    }
  };

  return {
    demoData,
    isLoading,
    imagesProcessed: demoData?.imagesProcessed || 0,
    remaining: getRemainingDemoImages(),
    limit: DEMO_IMAGE_LIMIT,
    isDemoLimitReached: isDemoLimitReached(),
    canProcessDemo,
    incrementDemo,
    resetDemo,
  };
};

export default useDemoUsage;
