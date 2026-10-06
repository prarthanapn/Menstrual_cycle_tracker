// MySQL database connection pool
import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';

// Load environment variables
dotenv.config();

const ssl = process.env.DB_SSL === 'true'
  ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      ...(process.env.DB_SSL_CA ? { ca: readFileSync(process.env.DB_SSL_CA, 'utf8') } : {}),
    }
  : undefined;

// Create connection pool (10 max connections)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'menstrual_tracker',
  ...(ssl ? { ssl } : {}),
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