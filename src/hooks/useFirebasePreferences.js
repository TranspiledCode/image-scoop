import { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const useFirebasePreferences = () => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState({
    defaultExportFormat: 'webp',
    omitFilename: false,
  });
  const [loading, setLoading] = useState(false);

  const loadPreferences = async () => {
    if (!currentUser) {
      setPreferences({
        defaultExportFormat: 'webp',
        omitFilename: false,
      });
      return;
    }

    setLoading(true);
    try {
      const prefsRef = ref(database, `users/${currentUser.uid}/preferences`);
      const snapshot = await get(prefsRef);

      if (snapshot.exists()) {
        setPreferences(snapshot.val());
      }
    } catch (error) {
      console.error('Error loading preferences:', error);

      // Capture Firebase error in Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: {
            operation: 'firebase_load_preferences',
            collection: 'preferences',
          },
          extra: {
            errorMessage: error.message,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences) => {
    if (!currentUser) return;

    try {
      const prefsRef = ref(database, `users/${currentUser.uid}/preferences`);
      await set(prefsRef, newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);

      // Capture Firebase error in Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: {
            operation: 'firebase_save_preferences',
            collection: 'preferences',
          },
          extra: {
            errorMessage: error.message,
          },
        });
      }

      throw error;
    }
  };

  const updatePreference = async (key, value) => {
    const newPreferences = {
      ...preferences,
      [key]: value,
    };
    await savePreferences(newPreferences);
  };

  useEffect(() => {
    if (currentUser) {
      loadPreferences();
    } else {
      setPreferences({
        defaultExportFormat: 'webp',
        omitFilename: false,
      });
    }
  }, [currentUser]);

  return {
    preferences,
    loading,
    savePreferences,
    updatePreference,
    loadPreferences,
  };
};

export default useFirebasePreferences;
