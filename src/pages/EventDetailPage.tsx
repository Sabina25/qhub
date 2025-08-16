import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

import { useTranslation } from '../context/TranslationContext';

import Footer from '../components/Footer';
import Header from '../components/Header';
import ParallaxBanner from '../components/ParallaxBannerProps.tsx';

import { fetchNewsById, NewsItem } from '../data/news';

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
      if (isNaN(+d)) return '';
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

function formatLocalYMD(ymd: string, locale: string) {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '';
  // ЛОКАЛЬНАЯ дата (без UTC-сдвига)
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

// Санитизация + нормализация ссылок + ЖЁСТКАЯ стилизация inline-стилями
function sanitizeAndEnhance(html: string): string {
  // 1) Санитизируем (оставляем только target/rel; style мы выставим сами)
  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] });

  // 2) Парсим и дополняем <a>
  const doc = new DOMParser().parseFromString(clean, 'text/html');

  doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      a.setAttribute('href', 'https://' + href);
    }

    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    a.style.color = '#2563eb';                    // blue-600
    a.style.textDecoration = 'underline';
    a.style.setProperty('text-underline-offset', '2px');
    a.style.setProperty('text-decoration-thickness', '2px');

    a.addEventListener?.('mouseenter', () => (a.style.color = '#1d4ed8')); // blue-700
    a.addEventListener?.('mouseleave', () => (a.style.color = '#2563eb'));
  });

  return doc.body.innerHTML;
}


const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useTranslation();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchNewsById(id, lang); 
        setItem(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, lang]);

  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const prettyDate = useMemo(() => {
    const ymd =
      (item && typeof (item as any).dateYMD === 'string' && (item as any).dateYMD) ||
      (item && toDateString((item as any).dateTs || (item as any).date)) ||
      '';
    return formatLocalYMD(ymd, locale);
  }, [item, locale]);

  const sanitizedHtml = useMemo(
    () => sanitizeAndEnhance(item?.excerpt || ''),
    [item?.excerpt]
  );

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20">Loading…</div>;
  if (!item) return <p className="text-center mt-20">News not found</p>;

  return (
    <>
      <Header />
      {item.image && <ParallaxBanner image={item.image} height="75vh" />}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/events" className="text-blue-600 underline mb-4 inline-block">
          ← {t('news.back') || 'Back to News'}
        </Link>

        <h1 className="text-4xl mb-4">{item.title}</h1>

        <p className="text-gray-500 text-sm mb-4">
          {prettyDate || '—'} {item.category ? `· ${item.category}` : ''}{item.featured ? ' · Featured' : ''}
        </p>

        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
      <Footer />
    </>
  );
};

export default EventDetailPage;
