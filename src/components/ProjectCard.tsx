import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import type { ProjectCardVM } from '../hooks/useAllProjects';
import { pickL10nWithLang } from '../utils/l10n';
import DOMPurify from 'dompurify';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)', meta: 'rgba(200,230,230,0.38)' };

function stripHtmlToText(html: string, max = 220): string {
  if (!html) return '';
  const clean = DOMPurify.sanitize(html);
  const tmp = document.createElement('div');
  tmp.innerHTML = clean;
  const text = (tmp.textContent || '').trim().replace(/\s+/g, ' ');
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
function formatYMD(ymd?: string, locale = 'uk-UA') {
  if (!ymd) return '';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}
function formatRange(p: ProjectCardVM, locale: string) {
  if (p.dateYMD) return formatYMD(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD)
    return `${formatYMD(p.dateStartYMD, locale)} – ${formatYMD(p.dateEndYMD, locale)}`;
  return formatYMD(p.dateStartYMD || p.dateEndYMD, locale);
}

export const ProjectCard = memo(function ProjectCard({
  item,
  locale = 'en-GB',
  basePath = '/projects',
  className = '',
}: {
  item: ProjectCardVM;
  locale?: string;
  basePath?: string;
  className?: string;
}) {
  const { lang } = useTranslation();

  const { text: title, used: titleUsed } = pickL10nWithLang(item.titleRaw, lang);
  const { text: location }               = pickL10nWithLang(item.locationRaw, lang);
  const { text: descHtml }               = pickL10nWithLang(item.descriptionHtmlRaw, lang);
  const { text: funding }                = pickL10nWithLang((item as any).fundingRaw, lang);

  const descText = stripHtmlToText(descHtml || '');
  const dateStr  = formatRange(item, locale);

  useEffect(() => {
    console.debug('[ProjectCard]', { id: item.id, lang, titleUsed, title });
  }, [item.id, lang, titleUsed, title]);

  return (
    <Link
      to={`${basePath}/${item.id}`}
      className={className}
      style={{
        display: 'block', textDecoration: 'none',
        borderRadius: 16, overflow: 'hidden', position: 'relative',
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(77,184,184,0.13)',
        transition: 'border-color 0.25s, transform 0.25s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.38)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.13)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Lang fallback badge */}
      {titleUsed && titleUsed !== lang && (
        <span style={{
          position: 'absolute', top: 10, right: 10, zIndex: 10,
          fontSize: 9, padding: '2px 8px', borderRadius: 20,
          background: 'rgba(249,115,22,0.15)',
          border: '0.5px solid rgba(249,115,22,0.35)',
          color: '#f97316', fontWeight: 600,
        }}>
          {titleUsed.toUpperCase()} fallback
        </span>
      )}

      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {item.image ? (
          <img
            src={item.image}
            alt={title || 'project cover'}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease' }}
            loading="lazy"
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0d2137,#1a4060,#2d7d9a)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,9,16,0.85) 0%,transparent 60%)', pointerEvents: 'none' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {item.featured && (
            <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: '#f97316', color: '#fff' }}>
              Featured
            </span>
          )}
          {funding && (
            <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: 'rgba(45,125,154,0.85)', color: '#e8f4f4', backdropFilter: 'blur(4px)' }}>
              {funding}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        <h2 className="font-raleway" style={{
          fontSize: 14, fontWeight: 600, color: Q.text, lineHeight: 1.35,
          marginBottom: 10, textTransform: 'uppercase',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
        }}>
          {title || '—'}
        </h2>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {dateStr && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Q.meta }}>
              <Calendar style={{ width: 12, height: 12, flexShrink: 0 }} />
              {dateStr}
            </div>
          )}
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Q.meta }}>
              <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />
              {location}
            </div>
          )}
        </div>

        {/* Description */}
        {descText && (
          <p style={{ fontSize: 13, lineHeight: 1.6, color: Q.muted, marginTop: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
            {descText}
          </p>
        )}

        {/* Bottom accent */}
        <div style={{ marginTop: 14, height: 1.5, background: `linear-gradient(90deg,${Q.teal},transparent)`, borderRadius: 1, opacity: 0.4 }} />
      </div>
    </Link>
  );
});
