// Chatbot route - process user messages and save to database
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db.js';
import { getAIResponse } from '../utils/ai-helper.js';

const router = express.Router();

// POST /api/chat - send message and get AI response
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_message } = req.body;
    const userId = req.userId;

    if (!user_message) {
      return res.status(400).json({ error: 'user_message is required' });
    }

    // Get response from AI or rules
    const { bot_response, triage_level } = await getAIResponse(user_message);

    // Save conversation to database
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO chatbot_logs (user_id, user_message, bot_response, triage_level, chat_time)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await connection.execute(query, [
      userId,
      user_message,
      bot_response,
      triage_level,
    ]);

    connection.release();

    // Return response with metadata
    res.status(200).json({
      chat_id: result.insertId,
      user_message,
      bot_response,
      triage_level,
      timestamp: new Date(),
    });
  } catch (error) {
    // Log errors for debugging
    console.error('[CHATBOT] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
