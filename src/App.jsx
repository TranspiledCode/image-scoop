// App.jsx (with container styles)
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';
import { ConditionalAuthProvider } from './context/ConditionalAuthProvider';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

// Lazy loaded pages for code splitting (excluding Marketing - it's the landing page)
const Process = lazy(() => import('./pages/Process'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PlanSelection = lazy(() => import('./pages/PlanSelection'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));

// Marketing page stays in main bundle for initial load performance
import Marketing from './pages/Marketing';

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
          <Router>
            <ConditionalAuthProvider>
              <ToastProvider position="bottom-right">
                <Header />
                <Routes>
                  <Route path="/" element={<Marketing />} />
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
              </ToastProvider>
            </ConditionalAuthProvider>
          </Router>
        </ThemeProvider>
      </ContextProvider>
    </ErrorBoundary>
  );
};

export default App;
