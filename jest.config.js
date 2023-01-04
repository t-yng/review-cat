/**
 * @type {import ('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest'],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '(\\.|/)(test|spec)\\.[jt]sx?$',
  testPathIgnorePatterns: ['<rootDir>/packages/'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: {
    electron: '<rootDir>/electron/src/__mocks__/electron.ts',
  },
  collectCoverage: false,
  collectCoverageFrom: ['electron/**/*.ts', '!**/*.d.ts'],
  coverageProvider: 'v8',
};
