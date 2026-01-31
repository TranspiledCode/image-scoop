// App.jsx (with container styles)
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

// Lazy loaded pages for code splitting
const Marketing = lazy(() => import('./pages/Marketing'));
const Process = lazy(() => import('./pages/Process'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PlanSelection = lazy(() => import('./pages/PlanSelection'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading component for lazy loading
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      fontSize: '18px',
      color: '#666',
    }}
  >
    Loading...
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <ToastProvider position="bottom-right">
              <Router>
                <Header />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Marketing />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/process"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Process />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plan-selection"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <PlanSelection />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Checkout />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Profile />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:section"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Profile />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <About />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <SignUp />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ResetPassword />
                      </Suspense>
                    }
                  />
                </Routes>
              </Router>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </ContextProvider>
    </ErrorBoundary>
  );
};

export default App;
