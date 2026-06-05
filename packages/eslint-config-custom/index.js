const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  reactHooksPlugin.configs['recommended-latest'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2015,
        ...globals.jest,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
    },
  },
  prettierConfig,
];
