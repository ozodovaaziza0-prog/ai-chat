import { flowerShop } from '../../config/flowerShop.js';

export function getOffTopicReply() {
  return `Этот вопрос лучше решить в нашем цветочном магазине. Позвоните по номеру ${flowerShop.phoneDisplay} — коллеги подскажут.`;
}

const COLOR_HINT =
  /цвет|окрас|оттен|палитр|тон\b|нюанс|сочетан|контраст|пастел|ярк|тёмн|светл|красн|алый|бордов|розов|пудров|оранж|персик|жёлт|золот|зелён|изумруд|син|голуб|бирюз|фиолет|сирен|лаванд|бел|крем|беж|коричн|терракот|сер|чёрн|монохром|градиент|rgb|hex/i;

export function isColorRelatedQuestion(text) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;
  if (/^(привет|здравств|добрый|hi|hello)\b/.test(normalized)) return true;
  return COLOR_HINT.test(normalized);
}
