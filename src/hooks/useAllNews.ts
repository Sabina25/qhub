import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchNews } from '../data/news';
import { toDateString } from '../utils/dates';

export type Lang = 'ua' | 'en';

export const SKELETON_COUNT = 6;

export type NewsCardVM = {
  id: string;
  title: string;
  excerptHtml: string;
  image: string;
  dateYMD: string;      // YYYY-MM-DD
  dateLabel: string;   
  categoryKey: string;
  featured: boolean;
};

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function formatLocalYMD(ymd: string, locale: string) {
  if (!ymd) return '—';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

export function useAllNews(lang: Lang) {
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const [items, setItems] = useState<NewsCardVM[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ref для infinite scroll
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        setError(null);

        const raw: any[] = await fetchNews();

        const mapped: NewsCardVM[] = raw.map((r) => {
          const dateYMD =
            (typeof r.dateYMD === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.dateYMD) && r.dateYMD) ||
            toDateString(r.dateTs || r.date) ||
            '';

          const title = pickL10n(r.title, lang);
          const excerptHtml = pickL10n(r.excerpt, lang);
          const image = r.image ?? '';
          const categoryKey = r.categoryKey ?? r.category ?? '';
          const featured = !!r.featured;

          return {
            id: r.id,
            title,
            excerptHtml,
            image,
            dateYMD,
            dateLabel: dateYMD ? formatLocalYMD(dateYMD, locale) : '—',
            categoryKey,
            featured,
          };
        });

        mapped.sort((a, b) => (a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0));

        setItems(mapped);
        setVisibleCount(6); 
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Не удалось загрузить новости');
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [lang, locale]);

  const canLoadMore = useMemo(() => visibleCount < items.length, [visibleCount, items.length]);

  const loadMore = () => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, items.length));
      setLoadingMore(false);
    }, 300);
  };

  // intersection observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const obs = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { threshold: 1 }
    );
    obs.observe(el);
    return () => obs.unobserve(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef, canLoadMore, loadingMore, items.length]);

  return {
    items,
    visibleItems: items.slice(0, visibleCount),
    loadingInitial,
    loadingMore,
    error,
    canLoadMore,
    loadMore,
    loaderRef,
  };
}
