import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Safe auth hook that returns null values when AuthProvider is not available
// Used in components that need to work both with and without authentication
export const useSafeAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (!context) {
      // AuthProvider not loaded yet (e.g., on marketing page)
      return {
        currentUser: null,
        signup: null,
        login: null,
        loginWithGoogle: null,
        logout: null,
        resetPassword: null,
        updateUserProfile: null,
        createUserSubscription: null,
      };
    }
    return context;
  } catch {
    // AuthProvider not available
    return {
      currentUser: null,
      signup: null,
      login: null,
      loginWithGoogle: null,
      logout: null,
      resetPassword: null,
      updateUserProfile: null,
      createUserSubscription: null,
    };
  }
};

export default useSafeAuth;
