import React from 'react';
import PropTypes from 'prop-types';
import { ToastProvider } from './ToastContext';
import { NavProvider } from './NavContext';

const ContextProvider = ({ children }) => {
  return (
    <NavProvider>
      <ToastProvider>{children}</ToastProvider>
    </NavProvider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
