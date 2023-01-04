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
    '\\.css$': 'identity-obj-proxy',
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'src/**/*.css.ts', '!**/*.d.ts'],
  coverageProvider: 'v8',
};
