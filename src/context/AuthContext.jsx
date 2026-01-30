import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

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

  const createUserSubscription = async (
    uid,
    planId = 'free',
    billingCycle = null,
  ) => {
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

    await set(ref(database, `users/${uid}/subscription`), subscriptionData);
    return subscriptionData;
  };

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    await set(ref(database, `users/${userCredential.user.uid}/profile`), {
      email,
      displayName: displayName || '',
      createdAt: Date.now(),
    });

    await set(ref(database, `users/${userCredential.user.uid}/preferences`), {
      defaultExportFormat: 'webp',
      omitFilename: false,
    });

    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const userRef = ref(database, `users/${userCredential.user.uid}/profile`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        createdAt: Date.now(),
      });

      await set(ref(database, `users/${userCredential.user.uid}/preferences`), {
        defaultExportFormat: 'webp',
        omitFilename: false,
      });
    }

    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = (updates) => {
    return updateProfile(auth.currentUser, updates);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
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
