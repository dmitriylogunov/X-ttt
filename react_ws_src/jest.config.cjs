module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}']
}
