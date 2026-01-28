import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { IceCream, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDemoMode } from '../hooks/useDemoMode';
import UserMenu from './header/UserMenu';
import MobileMenu from './header/MobileMenu';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 80px;
  color: #1f2937;
  box-shadow: ${({ scrolled }) =>
    scrolled ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  background: ${({ scrolled }) =>
    scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  backdrop-filter: ${({ scrolled }) => (scrolled ? 'blur(10px)' : 'none')};
  border-bottom: ${({ scrolled }) =>
    scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0 0.75rem;
    height: 60px;
  }
`;

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

  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    gap: 0.3rem;
  }
`;

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

const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

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
  padding: 0.5rem 1.5rem;
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

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ scrolled }) => (scrolled ? '#1f2937' : 'white')};
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  transition: color 0.3s ease;

  @media (max-width: 968px) {
    display: block;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const isDemoMode = useDemoMode();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Successfully logged out', 'success');
      navigate('/');
    } catch {
      addToast('Failed to logout', 'error');
    }
  };

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
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

  const handleNavigate = (pathOrSection) => {
    if (pathOrSection.startsWith('/')) {
      navigate(pathOrSection);
    } else {
      scrollToSection(pathOrSection);
    }
  };

  return (
    <>
      <HeaderContainer scrolled={isScrolled}>
        <LogoLink to="/">
          <HeaderTitle>
            <LogoIcon size={32} />
            Image Scoop
          </HeaderTitle>
        </LogoLink>

        <NavLinks>
          <NavLink onClick={() => scrollToSection('features')}>
            Features
          </NavLink>
          <NavLink onClick={() => scrollToSection('how-it-works')}>
            How It Works
          </NavLink>
          {!isDemoMode && (
            <>
              <NavLink onClick={() => scrollToSection('pricing')}>
                Pricing
              </NavLink>
              <NavLink onClick={() => scrollToSection('api')}>API</NavLink>
            </>
          )}
          <NavLink onClick={() => scrollToSection('faq')}>FAQ</NavLink>
          {!isDemoMode &&
            (currentUser ? (
              <UserMenu />
            ) : (
              <>
                <LoginLink to="/login">Login</LoginLink>
                <SignUpButton to="/signup">Sign Up</SignUpButton>
              </>
            ))}
        </NavLinks>

        <MenuButton
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          scrolled={isScrolled}
        >
          <Menu size={24} />
        </MenuButton>
      </HeaderContainer>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
