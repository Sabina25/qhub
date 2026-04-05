import { RefObject, memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

/* ── Типы (адаптируй под свой useAllProjects) ── */
export type ProjectCardVM = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  dateYMD?: string;
  funding?: string;
  location?: string;
  participants?: string;
  featured?: boolean;
};

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.55)', meta: 'rgba(200,230,230,0.38)' };

function formatLocal(ymd?: string, locale = 'en-GB') {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(y, m - 1, d));
}

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div aria-hidden="true" style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(77,184,184,0.05)', border: '0.5px solid rgba(77,184,184,0.1)' }}>
    <div style={{ height: 200, background: 'rgba(77,184,184,0.08)' }} />
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 14, borderRadius: 6, background: 'rgba(77,184,184,0.1)', width: '70%' }} />
      <div style={{ height: 12, borderRadius: 6, background: 'rgba(77,184,184,0.07)', width: '45%' }} />
    </div>
  </div>
);

/* ── Project Card ── */
const ProjectCard = ({ item, locale }: { item: ProjectCardVM; locale: string }) => (
  <Link
    to={`/projects/${item.id}`}
    style={{ display: 'block', textDecoration: 'none', borderRadius: 16, overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(77,184,184,0.13)', transition: 'border-color 0.25s, transform 0.25s' }}
    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.38)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.13)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
  >
    {/* Image */}
    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      {item.image ? (
        <img src={item.image} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s ease' }}
          loading="lazy"
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0d2137,#1a4060,#2d7d9a)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,9,16,0.85) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Badges */}
      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {item.featured && (
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: '#f97316', color: '#fff' }}>
            Featured
          </span>
        )}
        {item.funding && (
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 600, background: 'rgba(45,125,154,0.85)', color: '#e8f4f4', backdropFilter: 'blur(4px)' }}>
            {item.funding}
          </span>
        )}
      </div>
    </div>

    {/* Content */}
    <div style={{ padding: '16px 18px' }}>
      <h2 className="font-raleway" style={{ fontSize: 14, fontWeight: 600, color: Q.text, lineHeight: 1.35, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden', textTransform: 'uppercase' }}>
        {item.title}
      </h2>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {item.dateYMD && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Q.meta }}>
            <Calendar style={{ width: 12, height: 12 }} />
            {formatLocal(item.dateYMD, locale)}
          </div>
        )}
        {item.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Q.meta }}>
            <MapPin style={{ width: 12, height: 12 }} />
            {item.location}
          </div>
        )}
        {item.participants && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Q.meta }}>
            <Users style={{ width: 12, height: 12 }} />
            {item.participants}
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, height: 1.5, background: `linear-gradient(90deg,${Q.teal},transparent)`, borderRadius: 1, opacity: 0.4 }} />
    </div>
  </Link>
);

/* ── Grid ── */
export const ProjectsGrid = memo(function ProjectsGrid({
  items = [],
  loadingInitial,
  loadingMore,
  error,
  canLoadMore,
  onLoadMore,
  loaderRef,
  labels,
  locale = 'en-GB',
  className = '',
}: {
  items?: ProjectCardVM[];
  loadingInitial: boolean;
  loadingMore: boolean;
  error: string | null;
  canLoadMore: boolean;
  onLoadMore: () => void;
  loaderRef: RefObject<HTMLDivElement>;
  labels: { more: string; empty?: string };
  locale?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      {error && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,100,100,0.25)', color: '#f87171', fontSize: 14 }}>
          {error}
        </div>
      )}

      {!loadingInitial && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(200,230,230,0.45)', fontSize: 15 }}>
          {labels.empty ?? 'No projects yet'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {loadingInitial && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
        {!loadingInitial && items.map(item => <ProjectCard key={item.id} item={item} locale={locale} />)}
        {!loadingInitial && loadingMore && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`skm-${i}`} />)}
      </div>

      <div ref={loaderRef} style={{ height: 40, marginTop: 40 }} aria-hidden="true" />

      {!loadingInitial && canLoadMore && !loadingMore && items.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={onLoadMore}
            style={{ padding: '11px 32px', borderRadius: 30, cursor: 'pointer', background: 'transparent', border: '0.5px solid rgba(77,184,184,0.35)', color: Q.teal, fontSize: 14, fontWeight: 500, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {labels.more}
          </button>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {loadingMore ? 'Loading more…' : ''}
      </div>
    </section>
  );
});
