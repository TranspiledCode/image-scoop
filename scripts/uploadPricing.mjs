// scripts/uploadPricing.js
// Script to upload pricing data to Firebase Realtime Database

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const pricingData = {
  plans: {
    free: {
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
    'pay-as-you-go': {
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
      packs: [
        { scoops: 100, price: 5, pricePerScoop: 0.05 },
        { scoops: 250, price: 10, pricePerScoop: 0.04 },
        { scoops: 600, price: 20, pricePerScoop: 0.033 },
      ],
    },
    plus: {
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
      limits: {
        dailyImages: 100,
        fileSize: 20,
        batchSize: 10,
        historyDays: 7,
      },
    },
    pro: {
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
      limits: {
        dailyImages: -1, // -1 = unlimited
        fileSize: 50,
        batchSize: 25,
        historyDays: 30,
      },
    },
  },
  metadata: {
    lastUpdated: Date.now(),
    version: '1.0.0',
    annualDiscount: 0.2, // 20% discount
  },
};

async function uploadPricing() {
  try {
    console.log('Uploading pricing data to Firebase...');
    const pricingRef = ref(database, 'pricing');
    await set(pricingRef, pricingData);
    console.log('✅ Pricing data uploaded successfully!');
    console.log('\nData structure:');
    console.log(JSON.stringify(pricingData, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading pricing data:', error);
    process.exit(1);
  }
}

uploadPricing();
