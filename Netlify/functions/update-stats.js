import admin from 'firebase-admin';
import { initSentry, captureError, setTag } from './utils/sentry.js';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

export const handler = async (event) => {
  // Initialize Sentry for error tracking
  initSentry('update-stats');

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { conversions, storageSaved, userId } = JSON.parse(event.body);

    // Update total conversions
    if (conversions && typeof conversions === 'number' && conversions > 0) {
      setTag('operation', 'conversions');
      const conversionsRef = db.ref('stats/totalConversions');
      try {
        await conversionsRef.transaction((current) => {
          return (current || 0) + conversions;
        });
      } catch (error) {
        captureError(error, {
          tags: { operation: 'update_conversions' },
          extra: { conversions, userId },
        });
        throw error;
      }
    }

    // Update storage saved (in bytes)
    if (typeof storageSaved === 'number' && storageSaved >= 0) {
      setTag('operation', 'storage');
      const storageRef = db.ref('stats/totalStorageSaved');
      try {
        await storageRef.transaction((current) => {
          return (current || 0) + storageSaved;
        });
      } catch (error) {
        captureError(error, {
          tags: { operation: 'update_storage' },
          extra: { storageSaved, userId },
        });
        throw error;
      }
    }

    // Track unique user
    if (userId) {
      setTag('operation', 'users');
      try {
        const userRef = db.ref(`stats/users/${userId}`);
        const snapshot = await userRef.once('value');

        if (!snapshot.exists()) {
          await userRef.set(true);

          // Increment total users count
          const usersCountRef = db.ref('stats/totalUsers');
          await usersCountRef.transaction((current) => {
            return (current || 0) + 1;
          });
        }
      } catch (error) {
        captureError(error, {
          tags: { operation: 'update_users' },
          extra: { userId },
        });
        throw error;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Stats update error:', error);

    // Capture error in Sentry with context
    captureError(error, {
      tags: {
        operation: 'update_stats',
        errorType: error.name,
      },
      extra: {
        errorMessage: error.message,
      },
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to update stats',
        message: error.message,
      }),
    };
  }
};
