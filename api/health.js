import { getModelChain } from '../server/gemini.js';

export default function handler(_req, res) {
  const models = getModelChain();
  res.status(200).json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: models[0],
    fallbackModels: models.slice(1),
  });
}
