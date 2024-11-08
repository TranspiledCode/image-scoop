// App.jsx (with container styles)
import React from 'react';
import styled from '@emotion/styled';
import ContextProvider from './context/GlobalProvider';

// Import theme
import { ThemeProvider } from '@emotion/react';
import theme from './style/theme';

import UploadForm from './components/UploadForm';

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
        <Container>
          <UploadForm />
        </Container>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
