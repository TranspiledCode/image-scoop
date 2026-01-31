import React from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 50%, #a3e635 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const MobileNavLink = styled.button`
  display: block;
  width: 100%;
  padding: 1rem 0;
  font-size: 1.125rem;
  font-weight: 500;
  color: #1f2937;
  background: none;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;
  font-family: inherit;

  &:hover {
    color: #ec4899;
  }
`;

const MobileCTAButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
  font-family: inherit;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
  }
`;

const MobileMenu = ({ isOpen, onClose, currentUser, onNavigate, onLogout }) => {
  if (!isOpen) return null;

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    onClose();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <MobileMenuOverlay>
      <MobileMenuHeader>
        <MobileMenuTitle>Menu</MobileMenuTitle>
        <CloseButton onClick={onClose} aria-label="Close menu">
          <X size={24} />
        </CloseButton>
      </MobileMenuHeader>

      <MobileNavLink onClick={() => handleNavClick('features')}>
        Features
      </MobileNavLink>
      <MobileNavLink onClick={() => handleNavClick('pricing')}>
        Pricing
      </MobileNavLink>
      <MobileNavLink onClick={() => handleNavClick('faq')}>FAQ</MobileNavLink>

      {currentUser ? (
        <>
          <MobileNavLink onClick={() => handleNavClick('/process')}>
            Process Images
          </MobileNavLink>
          <MobileCTAButton as="button" onClick={handleLogoutClick}>
            Logout
          </MobileCTAButton>
        </>
      ) : (
        <>
          <MobileCTAButton to="/login" onClick={onClose}>
            Login
          </MobileCTAButton>
          <MobileCTAButton to="/signup" onClick={onClose}>
            Sign Up
          </MobileCTAButton>
        </>
      )}
    </MobileMenuOverlay>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default MobileMenu;
