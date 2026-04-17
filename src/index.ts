import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as yup from 'yup';
import * as fs from 'fs';
import * as path from 'path';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ════════════════════════════════════════
// sendContactEmail
// ════════════════════════════════════════
const contactSchema = yup.object({
  name:    yup.string().min(2).max(120).required(),
  email:   yup.string().email().required(),
  subject: yup.string().max(200).optional(),
  message: yup.string().min(5).max(5000).required(),
});

export const sendContactEmail = functions.https.onCall(async (data) => {
  const payload = await contactSchema.validate(data).catch(() => null);
  if (!payload) throw new functions.https.HttpsError('invalid-argument', 'Bad payload');

  await db.collection('mail').add({
    to: ['hub.qirim@gmail.com'],
    replyTo: payload.email,
    message: {
      subject: `[Contact] ${payload.name}: ${payload.email}${payload.subject ? ' — ' + payload.subject : ''}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject || '-'}\n\n${payload.message}`,
      html: `
        <h3>New contact message</h3>
        <p><b>Name:</b> ${payload.name}</p>
        <p><b>Email:</b> ${payload.email}</p>
        ${payload.subject ? `<p><b>Subject:</b> ${payload.subject}</p>` : ''}
        <p><b>Message:</b><br/>${String(payload.message).replace(/\n/g, '<br/>')}</p>
      `,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection('contactMessages').add({
    ...payload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { ok: true };
});

// ════════════════════════════════════════
// ogEvents — OG meta for crawlers
// ════════════════════════════════════════
const SITE_URL = 'https://qirimhub.com';

const BOTS = /facebookexternalhit|facebot|twitterbot|slackbot|linkedinbot|telegrambot|whatsapp|whatsappbot|discord|googlebot|bingbot|applebot|pinterest|vkshare|ia_archiver/i;

type L10n = string | { ua?: string; en?: string };

function pick(v: L10n | undefined, lang: 'ua' | 'en'): string {
  if (!v) return '';
  return typeof v === 'string' ? v : (v[lang] ?? v.ua ?? v.en ?? '');
}

const strip = (h = '') => h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const esc = (s: string) => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' } as any)[c]
);

// Читаем index.html из dist (деплоится вместе с функцией)
function getIndexHtml(): string {
  try {
    const p = path.join(__dirname, '..', 'dist-index.html');
    return fs.readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

// Вставляем OG теги в <head> существующего index.html
function injectOgTags(html: string, tags: string): string {
  if (!html) return tags;
  return html.replace('</head>', `${tags}\n</head>`);
}

function makeOgTags({ url, title, desc, image, published }: {
  url: string; title: string; desc: string; image: string; published?: string;
}): string {
  const T   = esc(title);
  const D   = esc(desc);
  const IMG = image
    ? `<meta property="og:image"        content="${esc(image)}"/>
  <meta property="og:image:width"  content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:image"       content="${esc(image)}"/>`
    : '';

  return `
  <!-- OG injected by ogEvents -->
  <title>${T}</title>
  <meta property="og:type"        content="article"/>
  <meta property="og:site_name"   content="Q-hub"/>
  <meta property="og:url"         content="${esc(url)}"/>
  <meta property="og:title"       content="${T}"/>
  <meta property="og:description" content="${D}"/>
  <meta property="og:locale"      content="uk_UA"/>
  <meta name="description"        content="${D}"/>
  ${IMG}
  ${published ? `<meta property="article:published_time" content="${esc(published)}"/>` : ''}
  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${T}"/>
  <meta name="twitter:description" content="${D}"/>`;
}

export const ogEvents = functions.https.onRequest(async (req, res) => {
  try {
    const ua = req.get('user-agent') || '';

    const parts = req.path.replace(/^\//, '').split('/');
    const kind  = parts[0] as 'events' | 'projects';
    const id    = parts[1];

    if (!id || !['events', 'projects'].includes(kind)) {
      res.redirect(302, SITE_URL);
      return;
    }

    const canonicalUrl = `${SITE_URL}/${kind}/${id}`;

    // ── Обычный браузер — отдаём index.html с OG тегами ──
    // Это работает для браузеров И для краулеров
    const lang: 'ua' | 'en' = (req.get('accept-language') || '')
      .toLowerCase().startsWith('en') ? 'en' : 'ua';

    const col  = kind === 'events' ? 'news' : 'projects';
    const snap = await db.collection(col).doc(id).get();

    if (!snap.exists) {
      // Документ не найден — отдаём обычный index.html
      const html = getIndexHtml();
      if (html) {
        res.status(200).type('html').send(html);
      } else {
        res.redirect(302, canonicalUrl);
      }
      return;
    }

    const doc = snap.data() as any;

    const title     = pick(doc.title, lang) || 'Q-hub';
    const rawDesc   = doc.excerpt ?? doc.descriptionHtml ?? '';
    const desc      = strip(pick(rawDesc, lang)).slice(0, 240);
    const image     = doc.image || '';
    const published = typeof doc.dateYMD === 'string' ? doc.dateYMD : undefined;

    const ogTags = makeOgTags({ url: canonicalUrl, title, desc, image, published });

    // Пробуем взять index.html и вставить OG теги
    const baseHtml = getIndexHtml();

    if (baseHtml) {
      const finalHtml = injectOgTags(baseHtml, ogTags);
      res.set('Cache-Control', BOTS.test(ua)
        ? 'public, max-age=300, s-maxage=600'
        : 'no-cache, no-store'
      );
      res.status(200).type('html').send(finalHtml);
    } else {
      // Fallback — минимальный HTML с OG и редиректом
      res.status(200).type('html').send(`<!doctype html>
<html lang="uk"><head>
<meta charset="utf-8"/>
${ogTags}
<meta http-equiv="refresh" content="0; url=${esc(canonicalUrl)}"/>
</head><body><script>window.location.replace("${esc(canonicalUrl)}")</script></body></html>`);
    }

  } catch (e) {
    console.error('ogEvents error:', e);
    res.status(500).send('Server error');
  }
});
