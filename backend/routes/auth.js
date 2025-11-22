import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/register
// Create a new user account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob, age_group, height_cm, weight_kg, blood_group } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO users (name, email, password_hash, dob, age_group, height_cm, weight_kg, blood_group)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await connection.execute(query, [
      name,
      email,
      hashedPassword,
      dob || null,
      age_group || null,
      height_cm || null,
      weight_kg || null,
      blood_group || null,
    ]);

    connection.release();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
// Authenticate user and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.user_id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
