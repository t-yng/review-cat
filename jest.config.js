/**
 * @type {import ('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest'],
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '(\\.|/)(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: {
    electron: '<rootDir>/electron/src/__mocks__/electron.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'renderer/**/*.{ts,tsx}',
    'electron/**/*.ts',
    '!renderer/**/*.css.ts',
    '!**/*.d.ts',
  ],
  coverageProvider: 'v8',
};
