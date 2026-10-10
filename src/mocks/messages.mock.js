export const mockMessages = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: 'Здравствуйте! Я Мира, ИИ-ассистент Северной студии. Подскажу по тарифам, срокам запуска и интеграциям.',
    createdAt: '2026-10-09T14:02:00Z',
    status: 'read',
  },
  {
    id: 'msg-2',
    role: 'user',
    text: 'Привет!',
    createdAt: '2026-10-09T14:03:12Z',
    status: 'read',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    text: 'Рада вас видеть. Могу сравнить пакеты или коротко рассказать, как виджет встаёт на сайт — что удобнее?',
    createdAt: '2026-10-09T14:03:28Z',
    status: 'read',
  },
  {
    id: 'msg-4',
    role: 'user',
    text: 'Нужен чат, который не перекрывает форму заявки на мобильном и выглядит как живой оператор, а не как сухая анкета.',
    createdAt: '2026-10-10T08:41:00Z',
    status: 'read',
  },
  {
    id: 'msg-5',
    role: 'assistant',
    text: '',
    createdAt: '2026-10-10T08:41:40Z',
  },
  {
    id: 'msg-6',
    role: 'assistant',
    text: 'Поняла. На узком экране панель занимает почти всю высоту и не закрывает поле ввода. Напишите, с чего начать: цены, сроки или поддержка.',
    createdAt: '2026-10-10T08:42:05Z',
    status: 'sent',
  },
];

export function getMockMessages(overrides = {}) {
  return mockMessages.map((message) => ({ ...message, ...overrides }));
}

export function createMockMessage(overrides = {}) {
  return {
    id: overrides.id ?? `msg-${crypto.randomUUID()}`,
    role: 'user',
    text: '',
    createdAt: new Date().toISOString(),
    status: 'sent',
    ...overrides,
  };
}
