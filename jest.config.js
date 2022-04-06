/** @type {import('@swc/core').Config} */
const swcConfig = {
  sourceMaps: true,
  module: {
    type: 'commonjs',
  },
  jsc: {
    parser: {
      syntax: 'typescript',
      tsx: true,
    },
    transform: {
      react: {
        runtime: 'automatic',
      },
    },
  },
};

/**
 * @type {import ('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', swcConfig],
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '(\\.|/)(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: {
    electron: '<rootDir>/electron/src/__mocks__/electron.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['/node_modules/(?!@tauri-apps)/'],
  collectCoverage: false,
  collectCoverageFrom: [
    'renderer/**/*.{ts,tsx}',
    'electron/**/*.ts',
    '!renderer/**/*.css.ts',
    '!**/*.d.ts',
  ],
  coverageProvider: 'v8',
};
