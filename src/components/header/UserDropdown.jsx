import React from 'react';
import styled from '@emotion/styled';
import { User, LogOut, CreditCard, Settings, ChevronDown } from 'lucide-react';
import { useUserSubscription } from '../../hooks/useUserSubscription';
import { useUserUsage } from '../../hooks/useUserUsage';
import PropTypes from 'prop-types';

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-width: calc(100vw - 32px);
  background: white;
  border-radius: 20px;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    right: -8px;
  }
`;

const DropdownHeader = styled.div`
  background: linear-gradient(135deg, #fdf2f8 0%, #fff7ed 50%, #fefce8 100%);
  padding: 20px;
  text-align: center;
  position: relative;

  &::before {
    content: '🍦';
    position: absolute;
    top: 12px;
    right: 16px;
    font-size: 20px;
    opacity: 0.5;
  }
`;

const DropdownAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
`;

const DropdownTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 2px 0;
`;

const DropdownEmail = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
`;

const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: white;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const PlanDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
`;

const DropdownUsage = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
`;

const UsageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UsageLabel = styled.span`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const UsageCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #374151;

  span {
    color: #ec4899;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #f3f4f6;
  border-radius: 100px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.percentage || 35}%;
  background: linear-gradient(90deg, #ec4899 0%, #f97316 50%, #a3e635 100%);
  border-radius: 100px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const DropdownMenuItems = styled.div`
  padding: 8px;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: #374151;
  font-family: inherit;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.15s;
  text-align: left;

  &:hover {
    background: #fdf2f8;
    transform: translateX(2px);
  }

  &:focus {
    outline: 2px solid #ec4899;
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MenuItemIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => props.background || '#fce7f3'};
  color: ${(props) => props.color || '#ec4899'};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MenuItemText = styled.div`
  flex: 1;
  min-width: 0;

  span {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    display: block;
  }

  small {
    font-size: 12px;
    color: #9ca3af;
  }
`;

const MenuItemArrow = styled(ChevronDown)`
  color: #d1d5db;
  flex-shrink: 0;
  transform: rotate(-90deg);
`;

const DropdownFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  font-family: inherit;

  &:hover {
    border-color: #fca5a5;
    background: #fef2f2;
    color: #ef4444;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const UserDropdown = ({
  isOpen,
  currentUser,
  getUserInitials,
  onMenuItemClick,
  onLogout,
}) => {
  const { subscription } = useUserSubscription();
  const { planLimits, totalImagesProcessed, monthlyUsagePercentage } =
    useUserUsage();
  const planName = subscription?.planName || 'Free';

  // Calculate usage display
  const displayUsage = () => {
    if (planLimits.unlimited) {
      return {
        current: totalImagesProcessed,
        limit: 'unlimited',
        percentage: Math.min((totalImagesProcessed / 100) * 10, 100), // Show growth up to 100 scoops
        isUnlimited: true,
      };
    }

    if (planLimits.monthlyLimit) {
      return {
        current: totalImagesProcessed,
        limit: planLimits.monthlyLimit,
        percentage: monthlyUsagePercentage,
        isUnlimited: false,
      };
    }

    return {
      current: totalImagesProcessed,
      limit: 0,
      percentage: 0,
      isUnlimited: false,
    };
  };

  const usageData = displayUsage();

  return (
    <DropdownMenu className={isOpen ? 'open' : ''}>
      <DropdownHeader>
        <DropdownAvatar>{getUserInitials()}</DropdownAvatar>
        <DropdownTitle>{currentUser.displayName || 'User'}</DropdownTitle>
        <DropdownEmail>{currentUser.email}</DropdownEmail>
        <PlanBadge>
          <PlanDot />
          {planName} Plan
        </PlanBadge>
      </DropdownHeader>
      <DropdownUsage>
        <UsageHeader>
          <UsageLabel>Monthly Scoops</UsageLabel>
          <UsageCount>
            <span>{usageData.current}</span> of {usageData.limit}
          </UsageCount>
        </UsageHeader>
        <ProgressBar>
          <ProgressFill percentage={usageData.percentage} />
        </ProgressBar>
      </DropdownUsage>
      <DropdownMenuItems>
        <MenuItem onClick={() => onMenuItemClick('/profile')}>
          <MenuItemIcon background="#dbeafe" color="#3b82f6">
            <User size={18} />
          </MenuItemIcon>
          <MenuItemText>
            <span>Profile</span>
            <small>View and edit account</small>
          </MenuItemText>
          <MenuItemArrow size={16} />
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick('/profile#subscription')}>
          <MenuItemIcon background="#dcfce7" color="#22c55e">
            <CreditCard size={18} />
          </MenuItemIcon>
          <MenuItemText>
            <span>Subscription</span>
            <small>Manage your plan</small>
          </MenuItemText>
          <MenuItemArrow size={16} />
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick('/profile#preferences')}>
          <MenuItemIcon background="#f3f4f6" color="#6b7280">
            <Settings size={18} />
          </MenuItemIcon>
          <MenuItemText>
            <span>Preferences</span>
            <small>Customize your experience</small>
          </MenuItemText>
          <MenuItemArrow size={16} />
        </MenuItem>
      </DropdownMenuItems>
      <DropdownFooter>
        <LogoutButton onClick={onLogout}>
          <LogOut size={16} />
          Sign Out
        </LogoutButton>
      </DropdownFooter>
    </DropdownMenu>
  );
};

UserDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  getUserInitials: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserDropdown;
