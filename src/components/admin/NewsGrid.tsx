import { RefObject, memo } from 'react';
import { NewsCardVM } from '../../hooks/useAllNews';
import { NewsCard } from './NewsCard';

export const SKELETON_COUNT = 6;

const SkeletonCard = () => (
  <div
    aria-hidden="true"
    style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'rgba(77,184,184,0.05)',
      border: '0.5px solid rgba(77,184,184,0.1)',
      animation: 'pulse 1.8s ease-in-out infinite',
    }}
  >
    <div style={{ height: 200, background: 'rgba(77,184,184,0.08)' }} />
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 14, borderRadius: 6, background: 'rgba(77,184,184,0.1)', width: '75%' }} />
      <div style={{ height: 14, borderRadius: 6, background: 'rgba(77,184,184,0.07)', width: '50%' }} />
    </div>
  </div>
);

type Labels = {
  featured: string;
  loadMore: string;
  empty?: string;
  category: (key: string) => string | undefined;
};

export const NewsGrid = memo(function NewsGrid({
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
  items?: NewsCardVM[];
  loadingInitial: boolean;
  loadingMore: boolean;
  error: string | null;
  canLoadMore: boolean;
  onLoadMore: () => void;
  loaderRef: RefObject<HTMLDivElement>;
  labels: Labels;
  locale?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      {/* Error */}
      {error && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,100,100,0.25)', color: '#f87171', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Empty */}
      {!loadingInitial && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(200,230,230,0.45)', fontSize: 15 }}>
          {labels.empty ?? 'No news yet'}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {loadingInitial && Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={`skel-${i}`} />
        ))}

        {!loadingInitial && items.map((ev) => (
          <NewsCard
            key={`${ev.id}-${locale}`}
            item={ev}
            featuredLabel={labels.featured}
            categoryLabel={(ev.categoryKey && (labels.category(ev.categoryKey) || ev.categoryKey)) || undefined}
            locale={locale}
          />
        ))}

        {!loadingInitial && loadingMore && Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={`skel-more-${i}`} />
        ))}
      </div>

      {/* Intersection observer target */}
      <div ref={loaderRef} style={{ height: 40, marginTop: 40 }} aria-hidden="true" />

      {/* Load more button */}
      {!loadingInitial && canLoadMore && !loadingMore && items.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={onLoadMore}
            aria-label={labels.loadMore}
            style={{
              padding: '11px 32px', borderRadius: 30, cursor: 'pointer',
              background: 'transparent',
              border: '0.5px solid rgba(77,184,184,0.35)',
              color: '#4db8b8', fontSize: 14, fontWeight: 500,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {labels.loadMore}
          </button>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {loadingMore ? 'Loading more…' : ''}
      </div>
    </section>
  );
});
