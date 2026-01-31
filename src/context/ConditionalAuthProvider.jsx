import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Lazy load Firebase AuthProvider only when needed
const AuthProvider = lazy(() =>
  import('./AuthContext').then((module) => ({ default: module.AuthProvider })),
);

// Routes that don't need authentication at all
const PUBLIC_ONLY_ROUTES = ['/', '/about'];

// Minimal loading fallback
const AuthLoader = ({ children }) => <>{children}</>;

AuthLoader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ConditionalAuthProvider = ({ children }) => {
  const location = useLocation();
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    // Check if current route needs authentication
    const isPublicRoute = PUBLIC_ONLY_ROUTES.includes(location.pathname);
    setNeedsAuth(!isPublicRoute);
  }, [location.pathname]);

  // For public routes (marketing, about), skip Firebase entirely
  if (!needsAuth) {
    return <>{children}</>;
  }

  // For other routes, load AuthProvider with Firebase
  return (
    <Suspense fallback={<AuthLoader>{children}</AuthLoader>}>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
};

ConditionalAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ConditionalAuthProvider;
