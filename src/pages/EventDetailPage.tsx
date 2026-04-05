import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Share2, Copy as CopyIcon, Check as CheckIcon, ArrowLeft, Calendar, Tag } from 'lucide-react';

import { useTranslation } from '../context/TranslationContext';
import Footer from '../components/Footer';
import Header from '../components/header/Header';
import ParallaxBanner from '../components/ParallaxBannerProps.tsx';
import RelatedNews from '../components/RelatedNews';

import { fetchNewsById, NewsItem } from '../data/news';
import { toDateString } from '../utils/dates';
import { buildShareUrl } from '../utils/share';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)', faint: 'rgba(200,230,230,0.38)' };

function sanitizeAndEnhance(html: string): string {
  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] });
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href))
      a.setAttribute('href', 'https://' + href);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.style.color = Q.teal;
    a.style.textDecoration = 'underline';
    a.style.setProperty('text-underline-offset', '3px');
    a.style.setProperty('text-decoration-thickness', '1px');
  });
  return doc.body.innerHTML;
}

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [justShared, setJustShared] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try { setItem(await fetchNewsById(id, lang)); }
      finally { setLoading(false); }
    })();
  }, [id, lang]);

  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const prettyDate = useMemo(() => {
    const ymd =
      (item && typeof (item as any).dateYMD === 'string' && (item as any).dateYMD) ||
      (item && toDateString((item as any).dateTs || (item as any).date)) || '';
    if (!ymd) return '';
    return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(ymd));
  }, [item, locale]);

  const sanitizedHtml = useMemo(() => sanitizeAndEnhance(item?.excerpt || ''), [item?.excerpt]);
  const shareUrl = useMemo(() => buildShareUrl(`/events/${id}`, { lang }), [id, lang]);

  const showCopied = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink = () => navigator.clipboard.writeText(shareUrl).then(showCopied).catch(showCopied);
  const webShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: item?.title || 'Q-hub', url: shareUrl }); setJustShared(true); setTimeout(() => setJustShared(false), 2000); }
      catch {/* ignore */}
    } else copyLink();
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${Q.teal}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: Q.faint, fontSize: 14 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* ── Not found ── */
  if (!item) return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: Q.muted, fontSize: 16 }}>News not found</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero image */}
      {item.image && <ParallaxBanner image={item.image} height="75vh" />}

      <main style={{ flex: 1, maxWidth: 820, width: '100%', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back link */}
        <Link
          to="/events"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.teal, textDecoration: 'none', marginBottom: 32, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#7dd8d8')}
          onMouseLeave={e => (e.currentTarget.style.color = Q.teal)}
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
          {t('news.back') || 'Back to News'}
        </Link>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          {prettyDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.faint }}>
              <Calendar style={{ width: 14, height: 14 }} />
              {prettyDate}
            </div>
          )}
          {item.category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.faint }}>
              <Tag style={{ width: 14, height: 14 }} />
              {item.category}
            </div>
          )}
          {item.featured && (
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700, background: '#f97316', color: '#fff' }}>
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-raleway" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 700, color: Q.text, lineHeight: 1.25, marginBottom: 24 }}>
          {item.title}
        </h1>

        {/* Teal accent line */}
        <div style={{ width: 48, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, marginBottom: 32 }} />

        {/* Share buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <button
            onClick={webShare}
            title={lang === 'ua' ? 'Поділитись' : 'Share'}
            style={{
              width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: justShared ? 'rgba(77,184,184,0.2)' : 'rgba(77,184,184,0.1)',
              border: `0.5px solid rgba(77,184,184,${justShared ? '0.5' : '0.3'})`,
              color: Q.teal, cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.1)')}
          >
            <Share2 style={{ width: 16, height: 16 }} />
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={copyLink}
              title={lang === 'ua' ? 'Скопіювати посилання' : 'Copy link'}
              style={{
                width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: copied ? 'rgba(77,184,184,0.15)' : 'rgba(255,255,255,0.05)',
                border: `0.5px solid rgba(77,184,184,${copied ? '0.4' : '0.2'})`,
                color: copied ? Q.teal : Q.faint, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {copied ? <CheckIcon style={{ width: 16, height: 16 }} /> : <CopyIcon style={{ width: 16, height: 16 }} />}
            </button>
            {copied && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(13,17,23,0.95)', border: '0.5px solid rgba(77,184,184,0.2)',
                color: Q.teal, fontSize: 11, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap',
              }}>
                Copied!
              </div>
            )}
          </div>

          <span style={{ fontSize: 12, color: Q.faint }}>
            {lang === 'ua' ? 'Поділитись статтею' : 'Share this article'}
          </span>
        </div>

        {/* Article body */}
        <div
  className="article-body"
  style={{ lineHeight: 1.85, fontSize: 16 }}
  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
/>

        {/* Bottom back link */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '0.5px solid rgba(77,184,184,0.1)' }}>
          <Link
            to="/events"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.teal, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7dd8d8')}
            onMouseLeave={e => (e.currentTarget.style.color = Q.teal)}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            {t('news.back') || 'Back to News'}
          </Link>
        </div>
      </main>

      <RelatedNews currentId={item.id} />
      <Footer />
    </div>
  );
};

export default EventDetailPage;
