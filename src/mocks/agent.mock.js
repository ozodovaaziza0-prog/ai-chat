export const mockAgent = {
  id: 'agent-mira',
  name: 'Мира',
  role: 'ИИ-ассистент',
  avatarInitials: 'М',
  status: 'online',
  statusLabel: 'В сети',
};

export function getMockAgent(overrides = {}) {
  return { ...mockAgent, ...overrides };
}
