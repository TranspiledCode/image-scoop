// ContextProvider.js
import React from 'react';
import PropTypes from 'prop-types';
import { ToastProvider } from './ToastContext';

const ContextProvider = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
