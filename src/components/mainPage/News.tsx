import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useTranslation } from '../../context/TranslationContext';
import { fetchNews } from '../../data/news';
import { toDateString } from '../../utils/dates';

type DisplayNews = {
  id: string; title: string; excerptHtml: string;
  image: string; dateYMD: string; categoryKey: string; featured: boolean;
};

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
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) a.setAttribute('href', 'https://' + href);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)', white: '#ffffff' };

const CatBadge = ({ label }: { label: string }) => (
  <span style={{
    fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
    background: 'rgba(45,125,154,0.85)', color: '#e8f4f4',
    backdropFilter: 'blur(4px)',
  }}>
    {label}
  </span>
);

/* ── Карточка — фото на весь размер ── */
const NewsCard = ({
  item, locale, onRead, featured = false,
}: {
  item: DisplayNews; locale: string; onRead: () => void; featured?: boolean;
}) => (
  <div
    onClick={onRead}
    className="group relative overflow-hidden rounded-2xl cursor-pointer w-full h-full transition-all duration-300"
    style={{ border: '0.5px solid rgba(77,184,184,0.15)' }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(77,184,184,0.45)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(77,184,184,0.15)')}
  >
    {/* Фото */}
    {item.image ? (
      <img
        src={item.image} alt={item.title}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    ) : (
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg,#0d2137 0%,#1a3a5c 50%,#2d7d9a 100%)' }} />
    )}

    {/* Градиент */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'linear-gradient(to top, rgba(6,9,16,0.97) 0%, rgba(6,9,16,0.55) 50%, transparent 100%)' }} />

    {/* Категория */}
    {item.categoryKey && (
      <div className="absolute top-3 left-3 z-10">
        <CatBadge label={item.categoryKey} />
      </div>
    )}

    {/* Контент */}
    <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
      <h3
        className="font-raleway uppercase font-semibold mb-3 "
        style={{
          color: Q.text,
          lineHeight: 1.3,
          fontSize: featured ? 20 : 13,
          display: '-webkit-box',
          WebkitLineClamp: featured ? 4 : 2,
          WebkitBoxOrient: 'vertical' as any,
          overflow: 'hidden',
        }}
      >
        {item.title}
      </h3>

      {featured && (
        <div
        className="text-sm leading-relaxed line-clamp-3 mb-4 news-excerpt"
        dangerouslySetInnerHTML={{ __html: item.excerptHtml }}
      />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1" style={{ color: 'rgba(200,230,230,0.45)', fontSize: 12 }}>
          <Calendar style={{ width: 12, height: 12 }} />
          {formatLocalYMD(item.dateYMD, locale)}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRead(); }}
          className="inline-flex items-center gap-1 font-semibold transition"
          style={{ color: Q.teal, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#7dd8d8')}
          onMouseLeave={e => (e.currentTarget.style.color = Q.teal)}
        >
          Читати <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
);

/* ── Main ── */
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
        const raw = await fetchNews();
        const list: DisplayNews[] = raw.map((r: any) => {
          const dateYMD = (typeof r.dateYMD === 'string' && r.dateYMD) || toDateString(r.dateTs || r.date) || '';
          return {
            id: r.id,
            title: pickL10n(r.title, lang),
            excerptHtml: sanitizeAndEnhance(pickL10n(r.excerpt, lang)),
            image: r.image ?? '', dateYMD,
            categoryKey: r.categoryKey ?? r.category ?? '',
            featured: !!r.featured,
          };
        });
        list.sort((a, b) => (a.dateYMD > b.dateYMD ? -1 : 1));
        setItems(list);
      } finally { setLoading(false); }
    })();
  }, [lang]);

  const featured = useMemo(() => items.find((i) => i.featured) || items[0], [items]);
  const rest = useMemo(
    () => items.filter((i) => i && featured && i.id !== featured.id).slice(0, 4),
    [items, featured]
  );

  // Высота всего блока
  const TOTAL_H = 500;
  const GAP = 12;
  const SMALL_H = (TOTAL_H - GAP) / 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="font-raleway font-semibold text-4xl md:text-5xl mb-3" style={{ color: Q.text }}>
          {t('news.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 14px' }} />
        <p className="text-lg max-w-2xl mx-auto" style={{ color: Q.muted }}>{t('news.subtitle')}</p>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={{ display: 'flex', gap: GAP, height: TOTAL_H }}>
          <div style={{ flex: 1, borderRadius: 16, background: 'rgba(77,184,184,0.06)', animation: 'pulse 2s infinite' }} />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: GAP }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ borderRadius: 16, background: 'rgba(77,184,184,0.06)' }} />
            ))}
          </div>
        </div>
      )}

      {!loading && !featured && (
        <div className="text-center py-10" style={{ color: Q.muted }}>No news yet</div>
      )}

      {/* ── Layout: featured слева + 2×2 справа ── */}
      {!loading && featured && (
        <>
          {/* Desktop */}
          <div className="hidden md:flex gap-3" style={{ height: TOTAL_H }}>

            {/* Featured — левая колонка */}
            <div style={{ flex: '0 0 40%', height: '100%' }}>
              <NewsCard
                item={featured}
                locale={locale}
                onRead={() => navigate(`/events/${featured.id}`)}
                featured
              />
            </div>

            {/* 2×2 grid — правая колонка */}
            <div style={{
              flex: '1 1 60%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: `${SMALL_H}px ${SMALL_H}px`,
              gap: GAP,
            }}>
              {rest.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  onRead={() => navigate(`/events/${item.id}`)}
                />
              ))}
              {/* Заполнитель если новостей меньше 4 */}
              {rest.length < 4 && Array.from({ length: 4 - rest.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{
                  borderRadius: 16,
                  background: 'rgba(77,184,184,0.03)',
                  border: '0.5px dashed rgba(77,184,184,0.1)',
                }} />
              ))}
            </div>
          </div>

          {/* Mobile — стек */}
          <div className="flex flex-col md:hidden gap-3">
            <div style={{ height: 340 }}>
              <NewsCard item={featured} locale={locale} onRead={() => navigate(`/events/${featured.id}`)} featured />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP }}>
              {rest.map((item) => (
                <div key={item.id} style={{ height: 200 }}>
                  <NewsCard item={item} locale={locale} onRead={() => navigate(`/events/${item.id}`)} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* View all */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate('/events')}
          style={{
            background: 'transparent',
            border: '0.5px solid rgba(77,184,184,0.35)',
            borderRadius: 30, padding: '11px 32px',
            color: Q.teal, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {t('news.view_all')}
        </button>
      </div>
    </div>
  );
};

export default News;
