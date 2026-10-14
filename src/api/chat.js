const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function requestAssistantReply(messages) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || `Ошибка API (${response.status})`;
    throw new Error(message);
  }

  if (!data.reply || typeof data.reply !== 'string') {
    throw new Error('Некорректный ответ сервера');
  }

  return data.reply;
}
