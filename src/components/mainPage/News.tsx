import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

import { useTranslation } from '../../context/TranslationContext';
import { fetchNews } from '../../data/news';

import { toDateString } from '../../utils/dates'; 

// --- types for local mapping ---
type DisplayNews = {
  id: string;
  title: string;
  excerptHtml: string;
  image: string;
  dateYMD: string;
  categoryKey: string;
  featured: boolean;
};

// --- helpers ---
function pickL10n(val: any, lang: 'ua' | 'en'): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function formatLocalYMD(ymd: string, locale: string) {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

function sanitizeAndEnhance(html: string): string {
  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] });
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      a.setAttribute('href', 'https://' + href);
    }
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}


const News: React.FC = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const [items, setItems] = useState<DisplayNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await fetchNews(); // из Firestore
        const list: DisplayNews[] = raw.map((r: any) => {
          const dateYMD =
            (typeof r.dateYMD === 'string' && r.dateYMD) ||
            toDateString(r.dateTs || r.date) ||
            '';
          return {
            id: r.id,
            title: pickL10n(r.title, lang),
            excerptHtml: sanitizeAndEnhance(pickL10n(r.excerpt, lang)),
            image: r.image ?? '',
            dateYMD,
            categoryKey: r.categoryKey ?? r.category ?? '',
            featured: !!r.featured,
          };
        });
        
        list.sort((a, b) => (a.dateYMD > b.dateYMD ? -1 : a.dateYMD < b.dateYMD ? 1 : 0));
        setItems(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [lang]);

  const featured = useMemo(
    () => items.find((i) => i.featured) || items[0],
    [items]
  );
  const gridItems = useMemo(
    () => items.filter((i) => i && featured && i.id !== featured.id).slice(0, 3),
    [items, featured]
  );

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('news.title')}
          </h2>
          <p className="font-notosans text-lg text-gray-600 max-w-2xl mx-auto">
            {t('news.subtitle')}
          </p>
        </div>

        {/* Featured Article */}
        {!loading && featured && (
          <div className="bg-white overflow-hidden mb-12 rounded-xl">
            <div className="grid lg:grid-cols-2">
              
              <div className="relative h-60 sm:h-72 lg:h-[480px] overflow-hidden">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {featured.categoryKey && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
                    {t(`${featured.categoryKey}`) || featured.categoryKey}
                  </span>
                )}
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {featured.categoryKey && (
                    <>
                      <Tag className="h-4 w-4 mr-2" />
                      {t(`${featured.categoryKey}`) || featured.categoryKey}
                      <span className="mx-2">•</span>
                    </>
                  )}
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatLocalYMD(featured.dateYMD, locale)}
                </div>

                <h3 className="font-raleway uppercase text-2xl lg:text-3xl text-gray-900 mb-4">
                  {featured.title}
                </h3>

                <div
                  className="font-sans text-gray-600 mb-6 text-lg leading-relaxed line-clamp-5 prose"
                  dangerouslySetInnerHTML={{ __html: featured.excerptHtml }}
                />

                <button
                  onClick={() => navigate(`/events/${featured.id}`)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition group"
                >
                  {t('news.read_full')}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Empty state */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white h-64 rounded-xl animate-pulse" />
            ))}
          </div>
        )}
        {!loading && !featured && (
          <div className="text-center text-gray-500">No news yet</div>
        )}

        {/* News Grid */}
        {!loading && gridItems.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridItems.map((item) => (
              <article
                key={item.id}
                className="bg-white overflow-hidden transition-all duration-300 group hover:-translate-y-1 rounded-xl"
              >
                {/* crop */}
                <div className="relative h-48 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                  {item.categoryKey && (
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      {t(`${item.categoryKey}`) || item.categoryKey}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatLocalYMD(item.dateYMD, locale)}
                  </div>

                  <h3 className="font-raleway uppercase text-lg text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <button
                    onClick={() => navigate(`/events/${item.id}`)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition group"
                  >
                    {t('news.read_full')}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/events')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold shadow-md transition"
          >
            {t('news.view_all')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
