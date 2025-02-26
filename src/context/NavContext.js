import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Create a new context for navigation
const NavContext = createContext();

export const useNavigation = () => useContext(NavContext);

export const NavProvider = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <NavContext.Provider
      value={{
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

NavProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NavProvider;
