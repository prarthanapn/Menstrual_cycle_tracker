import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = express.Router();

// GET /api/users (protected)
// Get all users (admin only, but returning current user for demo)
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT user_id, name, email, dob, age_group, height_cm, weight_kg, blood_group FROM users WHERE user_id = ?', [req.userId]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id (protected)
// Get specific user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Users can only access their own data
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT user_id, name, email, dob, age_group, height_cm, weight_kg, blood_group FROM users WHERE user_id = ?', [userId]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
