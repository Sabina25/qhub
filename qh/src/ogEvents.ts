import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const SITE_NAME    = 'Q-hub';
const PUBLIC_ORIGIN = 'https://qirimhub.com';
const FALLBACK_ORIGIN = 'https://github-b91ab.web.app';
const DEFAULT_OG_IMAGE = `${PUBLIC_ORIGIN}/og-default.jpg`;

const BOT_REGEX = /(bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp|discord|vkshare)/i;

type Lang = 'ua' | 'en';
type L10nText = string | { ua?: string; en?: string };
type NewsDoc = {
  title?: L10nText;
  excerpt?: L10nText;
  descriptionHtml?: L10nText;
  image?: string;
  dateYMD?: string;
};

function pickL10n(val: L10nText | undefined, lang: Lang = 'ua'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[lang] ?? val.ua ?? val.en ?? '';
}
function stripHtml(html = '') { return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function truncate(s: string, n = 200) { return s.length <= n ? s : s.slice(0, n - 1) + '…'; }
function absUrl(u?: string) {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `${PUBLIC_ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`;
}
function escHtml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function ensureMedia(url: string) {
  const isStorage = /firebasestorage\.(googleapis\.com|app)\/v0\/b\/.+\/o\//i.test(url);
  if (!isStorage) return url;
  if (/[?&]alt=media/i.test(url)) return url;
  return url + (url.includes('?') ? '&' : '?') + 'alt=media';
}

export const ogEvents = functions.https.onRequest(async (req, res) => {
  console.error('[ogEvents] path=' + req.path + ' ua=' + req.get('user-agent'));
  try {
    const ua     = String(req.get('user-agent') || '');
    const isBot  = BOT_REGEX.test(ua);
    const path   = req.path || '/';

    // Парсимо /events/:id або /projects/:id
    const m        = path.match(/^\/(events|projects)\/([^/?#]+)/);
    const pathType = m?.[1] as 'events' | 'projects' | undefined;
    const id       = m?.[2];

    console.error(`[ogEvents] isBot=${isBot} pathType=${pathType} id=${id}`);

    if (!pathType || !id) {
      res.redirect(302, FALLBACK_ORIGIN);
      return;
    }

    const canonicalUrl = `${PUBLIC_ORIGIN}/${pathType}/${id}`;

    // Визначаємо мову з query або accept-language
    const qlang = req.query?.lang as string | undefined;
    const lang: Lang = (qlang === 'en' || (req.get('accept-language') || '').toLowerCase().startsWith('en'))
      ? 'en' : 'ua';

    // Шукаємо документ
    const col  = pathType === 'events' ? 'news' : 'projects';
    const snap = await db.collection(col).doc(id).get();

    console.error(`[ogEvents] col=${col} exists=${snap.exists}`);

    if (!snap.exists) {
      // Спробуємо в news якщо projects не знайшло
      if (col === 'projects') {
        const snap2 = await db.collection('news').doc(id).get();
        if (snap2.exists) {
          const doc2 = snap2.data() as NewsDoc;
          return sendOgHtml(res, doc2, id, 'events', lang, canonicalUrl);
        }
      }
      res.redirect(302, canonicalUrl);
      return;
    }

    const doc = snap.data() as NewsDoc;
    return sendOgHtml(res, doc, id, pathType, lang, canonicalUrl);

  } catch (e) {
    console.error('[ogEvents] ERROR:', e);
    res.status(500).send('Internal error');
  }
});

function sendOgHtml(
  res: functions.Response,
  doc: NewsDoc,
  id: string,
  pathType: string,
  lang: Lang,
  canonicalUrl: string
) {
  const title       = pickL10n(doc.title, lang) || SITE_NAME;
  const rawDesc     = doc.excerpt ?? doc.descriptionHtml ?? '';
  const description = truncate(stripHtml(pickL10n(rawDesc, lang)), 200) || SITE_NAME;
  const rawImage    = absUrl(doc.image) || DEFAULT_OG_IMAGE;
  const imageUrl    = ensureMedia(rawImage);
  const version     = (doc as any)?.updatedAtTs || doc.dateYMD || Date.now();
  const imgWithVer  = imageUrl + (imageUrl.includes('?') ? '&' : '?') + `v=${version}`;

  const T = escHtml(title);
  const D = escHtml(description);
  const I = escHtml(imgWithVer);
  const U = escHtml(canonicalUrl);

  console.error(`[ogEvents] Sending OG: title="${title}" image="${rawImage}"`);

  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.status(200).type('html').send(`<!doctype html>
<html lang="${lang === 'ua' ? 'uk' : 'en'}">
<head>
  <meta charset="utf-8"/>
  <title>${T}</title>
  <meta property="og:type"               content="article"/>
  <meta property="og:site_name"          content="${SITE_NAME}"/>
  <meta property="og:locale"             content="${lang === 'ua' ? 'uk_UA' : 'en_US'}"/>
  <meta property="og:title"              content="${T}"/>
  <meta property="og:description"        content="${D}"/>
  <meta property="og:image"              content="${I}"/>
  <meta property="og:image:secure_url"   content="${I}"/>
  <meta property="og:image:width"        content="1200"/>
  <meta property="og:image:height"       content="630"/>
  <meta property="og:url"                content="${U}"/>
  <meta name="twitter:card"              content="summary_large_image"/>
  <meta name="twitter:title"             content="${T}"/>
  <meta name="twitter:description"       content="${D}"/>
  <meta name="twitter:image"             content="${I}"/>
  <link rel="canonical"                  href="${U}"/>
</head>
<body><p><a href="${U}">${T}</a></p></body>
</html>`);
}
// force redeploy Sat Apr 18 19:21:19 EDT 2026
