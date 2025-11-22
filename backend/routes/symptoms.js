import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = express.Router();

// POST /api/symptoms
// Add a symptom log
router.post('/', verifyToken, async (req, res) => {
  try {
    const { cycle_id, log_date, mood, cramps, headache, bloating, nausea, discharge, notes } = req.body;

    if (!cycle_id || !log_date) {
      return res.status(400).json({ error: 'cycle_id and log_date are required' });
    }

    const connection = await pool.getConnection();

    // Verify cycle ownership
    const [cycle] = await connection.execute(
      'SELECT c.* FROM cycle_records c WHERE c.cycle_id = ? AND c.user_id = ?',
      [cycle_id, req.userId]
    );

    if (cycle.length === 0) {
      connection.release();
      return res.status(403).json({ error: 'Cycle not found or unauthorized' });
    }

    const query = `
      INSERT INTO symptoms (cycle_id, log_date, mood, cramps, headache, bloating, nausea, discharge, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      cycle_id,
      log_date,
      mood || null,
      cramps ? 1 : 0,
      headache ? 1 : 0,
      bloating ? 1 : 0,
      nausea ? 1 : 0,
      discharge || null,
      notes || null,
    ]);

    connection.release();

    res.status(201).json({
      message: 'Symptom logged successfully',
      symptom_id: result.insertId,
    });
  } catch (error) {
    console.error('Create symptom error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/symptoms/:cycleId
// Get all symptoms for a cycle
router.get('/:cycleId', verifyToken, async (req, res) => {
  try {
    const cycleId = req.params.cycleId;

    const connection = await pool.getConnection();

    // Verify cycle ownership
    const [cycle] = await connection.execute(
      'SELECT * FROM cycle_records WHERE cycle_id = ? AND user_id = ?',
      [cycleId, req.userId]
    );

    if (cycle.length === 0) {
      connection.release();
      return res.status(403).json({ error: 'Cycle not found or unauthorized' });
    }

    const [symptoms] = await connection.execute(
      'SELECT * FROM symptoms WHERE cycle_id = ? ORDER BY log_date ASC',
      [cycleId]
    );

    connection.release();

    res.status(200).json(symptoms);
  } catch (error) {
    console.error('Get symptoms error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
