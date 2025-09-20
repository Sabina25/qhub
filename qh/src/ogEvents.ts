// qh/src/ogEvents.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';



if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const BOT_REGEX =
  /(bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp|discord|vkshare|google-structured-data-testing-tool)/i;

const PUBLIC_ORIGIN = 'https://qirimhub.com';
const FALLBACK_INDEX = 'https://qirimhub.com/index.html';

const DEFAULT_OG_IMAGE = `${PUBLIC_ORIGIN}/og-default.jpg`;

// --- types ---
type Lang = 'ua' | 'en';
type L10nText = string | { ua?: string; en?: string };

type NewsDoc = {
  title?: L10nText;
  excerpt?: L10nText;
  image?: string;
  dateYMD?: string;
  categoryKey?: string;
};

function pickL10n(val: L10nText | undefined, lang: Lang = 'ua'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[lang] ?? val.ua ?? val.en ?? '';
}

function stripHtml(html = ''): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function truncate(s: string, n = 200): string {
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}
function absUrl(u?: string): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return `${PUBLIC_ORIGIN}${u}`;
  return `${PUBLIC_ORIGIN}/${u}`;
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
}

// ... те же импорты и хелперы, как у тебя сейчас ...

export const ogEvents = functions.https.onRequest(async (req, res) => {
    try {
      const ua = String(req.get('user-agent') || '');
      const isBot = BOT_REGEX.test(ua);
  
      // Надёжнее: парсим из originalUrl|url|path
      const rawUrl = (req as any).originalUrl || req.url || req.path || '';
      const m = rawUrl.match(/\/events\/([^/?#]+)/);
      const id = m?.[1] || '';
      
  
      console.log('[ogEvents] ua=', ua, 'isBot=', isBot, 'rawUrl=', rawUrl, 'id=', id);
  
      if (!id) {
        const idx = await fetch(FALLBACK_INDEX);
        const html = await idx.text();
        res.status(200).set('Cache-Control', 'public, max-age=60').send(html);
        return;
      }
  
      // Пытаемся найти и в news, и в events
      const tryCols = ['news', 'events'];
      let data: NewsDoc | null = null;
      let foundIn: string | null = null;
  
      for (const col of tryCols) {
        const snap = await db.collection(col).doc(id).get();
        if (snap.exists) {
          data = snap.data() as NewsDoc;
          foundIn = col;
          break;
        }
      }
  
      console.log('[ogEvents] foundIn=', foundIn, 'hasData=', !!data);
  
      if (isBot && data) {
        const title = pickL10n(data.title, 'ua') || 'Q-hub';
        const rawExcerpt = pickL10n(data.excerpt, 'ua');
        const description = truncate(stripHtml(rawExcerpt || ''), 200) || 'Q-hub';
        const image = absUrl(data.image) || DEFAULT_OG_IMAGE;
        const url = `${PUBLIC_ORIGIN}/events/${id}`;
  
        const html = `<!doctype html>
  <html lang="uk">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index,follow" />
  </head>
  <body><noscript><p><a href="${url}">Open</a></p></noscript></body>
  </html>`;
        res.status(200).set({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
        }).send(html);
        return;
      }
  
      // не бот или не нашли документ — отдать SPA
      const idx = await fetch(FALLBACK_INDEX);
      const html = await idx.text();
      res.status(200).set('Cache-Control', 'private, no-cache').send(html);
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal error');
    }
  });
  