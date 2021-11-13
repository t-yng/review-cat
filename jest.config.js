/**
 * @type {import ('@jest/types').Config.InitialOptions}
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: {
    electron: '<rootDir>/electron/src/__mocks__/electron.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  collectCoverage: false,
  collectCoverageFrom: ['renderer/**/*.{ts,tsx}', 'electron/**/*.ts'],
  coverageProvider: 'v8',
};
