// Express server for menstrual health tracker app
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cycleRoutes from './routes/cycles.js';
import symptomRoutes from './routes/symptoms.js';
import reportRoutes from './routes/reports.js';
import chatbotRoutes from './routes/chatbot.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL?.replace(/\/$/, '') || null;

const getBaseUrl = (req) => BASE_URL || `${req.protocol}://${req.get('host')}`;

// Check if OpenAI API key is configured
const checkAIBackend = async () => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;

  let aiStatus = '[WARNING] No AI model configured (using rule-based responses)';

  if (OPENAI_API_KEY) {
    aiStatus = '[OK] OpenAI API configured';
  }

  return aiStatus;
};

// CORS and body parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatbotRoutes);

// API status endpoint
app.get('/', (req, res) => {
  const baseUrl = getBaseUrl(req);

  res.status(200).json({
    message: 'Menstrual Health Tracker API',
    status: 'running',
    baseUrl,
    apiUrl: `${baseUrl}/api`
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const aiStatus = await checkAIBackend();
  res.status(200).json({
    status: 'Backend is running',
    ai_model: aiStatus,
    timestamp: new Date()
  });
});

// Check OpenAI configuration
app.get('/api/ai-check', async (req, res) => {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
    const status = OPENAI_API_KEY ? 'OK' : 'NOT_CONFIGURED';
    res.status(200).json({
      openai: {
        configured: !!OPENAI_API_KEY,
        status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start server and log startup info
app.listen(PORT, async () => {
  if (BASE_URL) {
    console.log(`[SERVER] Running on ${BASE_URL}`);
    console.log(`[SERVER] Health check: ${BASE_URL}/api/health`);
  } else {
    console.log(`[SERVER] Running on port ${PORT}`);
    console.log('[SERVER] Health check: /api/health');
  }
  const aiStatus = await checkAIBackend();
  console.log(`[AI] ${aiStatus}`);
});
