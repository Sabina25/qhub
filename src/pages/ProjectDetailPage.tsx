import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Share2, Copy as CopyIcon, Check as CheckIcon, ArrowLeft, Calendar, MapPin } from 'lucide-react';

import Header from '../components/header/Header';
import Footer from '../components/Footer';
import RelatedProjects from '../components/RelatedProjects';
import { useTranslation } from '../context/TranslationContext';
import VideoGallery from '../components/VideoGallery';

import { fetchProjectById, fetchProjects, ProjectDoc } from '../data/projects';
import { buildShareUrl } from '../utils/share';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.65)', faint: 'rgba(200,230,230,0.38)' };

type Lang = 'ua' | 'en';

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function enhanceHtml(html: string) {
  const clean = DOMPurify.sanitize(html || '', { ADD_ATTR: ['target', 'rel'] });
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  // Убираем inline цвета чтобы не переопределяли тёмную тему
  doc.querySelectorAll<HTMLElement>('*').forEach(el => {
    el.style.removeProperty('color');
    el.style.removeProperty('background-color');
    el.style.removeProperty('background');
  });
  doc.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href))
      a.setAttribute('href', 'https://' + href);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    (a as HTMLElement).style.color = Q.teal;
    (a as HTMLElement).style.textDecoration = 'underline';
  });
  return doc.body.innerHTML;
}

function formatYMD(ymd?: string, locale = 'uk-UA') {
  if (!ymd) return '';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}
