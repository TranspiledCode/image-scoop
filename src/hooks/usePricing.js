// src/hooks/usePricing.js
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Custom hook to fetch pricing data from Firebase Realtime Database
 * Returns null if no data - component should use hardcoded fallback
 */
export const usePricing = () => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pricingRef = ref(database, 'pricing');

    const unsubscribe = onValue(
      pricingRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data && data.plans) {
            // Convert plans object to array and sort by order
            const plansArray = Object.values(data.plans).sort(
              (a, b) => a.order - b.order,
            );
            setPricing({
              plans: plansArray,
              metadata: data.metadata || {},
            });
          } else {
            setPricing(null);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error processing pricing data:', err);
          setError(err);
          setPricing(null);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching pricing data:', err);
        setError(err);
        setPricing(null);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { pricing, loading, error };
};

export default usePricing;
