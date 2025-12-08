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

// Check AI backend availability
const checkAIBackend = async () => {
  const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || null;

  let aiStatus = '⚠️  No AI model configured (using rule-based responses)';

  // Check Ollama
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(OLLAMA_API_URL.replace('/api/generate', ''), { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      aiStatus = '✅ Ollama available (using Mistral/Llama)';
    }
  } catch (e) {
    // Ollama not available, check HF
    if (HUGGINGFACE_API_KEY) {
      aiStatus = '✅ Hugging Face Inference API configured (fallback mode)';
    }
  }

  return aiStatus;
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatbotRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Menstrual Health Tracker API', status: 'running', apiUrl: `http://localhost:${PORT}/api` });
});

// Health check
app.get('/api/health', async (req, res) => {
  const aiStatus = await checkAIBackend();
  res.status(200).json({ status: 'Backend is running', ai_model: aiStatus, timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  const aiStatus = await checkAIBackend();
  console.log(`🤖 ${aiStatus}`);
  console.log(`💡 Note: Chatbot will use rule-based responses if AI model is unavailable`);
});
