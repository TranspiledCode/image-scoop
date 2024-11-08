// src/components/FormContainer.js
import styled from '@emotion/styled';

const FormContainer = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 58rem;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2.5rem;
`;

export default FormContainer;
