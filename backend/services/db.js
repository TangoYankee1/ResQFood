const mysql = require('mysql2/promise');

// Create a connection pool. This is more efficient than creating a new connection for every query.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'resqfood_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * The query function is a wrapper around the pool.query function.
 * It executes a SQL query with the given parameters and returns the result.
 * For a SELECT query, it returns an array of rows.
 * For an INSERT/UPDATE/DELETE query, it returns an object with information about the operation (e.g., insertId).
 */
async function query(sql, params) {
  const [results] = await pool.query(sql, params);
  if (Array.isArray(results)) {
    return results;
  }
  return results;
}

/**
 * The end function closes the connection pool.
 * This should be called only once, after all tests have completed.
 */
async function end() {
  await pool.end();
}

module.exports = {
  query,
  end
};