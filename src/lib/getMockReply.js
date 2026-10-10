import { mockFallbackReplies, mockReplies } from '../mocks/replies.mock.js';

export function getMockReply(text) {
  const normalized = text.trim().toLowerCase();
  const match = mockReplies.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (match) return match.text;

  const index = Math.floor(Math.random() * mockFallbackReplies.length);
  return mockFallbackReplies[index];
}
