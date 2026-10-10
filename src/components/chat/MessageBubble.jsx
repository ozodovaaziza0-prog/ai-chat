import { formatTime } from '../../lib/formatTime.js';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const time = formatTime(message.createdAt);

  return (
    <article className={`chat-bubble chat-bubble--${message.role}`}>
      <p className="chat-bubble__text">{message.text}</p>
      <p className="chat-bubble__meta">
        <time dateTime={message.createdAt}>{time}</time>
        {isUser && message.status && (
          <span className="chat-bubble__status">{message.status === 'read' ? 'прочитано' : 'отправлено'}</span>
        )}
      </p>
    </article>
  );
}
