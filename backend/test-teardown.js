// This script is responsible for closing the database connection pool after all tests have run.
const db = require('./services/db');

module.exports = async () => {
  console.log('\nTests finished. Closing database connection pool...');
  await db.end();
};