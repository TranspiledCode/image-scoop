// src/components/Header.jsx
import React from 'react';
import styled from '@emotion/styled';
import { IceCream } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Sticky positioning */
  position: sticky;
  top: 0;
  z-index: 100;
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

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 500;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  background-color: rgba(105, 99, 99, 0.174);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
`;

const Header = () => (
  <HeaderContainer>
    <div>
      <LogoLink to="/">
        <HeaderTitle>
          <LogoIcon size={32} />
          Pixel Pushup
        </HeaderTitle>
      </LogoLink>
      <Tagline>Make your images pop like ice cream!</Tagline>
    </div>

    <NavLinks>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </NavLinks>
  </HeaderContainer>
);

export default Header;
