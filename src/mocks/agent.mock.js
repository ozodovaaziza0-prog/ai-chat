import { flowerShop } from '../../config/flowerShop.js';

export const mockAgent = {
  id: 'agent-mira',
  name: 'Мира',
  role: 'Консультант по цветам',
  avatarInitials: 'М',
  status: 'online',
  statusLabel: 'В сети',
  shopName: flowerShop.name,
  shopPhone: flowerShop.phoneDisplay,
};

export function getMockAgent(overrides = {}) {
  return { ...mockAgent, ...overrides };
}
