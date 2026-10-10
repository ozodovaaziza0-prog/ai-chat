export function QuickReplies({ replies, disabled, onSelect }) {
  if (!replies.length) return null;

  return (
    <div className="chat-quick" role="group" aria-label="Быстрые ответы">
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          className="chat-quick__chip"
          disabled={disabled}
          onClick={() => onSelect(reply.text)}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
