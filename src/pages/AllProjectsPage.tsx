import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';

import { fetchProjects, ProjectDoc } from '../data/projects';

type Lang = 'ua' | 'en';

// --- helpers ---
function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function stripHtmlToText(html: string, max = 220): string {
  if (!html) return '';
  const clean = DOMPurify.sanitize(html);
  const tmp = document.createElement('div');
  tmp.innerHTML = clean;
  const text = (tmp.textContent || '').trim().replace(/\s+/g, ' ');
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function formatYMD(ymd?: string, locale: string = 'uk-UA'): string {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

function formatRange(p: ProjectDoc, locale: string): string {
  if (p.dateYMD) return formatYMD(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD) {
    return `${formatYMD(p.dateStartYMD, locale)} – ${formatYMD(p.dateEndYMD, locale)}`;
  }
  return formatYMD(p.dateStartYMD || p.dateEndYMD, locale);
}

function bestSortKey(p: ProjectDoc): string {

  return String(p.dateYMD || p.dateEndYMD || p.dateStartYMD || '');
}

const PAGE_SIZE = 4;

const AllProjectsPage: React.FC = () => {
  const { lang } = useTranslation(); // 'ua' | 'en'
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const [items, setItems] = useState<ProjectDoc[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProjects();
        list.sort((a, b) => (bestSortKey(a) > bestSortKey(b) ? -1 : 1));
        setItems(list);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasMore = visibleCount < items.length;
  const visible = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const handleLoadMore = () => setVisibleCount((c) => Math.min(c + PAGE_SIZE, items.length));

  return (
    <>
      <Header appearance="solid" />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">All Projects</h1>

        {err && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
            {err}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse h-72" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">No projects yet</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {visible.map((project) => {
                const title = pickL10n(project.title as any, lang as Lang);
                const location = pickL10n((project as any).location, lang as Lang);
                const descHtml = pickL10n((project as any).descriptionHtml, lang as Lang);
                const dateStr = formatRange(project, locale);
                const descText = stripHtmlToText(descHtml || '');

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded mb-4">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={title || 'project cover'}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200" />
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2 line-clamp-2">{title || '—'}</h2>

                    {(dateStr || location) && (
                      <div className="text-sm text-gray-500 mb-2">
                        {dateStr && <span>{dateStr}</span>}
                        {dateStr && location && <span className="mx-2">•</span>}
                        {location && <span>{location}</span>}
                      </div>
                    )}

                    <p className="text-gray-700 mb-3 line-clamp-3">{descText}</p>
                    <div className="space-y-1 text-sm text-gray-500">
                      {'funding' in project && (project as any).funding && (
                        <p>Funding: {(project as any).funding}</p>
                      )}
                      {'duration' in project && (project as any).duration && (
                        <p>Duration: {(project as any).duration}</p>
                      )}
                      {'participants' in project && (project as any).participants && (
                        <p>Participants: {(project as any).participants}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  More
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AllProjectsPage;
