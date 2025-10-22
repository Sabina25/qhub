import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Share2, Copy as CopyIcon, Check as CheckIcon } from 'lucide-react';

import { useTranslation } from '../context/TranslationContext';
import Footer from '../components/Footer';
import Header from '../components/header/Header';
import ParallaxBanner from '../components/ParallaxBannerProps.tsx';
import RelatedNews from '../components/RelatedNews';

import { fetchNewsById, NewsItem } from '../data/news';
import { toDateString } from '../utils/dates';
import { buildShareUrl } from '../utils/share';

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
    a.style.color = '#2563eb';
    a.style.textDecoration = 'underline';
    a.style.setProperty('text-underline-offset', '2px');
    a.style.setProperty('text-decoration-thickness', '2px');
  });
  return doc.body.innerHTML;
}

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useTranslation();

  const [copied, setCopied] = useState(false);
  const [justShared, setJustShared] = useState(false);

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
    if (!ymd) return '';
    const date = new Date(ymd);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [item, locale]);

  const sanitizedHtml = useMemo(() => sanitizeAndEnhance(item?.excerpt || ''), [item?.excerpt]);

  // --- share/copy logic ---
  const shareUrl = useMemo(() => buildShareUrl(`/events/${id}`, { lang }), [id, lang]);

  const showCopiedToast = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(showCopiedToast).catch(showCopiedToast);
  };

  const webShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item?.title || 'Q-hub', url: shareUrl });
        setJustShared(true);
        setTimeout(() => setJustShared(false), 2000);
      } catch {/* ignore */}
    } else {
      copyShareUrl();
    }
  };

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

        {/* --- Share icons --- */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={webShare}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none`}
            title={lang === 'ua' ? 'Поділитись' : 'Share'}
            aria-label={lang === 'ua' ? 'Поділитись' : 'Share'}
          >
            <Share2 className={`h-4 w-4 ${justShared ? 'scale-110' : ''}`} />
          </button>

          <div className="relative">
            <button
              onClick={copyShareUrl}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition focus:outline-none"
              title={lang === 'ua' ? 'Скопіювати посилання' : 'Copy link'}
              aria-label={lang === 'ua' ? 'Скопіювати посилання' : 'Copy link'}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </button>
            {copied && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-black/80 text-white text-xs px-2 py-1 select-none">
                Copied
                <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
              </div>
            )}
          </div>
        </div>

        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>

      <RelatedNews currentId={item.id} />
      <Footer />
    </>
  );
};

export default EventDetailPage;
