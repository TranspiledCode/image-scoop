// App.jsx (with container styles)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

import Home from 'pages/Home';
import About from 'pages/About';

const App = () => {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider position="bottom-right">
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
