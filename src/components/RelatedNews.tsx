import { useEffect, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { fetchNews } from '../data/news';
import { toDateString } from '../utils/dates';
import type { NewsCardVM } from '../hooks/useAllNews';
import {NewsCard} from '../components/admin/NewsCard'

type Props = {
  currentId: string;
  limit?: number;
  className?: string;
};

// хелпер под локализацию
function pickL10n(val: any, lang: 'ua' | 'en'): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

export default function RelatedNews({ currentId, limit = 3, className = '' }: Props) {
  const { t, lang } = useTranslation();

  const [items, setItems] = useState<NewsCardVM[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const raw = await fetchNews();

        const mapped: NewsCardVM[] = raw.map((r: any) => ({
          id: r.id,
          title: pickL10n(r.title, lang),
          image: r.image ?? '',
          dateYMD:
            (typeof r.dateYMD === 'string' && r.dateYMD) ||
            toDateString(r.dateTs || r.date) ||
            '',
          categoryKey: r.categoryKey ?? r.category ?? '',
          featured: !!r.featured,
        }));

        mapped.sort((a, b) =>
          a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0
        );

        const picked = mapped.filter((n) => n.id !== currentId).slice(0, limit);

        if (alive) setItems(picked);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [currentId, lang, limit]);

  if (loading) {
    return (
      <section className={`mt-12 ${className}`}>
        <h2 className="text-xl font-bold mb-4">
          {t('news.read_also') ?? 'Читайте также'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className={`mt-16 mb-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">
          {t('news.read_also') ?? 'Читайте також'}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              featuredLabel={t('news.featured') ?? 'Featured'}
              categoryLabel={item.categoryKey ? t(item.categoryKey) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
