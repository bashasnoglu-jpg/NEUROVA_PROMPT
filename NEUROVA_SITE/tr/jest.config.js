module.exports = {
  // Use jsdom environment for DOM manipulation tests
  testEnvironment: 'jsdom',

  // Look for test files in the tests directory
  testMatch: [
    "**/tests/**/*.test.js",
    "**/*.test.js"
  ],

  // Collect code coverage information
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true
};