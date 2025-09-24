import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const SITE_NAME = 'Q-hub';
const OG_LOCALE = 'uk_UA';


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

function ensureDirectImage(url: string): string {
  const isStorage = /\/\/(firebasestorage\.googleapis\.com|firebasestorage\.app)\/v0\/b\/.+\/o\//i.test(url);
  if (!isStorage) return url;
  if (/[?&]alt=media\b/i.test(url)) return url;
  return url + (url.includes('?') ? '&' : '?') + 'alt=media';
}



export const ogEvents = functions.https.onRequest(async (req, res) => {
  try {
    const ua = String(req.get('user-agent') || '');
    const isBot = BOT_REGEX.test(ua);


    const rawUrl = (req as any).originalUrl || req.url || req.path || '';
    const m = rawUrl.match(/\/(events|projects)\/([^/?#]+)/);
    type PathType = 'events' | 'projects' | 'news';
    const pathType = (m?.[1] || '') as PathType;
    const id = m?.[2] || '';

    // язык из ?lang=
    const urlObj = new URL(PUBLIC_ORIGIN + rawUrl);
    const qlang = urlObj.searchParams.get('lang');
    const lang: Lang = qlang === 'en' ? 'en' : 'ua';


    if (!id || !pathType) {
      const idx = await fetch(FALLBACK_INDEX);
      return res.status(200).set('Cache-Control', 'public, max-age=60').send(await idx.text());
    }


      const tryCols = [pathType, ...['news','events','projects'].filter(c => c !== pathType)];


      let data: NewsDoc | null = null;
      let foundIn: string | null = null;

      for (const col of tryCols) {
  
      const snap = await db.collection(col).doc(id).get();
      if (snap.exists) {
        data = snap.data() as NewsDoc;
        foundIn = col;
        break;
      }

     
      if (col === 'projects') {
        const q = await db.collection(col).where('slug', '==', id).limit(1).get();
        if (!q.empty) {
          data = q.docs[0].data() as NewsDoc;
          foundIn = col;
          break;
        }
      }
      }
    if (isBot && data) {
      const title = pickL10n(data.title, lang) || SITE_NAME;
      const rawExcerpt = pickL10n(data.excerpt, lang);
      const description = truncate(stripHtml(rawExcerpt || ''), 200) || SITE_NAME;
    
      const baseImageRaw = absUrl(data.image) || DEFAULT_OG_IMAGE;
      const baseImage = absUrl(data.image) || DEFAULT_OG_IMAGE;
      const version = (data as any)?.updatedAtTs || (data as any)?.dateYMD || Date.now();
      const imageUrl = baseImage.includes('?') ? `${baseImage}&v=${version}` : `${baseImage}?v=${version}`;
    
      const url = `${PUBLIC_ORIGIN}/${pathType}/${id}`; 

      const html = `<!doctype html>
<html lang="${lang === 'ua' ? 'uk' : 'en'}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="${lang === 'ua' ? 'uk_UA' : 'en_US'}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index,follow" />
</head>
<body><noscript><p><a href="${url}">Open</a></p></noscript></body>
</html>`;
      return res.status(200).set({'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=300'}).send(html);
    }

    const idx = await fetch(FALLBACK_INDEX);
    return res.status(200).set('Cache-Control', 'private, no-cache').send(await idx.text());
  } catch (e) {
    console.error(e);
    return res.status(500).send('Internal error');
  }
});

