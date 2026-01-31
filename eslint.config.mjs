import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.netlify/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
        Buffer: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'warn',
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Override for Node.js scripts
  {
    files: ['scripts/**/*.js', 'Netlify/functions/**/*.js', 'functions/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
