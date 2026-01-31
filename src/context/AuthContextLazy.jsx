import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const [auth, setAuth] = useState(null);
  const [database, setDatabase] = useState(null);

  // Lazy load Firebase only when needed
  const ensureFirebaseLoaded = async () => {
    if (firebaseLoaded) {
      return { auth, database };
    }

    const [
      { initializeApp },
      { getAuth },
      { getDatabase },
      authModule,
      dbModule,
    ] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/database'),
      import('firebase/auth'), // Import auth functions
      import('firebase/database'), // Import database functions
    ]);

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
    const authInstance = getAuth(app);
    const databaseInstance = getDatabase(app);

    setAuth(authInstance);
    setDatabase(databaseInstance);
    setFirebaseLoaded(true);

    return {
      auth: authInstance,
      database: databaseInstance,
      authModule,
      dbModule,
    };
  };

  const createUserSubscription = async (
    uid,
    planId = 'free',
    billingCycle = null,
  ) => {
    const { database: db, dbModule } = await ensureFirebaseLoaded();
    const now = Date.now();
    const isTrial = ['plus', 'pro'].includes(planId);
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;

    const subscriptionData = {
      planId,
      planName: planId.charAt(0).toUpperCase() + planId.slice(1),
      status:
        planId === 'free' || planId === 'payAsYouGo' ? 'active' : 'trialing',
      billingCycle,
      startDate: now,
      trialEndDate: isTrial ? now + fourteenDaysInMs : null,
      currentPeriodEnd: isTrial ? now + fourteenDaysInMs : null,
      payAsYouGoBalance: 0,
      createdAt: now,
      updatedAt: now,
    };

    await dbModule.set(
      dbModule.ref(db, `users/${uid}/subscription`),
      subscriptionData,
    );
    return subscriptionData;
  };

  const signup = async (email, password, displayName) => {
    const {
      auth: authInstance,
      authModule,
      database: db,
      dbModule,
    } = await ensureFirebaseLoaded();

    const userCredential = await authModule.createUserWithEmailAndPassword(
      authInstance,
      email,
      password,
    );

    if (displayName) {
      await authModule.updateProfile(userCredential.user, { displayName });
    }

    await dbModule.set(
      dbModule.ref(db, `users/${userCredential.user.uid}/profile`),
      {
        email,
        displayName: displayName || '',
        createdAt: Date.now(),
      },
    );

    await dbModule.set(
      dbModule.ref(db, `users/${userCredential.user.uid}/preferences`),
      {
        defaultExportFormat: 'webp',
        omitFilename: false,
      },
    );

    return userCredential;
  };

  const login = async (email, password) => {
    const { auth: authInstance, authModule } = await ensureFirebaseLoaded();
    return authModule.signInWithEmailAndPassword(authInstance, email, password);
  };

  const loginWithGoogle = async () => {
    const {
      auth: authInstance,
      authModule,
      database: db,
      dbModule,
    } = await ensureFirebaseLoaded();

    const provider = new authModule.GoogleAuthProvider();
    const userCredential = await authModule.signInWithPopup(
      authInstance,
      provider,
    );

    const userRef = dbModule.ref(
      db,
      `users/${userCredential.user.uid}/profile`,
    );
    const snapshot = await dbModule.get(userRef);

    if (!snapshot.exists()) {
      await dbModule.set(userRef, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        createdAt: Date.now(),
      });

      await dbModule.set(
        dbModule.ref(db, `users/${userCredential.user.uid}/preferences`),
        {
          defaultExportFormat: 'webp',
          omitFilename: false,
        },
      );
    }

    return userCredential;
  };

  const logout = async () => {
    const { auth: authInstance, authModule } = await ensureFirebaseLoaded();
    return authModule.signOut(authInstance);
  };

  const resetPassword = async (email) => {
    const { auth: authInstance, authModule } = await ensureFirebaseLoaded();
    return authModule.sendPasswordResetEmail(authInstance, email);
  };

  const updateUserProfile = async (updates) => {
    const { auth: authInstance, authModule } = await ensureFirebaseLoaded();
    return authModule.updateProfile(authInstance.currentUser, updates);
  };

  useEffect(() => {
    // Start loading Firebase immediately but don't block render
    ensureFirebaseLoaded().then(({ auth: authInstance, authModule }) => {
      const unsubscribe = authModule.onAuthStateChanged(
        authInstance,
        (user) => {
          setCurrentUser(user);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    });
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    createUserSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
