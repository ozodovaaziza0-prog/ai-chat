import { useEffect, useState } from 'react';

const SEEN_KEY = 'ai-chat-launcher-seen';

function hasOpenedBefore() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function ChatLauncher({ isOpen, unreadCount, onClick }) {
  const label = isOpen ? 'Свернуть чат' : 'Открыть чат с ИИ-агентом';
  const [hasClicked, setHasClicked] = useState(hasOpenedBefore);
  const [isBeating, setIsBeating] = useState(false);

  useEffect(() => {
    if (hasClicked) return undefined;

    let frame = 0;
    const play = () => {
      setIsBeating(false);
      frame = window.requestAnimationFrame(() => setIsBeating(true));
    };

    play();
    const timer = window.setInterval(play, 5000);

    return () => {
      window.clearInterval(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [hasClicked]);

  const handleClick = () => {
    if (!hasClicked) {
      setHasClicked(true);
      setIsBeating(false);
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {
        // пульсация просто не вернётся в этой вкладке
      }
    }
    onClick();
  };

  const className = [
    'chat-launcher',
    isOpen ? 'chat-launcher--open' : '',
    isBeating ? 'chat-launcher--beat' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-expanded={isOpen}
      onClick={handleClick}
    >
      {isOpen ? <CloseIcon /> : <ChihuahuaIcon />}
      {!isOpen && unreadCount > 0 && (
        <span className="chat-launcher__badge" aria-label={`Непрочитанных: ${unreadCount}`}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

function ChihuahuaIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 24C14 20 10 14 9 7 9 4 13 4.5 14.5 8 16.5 13 19 19 18.5 24Z"
      />
      <path
        fill="currentColor"
        d="M31 24C34 20 38 14 39 7 39 4 35 4.5 33.5 8 31.5 13 29 19 29.5 24Z"
      />
      <path fill="var(--launcher)" d="M15.6 21.2C14 17.4 12.8 12.6 13.6 9.2 15 13 16.8 17.4 17.2 21.2Z" />
      <path fill="var(--launcher)" d="M32.4 21.2C34 17.4 35.2 12.6 34.4 9.2 33 13 31.2 17.4 30.8 21.2Z" />
      <ellipse cx="24" cy="29" rx="11" ry="10" fill="currentColor" />
      <ellipse cx="24" cy="36.4" rx="4.2" ry="3.1" fill="currentColor" />
      <path
        d="M12 22.5C16 13.5 20 11.2 24 11.2S32 13.5 36 22.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle cx="10.2" cy="24" r="5.2" fill="currentColor" />
      <circle cx="37.8" cy="24" r="5.2" fill="currentColor" />
      <circle cx="10.2" cy="24" r="2.4" fill="var(--launcher)" />
      <circle cx="37.8" cy="24" r="2.4" fill="var(--launcher)" />
      <path
        d="M41.6 27.4c2.6 2.8 2.8 6.4.4 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="41" cy="37.2" r="2.2" fill="currentColor" />
      <circle cx="19.3" cy="28.2" r="2.7" fill="var(--launcher)" />
      <circle cx="28.7" cy="28.2" r="2.7" fill="var(--launcher)" />
      <ellipse cx="24" cy="33.5" rx="1.8" ry="1.3" fill="var(--launcher)" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  );
}
