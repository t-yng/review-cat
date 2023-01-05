/**
 * @type {import ('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest'],
  },
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(\\.|/)(test|spec)\\.[jt]s?$',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: {
    electron: '<rootDir>/test/mocks/electron.ts',
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', '!**/*.d.ts'],
  coverageProvider: 'v8',
};
