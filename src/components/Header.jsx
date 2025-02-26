// src/components/Header.jsx
import React from 'react';
import styled from '@emotion/styled';
import { IceCream } from 'lucide-react';

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.tertiary}
  );
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const LogoIcon = styled(IceCream)`
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const Tagline = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
`;

const Header = () => (
  <HeaderContainer>
    <div>
      <HeaderTitle>
        <LogoIcon size={32} />
        Pixel Pushup
      </HeaderTitle>
      <Tagline>Serving Up Tasty Images!</Tagline>
    </div>
  </HeaderContainer>
);

export default Header;
