import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { generateAgentReply, getModelChain } from './gemini.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => {
  const models = getModelChain();
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: models[0],
    fallbackModels: models.slice(1),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body ?? {};
    const reply = await generateAgentReply(messages);
    res.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка сервера';
    const status =
      message.includes('GEMINI_API_KEY') ||
      message.includes('перегружен') ||
      message.includes('недоступна')
        ? 503
        : 400;
    res.status(status).json({ error: message });
  }
});

const models = getModelChain();

app.listen(port, () => {
  console.log(`Chat API: http://localhost:${port}`);
  console.log(`Gemini models: ${models.join(' → ')}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY не задан — POST /api/chat вернёт 503.');
  }
});
