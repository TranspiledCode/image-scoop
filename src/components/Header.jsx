// src/components/Header.jsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { IceCream, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Styled component for the header container
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
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
`;

// Styled component for the header title
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

// Styled component for the logo icon with animation
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

// Styled component for the tagline
const Tagline = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
`;

// Styled component for desktop navigation links
const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

// Styled component for individual navigation links
const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 500;
  font-size: 1.5rem;
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

// Styled component for the logo link
const LogoLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
`;

// Styled component for the menu button (visible on mobile)
const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

// Styled component for the mobile menu overlay
const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

// Styled component for mobile navigation links
const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-size: 3.5rem;
  padding: 1rem;
  width: 100%;
  text-align: center;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// Styled component for the close button in the mobile menu
const CloseButton = styled.button`
  position: absolute;
  top: 4rem;
  right: 2rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;

const Header = () => {
  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <HeaderContainer>
        <div>
          <LogoLink to="/">
            <HeaderTitle>
              <LogoIcon size={32} />
              Image Scoop
            </HeaderTitle>
          </LogoLink>
          <Tagline>Make your images pop like ice cream!</Tagline>
        </div>
        <NavLinks>
          <NavLink to="/about">How It Works</NavLink>
        </NavLinks>
        <MenuButton onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </MenuButton>
      </HeaderContainer>
      {isMenuOpen && (
        <MobileMenuOverlay>
          <CloseButton
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </CloseButton>
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </MobileNavLink>
        </MobileMenuOverlay>
      )}
    </>
  );
};

export default Header;
