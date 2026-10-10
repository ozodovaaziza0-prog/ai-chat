export function ChatHeader({ agent, theme, onToggleTheme, onClose }) {
  const themeLabel = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';

  return (
    <header className="chat-header">
      <div className="chat-header__agent">
        <span className="chat-header__avatar" aria-hidden="true">
          {agent.avatarInitials}
        </span>
        <div>
          <p className="chat-header__name">{agent.name}</p>
          <p className="chat-header__status">
            <span className="chat-header__dot" aria-hidden="true" />
            {agent.statusLabel}
          </p>
        </div>
      </div>
      <div className="chat-header__actions">
        <button type="button" className="chat-icon-button" aria-label={themeLabel} onClick={onToggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button type="button" className="chat-icon-button" aria-label="Свернуть чат" onClick={onClose}>
          <ChevronIcon />
        </button>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.2 2.6a.9.9 0 0 1 .3 1.1 7.2 7.2 0 0 0 4.8 10.2.9.9 0 0 1 .4 1.5A9.2 9.2 0 1 1 13.6 2.3a.9.9 0 0 1 1.6.3Z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9l6 6 6-6"
      />
    </svg>
  );
}
