import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import UserDropdown from './UserDropdown';

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 100px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 13px;
`;

const UserName = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const UserChevron = styled(ChevronDown)`
  color: #6b7280;
  transition: transform 0.2s;

  .active & {
    transform: rotate(180deg);
  }
`;

const UserMenu = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      addToast('Successfully logged out', 'success');
      navigate('/');
    } catch {
      addToast('Failed to logout', 'error');
    }
  };

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return currentUser?.email?.[0]?.toUpperCase() || 'U';
  };

  const handleMenuItemClick = (path) => {
    setIsUserMenuOpen(false);
    if (path) {
      navigate(path);
    }
  };

  if (!currentUser) return null;

  return (
    <UserMenuContainer ref={userMenuRef}>
      <UserMenuButton
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className={isUserMenuOpen ? 'active' : ''}
        aria-label="User menu"
      >
        <UserAvatar>{getUserInitials()}</UserAvatar>
        <UserName>{currentUser.displayName || currentUser.email}</UserName>
        <UserChevron size={16} />
      </UserMenuButton>
      <UserDropdown
        isOpen={isUserMenuOpen}
        currentUser={currentUser}
        getUserInitials={getUserInitials}
        onMenuItemClick={handleMenuItemClick}
        onLogout={handleLogout}
      />
    </UserMenuContainer>
  );
};

export default UserMenu;
