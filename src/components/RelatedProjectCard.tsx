import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

type Lang = 'ua' | 'en';
export type ProjectCardVM = {
  id: string; title: any; image?: string;
  dateYMD?: string; dateStartYMD?: string; dateEndYMD?: string;
  categoryKey?: string; featured?: boolean;
};

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', meta: 'rgba(200,230,230,0.38)' };

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}
function toLocalDate(ymd?: string, locale = 'en-GB') {
  if (!ymd) return '';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(y, m - 1, d));
}
function formatRange(p: ProjectCardVM, locale: string) {
  if (p.dateYMD) return toLocalDate(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD) return `${toLocalDate(p.dateStartYMD, locale)} – ${toLocalDate(p.dateEndYMD, locale)}`;
  return toLocalDate(p.dateStartYMD || p.dateEndYMD, locale);
}

export const RelatedProjectCard = ({ item, categoryLabel, featuredLabel, locale = 'en-GB' }: { item: ProjectCardVM; categoryLabel?: string; featuredLabel?: string; locale?: string; }) => {
  const { lang } = useTranslation();
  const title = pickL10n(item.title, lang as Lang);
  const dateStr = formatRange(item, locale);
  return (
    <Link to={`/projects/${item.id}`}
      style={{ display: 'block', textDecoration: 'none', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(77,184,184,0.13)', transition: 'border-color 0.25s, transform 0.25s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.38)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.13)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}>
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        {item.image
          ? <img src={item.image} alt={title || 'project'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s' }} loading="lazy"
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0d2137,#1a4060,#2d7d9a)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,9,16,0.85) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          {item.featured && featuredLabel && <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: '#f97316', color: '#fff' }}>{featuredLabel}</span>}
          {categoryLabel && <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: 'rgba(45,125,154,0.85)', color: '#e8f4f4' }}>{categoryLabel}</span>}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h2 className="font-raleway" style={{ fontSize: 14, fontWeight: 600, color: Q.text, lineHeight: 1.35, marginBottom: 8, textTransform: 'uppercase', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {title || '—'}
        </h2>
        {dateStr && <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: Q.meta }}><Calendar style={{ width: 12, height: 12 }} />{dateStr}</div>}
        <div style={{ marginTop: 12, height: 1.5, background: `linear-gradient(90deg,${Q.teal},transparent)`, borderRadius: 1, opacity: 0.4 }} />
      </div>
    </Link>
  );
};
