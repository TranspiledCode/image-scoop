// src/components/Header.jsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { IceCream, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Styled component for the header container
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

// Styled component for the header title
const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 50%, #84cc16 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// Styled component for the logo icon with animation
const LogoIcon = styled(IceCream)`
  color: #ec4899;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

// Styled component for desktop navigation links
const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

// Styled component for individual navigation links
const NavLink = styled.button`
  color: #6b7280;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: #1f2937;
    background: rgba(236, 72, 153, 0.1);
  }
`;

const LoginLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    color: #1f2937;
    background: rgba(236, 72, 153, 0.1);
  }
`;

const SignUpButton = styled(Link)`
  color: #ec4899;
  text-decoration: none;
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  background: transparent;
  border: 2px solid #ec4899;
  cursor: pointer;

  &:hover {
    background: #ec4899;
    color: white;
  }
`;

// Styled component for the logo link
const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

// Styled component for the menu button (visible on mobile)
const MenuButton = styled.button`
  background: none;
  border: none;
  color: #1f2937;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  @media (max-width: 968px) {
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
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  gap: 1rem;
`;

// Styled component for mobile navigation links
const MobileNavLink = styled.button`
  color: #1f2937;
  text-decoration: none;
  font-size: 1.5rem;
  padding: 1rem 2rem;
  width: auto;
  text-align: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(236, 72, 153, 0.1);
  }
`;

const MobileCTAButton = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
`;

// Styled component for the close button in the mobile menu
const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #1f2937;
  cursor: pointer;
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);

    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <>
      <HeaderContainer>
        <LogoLink to="/">
          <HeaderTitle>
            <LogoIcon size={24} />
            Image Scoop
          </HeaderTitle>
        </LogoLink>

        <NavLinks>
          <NavLink onClick={() => scrollToSection('features')}>
            Features
          </NavLink>
          <NavLink onClick={() => scrollToSection('pricing')}>Pricing</NavLink>
          <NavLink onClick={() => scrollToSection('api')}>API</NavLink>
          <NavLink onClick={() => scrollToSection('faq')}>FAQ</NavLink>
          <LoginLink to="/login">Login</LoginLink>
          <SignUpButton to="/signup">Sign Up</SignUpButton>
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
            <X size={32} />
          </CloseButton>
          <MobileNavLink onClick={() => scrollToSection('features')}>
            Features
          </MobileNavLink>
          <MobileNavLink onClick={() => scrollToSection('pricing')}>
            Pricing
          </MobileNavLink>
          <MobileNavLink onClick={() => scrollToSection('api')}>
            API
          </MobileNavLink>
          <MobileNavLink onClick={() => scrollToSection('faq')}>
            FAQ
          </MobileNavLink>
          <MobileCTAButton to="/login" onClick={() => setIsMenuOpen(false)}>
            Login
          </MobileCTAButton>
          <MobileCTAButton to="/signup" onClick={() => setIsMenuOpen(false)}>
            Sign Up
          </MobileCTAButton>
        </MobileMenuOverlay>
      )}
    </>
  );
};

export default Header;
