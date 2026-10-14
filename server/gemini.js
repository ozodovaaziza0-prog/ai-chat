import { GoogleGenerativeAI } from '@google/generative-ai';
import { agentSystemInstruction } from './agentPrompt.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const DEFAULT_FALLBACKS = ['gemini-3.8-flash'];
const MAX_RETRIES_PER_MODEL = 1;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY не задан. Добавьте ключ в файл .env в корне проекта.');
  }
  return new GoogleGenerativeAI(apiKey);
}

export function getModelChain() {
  const primary = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const fromEnv = process.env.GEMINI_FALLBACK_MODELS
    ? process.env.GEMINI_FALLBACK_MODELS.split(',').map((item) => item.trim()).filter(Boolean)
    : DEFAULT_FALLBACKS;

  return [...new Set([primary, ...fromEnv])];
}

function toGeminiRole(role) {
  return role === 'assistant' ? 'model' : 'user';
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /503|429|high demand|UNAVAILABLE|overloaded|try again later/i.test(message);
}

function buildFailureMessage(errors) {
  const text = errors.join(' ');
  const hasOverload = /503|429|high demand|overloaded|try again later/i.test(text);
  const hasModelGone = /404|no longer available|not found/i.test(text);

  if (hasOverload && !hasModelGone) {
    return 'Сервис Gemini сейчас перегружен. Подождите минуту и отправьте сообщение снова.';
  }

  if (hasModelGone) {
    return 'Модель Gemini недоступна для вашего ключа. В .env укажите GEMINI_MODEL=gemini-3.5-flash-lite и перезапустите npm run dev.';
  }

  if (/API key|API_KEY|permission|401|403/i.test(text)) {
    return 'Проблема с GEMINI_API_KEY. Создайте ключ в Google AI Studio и пропишите его в .env.';
  }

  return 'Не удалось получить ответ от Gemini. Попробуйте отправить сообщение ещё раз.';
}

export function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((item) => item && typeof item.text === 'string' && item.text.trim())
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      text: item.text.trim(),
    }))
    .slice(-20);
}

function buildGeminiHistory(prior) {
  const mapped = prior.map((item) => ({
    role: toGeminiRole(item.role),
    parts: [{ text: item.text }],
  }));

  let start = 0;
  while (start < mapped.length && mapped[start].role === 'model') {
    start += 1;
  }

  const cleaned = [];
  for (const entry of mapped.slice(start)) {
    const last = cleaned[cleaned.length - 1];
    if (last && last.role === entry.role) {
      last.parts[0].text = `${last.parts[0].text}\n\n${entry.parts[0].text}`;
      continue;
    }
    cleaned.push(entry);
  }

  if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === 'user') {
    cleaned.pop();
  }

  return cleaned;
}

async function generateWithModel(genAI, modelName, prior, lastText) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: agentSystemInstruction,
  });

  const chat = model.startChat({
    history: buildGeminiHistory(prior),
  });

  const result = await chat.sendMessage(lastText);
  const reply = result.response.text()?.trim();

  if (!reply) {
    throw new Error('Пустой ответ от модели');
  }

  return reply;
}

export async function generateAgentReply(messages) {
  const history = normalizeMessages(messages);
  if (!history.length) {
    throw new Error('Пустая история сообщений');
  }

  const last = history[history.length - 1];
  if (last.role !== 'user') {
    throw new Error('Последнее сообщение должно быть от пользователя');
  }

  const prior = history.slice(0, -1);
  const genAI = getClient();
  const models = getModelChain();
  const errors = [];

  for (const modelName of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt += 1) {
      try {
        const reply = await generateWithModel(genAI, modelName, prior, last.text);
        if (modelName !== models[0]) {
          console.warn(`[gemini] Ответ получен через запасную модель: ${modelName}`);
        }
        return reply;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        errors.push(`${modelName}: ${detail}`);

        if (!isRetryableError(error) || attempt === MAX_RETRIES_PER_MODEL) {
          break;
        }

        await wait(800 * (attempt + 1));
      }
    }
  }

  console.error('[gemini] Все модели недоступны:', errors.slice(-3).join(' | '));

  throw new Error(buildFailureMessage(errors));
}
