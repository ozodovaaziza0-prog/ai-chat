import { useState } from 'react';

export function ChatComposer({ disabled, inputRef, onSend }) {
  const [value, setValue] = useState('');

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  return (
    <form
      className="chat-composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label className="chat-composer__label" htmlFor="chat-message">
        Сообщение
      </label>
      <textarea
        id="chat-message"
        ref={inputRef}
        className="chat-composer__input"
        rows={1}
        placeholder="Напишите сообщение…"
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <button
        type="submit"
        className="chat-composer__send"
        aria-label="Отправить"
        disabled={disabled || !value.trim()}
      >
        <SendIcon />
      </button>
    </form>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3.2 11.2 20.4 3.4c.8-.4 1.6.5 1.2 1.3l-6.8 18.1c-.4.9-1.6.8-1.9-.2l-2.2-7.1-7.1-2.2c-1-.3-1.1-1.5-.4-2.1Z" />
    </svg>
  );
}
