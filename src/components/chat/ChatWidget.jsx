import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { useTheme } from '../../hooks/useTheme.js';
import { getMockAgent } from '../../mocks/agent.mock.js';
import { getMockQuickReplies } from '../../mocks/replies.mock.js';
import { ChatLauncher } from './ChatLauncher.jsx';
import { ChatPanel } from './ChatPanel.jsx';

const agent = getMockAgent();
const quickReplies = getMockQuickReplies();

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { messages, isTyping, unreadCount, sendMessage, markRead } = useChat(isOpen);
  const composerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    markRead();
    composerRef.current?.focus();
  }, [isOpen, markRead]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleSend = (text) => {
    setShowQuickReplies(false);
    sendMessage(text);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <ChatPanel
          agent={agent}
          theme={theme}
          messages={messages}
          isTyping={isTyping}
          isOpen={isOpen}
          quickReplies={quickReplies}
          showQuickReplies={showQuickReplies}
          composerRef={composerRef}
          onToggleTheme={toggleTheme}
          onClose={() => setIsOpen(false)}
          onSend={handleSend}
        />
      )}
      <ChatLauncher
        isOpen={isOpen}
        unreadCount={unreadCount}
        onClick={() => setIsOpen((open) => !open)}
      />
    </div>
  );
}
