// buttons.js
import colors from './colors';

const buttons = {
  variants: {
    primary: {
      bgColor: colors.primary,
      hoverColor: colors.primaryDark,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
    secondary: {
      bgColor: colors.secondary,
      hoverColor: colors.secondaryDark,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
    success: {
      bgColor: colors.success,
      hoverColor: colors.tertiaryDark,
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
      hoverBgColor: colors.primary + '15',
      hoverTextColor: colors.primaryDark,
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
      hoverColor: colors.blueberry,
      textColor: colors.white,
      hoverTextColor: colors.white,
    },
  },
  sizes: {
    tiny: {
      padding: '6px 12px',
      fontSize: '12px',
      iconSize: '14px',
    },
    small: {
      padding: '8px 18px',
      fontSize: '14px',
      iconSize: '16px',
    },
    medium: {
      padding: '12px 28px',
      fontSize: '16px',
      iconSize: '18px',
    },
    large: {
      padding: '16px 36px',
      fontSize: '18px',
      iconSize: '22px',
    },
  },
};

export default buttons;
