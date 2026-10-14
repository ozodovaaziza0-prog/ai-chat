import { generateAgentReply } from '../server/gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body ?? {};
    const reply = await generateAgentReply(messages);
    return res.status(200).json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка сервера';
    const status =
      message.includes('GEMINI_API_KEY') ||
      message.includes('перегружен') ||
      message.includes('недоступна')
        ? 503
        : 400;
    return res.status(status).json({ error: message });
  }
}
