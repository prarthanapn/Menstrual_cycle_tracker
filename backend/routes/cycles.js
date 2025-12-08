import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = express.Router();

// POST /api/cycles
// Create a new cycle record - only requires start_date, flow_level, pain_level
router.post('/', verifyToken, async (req, res) => {
  try {
    const { start_date, flow_level, pain_level, notes } = req.body;
    const userId = req.userId;

    if (!start_date || !flow_level) {
      return res.status(400).json({ error: 'start_date and flow_level are required' });
    }

    const connection = await pool.getConnection();
    // If a cycle exists in the same month/year for this user, update it instead of inserting
    const start = new Date(start_date);
    const month = start.getMonth() + 1;
    const year = start.getFullYear();

    // Look for existing cycle with same month & year
    const [existingRows] = await connection.execute(
      'SELECT * FROM cycle_records WHERE user_id = ? AND MONTH(start_date) = ? AND YEAR(start_date) = ? LIMIT 1',
      [userId, month, year]
    );

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      const updateQuery = `
        UPDATE cycle_records
        SET flow_level = COALESCE(?, flow_level),
            pain_level = COALESCE(?, pain_level),
            notes = COALESCE(?, notes)
        WHERE cycle_id = ?
      `;

      await connection.execute(updateQuery, [
        flow_level || null,
        pain_level || null,
        notes || null,
        existing.cycle_id,
      ]);

      connection.release();
      return res.status(200).json({ message: 'Cycle updated for month', cycle_id: existing.cycle_id });
    }

    const insertQuery = `
      INSERT INTO cycle_records (user_id, start_date, flow_level, pain_level, notes)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(insertQuery, [
      userId,
      start_date,
      flow_level,
      pain_level || null,
      notes || null,
    ]);

    connection.release();

    res.status(201).json({ message: 'Cycle record created', cycle_id: result.insertId });
  } catch (error) {
    console.error('Create cycle error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cycles
// Get cycles for the authenticated user (simpler endpoint for frontend lists)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT cycle_id, start_date, end_date, flow_level, discharge, is_end_date FROM cycle_records WHERE user_id = ? ORDER BY start_date DESC`,
      [userId]
    );
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Get cycles (auth) error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cycles/:userId
// Get all cycles for a user
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Users can only access their own cycles
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM cycle_records WHERE user_id = ? ORDER BY start_date DESC`,
      [userId]
    );
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Get cycles error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cycles/:id
// Update a cycle record - ONLY accepts: end_date, notes, cycle_length (auto-calculated)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const cycleId = req.params.id;
    const { end_date, notes } = req.body;

    const connection = await pool.getConnection();

    // Fetch the cycle to verify ownership
    const [cycle] = await connection.execute('SELECT * FROM cycle_records WHERE cycle_id = ?', [cycleId]);
    if (cycle.length === 0 || cycle[0].user_id !== req.userId) {
      connection.release();
      return res.status(403).json({ error: 'Unauthorized or cycle not found' });
    }

    // Calculate cycle_length if end_date is provided
    let cycle_length = cycle[0].cycle_length;
    if (end_date) {
      const start = new Date(cycle[0].start_date);
      const end = new Date(end_date);
      cycle_length = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    }

    const query = `
      UPDATE cycle_records
      SET end_date = ?,
          cycle_length = ?,
          notes = COALESCE(?, notes)
      WHERE cycle_id = ?
    `;

    await connection.execute(query, [
      end_date || null,
      cycle_length,
      notes || null,
      cycleId,
    ]);

    connection.release();

    res.status(200).json({ 
      message: 'Cycle updated successfully',
      cycle_id: cycleId,
      end_date,
      cycle_length
    });
  } catch (error) {
    console.error('Update cycle error:', error);
    res.status(500).json({ error: error.message });
  }
});

// (export at bottom)

// DELETE /api/cycles/:id
// Delete a cycle record (only owner)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cycleId = req.params.id;

    const connection = await pool.getConnection();
    const [cycle] = await connection.execute('SELECT * FROM cycle_records WHERE cycle_id = ?', [cycleId]);
    if (cycle.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Cycle not found' });
    }

    if (cycle[0].user_id !== req.userId) {
      connection.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await connection.execute('DELETE FROM cycle_records WHERE cycle_id = ?', [cycleId]);
    connection.release();

    res.status(200).json({ message: 'Cycle deleted' });
  } catch (error) {
    console.error('Delete cycle error:', error);
    res.status(500).json({ error: error.message });
  }
});

  export default router;
