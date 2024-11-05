// App.jsx (with container styles)
import React from 'react';
import styled from '@emotion/styled';
import Form from './components/Form';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const App = () => {
  return (
    <Container>
      <Form />
    </Container>
  );
};

export default App;
