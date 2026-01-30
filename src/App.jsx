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

import Marketing from 'pages/Marketing';
import Process from 'pages/Process';
import About from 'pages/About';
import Login from 'pages/Login';
import SignUp from 'pages/SignUp';
import ResetPassword from 'pages/ResetPassword';
import PlanSelection from 'pages/PlanSelection';
import Checkout from 'pages/Checkout';

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
                      <ProtectedRoute>
                        <Process />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plan-selection"
                    element={
                      <ProtectedRoute>
                        <PlanSelection />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
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
