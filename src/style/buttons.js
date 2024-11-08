// buttons.js
import colors from './colors';

const buttons = {
  variants: {
    primary: {
      bgColor: colors.primary,
      hoverColor: colors.primaryLight,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
    secondary: {
      bgColor: colors.secondary,
      hoverColor: colors.secondaryLight,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
    success: {
      bgColor: colors.success,
      hoverColor: colors.secondaryAccent,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
    warning: {
      bgColor: colors.warning,
      hoverColor: colors.tertiaryAccent,
      textColor: colors.black,
      hoverTextColor: colors.black,
    },
    danger: {
      bgColor: colors.error,
      hoverColor: colors.darkGray,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
    ghost: {
      borderColor: colors.primary,
      textColor: colors.primary,
      hoverBgColor: colors.lightGray,
      hoverTextColor: colors.darkGray,
    },
    outline: {
      bgColor: 'transparent',
      hoverBgColor: 'transparent',
      borderColor: colors.white,
      textColor: colors.white,
      hoverColor: colors.secondary,
      hoverTextColor: colors.secondary,
    },
    info: {
      bgColor: colors.info,
      hoverColor: colors.primaryAccent,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
  },
  sizes: {
    tiny: {
      padding: '4px 8px',
      fontSize: '12px',
      iconSize: '12px',
    },
    small: {
      padding: '8px 16px',
      fontSize: '14px',
      iconSize: '14px',
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
      iconSize: '16px',
    },
    large: {
      padding: '16px 32px',
      fontSize: '20px',
      iconSize: '20px',
    },
  },
};

export default buttons;
