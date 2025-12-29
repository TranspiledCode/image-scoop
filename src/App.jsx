// App.jsx (with container styles)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

import Marketing from 'pages/Marketing';
import Process from 'pages/Process';
import About from 'pages/About';
import Login from 'pages/Login';
import SignUp from 'pages/SignUp';

const App = () => {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ToastProvider position="bottom-right">
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Marketing />} />
                <Route path="/process" element={<Process />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
