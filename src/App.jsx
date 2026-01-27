// App.jsx (with container styles)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';
import DemoRouteGuard from './components/DemoRouteGuard';

import Marketing from 'pages/Marketing';
import Process from 'pages/Process';
import About from 'pages/About';
import Login from 'pages/Login';
import SignUp from 'pages/SignUp';
import ResetPassword from 'pages/ResetPassword';

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
                  <Route path="/" element={<Marketing />} />
                  <Route
                    path="/process"
                    element={
                      <DemoRouteGuard>
                        <ProtectedRoute>
                          <Process />
                        </ProtectedRoute>
                      </DemoRouteGuard>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <DemoRouteGuard>
                        <About />
                      </DemoRouteGuard>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <DemoRouteGuard>
                        <Login />
                      </DemoRouteGuard>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <DemoRouteGuard>
                        <SignUp />
                      </DemoRouteGuard>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <DemoRouteGuard>
                        <ResetPassword />
                      </DemoRouteGuard>
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
