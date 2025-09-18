import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { fetchNews } from '../data/news';
import { toDateString } from '../utils/dates';
import type { Lang } from '../utils/l10n';

export type NewsCardVM = {
  id: string;
  titleRaw?: { ua?: string; en?: string };       
  excerptHtmlRaw?: { ua?: string; en?: string };  
  image: string;
  dateYMD: string;
  categoryKey: string;
  featured: boolean;
};

const PAGE = 6;

function normalizeYMD(row: any): string {
  if (typeof row?.dateYMD === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.dateYMD)) return row.dateYMD;
  return toDateString(row?.dateTs || row?.date) || '';
}

function toL10n(val: any): { ua?: string; en?: string } | undefined {
  if (val == null) return undefined;

  if (typeof val === 'object') {
    const out: { ua?: string; en?: string } = {};
    if (Object.prototype.hasOwnProperty.call(val, 'ua')) out.ua = typeof val.ua === 'string' ? val.ua : String(val.ua ?? '');
    if (Object.prototype.hasOwnProperty.call(val, 'en')) out.en = typeof val.en === 'string' ? val.en : String(val.en ?? '');
    return Object.keys(out).length ? out : undefined;
  }
  if (typeof val === 'string') return { ua: val }; 
  return undefined;
}


export function useAllNews(_lang: Lang) {
  const [items, setItems] = useState<NewsCardVM[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        setError(null);

        const raw = await fetchNews();
        const mapped: NewsCardVM[] = (raw || []).map((r: any) => ({
          id: String(r.id),
          titleRaw: toL10n(r.title),                 
          excerptHtmlRaw: toL10n(r.excerpt),        
          image: r.image ?? '',
          dateYMD: normalizeYMD(r),
          categoryKey: r.categoryKey ?? r.category ?? '',
          featured: !!r.featured,
        }));

        mapped.sort((a, b) => (a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0));
        setItems(mapped);
        setVisibleCount(PAGE);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Failed to load news');
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, []); 

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const canLoadMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE, items.length));
      setLoadingMore(false);
    }, 200);
  }, [canLoadMore, loadingMore, items.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries[0]?.isIntersecting && loadMore(), { threshold: 1 });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return { visibleItems, loadingInitial, loadingMore, error, canLoadMore, loadMore, loaderRef };
}
