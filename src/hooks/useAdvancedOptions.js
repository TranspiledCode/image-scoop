import { useState, useCallback } from 'react';
import { useUserSubscription } from './useUserSubscription';

const STORAGE_KEY = 'image-scoop-advanced-options';
const SAVED_PREFS_KEY = 'image-scoop-saved-preferences';

const DEFAULT_OPTIONS = {
  // Quality & Compression
  jpegQuality: 95,
  pngCompression: 6,
  webpQuality: 90,
  avifQuality: 85,
  progressiveJpeg: true,

  // Size & Dimensions
  selectedVariants: ['t', 's', 'm', 'l', 'xl', 'xxl'],
  sizePreset: 'standard',
  maxDimension: 8000,
  aspectRatio: 'original',

  // Naming & Organization
  omitFilename: true,
  filenamePrefix: '',
  filenameSuffix: '',
  folderOrganization: 'by-original',

  // Advanced Processing
  stripMetadata: false,
  sharpening: 'none',
  colorSpace: 'srgb',
  resizeAlgorithm: 'lanczos3',
  chromaSubsampling: '4:2:0',
};

// Category-based locking system
const CATEGORIES = {
  naming: [
    'omitFilename',
    'filenamePrefix',
    'filenameSuffix',
    'folderOrganization',
  ],
  quality: [
    'jpegQuality',
    'pngCompression',
    'webpQuality',
    'avifQuality',
    'progressiveJpeg',
  ],
  size: ['selectedVariants', 'sizePreset', 'maxDimension', 'aspectRatio'],
  processing: [
    'stripMetadata',
    'sharpening',
    'colorSpace',
    'resizeAlgorithm',
    'chromaSubsampling',
  ],
};

// Define which CATEGORIES are locked per plan tier
const CATEGORY_LOCKS = {
  free: {
    naming: false, // ✓ Unlocked for all users
    quality: true, // 🔒 Plus/PAYG/Pro only
    size: true, // 🔒 Plus/PAYG/Pro only
    processing: true, // 🔒 Pro only
  },
  plus: {
    naming: false, // ✓ Unlocked
    quality: false, // ✓ Unlocked
    size: false, // ✓ Unlocked
    processing: true, // 🔒 Pro only
  },
  payAsYouGo: {
    naming: false, // ✓ Unlocked
    quality: false, // ✓ Unlocked (PAYG gets Plus-level features)
    size: false, // ✓ Unlocked (PAYG gets Plus-level features)
    processing: true, // 🔒 Pro only
  },
  pro: {
    naming: false, // ✓ Unlocked
    quality: false, // ✓ Unlocked
    size: false, // ✓ Unlocked
    processing: false, // ✓ Unlocked
  },
};

// Feature-level defaults and ranges (for validation, not locking)
const FEATURE_RANGES = {
  jpegQuality: { min: 60, max: 100, default: 95 },
  pngCompression: { min: 0, max: 9, default: 6 },
  webpQuality: { min: 60, max: 100, default: 90 },
  avifQuality: { min: 60, max: 100, default: 85 },
  maxDimension: { min: 1000, max: 8000, default: 8000 },
};

/**
 * Hook for managing advanced image processing options with plan-based access control
 */
