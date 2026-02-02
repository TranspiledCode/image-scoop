import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useUserSubscription } from './useUserSubscription';

const PLAN_LIMITS = {
  free: {
    dailyLimit: 20,
    monthlyLimit: 600,
    unlimited: false,
  },
  payAsYouGo: {
    dailyLimit: null,
    monthlyLimit: null,
    unlimited: false, // Limited by scoop balance
  },
  plus: {
    dailyLimit: 100,
    monthlyLimit: 3000,
    unlimited: false,
  },
  pro: {
    dailyLimit: null,
    monthlyLimit: null,
    unlimited: true,
  },
};

export const useUserUsage = () => {
  const { currentUser } = useAuth();
  const { subscription } = useUserSubscription();
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setUsage(null);
      setLoading(false);
      return;
    }

    const usageRef = ref(database, `users/${currentUser.uid}/usage`);
    const unsubscribe = onValue(
      usageRef,
      (snapshot) => {
        const data = snapshot.val();
        setUsage(
          data || {
            currentPeriodStart: Date.now(),
            imagesProcessedToday: 0,
            lastResetDate: new Date().toISOString().split('T')[0],
            totalImagesProcessed: 0,
          },
        );
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading usage:', err);

        // Capture Firebase error in Sentry
        if (window.Sentry) {
          window.Sentry.captureException(err, {
            tags: {
              operation: 'firebase_load_usage',
              collection: 'usage',
            },
            extra: {
              errorMessage: err.message,
            },
          });
        }

        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  const planLimits = PLAN_LIMITS[subscription?.planId] || PLAN_LIMITS.free;

  const dailyUsagePercentage = planLimits.dailyLimit
    ? Math.min(
        100,
        ((usage?.imagesProcessedToday || 0) / planLimits.dailyLimit) * 100,
      )
    : 0;

  const monthlyUsagePercentage = planLimits.monthlyLimit
    ? Math.min(
        100,
        ((usage?.totalImagesProcessed || 0) / planLimits.monthlyLimit) * 100,
      )
    : 0;

  return {
    usage,
    loading,
    error,
    planLimits,
    dailyUsagePercentage,
    monthlyUsagePercentage,
    imagesProcessedToday: usage?.imagesProcessedToday || 0,
    totalImagesProcessed: usage?.totalImagesProcessed || 0,
  };
};

export default useUserUsage;
