import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';  

import { useTranslation } from '../context/TranslationContext';

import Footer from '../components/Footer';
import Header from '../components/Header';
import ParallaxBanner from '../components/ParallaxBannerProps.tsx';

import { fetchNewsById, NewsItem } from '../data/news';

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
    } finally { setLoading(false); }
  })();
}, [id, lang]);


  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchNewsById(id);
        setItem(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20">Loading…</div>;
  if (!item) return <p className="text-center mt-20">News not found</p>;

  const prettyDate = item.date ? new Date(item.date).toLocaleDateString('uk-UA') : '';

  return (
    <>
      <Header />
      {item.image && (
        <ParallaxBanner image={item.image} height="75vh" />
      )}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/events" className="text-blue-600 underline mb-4 inline-block">
          ← Back to News
        </Link>

        <h1 className="text-4xl mb-4">{item.title}</h1>

        <p className="text-gray-500 text-sm mb-4">
          {prettyDate || '—'} {item.category ? `· ${item.category}` : ''}
          {item.featured ? ' · Featured' : ''}
        </p>

        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.excerpt) }}
        />
      </div>
      <Footer />
    </>
  );
};

export default EventDetailPage;
