import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as yup from 'yup';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const schema = yup.object({
  name: yup.string().min(2).max(120).required(),
  email: yup.string().email().required(),
  subject: yup.string().max(200).optional(),
  message: yup.string().min(5).max(5000).required(),
});

export const sendContactEmail = functions.https.onCall(async (data, context) => {
  // (опционально) требуем App Check
  // if (!context.app) throw new functions.https.HttpsError('failed-precondition','AppCheck required');

  const payload = await schema.validate(data).catch(() => null);
  if (!payload) throw new functions.https.HttpsError('invalid-argument','Bad payload');

  // Doc для расширения Trigger Email
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
        <p><b>Message:</b><br/>${String(payload.message).replace(/\n/g,'<br/>')}</p>
      `,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // (опционально) лог
  await db.collection('contactMessages').add({
    ...payload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ip: (context.rawRequest?.headers['x-forwarded-for'] as string) || '',
  });

  return { ok: true };
});


admin.initializeApp();
const db = admin.firestore();

type L10n<T=string> = T | { ua?: T; en?: T };

const BOTS = /facebookexternalhit|twitterbot|slackbot|linkedinbot|telegram|whatsapp|discord|googlebot/i;

function pick(v: L10n<string>|undefined, lang:'ua'|'en') {
  if (!v) return '';
  return typeof v === 'string' ? v : (v[lang] ?? v.ua ?? v.en ?? '');
}
const strip = (h='') => h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const esc = (s:string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'} as any)[c]);

function abs(req: functions.https.Request, url?: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const host = req.get('x-forwarded-host') || req.get('host');
  return `https://${host}${url.startsWith('/') ? url : '/'+url}`;
}

function html({url,title,desc,image,published}:{url:string;title:string;desc:string;image:string;published?:string}) {
  const T = esc(title || 'Q-hub');
  const D = esc(desc || '');
  const IMG = image ? `<meta property="og:image" content="${esc(image)}">
<meta property="og:image:alt" content="${T}">` : '';
  return `<!doctype html><html lang="uk"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${T}</title><link rel="canonical" href="${esc(url)}"/>
<meta property="og:type" content="article"><meta property="og:site_name" content="Q-hub">
<meta property="og:url" content="${esc(url)}"><meta property="og:title" content="${T}">
<meta property="og:description" content="${D}">${IMG}
${published ? `<meta property="article:published_time" content="${esc(published)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${T}"><meta name="twitter:description" content="${D}">
${image ? `<meta name="twitter:image" content="${esc(image)}">` : ''}
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/assets/app.css">
</head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`;
}

async function readDoc(kind:'events'|'projects', id:string) {
  const col = kind === 'events' ? 'news' : 'projects';
  const snap = await db.collection(col).doc(id).get();
  return snap.exists ? { id, ...(snap.data() as any) } : null;
}

export const ogRenderer = functions.https.onRequest(async (req, res) => {
  try {
    const ua = req.get('user-agent') || '';
    const parts = req.path.split('/'); // ['', 'og-test', 'events', ':id']
    const kind = parts[2] as 'events'|'projects';
    const id = parts[3];

    if (!id || !['events','projects'].includes(kind)) return res.status(404).send('Not found');

    const lang: 'ua'|'en' = (req.get('accept-language')||'').toLowerCase().startsWith('en') ? 'en' : 'ua';
    const url = `https://${req.get('x-forwarded-host') || req.get('host')}${req.originalUrl}`;

    const doc = await readDoc(kind, id);
    if (!doc) return res.status(404).send('Not found');

    const title = pick(doc.title, lang) || 'Q-hub';
    const raw   = doc.excerpt ?? doc.descriptionHtml ?? '';
    const desc  = strip(pick(raw, lang)).slice(0, 240);
    const image = abs(req, doc.image);
    const published = typeof doc.dateYMD === 'string' ? doc.dateYMD : undefined;

    const page = html({ url, title, desc, image, published });
    res.set('Cache-Control', BOTS.test(ua) ? 'public, max-age=300' : 'private, max-age=0');
    res.status(200).send(page);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});
