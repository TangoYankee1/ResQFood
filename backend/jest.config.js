// This is the configuration file for Jest, our testing framework.

module.exports = {
  // This line tells Jest to run our custom script after all tests are done.
  // This is the correct way to close the database connection pool once, at the very end.
  globalSetup: './test-setup.js',
  globalTeardown: './test-teardown.js',

  // This specifies the environment in which the tests will be run. 'node' is correct for a backend application.
  testEnvironment: 'node',

  // This pattern tells Jest where to find our test files.
  testMatch: ['**/*.test.js'],
};