function formatRange(p: ProjectDoc, locale: string) {
  if (p.dateYMD) return formatYMD(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD)
    return `${formatYMD(p.dateStartYMD, locale)} – ${formatYMD(p.dateEndYMD, locale)}`;
  return formatYMD(p.dateStartYMD || p.dateEndYMD, locale);
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useTranslation();
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const [proj, setProj]       = useState<ProjectDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);
  const [justShared, setJustShared] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setProj(await fetchProjectById(id));
      } catch (e: any) {
        setErr(e?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const title       = useMemo(() => pickL10n(proj?.title, lang as Lang), [proj?.title, lang]);
  const location    = useMemo(() => pickL10n((proj as any)?.location, lang as Lang), [proj?.location, lang]);
  const funding     = useMemo(() => pickL10n((proj as any)?.funding, lang as Lang), [proj, lang]);
  const participants= useMemo(() => pickL10n((proj as any)?.participants, lang as Lang), [proj, lang]);
  const descHtml    = useMemo(() => pickL10n((proj as any)?.descriptionHtml, lang as Lang), [proj?.descriptionHtml, lang]);
  const sanitizedHtml = useMemo(() => enhanceHtml(descHtml || ''), [descHtml]);
  const dateStr     = useMemo(() => (proj ? formatRange(proj, locale) : ''), [proj, locale]);
  const allVideoUrls = useMemo(() => proj?.youtubeUrls || [], [proj?.youtubeUrls]);

  const shareVersion = useMemo(() => (proj as any)?.updatedAtTs?.toString?.() || proj?.dateYMD || '', [proj]);
  const shareUrl     = useMemo(() => buildShareUrl(`/projects/${id}`, { version: shareVersion, lang }), [id, shareVersion, lang]);

  const showCopied = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(showCopied).catch(() => {
      try {
        const ta = document.createElement('textarea');
        ta.value = shareUrl; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); showCopied();
      } catch {/* ignore */}
    });
  };
  const webShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: title || 'Q-hub', text: title || '', url: shareUrl }); setJustShared(true); setTimeout(() => setJustShared(false), 2000); }
      catch {/* cancelled */}
    } else copyLink();
  };

  /* ── States ── */
  const stateStyle: React.CSSProperties = { minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  if (loading) return (
    <div style={stateStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${Q.teal}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: Q.faint, fontSize: 14 }}>Loading…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
  if (err) return (
    <div style={stateStyle}>
      <div style={{ padding: '16px 24px', borderRadius: 12, background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,100,100,0.25)', color: '#f87171' }}>{err}</div>
    </div>
  );
  if (!proj) return (
    <div style={stateStyle}>
      <p style={{ color: Q.muted }}>Project not found</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', flexDirection: 'column' }}>
      <Header appearance="solid" />

      <main style={{ flex: 1, maxWidth: 860, width: '100%', margin: '0 auto', padding: '80px 24px 80px' }}>

        {/* Cover */}
        {proj.image && (
          <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 40, border: '0.5px solid rgba(77,184,184,0.18)', position: 'relative' }}>
            <img src={proj.image} alt={title || 'project cover'}
              style={{ width: '100%', height: 'clamp(240px,40vw,480px)', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              loading="lazy" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,9,16,0.6), transparent 50%)', pointerEvents: 'none' }} />
          </div>
        )}

        {/* Back */}
        <Link to="/projects"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.teal, textDecoration: 'none', marginBottom: 28, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#7dd8d8')}
          onMouseLeave={e => (e.currentTarget.style.color = Q.teal)}>
          <ArrowLeft style={{ width: 15, height: 15 }} />
          {t('projects.back') || 'Back to Projects'}
        </Link>

        {/* Featured + funding badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {proj.featured && (
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700, background: '#f97316', color: '#fff' }}>Featured</span>
          )}
          {funding && (
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: 'rgba(45,125,154,0.85)', color: '#e8f4f4' }}>{funding}</span>
          )}
          {participants && (
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(77,184,184,0.1)', border: '0.5px solid rgba(77,184,184,0.25)', color: Q.teal }}>{participants}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-raleway" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 700, color: Q.text, lineHeight: 1.2, marginBottom: 20 }}>
          {title || '—'}
        </h1>

        {/* Teal line */}
        <div style={{ width: 48, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, marginBottom: 20 }} />

        {/* Meta */}
        {(dateStr || location) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            {dateStr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.faint }}>
                <Calendar style={{ width: 14, height: 14 }} />
                {dateStr}
              </div>
            )}
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.faint }}>
                <MapPin style={{ width: 14, height: 14 }} />
                {location}
              </div>
            )}
          </div>
        )}

        {/* Share */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <button onClick={webShare}
            style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: justShared ? 'rgba(77,184,184,0.2)' : 'rgba(77,184,184,0.1)', border: `0.5px solid rgba(77,184,184,${justShared ? '0.5' : '0.3'})`, color: Q.teal, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.1)')}>
            <Share2 style={{ width: 16, height: 16 }} />
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={copyLink}
              style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: copied ? 'rgba(77,184,184,0.15)' : 'rgba(255,255,255,0.05)', border: `0.5px solid rgba(77,184,184,${copied ? '0.4' : '0.2'})`, color: copied ? Q.teal : Q.faint, cursor: 'pointer', transition: 'all 0.2s' }}>
              {copied ? <CheckIcon style={{ width: 16, height: 16 }} /> : <CopyIcon style={{ width: 16, height: 16 }} />}
            </button>
            {copied && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(13,17,23,0.95)', border: '0.5px solid rgba(77,184,184,0.2)', color: Q.teal, fontSize: 11, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                Copied!
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: Q.faint }}>{lang === 'ua' ? 'Поділитись проєктом' : 'Share this project'}</span>
        </div>

        {/* Article body */}
        <div
          className="article-body"
          style={{ lineHeight: 1.85, fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        {/* Gallery */}
        {proj.gallery && proj.gallery.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 className="font-raleway" style={{ fontSize: 22, fontWeight: 600, color: Q.text, marginBottom: 8 }}>
                {lang === 'ua' ? 'Галерея' : 'Gallery'}
              </h2>
              <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {proj.gallery.map((src, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '0.5px solid rgba(77,184,184,0.15)', aspectRatio: '4/3' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {allVideoUrls.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 className="font-raleway" style={{ fontSize: 22, fontWeight: 600, color: Q.text, marginBottom: 8 }}>
                {lang === 'ua' ? 'Відео' : 'Videos'}
              </h2>
              <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2 }} />
            </div>
            <VideoGallery urls={allVideoUrls} />
          </section>
        )}

        {/* Bottom back */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '0.5px solid rgba(77,184,184,0.1)' }}>
          <Link to="/projects"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: Q.teal, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7dd8d8')}
            onMouseLeave={e => (e.currentTarget.style.color = Q.teal)}>
            <ArrowLeft style={{ width: 15, height: 15 }} />
            {t('projects.back') || 'Back to Projects'}
          </Link>
        </div>

        <RelatedProjects currentId={id!} limit={3} className="mt-16" />
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
