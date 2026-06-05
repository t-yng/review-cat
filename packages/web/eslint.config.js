const baseConfig = require('@review-cat/eslint-config-custom');

module.exports = [
  ...baseConfig,
  {
    ignores: ['src/**/generated.ts', 'dist/**', 'coverage/**'],
  },
];
