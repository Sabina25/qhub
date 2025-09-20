import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// простая проверка на бота
const BOT_REGEX = /(bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp|discord|vkshare|google-structured-data-testing-tool)/i;

// подставь свой публичный домен
const PUBLIC_ORIGIN = 'https://qirimhub.com';          // кастомный домен
const FALLBACK_INDEX = 'https://qirimhub.com/index.html'; // можно и web.app если так надёжнее

type NewsDoc = {
  title?: any;                // {ua,en} | string
  excerpt?: any;              // {ua,en} | string | HTML
  image?: string;
  dateYMD?: string;
  categoryKey?: string;
};

function pickL10n(val: any, lang: 'ua'|'en' = 'ua'): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function stripHtml(html = ''): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(s: string, n = 180): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
}

function absUrl(u?: string): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return `${PUBLIC_ORIGIN}${u}`;
  return `${PUBLIC_ORIGIN}/${u}`;
}

export const ogEvents = functions.https.onRequest(async (req, res) => {
  try {
    // ожидаем /events/:id
    const m = req.path.match(/\/events\/([^/?#]+)/);
    const id = m?.[1];
    const ua = String(req.get('user-agent') || '');
    const isBot = BOT_REGEX.test(ua);

    if (!id) {
      // если нет id — отдадим индекс
      const idx = await fetch(FALLBACK_INDEX);
      const html = await idx.text();
      res.status(200).set('Cache-Control', 'public, max-age=60').send(html);
      return;
    }

    // тянем новость/событие из Firestore (подставь свой путь)
    const snap = await db.collection('news').doc(id).get(); // если у тебя коллекция другая — поправь
    const data = snap.exists ? (snap.data() as NewsDoc) : null;

    if (isBot && data) {
      const title = pickL10n(data.title, 'ua') || 'Q-hub';
      const rawExcerpt = pickL10n(data.excerpt, 'ua');
      const description = truncate(stripHtml(rawExcerpt || ''), 200) || 'Q-hub';
      const image = absUrl(data.image) || `${PUBLIC_ORIGIN}/og-default.jpg`;
      const url = `${PUBLIC_ORIGIN}/events/${id}`;

      const html = `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${image}" />

  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index,follow" />
</head>
<body>
  <!-- Людям можно показать кнопку, но боты до head уже всё забрали -->
  <noscript><p><a href="${url}">Open</a></p></noscript>
</body>
</html>`;
      res.status(200).set({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      }).send(html);
      return;
    }

    // не бот (или не нашли данные) — отдать обычный index.html, чтобы SPA открылось
    const idx = await fetch(FALLBACK_INDEX);
    const html = await idx.text();
    res.status(200).set('Cache-Control', 'private, max-age=0, no-cache').send(html);

  } catch (e) {
    console.error(e);
    res.status(500).send('Internal error');
  }
});

// простая экранизация для <meta content="">
function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
