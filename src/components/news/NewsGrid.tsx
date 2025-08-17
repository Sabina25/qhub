import { RefObject } from 'react';
import { NewsCardVM } from '../../hooks/useAllNews';
import { NewsCard } from './NewsCard';

export const SKELETON_COUNT = 6;

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 p-4 rounded-xl h-64">
    <div className="w-full h-32 bg-gray-300 rounded mb-4" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

export const NewsGrid = ({
  items,
  loadingInitial,
  loadingMore,
  error,
  canLoadMore,
  onLoadMore,
  loaderRef,
  labels,
}: {
  items: NewsCardVM[];
  loadingInitial: boolean;
  loadingMore: boolean;
  error: string | null;
  canLoadMore: boolean;
  onLoadMore: () => void;
  loaderRef: RefObject<HTMLDivElement>;
  labels: {
    featured: string;
    loadMore: string;
    category: (key: string) => string;
  };
}) => {
  return (
    <>
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {loadingInitial &&
          Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}

        {!loadingInitial &&
          items.map((ev) => (
            <NewsCard
              key={ev.id}
              item={ev}
              featuredLabel={labels.featured}
              categoryLabel={ev.categoryKey ? labels.category(ev.categoryKey) : undefined}
            />
          ))}

        {!loadingInitial && loadingMore &&
          Array.from({ length: Math.min(SKELETON_COUNT, Math.max(0, items.length)) }).map((_, i) => (
            <SkeletonCard key={`skel-more-${i}`} />
          ))}
      </div>

      <div ref={loaderRef} className="h-10 mt-10" />

      {!loadingInitial && canLoadMore && !loadingMore && (
        <div className="flex justify-center mt-4">
          <button onClick={onLoadMore} className="px-4 py-2 rounded border hover:bg-gray-50">
            {labels.loadMore}
          </button>
        </div>
      )}
    </>
  );
};
