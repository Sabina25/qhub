import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as yup from 'yup';

// ── Инициализация — только один раз ──
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ════════════════════════════════
// sendContactEmail
// ════════════════════════════════
const schema = yup.object({
  name:    yup.string().min(2).max(120).required(),
  email:   yup.string().email().required(),
  subject: yup.string().max(200).optional(),
  message: yup.string().min(5).max(5000).required(),
});

export const sendContactEmail = functions.https.onCall(async (data) => {
  const payload = await schema.validate(data).catch(() => null);
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

// ════════════════════════════════
// ogEvents — OG мета для краулеров
// ════════════════════════════════
type L10n = string | { ua?: string; en?: string };

const BOTS = /facebookexternalhit|twitterbot|slackbot|linkedinbot|telegrambot|whatsapp|discord|googlebot|bingbot|applebot|pinterest/i;

function pick(v: L10n | undefined, lang: 'ua' | 'en'): string {
  if (!v) return '';
  return typeof v === 'string' ? v : (v[lang] ?? v.ua ?? v.en ?? '');
}
const strip = (h = '') => h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const esc   = (s: string) => s.replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' } as any)[c]
);

function makeHtml({ url, title, desc, image, published }: {
  url: string; title: string; desc: string; image: string; published?: string;
}) {
  const T   = esc(title || 'Q-hub');
  const D   = esc(desc || '');
  const IMG = image
    ? `<meta property="og:image" content="${esc(image)}">
       <meta property="og:image:width" content="1200">
       <meta property="og:image:height" content="630">
       <meta name="twitter:image" content="${esc(image)}">`
    : '';
  return `<!doctype html><html lang="uk"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${T}</title>
<link rel="canonical" href="${esc(url)}"/>
<meta property="og:type"        content="article"/>
<meta property="og:site_name"   content="Q-hub"/>
<meta property="og:url"         content="${esc(url)}"/>
<meta property="og:title"       content="${T}"/>
<meta property="og:description" content="${D}"/>
${IMG}
${published ? `<meta property="article:published_time" content="${esc(published)}"/>` : ''}
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${T}"/>
<meta name="twitter:description" content="${D}"/>
<link rel="icon" href="/favicon.ico"/>
</head>
<body>
  <h1>${T}</h1>
  <p>${D}</p>
  ${image ? `<img src="${esc(image)}" alt="${T}" style="max-width:600px"/>` : ''}
</body></html>`;
}

export const ogEvents = functions.https.onRequest(async (req, res) => {
  try {
    const ua = req.get('user-agent') || '';

    // Обычный браузер — отдаём index.html (Firebase Hosting подхватит)
    if (!BOTS.test(ua)) {
      res.set('Cache-Control', 'no-cache');
      // Возвращаем базовый HTML — браузер загрузит React приложение
      res.redirect(302, req.path);
      return;
    }

    // Краулер — разбираем путь: /events/:id или /projects/:id
    const parts = req.path.replace(/^\//, '').split('/');
    const kind  = parts[0] as 'events' | 'projects';
    const id    = parts[1];

    if (!id || !['events', 'projects'].includes(kind)) {
      res.status(404).send('Not found');
      return;
    }

    const lang: 'ua' | 'en' = (req.get('accept-language') || '').toLowerCase().startsWith('en') ? 'en' : 'ua';

    // Читаем документ из Firestore
    const col  = kind === 'events' ? 'news' : 'projects';
    const snap = await db.collection(col).doc(id).get();

    if (!snap.exists) {
      res.status(404).send('Not found');
      return;
    }

    const doc = snap.data() as any;

    const title     = pick(doc.title, lang) || 'Q-hub';
    const rawDesc   = doc.excerpt ?? doc.descriptionHtml ?? '';
    const desc      = strip(pick(rawDesc, lang)).slice(0, 240);
    const image     = doc.image || '';
    const published = typeof doc.dateYMD === 'string' ? doc.dateYMD : undefined;
    const url       = `https://${req.get('x-forwarded-host') || req.get('host')}/${kind}/${id}`;

    const page = makeHtml({ url, title, desc, image, published });

    res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.status(200).type('html').send(page);

  } catch (e) {
    console.error('ogEvents error:', e);
    res.status(500).send('Server error');
  }
});
