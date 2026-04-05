import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import type { NewsCardVM } from '../../hooks/useAllNews';
import { pickL10nKeepEmpty } from '../../utils/l10n';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.55)', meta: 'rgba(200,230,230,0.38)' };

function formatLocal(ymd?: string, locale = 'en-GB') {
  if (!ymd) return '—';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(y, m - 1, d));
}

export const NewsCard = ({
  item,
  featuredLabel,
  categoryLabel,
  locale = 'en-GB',
}: {
  item: NewsCardVM;
  featuredLabel: string;
  categoryLabel?: string;
  locale?: string;
}) => {
  const { lang } = useTranslation();
  const { text: title } = pickL10nKeepEmpty(item.titleRaw, lang);

  return (
    <Link
      to={`/events/${item.id}`}
      style={{ display: 'block', textDecoration: 'none', borderRadius: 16, overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(77,184,184,0.13)', transition: 'border-color 0.25s, transform 0.25s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.38)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.13)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {item.image ? (
          <img
            src={item.image} alt={title || 'news cover'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s ease' }}
            loading="lazy"
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0d2137,#1a4060,#2d7d9a)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,9,16,0.8) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {item.featured && (
            <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: '#f97316', color: '#fff' }}>
              {featuredLabel}
            </span>
          )}
          {categoryLabel && (
            <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: 'rgba(45,125,154,0.85)', color: '#e8f4f4', backdropFilter: 'blur(4px)' }}>
              {categoryLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        <h2 className="font-raleway" style={{ fontSize: 15, fontWeight: 600, color: Q.text, lineHeight: 1.35, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden', textTransform: 'uppercase' }}>
          {title || '—'}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Q.meta }}>
          <Calendar style={{ width: 13, height: 13 }} />
          {formatLocal(item.dateYMD, locale)}
        </div>

        {/* Teal bottom accent */}
        <div style={{ marginTop: 14, height: 1.5, background: `linear-gradient(90deg,${Q.teal},transparent)`, borderRadius: 1, opacity: 0.4 }} />
      </div>
    </Link>
  );
};
