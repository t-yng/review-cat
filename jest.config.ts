module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/'],
  transform: {
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./test/jestsetup.js'],
};