export const useAdvancedOptions = () => {
  const { subscription } = useUserSubscription();
  const [options, setOptions] = useState(() => {
    // Only load from localStorage if user has explicitly saved preferences
    try {
      const hasSavedPrefs = localStorage.getItem(SAVED_PREFS_KEY) === 'true';
      if (hasSavedPrefs) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Exclude per-batch options (prefix/suffix should reset each time)
          // eslint-disable-next-line no-unused-vars
          const { filenamePrefix, filenameSuffix, ...persistentOptions } =
            parsed;
          // Merge with defaults to handle new options added over time
          return { ...DEFAULT_OPTIONS, ...persistentOptions };
        }
      }
    } catch (error) {
      console.error('Error loading advanced options from localStorage:', error);
    }
    // Default: always start fresh
    return DEFAULT_OPTIONS;
  });

  // Get current plan tier
  const getPlanTier = useCallback(() => {
    if (!subscription) return 'free';

    // Check for explicit plan IDs
    if (subscription.planId === 'pro') return 'pro';
    if (subscription.planId === 'plus') return 'plus';
    if (subscription.planId === 'payAsYouGo') return 'payAsYouGo';

    // Default to free
    return 'free';
  }, [subscription]);

  // Get the category for a given option key
  const getCategoryForOption = useCallback((optionKey) => {
    for (const [category, options] of Object.entries(CATEGORIES)) {
      if (options.includes(optionKey)) {
        return category;
      }
    }
    return null;
  }, []);

  // Check if an entire category is locked
  const isCategoryLocked = useCallback(
    (category) => {
      const planTier = getPlanTier();
      return CATEGORY_LOCKS[planTier]?.[category] === true;
    },
    [getPlanTier],
  );

  // Check if a specific option is locked (via its category)
  const isLocked = useCallback(
    (optionKey) => {
      const category = getCategoryForOption(optionKey);
      if (!category) return false;
      return isCategoryLocked(category);
    },
    [getCategoryForOption, isCategoryLocked],
  );

  // Get allowed range for a numeric option (for sliders)
  const getAllowedRange = useCallback((optionKey) => {
    const range = FEATURE_RANGES[optionKey];
    if (range) {
      return {
        min: range.min,
        max: range.max,
      };
    }
    // Default ranges for options not in FEATURE_RANGES
    return { min: 0, max: 100 };
  }, []);

  // Plan-aware setter
  const setOption = useCallback(
    (key, value) => {
      // Check if option is locked
      if (isLocked(key)) {
        console.warn(
          `Option "${key}" is locked for your current plan (${getPlanTier()})`,
        );
        return false;
      }

      // Validate and clamp numeric values
      const range = getAllowedRange(key);
      let validatedValue = value;

      if (
        range.min !== undefined &&
        range.max !== undefined &&
        typeof value === 'number'
      ) {
        validatedValue = Math.max(range.min, Math.min(range.max, value));
        if (validatedValue !== value) {
          console.warn(
            `Value for "${key}" clamped from ${value} to ${validatedValue} (allowed: ${range.min}-${range.max})`,
          );
        }
      }

      // Validate string lengths
      if (
        (key === 'filenamePrefix' || key === 'filenameSuffix') &&
        typeof value === 'string'
      ) {
        if (value.length > 20) {
          console.warn(`${key} limited to 20 characters`);
          validatedValue = value.slice(0, 20);
        }
      }

      // Validate selectedVariants array
      if (key === 'selectedVariants' && Array.isArray(value)) {
        const validSizes = ['t', 's', 'm', 'l', 'xl', 'xxl'];
        validatedValue = value.filter((size) => validSizes.includes(size));
        if (validatedValue.length === 0) {
          console.warn('At least one variant must be selected');
          return false;
        }
      }

      setOptions((prev) => ({
        ...prev,
        [key]: validatedValue,
      }));

      return true;
    },
    [isLocked, getAllowedRange, getPlanTier],
  );

  // Bulk update multiple options
  const updateOptions = useCallback(
    (updates) => {
      const results = {};
      Object.entries(updates).forEach(([key, value]) => {
        results[key] = setOption(key, value);
      });
      return results;
    },
    [setOption],
  );

  // Reset all options to defaults
  const resetToDefaults = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
  }, []);

  // Reset per-batch options (prefix/suffix) after processing
  const resetBatchOptions = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      filenamePrefix: '',
      filenameSuffix: '',
    }));
  }, []);

  // Save current preferences to localStorage
  const savePreferences = useCallback(() => {
    try {
      // Exclude per-batch options (prefix/suffix)
      // eslint-disable-next-line no-unused-vars
      const { filenamePrefix, filenameSuffix, ...persistentOptions } = options;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentOptions));
      localStorage.setItem(SAVED_PREFS_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }, [options]);

  // Clear saved preferences
  const clearSavedPreferences = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SAVED_PREFS_KEY);
      setOptions(DEFAULT_OPTIONS);
      return true;
    } catch (error) {
      console.error('Error clearing preferences:', error);
      return false;
    }
  }, []);

  // Check if user has saved preferences
  const hasSavedPreferences = useCallback(() => {
    return localStorage.getItem(SAVED_PREFS_KEY) === 'true';
  }, []);

  // Get upgrade prompt message for locked category
  const getCategoryUpgradeMessage = useCallback(
    (category) => {
      const planTier = getPlanTier();

      // Naming is never locked
      if (category === 'naming') return null;

      // Free users - check what unlocks the category
      if (planTier === 'free') {
        // Quality and Size unlock with Plus (or PAYG)
        if (category === 'quality' || category === 'size') {
          return 'Upgrade to Plus, Pro or Pay As You Go';
        }
        // Processing is Pro-only
        if (category === 'processing') {
          return 'Upgrade to Pro';
        }
      }

      // Plus and PAYG users - only Processing is locked
      if (planTier === 'plus' || planTier === 'payAsYouGo') {
        if (category === 'processing') {
          return 'Upgrade to Pro';
        }
      }

      return null;
    },
    [getPlanTier],
  );

  // Get upgrade message for a specific option (via its category)
  const getUpgradeMessage = useCallback(
    (optionKey) => {
      const category = getCategoryForOption(optionKey);
      if (!category) return null;
      return getCategoryUpgradeMessage(category);
    },
    [getCategoryForOption, getCategoryUpgradeMessage],
  );

  return {
    options,
    setOption,
    updateOptions,
    resetToDefaults,
    resetBatchOptions,
    savePreferences,
    clearSavedPreferences,
    hasSavedPreferences,
    isLocked,
    isCategoryLocked,
    getAllowedRange,
    getUpgradeMessage,
    getCategoryUpgradeMessage,
    planTier: getPlanTier(),
  };
};

export default useAdvancedOptions;
