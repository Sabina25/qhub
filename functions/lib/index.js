"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogEvents = exports.sendContactEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const yup = __importStar(require("yup"));
if (!admin.apps.length)
    admin.initializeApp();
const db = admin.firestore();
// ════════════════════════════════════════
// sendContactEmail
// ════════════════════════════════════════
const contactSchema = yup.object({
    name: yup.string().min(2).max(120).required(),
    email: yup.string().email().required(),
    subject: yup.string().max(200).optional(),
    message: yup.string().min(5).max(5000).required(),
});
exports.sendContactEmail = functions.https.onCall(async (data) => {
    const payload = await contactSchema.validate(data).catch(() => null);
    if (!payload)
        throw new functions.https.HttpsError('invalid-argument', 'Bad payload');
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
function pick(v, lang) {
    if (!v)
        return '';
    return typeof v === 'string' ? v : (v[lang] ?? v.ua ?? v.en ?? '');
}
const strip = (h = '') => h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
function makeOgTags({ url, title, desc, image, published }) {
    const T = esc(title);
    const D = esc(desc);
    const IMG = image
        ? `<meta property="og:image"        content="${esc(image)}"/>
  <meta property="og:image:width"  content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:image"       content="${esc(image)}"/>`
        : '';
    return `
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
exports.ogEvents = functions.https.onRequest(async (req, res) => {
    try {
        const ua = req.get('user-agent') || '';
        console.log("PATH:", req.path, "UA:", req.get("user-agent"));
        const parts = req.path.replace(/^\//, '').split('/');
        const kind = parts[0];
        const id = parts[1];
        if (!id || !['events', 'projects'].includes(kind)) {
            res.redirect(302, SITE_URL);
            return;
        }
        const canonicalUrl = `${SITE_URL}/${kind}/${id}`;
        // ── Обычный браузер — отдаём минимальный shell, React подхватит ──
        // ── Обычный браузер — отдаём реальный index.html ──
        if (!BOTS.test(ua)) {
            const response = await fetch(`https://github-b91ab.web.app/index.html`);
            const html = await response.text();
            res.set('Cache-Control', 'no-store');
            res.status(200).type('html').send(html);
            return;
        }
        // ── Бот — читаем Firestore и отдаём OG теги ──
        const lang = (req.get('accept-language') || '')
            .toLowerCase().startsWith('en') ? 'en' : 'ua';
        const col = kind === 'events' ? 'news' : 'projects';
        const snap = await db.collection(col).doc(id).get();
        if (!snap.exists) {
            res.status(404).type('html').send(`<!doctype html><html><head><meta charset="utf-8"/><title>Q-hub</title></head><body></body></html>`);
            return;
        }
        const doc = snap.data();
        const title = pick(doc.title, lang) || 'Q-hub';
        const rawDesc = doc.excerpt ?? doc.descriptionHtml ?? '';
        const desc = strip(pick(rawDesc, lang)).slice(0, 240);
        const image = doc.image || '';
        const published = typeof doc.dateYMD === 'string' ? doc.dateYMD : undefined;
        const ogTags = makeOgTags({ url: canonicalUrl, title, desc, image, published });
        const T = esc(title);
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.status(200).type('html').send(`<!doctype html>
<html lang="uk"><head>
<meta charset="utf-8"/>
${ogTags}
</head>
<body>
<h1>${T}</h1>
<a href="${esc(canonicalUrl)}">${esc(canonicalUrl)}</a>
</body></html>`);
    }
    catch (e) {
        console.error('ogEvents error:', e);
        res.status(500).send('Server error');
    }
});
