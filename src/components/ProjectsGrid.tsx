import { RefObject, memo } from 'react';
import { ProjectCard } from './ProjectCard';
import type { ProjectCardVM } from '../hooks/useAllProjects';
import { useTranslation } from '../context/TranslationContext';

export const SKELETON_COUNT = 6;

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 p-4 rounded-xl h-64" aria-hidden="true">
    <div className="w-full h-32 bg-gray-300 rounded mb-4" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

type Labels = { more: string; empty?: string };

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
  basePath = '/projects',
}: {
  items?: ProjectCardVM[];
  loadingInitial: boolean;
  loadingMore: boolean;
  error: string | null;
  canLoadMore: boolean;
  onLoadMore: () => void;
  loaderRef: RefObject<HTMLDivElement>;
  labels: Labels;
  locale?: string;
  basePath?: string;
}) {
    const { lang } = useTranslation();
  return (
    <section>
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loadingInitial && items.length === 0 ? (
        <div className="text-center text-gray-500 py-10">{labels.empty ?? 'No projects yet'}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {loadingInitial &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}

          {!loadingInitial &&
            items.map((p) => (
                <ProjectCard
                key={`${p.id}-${lang}`}   
                item={p}
                locale={locale}
              />
            ))}

          {!loadingInitial &&
            loadingMore &&
            Array.from({ length: Math.min(SKELETON_COUNT, Math.max(0, items.length)) }).map((_, i) => (
              <SkeletonCard key={`skel-more-${i}`} />
            ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10 mt-10" aria-hidden="true" />

      {!loadingInitial && canLoadMore && !loadingMore && items.length > 0 && (
        <div className="text-center mt-10">
          <button
            onClick={onLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            aria-label={labels.more}
          >
            {labels.more}
          </button>
        </div>
      )}
    </section>
  );
});
