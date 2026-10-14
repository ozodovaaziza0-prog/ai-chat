import { useCallback, useRef, useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

export function ChatComposer({ disabled, inputRef, onSend }) {
  const [value, setValue] = useState('');
  const [speechHint, setSpeechHint] = useState('');
  const dictationBaseRef = useRef('');
  const committedRef = useRef('');

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
    setSpeechHint('');
    dictationBaseRef.current = '';
    committedRef.current = '';
  };

  const handleTranscript = useCallback(({ final, interim }) => {
    if (final) {
      committedRef.current = `${committedRef.current}${final}`.trimStart();
    }
    const draft = `${committedRef.current}${interim}`.trim();
    const next = dictationBaseRef.current
      ? `${dictationBaseRef.current}${draft ? ` ${draft}` : ''}`
      : draft;
    setValue(next.trimStart());
  }, []);

  const handleSpeechError = useCallback((code) => {
    if (code === 'not-allowed') {
      setSpeechHint('Разрешите доступ к микрофону в браузере.');
      return;
    }
    if (code === 'no-speech') {
      setSpeechHint('Речь не распознана. Попробуйте ещё раз.');
      return;
    }
    setSpeechHint('Не удалось записать голос. Повторите диктовку.');
  }, []);

  const { isSupported, isListening, toggle, stop } = useSpeechRecognition({
    onTranscript: handleTranscript,
    onError: handleSpeechError,
  });

  const startDictation = () => {
    if (disabled || !isSupported || isListening) return;
    dictationBaseRef.current = value.trim();
    committedRef.current = '';
    setSpeechHint('Слушаю… Нажмите микрофон ещё раз, чтобы остановить.');
    toggle();
  };

  const stopDictation = () => {
    if (!isListening) return;
    stop();
    setSpeechHint('Проверьте текст и нажмите «Отправить».');
  };

  return (
    <form
      className="chat-composer"
      onSubmit={(event) => {
        event.preventDefault();
        if (isListening) stopDictation();
        submit();
      }}
    >
      <label className="chat-composer__label" htmlFor="chat-message">
        Сообщение
      </label>
      <div className="chat-composer__field">
        <textarea
          id="chat-message"
          ref={inputRef}
          className="chat-composer__input"
          rows={1}
          placeholder={isListening ? 'Говорите…' : 'Напишите сообщение…'}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            if (isListening) stopDictation();
            setValue(event.target.value);
            setSpeechHint('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (isListening) stopDictation();
              submit();
            }
          }}
        />
        {speechHint && (
          <p className="chat-composer__hint" role="status" aria-live="polite">
            {speechHint}
          </p>
        )}
      </div>
      {isSupported && (
        <button
          type="button"
          className={`chat-composer__mic${isListening ? ' chat-composer__mic--active' : ''}`}
          aria-label={isListening ? 'Остановить диктовку' : 'Голосовой ввод'}
          aria-pressed={isListening}
          disabled={disabled}
          onClick={isListening ? stopDictation : startDictation}
        >
          <MicIcon />
        </button>
      )}
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

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3.2 11.2 20.4 3.4c.8-.4 1.6.5 1.2 1.3l-6.8 18.1c-.4.9-1.6.8-1.9-.2l-2.2-7.1-7.1-2.2c-1-.3-1.1-1.5-.4-2.1Z" />
    </svg>
  );
}
