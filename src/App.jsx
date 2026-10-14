import { ChatWidget } from './components/chat/ChatWidget.jsx';

export default function App() {
  return (
    <>
      <header className="site-header">
        <a className="site-logo" href="#top">
          Ромашка — цветы
        </a>
        <nav className="site-nav" aria-label="Разделы страницы">
          <a href="#product">Продукт</a>
          <a href="#how">Как это работает</a>
          <a href="#plans">Пакеты</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Консультант по цветам</p>
          <h1>Подберите оттенки букета в чате с Мирой</h1>
          <p className="lead">
            Мира отвечает только на вопросы про цвета и оформление. По доставке, ценам и заказу —
            звоните в магазин, номер подскажет в чате.
          </p>
          <p className="hero-note">Откройте кнопку справа внизу и спросите, например, про сочетание розового и персикового.</p>
        </section>

        <section id="product" className="section">
          <h2>Что видит посетитель</h2>
          <div className="cards">
            <article className="card">
              <h3>Кнопка на виду</h3>
              <p>Круглый запуск в правом нижнем углу. Если ответ пришёл при закрытой панели, на кнопке появляется счётчик.</p>
            </article>
            <article className="card">
              <h3>Окно как у Jivo</h3>
              <p>Шапка с именем и статусом «В сети», лента сообщений, быстрые темы и поле ввода.</p>
            </article>
            <article className="card">
              <h3>Светлая и тёмная тема</h3>
              <p>Переключатель в шапке чата. Выбор сохраняется и не сбрасывается после обновления страницы.</p>
            </article>
          </div>
        </section>

        <section id="how" className="section section--muted">
          <h2>Как проходит диалог</h2>
          <ol className="steps">
            <li>Посетитель открывает виджет и видит уже начатую переписку.</li>
            <li>Можно выбрать быстрый ответ или написать свой вопрос. Enter отправляет, Shift+Enter переносит строку.</li>
            <li>Агент ненадолго «печатает», затем приходит ответ по ключевым словам: цены, сроки, интеграции, поддержка.</li>
          </ol>
        </section>

        <section id="plans" className="section">
          <h2>Пакеты для демо</h2>
          <div className="cards">
            <article className="card">
              <h3>Старт</h3>
              <p>Виджет, история и сценарии без сервера. Подходит, чтобы согласовать тексты и тон.</p>
            </article>
            <article className="card">
              <h3>Рабочий</h3>
              <p>Тот же интерфейс, но ответы приходят из API. Формат сообщения уже совпадает с будущим контрактом.</p>
            </article>
            <article className="card">
              <h3>Корпоративный</h3>
              <p>Свой стиль, база знаний и приоритет в поддержке. Экран готов, подключение — отдельным шагом.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Северная студия · демо виджета чата. Данные вымышленные.</p>
      </footer>

      <ChatWidget />
    </>
  );
}
