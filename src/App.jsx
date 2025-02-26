// App.jsx (with container styles)
import React from 'react';
import styled from '@emotion/styled';
import ContextProvider from './context/GlobalProvider';
import { ToastProvider } from './context/ToastContext';

import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

import Home from 'pages/Home';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const App = () => {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider position="bottom-left">
          <Container>
            <Home />
          </Container>
        </ToastProvider>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
