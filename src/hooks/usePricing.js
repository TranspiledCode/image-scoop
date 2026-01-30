// src/hooks/usePricing.js
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Custom hook to fetch pricing data from Firebase Realtime Database
 * Falls back to hardcoded pricing if Firebase fetch fails
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
          if (data) {
            // Convert plans object to array and sort by order
            const plansArray = Object.values(data.plans || {}).sort(
              (a, b) => a.order - b.order,
            );
            setPricing({
              plans: plansArray,
              metadata: data.metadata,
            });
          } else {
            // Fallback to hardcoded pricing if no data in Firebase
            setPricing(getFallbackPricing());
          }
          setLoading(false);
        } catch (err) {
          console.error('Error processing pricing data:', err);
          setError(err);
          setPricing(getFallbackPricing());
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching pricing data:', err);
        setError(err);
        setPricing(getFallbackPricing());
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { pricing, loading, error };
};

// Fallback pricing data (matches current hardcoded values)
const getFallbackPricing = () => ({
  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for personal use',
      price: 0,
      period: 'Forever free',
      cta: 'Get Started',
      featured: false,
      payAsYouGo: false,
      order: 1,
      features: [
        '20 images per day (~600/month)',
        '4 variants (s, m, l, xl)',
        'WebP, JPEG, PNG formats',
        'Up to 10MB per file',
        'Single image processing',
      ],
    },
    {
      id: 'pay-as-you-go',
      name: 'Pay As You Go',
      description: 'Buy scoops when you need them',
      price: 5,
      period: 'Starting at',
      cta: 'Buy Scoops',
      featured: false,
      payAsYouGo: true,
      order: 2,
      features: [
        '100 scoops for $5 (5¢ each)',
        '250 scoops for $10 (4¢ each)',
        '600 scoops for $20 (3.3¢ each)',
        'Scoops never expire',
        '6 variants (xs, s, m, l, xl, xxl)',
        'WebP, JPEG, PNG, AVIF formats',
        'Up to 20MB per file',
        'Single image processing',
      ],
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'For creators & small businesses',
      price: 5,
      period: 'per month',
      cta: 'Start Free Trial',
      featured: true,
      payAsYouGo: false,
      order: 3,
      features: [
        '100 images per day (~3,000/month)',
        '6 variants (xs, s, m, l, xl, xxl)',
        'WebP, JPEG, PNG, AVIF formats',
        'Up to 20MB per file',
        'Batch processing (10 files)',
        '7-day history & re-download',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals & developers',
      price: 10,
      period: 'per month',
      cta: 'Start Free Trial',
      featured: false,
      payAsYouGo: false,
      order: 4,
      features: [
        'Unlimited images',
        'All variants + App icons',
        'All formats + advanced options',
        'Up to 50MB per file',
        'Batch processing (25 files)',
        'API access (coming soon)',
        '30-day history & re-download',
        'Priority email support',
      ],
    },
  ],
  metadata: {
    version: '1.0.0',
    annualDiscount: 0.2,
  },
});

export default usePricing;
