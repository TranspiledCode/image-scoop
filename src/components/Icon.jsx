// Icon.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaInfoCircle } from 'react-icons/fa'; // Default fallback icon

const Icon = ({ name, size = '24px' }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const { [name]: LoadedIcon } = await import(`react-icons/fa`);
        setIconComponent(() => LoadedIcon || FaInfoCircle);
      } catch {
        setIconComponent(() => FaInfoCircle); // Set default icon on error
      }
    };

    loadIcon();
  }, [name]);

  const RenderedIcon = IconComponent || FaInfoCircle;

  return <RenderedIcon style={{ fontSize: size }} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string, // Size prop with units (px or rem)
};

export default Icon;
