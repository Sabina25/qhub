import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { useAllNews } from '../hooks/useAllNews';
import { NewsGrid } from '../components/news/NewsGrid';

const AllEventsPage: React.FC = () => {
  const { lang, t } = useTranslation(); // 'ua' | 'en'
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
    <>
      <Header appearance="solid" />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">
          {t('news.allNews') || 'All News'}
        </h1>
        <hr className="mb-10 border-t border-gray-300" />

        <NewsGrid
          items={visibleItems}
          loadingInitial={loadingInitial}
          loadingMore={loadingMore}
          error={error}
          canLoadMore={canLoadMore}
          onLoadMore={loadMore}
          loaderRef={loaderRef}
          labels={{
            featured: t('news.featured') || 'Featured',
            loadMore: t('common.loadMore') || 'Load more',
            empty: t('news.empty') || 'No news yet',
            category: (k) => t(k) || k,
          }}
        />
      </main>
      <Footer />
    </>
  );
};

export default AllEventsPage;
