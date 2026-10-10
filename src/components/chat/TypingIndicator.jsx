export function TypingIndicator({ agentName }) {
  return (
    <div className="chat-typing" role="status" aria-live="polite">
      <span className="chat-typing__dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{agentName} печатает…</span>
    </div>
  );
}
