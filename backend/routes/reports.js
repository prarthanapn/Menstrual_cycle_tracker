import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db.js';
import { generatePDFReport } from '../utils/pdf-generator.js';
import { generateAISummary } from '../utils/ai-helper.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// POST /api/reports/generate
// Generate a PDF report for the user
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { doctor_email } = req.body;

    const connection = await pool.getConnection();

    // Fetch user data
    const [user] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (user.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch last 6 cycles
    const [cycles] = await connection.execute(
      `SELECT * FROM cycle_records WHERE user_id = ? ORDER BY start_date DESC LIMIT 6`,
      [userId]
    );

    // Fetch symptoms for these cycles
    let allSymptoms = [];
    if (cycles.length > 0) {
      const cycleIds = cycles.map(c => c.cycle_id);
      const placeholders = cycleIds.map(() => '?').join(',');
      const [symptoms] = await connection.execute(
        `SELECT * FROM symptoms WHERE cycle_id IN (${placeholders})`,
        cycleIds
      );
      allSymptoms = symptoms;
    }

    connection.release();

    // Generate AI summary
    const summary = await generateAISummary(user[0], cycles, allSymptoms);

    // Generate PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `report_${userId}_${timestamp}.pdf`;
    const filepath = `reports/${filename}`;

    await generatePDFReport(user[0], cycles, allSymptoms, summary, filepath);

    // Store report in database
    const dbConnection = await pool.getConnection();
    const reportQuery = `
      INSERT INTO reports (user_id, report_title, generated_on, file_path, doctor_email, summary)
      VALUES (?, ?, NOW(), ?, ?, ?)
    `;

    const reportTitle = `Health Report - ${new Date().toLocaleDateString()}`;
    const [result] = await dbConnection.execute(reportQuery, [
      userId,
      reportTitle,
      filepath,
      doctor_email || null,
      summary,
    ]);

    dbConnection.release();

    res.status(201).json({
      message: 'Report generated successfully',
      report_id: result.insertId,
      filename,
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/:userId
// Get all reports for a user
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const connection = await pool.getConnection();
    const [reports] = await connection.execute(
      'SELECT * FROM reports WHERE user_id = ? ORDER BY generated_on DESC',
      [userId]
    );
    connection.release();

    res.status(200).json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
