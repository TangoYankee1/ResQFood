// This script runs once before all tests and is responsible for ensuring a clean database state.
const db = require('./services/db');

module.exports = async () => {
  console.log('\nRunning global test setup...');
  try {
    await db.query('SET FOREIGN_KEY_CHECKS = 0;');
    await db.query('TRUNCATE TABLE assignments');
    await db.query('TRUNCATE TABLE donations');
    await db.query('TRUNCATE TABLE users');
    await db.query('TRUNCATE TABLE beneficiaries');
    await db.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Failed to clean the database:', error);
    process.exit(1); // Exit if setup fails
  } finally {
    // We can end the connection here if db is a single connection, but since it's a pool,
    // we let the teardown script handle it.
  }
};