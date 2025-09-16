import { RefObject, memo } from 'react';
import { NewsCardVM } from '../../hooks/useAllNews';
import { NewsCard } from './NewsCard';

export const SKELETON_COUNT = 6;

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 p-4 rounded-xl h-64" aria-hidden="true">
    <div className="w-full h-32 bg-gray-300 rounded mb-4" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

type Labels = {
  featured: string;
  loadMore: string;
  empty?: string;
  // гарантируем строку на выходе
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
  className = '',                          // NEW
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
  className?: string;                       // NEW
}) {
  return (
    <section className={className}>
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {(!loadingInitial && items.length === 0) ? (
        <div className="text-center text-gray-500 py-10">
          {labels.empty ?? 'No news yet'}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {loadingInitial &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={`skel-${i}`} />
            ))}

          {!loadingInitial &&
            items.map((ev) => (
              <NewsCard
                key={ev.id}
                item={ev}
                featuredLabel={labels.featured}
                categoryLabel={(ev.categoryKey && (labels.category(ev.categoryKey) || ev.categoryKey)) || undefined}
                locale={locale}
              />
            ))}

          {!loadingInitial && loadingMore &&
            Array.from({ length: Math.min(SKELETON_COUNT, Math.max(0, items.length)) }).map((_, i) => (
              <SkeletonCard key={`skel-more-${i}`} />
            ))}
        </div>
      )}

      {/* якорь под IntersectionObserver */}
      <div ref={loaderRef} className="h-10 mt-10" aria-hidden="true" />

      {!loadingInitial && canLoadMore && !loadingMore && items.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 rounded border hover:bg-gray-50"
            aria-label={labels.loadMore}
          >
            {labels.loadMore}
          </button>
        </div>
      )}

      {/* live-зона для состояния загрузки */}
      <div role="status" aria-live="polite" className="sr-only">
        {loadingMore ? 'Loading more…' : ''}
      </div>
    </section>
  );
});
