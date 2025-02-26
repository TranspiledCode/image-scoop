// src/components/Header.jsx
import React from 'react';
import styled from '@emotion/styled';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primaryAccent};
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin: 0;
`;

const Header = () => (
  <HeaderContainer>
    <HeaderTitle>Pixel Pushup</HeaderTitle>
  </HeaderContainer>
);

export default Header;
