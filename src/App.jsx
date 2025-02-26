// App.jsx (with container styles)
import React from 'react';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

import Home from 'pages/Home';

const App = () => {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider position="bottom-right">
          <Header />
          <Home />
        </ToastProvider>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
