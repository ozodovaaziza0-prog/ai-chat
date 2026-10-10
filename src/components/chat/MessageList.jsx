import { useEffect, useRef } from 'react';
import { ChatScene } from './ChatScene.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';

export function MessageList({ messages, isTyping, agentName, isOpen }) {
  const logRef = useRef(null);
  const visibleMessages = messages.filter((message) => message.text.trim());

  useEffect(() => {
    const log = logRef.current;
    if (!log || !isOpen) return;
    log.scrollTop = log.scrollHeight;
  }, [visibleMessages.length, isTyping, isOpen]);

  return (
    <div className="chat-log-shell">
      <ChatScene />
      <div ref={logRef} className="chat-log" role="log" aria-live="polite" aria-relevant="additions">
        {visibleMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator agentName={agentName} />}
      </div>
    </div>
  );
}
