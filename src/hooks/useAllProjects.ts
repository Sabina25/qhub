import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { fetchProjects } from '../data/projects';
import type { Lang } from '../utils/l10n';

export type ProjectCardVM = {
  id: string;
  titleRaw?: any;
  locationRaw?: any;
  descriptionHtmlRaw?: any;
  image?: string;
  dateYMD?: string;
  dateStartYMD?: string;
  dateEndYMD?: string;
};

const PAGE = 4;

function bestSortKey(p: any): string {
  return String(p?.dateYMD || p?.dateEndYMD || p?.dateStartYMD || '');
}

export function useAllProjects(lang: Lang) {
  const [items, setItems] = useState<ProjectCardVM[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        setError(null);
        const raw = await fetchProjects();
        raw.sort((a: any, b: any) => (bestSortKey(a) > bestSortKey(b) ? -1 : 1));

        const mapped: ProjectCardVM[] = raw.map((r: any) => ({
          id: String(r.id),
          titleRaw: r.title,
          locationRaw: r.location,
          descriptionHtmlRaw: r.descriptionHtml,
          image: r.image,
          dateYMD: r.dateYMD,
          dateStartYMD: r.dateStartYMD,
          dateEndYMD: r.dateEndYMD,
        }));

        setItems(mapped);
        setVisibleCount(PAGE);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Failed to load projects');
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [lang]); 

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const canLoadMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE, items.length));
      setLoadingMore(false);
    }, 120);
  }, [canLoadMore, loadingMore, items.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { threshold: 1 });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return { locale, visibleItems, loadingInitial, loadingMore, error, canLoadMore, loadMore, loaderRef };
}
