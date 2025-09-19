import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import { useAllProjects } from '../hooks/useAllProjects';
import { ProjectsGrid } from '../components/ProjectsGrid';

const AllProjectsPage: React.FC = () => {
  const { lang, t } = useTranslation(); // 'ua' | 'en'
  const { locale, visibleItems, loadingInitial, loadingMore, error, canLoadMore, loadMore, loaderRef } =
    useAllProjects(lang);

    console.log('locale: ', locale)

  return (
    <>
      <Header appearance="solid" />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">
          {t ? t('projects.title') : 'All Projects'}
        </h1>

        <ProjectsGrid
          items={visibleItems}
          loadingInitial={loadingInitial}
          loadingMore={loadingMore}
          error={error}
          canLoadMore={canLoadMore}
          onLoadMore={loadMore}
          loaderRef={loaderRef}
          labels={{ more: t('common.loadMore'), empty: t('projects.empty') }}
          locale={locale}
        />
      </main>
      <Footer />
    </>
  );
};

export default AllProjectsPage;
