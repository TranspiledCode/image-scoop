import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useToast } from 'context/ToastContext'; // Import useToast hook
import PropTypes from 'prop-types';

const slideUpFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ToastWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${({ theme, variant }) =>
    theme.buttons?.variants[variant]?.bgColor || theme.colors.gray};
  color: ${({ theme, variant }) =>
    theme.buttons?.variants[variant]?.textColor || theme.colors.white};
  border-radius: 4px;
  margin-bottom: 12px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  animation: ${slideUpFadeIn} 0.5s ease forwards;

  &:hover {
    background-color: ${({ theme, variant }) =>
      theme.buttons?.variants[variant]?.hoverColor || theme.colors.darkGray};
  }
`;

const ToastMessage = styled.div`
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  margin-left: 12px;
`;

const Toast = ({ id, message, variant }) => {
  const { removeToast } = useToast(); // Get removeToast function

  return (
    <ToastWrapper variant={variant}>
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={() => removeToast(id)}>×</CloseButton>{' '}
      {/* Close button */}
    </ToastWrapper>
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired, // Ensure `id` is required
  message: PropTypes.string.isRequired, // Ensure `message` is required
  variant: PropTypes.oneOf(['success', 'danger', 'info', 'warning']).isRequired, // Ensure `variant` is required
};

export default Toast;
