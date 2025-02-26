// src/components/FormContainer.js
import styled from '@emotion/styled';

const FormContainer = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 58rem;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 1px 8px rgba(0, 0, 0, 0.06);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;

  /* Ice cream drips at the top */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    width: 40px;
    height: 15px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 0 0 20px 20px;
    transform: translateX(-50%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 30%;
    width: 30px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 0 0 15px 15px;
    transform: translateX(50%);
  }

  /* Extra drip */
  & > form::before {
    content: '';
    position: absolute;
    top: 0;
    left: 70%;
    width: 25px;
    height: 12px;
    background-color: ${({ theme }) => theme.colors.tertiary};
    border-radius: 0 0 12px 12px;
    transform: translateX(-50%);
  }
`;

export default FormContainer;
