// ToastContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import ToastContainer from 'components/ToastContainer';
import PropTypes from 'prop-types';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, variant, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} position={position} />{' '}
      {/* Pass position prop */}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
};
