export const mockMessages = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: 'Здравствуйте! Я Мира, консультант по цветам. Помогу с оттенками, сочетаниями и оформлением букета.',
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
    text: 'Рада вас видеть. Спросите про палитру букета, цвет упаковки или сочетание оттенков.',
    createdAt: '2026-10-09T14:03:28Z',
    status: 'read',
  },
  {
    id: 'msg-4',
    role: 'user',
    text: 'Хочу нежный букет, но не знаю, розовый или персиковый лучше.',
    createdAt: '2026-10-10T08:41:00Z',
    status: 'read',
  },
  {
    id: 'msg-5',
    role: 'assistant',
    text: 'Персиковый теплее и солнечнее, пудровый розовый — романтичнее и спокойнее. С белой зеленью оба варианта смотрятся мягко; для вечера чаще выбирают розовый с кремовым.',
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
