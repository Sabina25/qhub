import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { useAllNews } from '../hooks/useAllNews';
import { NewsGrid } from '../components/admin/NewsGrid';


const AllNewsPage: React.FC = () => {
 const { lang, t } = useTranslation(); // 'ua' | 'en'
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
    <>
      <Header appearance="solid" />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">
          {t('news.allNews')}
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
            featured: t('news.featured'),
            loadMore: t('common.loadMore'),
            empty: t('news.empty'),
            category: (k) => t(k),
          }}
          locale={locale} 
        />
      </main>
      <Footer />
    </>
  );
};

export default AllNewsPage;
