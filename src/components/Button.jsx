// Button.js
import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { useTheme } from '@emotion/react';

const StyledButton = styled.button`
  background-color: ${({ variant, theme }) =>
    theme.buttons.variants[variant].bgColor || 'transparent'};
  color: ${({ variant, theme }) => theme.buttons.variants[variant].textColor};
  padding: ${({ size, theme }) => theme.buttons.sizes[size].padding};
  font-size: ${({ size, theme }) => theme.buttons.sizes[size].fontSize};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border: ${({ variant, theme }) =>
    theme.buttons.variants[variant].borderColor
      ? `2px solid ${theme.buttons.variants[variant].borderColor}`
      : 'none'};
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.375rem;
  font-weight: 500;
  margin-top: 1rem;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    &:hover {
      background-color: ${({ variant, theme }) =>
        theme.buttons.variants[variant].hoverBgColor ||
        theme.buttons.variants[variant].hoverColor ||
        theme.buttons.variants[variant].bgColor};
      color: ${({ variant, theme }) =>
        theme.buttons.variants[variant].hoverTextColor ||
        theme.buttons.variants[variant].textColor};
    }
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-left: 2rem;
`;

const Button = ({
  children,
  icon,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick, // Added onClick prop
}) => {
  const theme = useTheme();

  const iconSize = theme.buttons.sizes[size].iconSize;

  return (
    <StyledButton
      variant={variant}
      size={size}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick} // Pass onClick to StyledButton
    >
      {children}
      {icon && (
        <IconWrapper>
          <Icon name={icon} size={iconSize} color="white" />
        </IconWrapper>
      )}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'ghost',
    'outline',
  ]),
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func, // Added onClick to PropTypes
};

export default Button;
