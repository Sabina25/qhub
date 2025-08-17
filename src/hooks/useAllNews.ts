import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { fetchNews } from '../data/news';
import { toDateString } from '../utils/dates';

export type Lang = 'ua' | 'en';

export type NewsCardVM = {
  id: string;
  title: string;
  excerptHtml: string;
  image: string;
  dateYMD: string;      
  datePretty: string;   
  categoryKey: string;
  featured: boolean;
};

const PAGE = 6;

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function normalizeYMD(row: any): string {
  if (typeof row?.dateYMD === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.dateYMD)) return row.dateYMD;
  const ymd = toDateString(row?.dateTs || row?.date);
  return ymd || '';
}

function formatLocal(ymd: string, locale: string) {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

export function useAllNews(lang: Lang) {
  const [items, setItems] = useState<NewsCardVM[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  // загрузка
  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        setError(null);

        const raw = await fetchNews(); 
        const mapped: NewsCardVM[] = (raw || []).map((r: any) => {
          const dateYMD = normalizeYMD(r);
          return {
            id: r.id,
            title: pickL10n(r.title, lang),
            excerptHtml: pickL10n(r.excerpt, lang),
            image: r.image ?? '',
            dateYMD,
            datePretty: formatLocal(dateYMD, locale),
            categoryKey: r.categoryKey ?? r.category ?? '',
            featured: !!r.featured,
          };
        });

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
  }, [lang, locale]);

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
    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { threshold: 1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return {
    visibleItems,
    loadingInitial,
    loadingMore,
    error,
    canLoadMore,
    loadMore,
    loaderRef,
  };
}
