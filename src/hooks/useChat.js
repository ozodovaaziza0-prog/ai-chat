import { useCallback, useEffect, useRef, useState } from 'react';
import { requestAssistantReply } from '../api/chat.js';
import { getMockReply } from '../lib/getMockReply.js';
import { createMockMessage, getMockMessages } from '../mocks/messages.mock.js';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildApiMessages(messages, userText) {
  const visible = messages
    .filter((message) => message.text?.trim())
    .map((message) => ({
      role: message.role,
      text: message.text.trim(),
    }));

  return [...visible, { role: 'user', text: userText.trim() }];
}

async function loadReply(text, messages) {
  if (useMocks) {
    const delay = 800 + Math.random() * 700;
    await wait(delay);
    return getMockReply(text);
  }

  return requestAssistantReply(buildApiMessages(messages, text));
}

export function useChat(isOpen) {
  const [messages, setMessages] = useState(() => getMockMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isOpenRef = useRef(isOpen);
  const requestIdRef = useRef(0);
  isOpenRef.current = isOpen;

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  const markRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const sendMessage = (rawText) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    const userMessage = createMockMessage({
      role: 'user',
      text,
      status: 'sent',
    });

    let historyForApi = [];
    setMessages((current) => {
      historyForApi = current;
      return [...current, userMessage];
    });
    setIsTyping(true);

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    loadReply(text, historyForApi)
      .then((replyText) => {
        if (requestIdRef.current !== requestId) return;

        const assistantMessage = createMockMessage({
          role: 'assistant',
          text: replyText,
          status: 'sent',
        });

        setMessages((current) =>
          current.map((message) =>
            message.id === userMessage.id ? { ...message, status: 'read' } : message,
          ).concat(assistantMessage),
        );

        if (!isOpenRef.current) {
          setUnreadCount((count) => count + 1);
        }
      })
      .catch((error) => {
        if (requestIdRef.current !== requestId) return;

        const hint =
          error instanceof Error && error.message
            ? error.message
            : 'Не получилось получить ответ. Попробуйте ещё раз чуть позже.';

        const assistantMessage = createMockMessage({
          role: 'assistant',
          text: hint,
          status: 'sent',
        });

        setMessages((current) => [...current, assistantMessage]);

        if (!isOpenRef.current) {
          setUnreadCount((count) => count + 1);
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setIsTyping(false);
      });
  };

  return { messages, isTyping, unreadCount, sendMessage, markRead };
}
