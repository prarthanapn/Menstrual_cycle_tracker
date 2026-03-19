// MySQL database connection pool
import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create connection pool (10 max connections)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'menstrual_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('[DATABASE] Connected successfully');
    connection.release();
  } catch (error) {
    console.error('[DATABASE] Connection failed:', error.message);
  }
})();

export default pool;
