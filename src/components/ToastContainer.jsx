// ToastContainer.js
import React from 'react';
import styled from '@emotion/styled';
import Toast from './Toast';
import PropTypes from 'prop-types';

// Define position styles based on the position prop
const getPositionStyles = (position) => {
  switch (position) {
    case 'top-left':
      return `
        top: 20px;
        left: 20px;
      `;
    case 'top-right':
      return `
        top: 20px;
        right: 20px;
      `;
    case 'bottom-left':
      return `
        bottom: 20px;
        left: 20px;
      `;
    case 'bottom-right':
      return `
        bottom: 20px;
        right: 20px;
      `;
    default:
      return `
        top: 20px;
        right: 20px;
      `;
  }
};

// Apply the position styles dynamically
const ToastContainerWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  ${({ position }) => getPositionStyles(position)};
`;

const ToastContainer = ({ toasts, position = 'top-right' }) => {
  return (
    <ToastContainerWrapper position={position}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
        />
      ))}
    </ToastContainerWrapper>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['success', 'danger', 'info', 'warning'])
        .isRequired,
    }),
  ).isRequired,
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
};

export default ToastContainer;
