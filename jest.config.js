module.exports = {
  setupFiles: ['./tests/unit/config.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "SrcConfig": "<rootDir>/config/development.js",
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/unit/fileMock.js',
    '\\.(css|less)$': '<rootDir>/tests/unit/fileMock.js'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  transformIgnorePatterns: ['./node_modules/'],

  // testMatch: [
  //   '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  //   '<rootDir>/tests/unit/Dashboard.spec.js'
  // ],
  verbose: true,
  testURL: 'http://localhost/'
}
