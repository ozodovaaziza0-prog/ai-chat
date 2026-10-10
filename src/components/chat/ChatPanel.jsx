import { ChatComposer } from './ChatComposer.jsx';
import { ChatHeader } from './ChatHeader.jsx';
import { MessageList } from './MessageList.jsx';
import { QuickReplies } from './QuickReplies.jsx';

export function ChatPanel({
  agent,
  theme,
  messages,
  isTyping,
  isOpen,
  quickReplies,
  showQuickReplies,
  composerRef,
  onToggleTheme,
  onClose,
  onSend,
}) {
  return (
    <section className="chat-panel" aria-label={`Чат с ${agent.name}`}>
      <ChatHeader agent={agent} theme={theme} onToggleTheme={onToggleTheme} onClose={onClose} />
      <MessageList messages={messages} isTyping={isTyping} agentName={agent.name} isOpen={isOpen} />
      {showQuickReplies && (
        <QuickReplies replies={quickReplies} disabled={isTyping} onSelect={onSend} />
      )}
      <ChatComposer disabled={isTyping} inputRef={composerRef} onSend={onSend} />
    </section>
  );
}
