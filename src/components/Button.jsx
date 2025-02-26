// Button.js
import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

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
    color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 2rem;
  font-weight: 600;
  margin-top: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.7s ease;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      background-color: ${({ variant, theme }) =>
        theme.buttons.variants[variant].hoverBgColor ||
        theme.buttons.variants[variant].hoverColor ||
        theme.buttons.variants[variant].bgColor};
      color: ${({ variant, theme }) =>
        theme.buttons.variants[variant].hoverTextColor ||
        theme.buttons.variants[variant].textColor};
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

      &::before {
        left: 100%;
      }
    }
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
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
  onClick: PropTypes.func,
};

export default Button;
