import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { useAllNews } from '../hooks/useAllNews';
import { NewsGrid } from '../components/admin/NewsGrid';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.55)' };

const AllNewsPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const {
    visibleItems,
    loadingInitial,
    loadingMore,
    error,
    canLoadMore,
    loadMore,
    loaderRef,
  } = useAllNews(lang as 'ua' | 'en');

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', flexDirection: 'column' }}>
      <Header appearance="solid" />

      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="font-raleway" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: Q.text, marginBottom: 16 }}>
            {t('news.allNews')}
          </h1>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 16px' }} />
          <p style={{ fontSize: 15, color: Q.muted, maxWidth: 480, margin: '0 auto' }}>
            {t('news.subtitle')}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(77,184,184,0.12)', marginBottom: 40 }} />

        <NewsGrid
          items={visibleItems}
          loadingInitial={loadingInitial}
          loadingMore={loadingMore}
          error={error}
          canLoadMore={canLoadMore}
          onLoadMore={loadMore}
          loaderRef={loaderRef}
          labels={{
            featured: t('news.featured'),
            loadMore: t('common.loadMore'),
            empty: t('news.empty'),
            category: (k) => t(k),
          }}
          locale={locale}
        />
      </main>

      <Footer />
    </div>
  );
};

export default AllNewsPage;
