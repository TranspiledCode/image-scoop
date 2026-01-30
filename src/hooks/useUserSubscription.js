import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const DEFAULT_FREE_SUBSCRIPTION = {
  planId: 'free',
  planName: 'Free',
  status: 'active',
  billingCycle: null,
  startDate: null,
  trialEndDate: null,
  currentPeriodEnd: null,
  payAsYouGoBalance: 0,
};

export const useUserSubscription = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const subscriptionRef = ref(
      database,
      `users/${currentUser.uid}/subscription`,
    );
    const unsubscribe = onValue(
      subscriptionRef,
      (snapshot) => {
        setSubscription(snapshot.val() || DEFAULT_FREE_SUBSCRIPTION);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading subscription:', err);
        setError(err);
        setSubscription(DEFAULT_FREE_SUBSCRIPTION);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  const updateSubscription = async (subscriptionData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update subscription');
    }

    try {
      await set(ref(database, `users/${currentUser.uid}/subscription`), {
        ...subscriptionData,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Error updating subscription:', err);
      throw err;
    }
  };

  return {
    subscription,
    loading,
    error,
    updateSubscription,
    isFreeTier: subscription?.planId === 'free',
    isPayAsYouGo: subscription?.planId === 'payAsYouGo',
    isPaid: ['plus', 'pro'].includes(subscription?.planId),
    hasActiveSubscription: subscription?.status === 'active',
    isTrialing: subscription?.status === 'trialing',
  };
};

export default useUserSubscription;
