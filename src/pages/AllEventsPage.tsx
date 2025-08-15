// src/pages/AllEventsPage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';

import { fetchNews } from '../data/news'; 

const SKELETON_COUNT = 6;

type DisplayNews = {
  id: string;
  title: string;         
  excerptHtml: string;   
  image: string;
  date: string;           
  categoryKey: string;   
  featured: boolean;
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 p-4 rounded-xl h-64">
    <div className="w-full h-32 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);


function pickL10n(val: any, lang: 'ua' | 'en'): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    return val[lang] ?? val.ua ?? val.en ?? '';
  }
  return '';
}

function toDateString(input: any): string {
  try {
    if (input && typeof input === 'object' && 'seconds' in input) {
      const d = new Date(input.seconds * 1000);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (typeof input === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      const d = new Date(input);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return '';
  } catch {
    return '';
  }
}


const AllEventsPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const [items, setItems] = useState<DisplayNews[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        const rawList: any[] = await fetchNews(/* можно передать lang, если обновлял data/news */);

        const list: DisplayNews[] = rawList.map((r) => {
          const date =
            toDateString(r.date) || toDateString(r.createdAt) || toDateString(r.updatedAt) || '';

          return {
            id: r.id,
            title: pickL10n(r.title, lang),
            excerptHtml: pickL10n(r.excerpt, lang),
            image: r.image ?? '',
            date,
            
            categoryKey: r.categoryKey ?? r.category ?? '',
            featured: !!r.featured,
          };
        });

        // новые сверху
        list.sort((a, b) => (Date.parse(b.date || '') || 0) - (Date.parse(a.date || '') || 0));
        setItems(list);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Не удалось загрузить новости');
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [lang]);

  const canLoadMore = useMemo(() => visibleCount < items.length, [visibleCount, items.length]);

  const loadMore = () => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, items.length));
      setLoadingMore(false);
    }, 400);
  };

  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const obs = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { threshold: 1 }
    );
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [loaderRef, canLoadMore, loadingMore, items.length]);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">
          {t('news.allNews') || 'All News'}
        </h1>
        <hr className="mb-10 border-t border-gray-300" />

        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {loadingInitial &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}

          {!loadingInitial &&
            items.slice(0, visibleCount).map((ev) => (
              <Link
                to={`/events/${ev.id}`}
                key={ev.id}
                className="relative block transform transition-transform duration-300 hover:scale-105"
              >
                {ev.featured && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">
                    {t('news.featured') || 'Featured'}
                  </span>
                )}

                {ev.image ? (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 mb-4 rounded" />
                )}

                <h2 className="font-raleway text-2xl mb-2 line-clamp-2">{ev.title || '—'}</h2>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {ev.date ? new Date(ev.date).toLocaleDateString(lang === 'ua' ? 'uk-UA' : 'en-GB') : '—'}
                  </span>
                  {ev.categoryKey && (
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {t(`${ev.categoryKey}`) || ev.categoryKey}
                    </span>
                  )}
                </div>
              </Link>
            ))}

          {!loadingInitial && loadingMore &&
            Array.from({ length: Math.min(SKELETON_COUNT, items.length - visibleCount) }).map((_, i) => (
              <SkeletonCard key={`skel-more-${i}`} />
            ))}
        </div>

        <div ref={loaderRef} className="h-10 mt-10" />

        {!loadingInitial && canLoadMore && !loadingMore && (
          <div className="flex justify-center mt-4">
            <button onClick={loadMore} className="px-4 py-2 rounded border hover:bg-gray-50">
              {t('common.loadMore') || 'Load more'}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AllEventsPage;
