// src/style/processTheme.js
// Shared theme tokens for the /process page redesign
// Matches marketing page aesthetic with dark gradients and consistent styling

export const processTheme = {
  // Page background
  pageBackground: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',

  // Card backgrounds
  cardBg: '#374151',
  cardBgLight: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  cardBorderActive: '#ec4899',

  // Gradient accents (from marketing)
  primaryGradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
  secondaryGradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
  tertiaryGradient: 'linear-gradient(135deg, #eab308 0%, #84cc16 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',

  // Interactive states
  borderDefault: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  borderActive: '#ec4899',

  // Shadows
  shadowCard: '0 4px 14px rgba(0, 0, 0, 0.3)',
  shadowCardHover: '0 12px 32px rgba(236, 72, 153, 0.2)',
  shadowButton: '0 4px 14px rgba(236, 72, 153, 0.3)',

  // Breakpoints
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
};

export default processTheme;
