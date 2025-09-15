import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../context/TranslationContext';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

import { fetchProjects, ProjectDoc } from '../../data/projects';
import { FancyCarousel } from '../FancyCarousel'; // <— проверь путь

type Lang = 'ua' | 'en';

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}
function stripHtmlToText(html: string, max = 220): string {
  const clean = DOMPurify.sanitize(html || '');
  const tmp = document.createElement('div');
  tmp.innerHTML = clean;
  const text = (tmp.textContent || '').trim().replace(/\s+/g, ' ');
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
function formatYMD(ymd?: string, locale = 'uk-UA') {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

const Projects: React.FC = () => {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const [items, setItems] = useState<ProjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProjects();
        list.sort((a, b) => {
          const fa = a.featured ? 1 : 0;
          const fb = b.featured ? 1 : 0;
          if (fa !== fb) return fb - fa;
          const da = String(a.dateYMD || '');
          const db = String(b.dateYMD || '');
          return da > db ? -1 : da < db ? 1 : 0;
        });
        setItems(list.slice(0, 5));
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const slides = useMemo(() => {
    const locale = (lang as Lang) === 'ua' ? 'uk-UA' : 'en-GB';
    return items.map((pr) => {
      const title = pickL10n(pr.title, lang as Lang);
      const descHtml = pickL10n((pr as any).descriptionHtml, lang as Lang);
      const description = stripHtmlToText(descHtml, 240);

      return {
        ...pr,
        title,
        description,
        funding: (pr as any).funding || '',
        duration: (pr as any).duration || formatYMD(pr.dateYMD, locale),
        participants: (pr as any).participants || '',
      };
    });
  }, [items, lang]);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 font-raleway text-gray-900">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-notosans">
            {t('projects.subtitle')}
          </p>
        </div>

        {err && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
            {err}
          </div>
        )}

        {loading ? (
          <div className="h-[420px] bg-gray-100 rounded-lg animate-pulse" />
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">No projects yet</div>
        ) : (
          <FancyCarousel
            className="mt-4"
            autoplayMs={7000}
            dates={slides.map(pr => pr.dateYMD || '')}
            formatDate={(d) => {
              const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';
              if (d instanceof Date) return d.toLocaleDateString(locale);
              const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/);
              if (m) {
                const [_, y, mo, da] = m;
                return new Date(+y, +mo - 1, +da).toLocaleDateString(locale);
              }
              return String(d);
            }}
            datePlacement="top-right"
          >
            {slides.map((pr, i) => (
              <div key={pr.id || `slide-${i}`}>
                <div className="flex flex-col lg:flex-row min-h-[420px]">
                  <div className="relative lg:w-1/2 w-full">
                    {pr.image ? (
                      <img
                        src={pr.image}
                        alt={pr.title}
                        className="h-80 lg:h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-80 lg:h-full w-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {pr.featured && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* RIGHT — content */}
                  <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-raleway uppercase text-3xl text-gray-900 mb-4 line-clamp-2">
                        {pr.title}
                      </h3>

                      {(pr.funding || pr.duration || pr.participants) && (
                        <div className="text-sm font-semibold mb-3 flex flex-wrap gap-x-2 gap-y-1 text-[#319795]"> {/* brand */}
                          {pr.funding && <span>{pr.funding}</span>}
                          {pr.funding && pr.duration && <span>•</span>}
                          {pr.duration && <span>{pr.duration}</span>}
                          {(pr.funding || pr.duration) && pr.participants && <span>•</span>}
                          {pr.participants && <span>{pr.participants}</span>}
                        </div>
                      )}

                      <p className="text-gray-700 text-base leading-relaxed font-notosans line-clamp-5">
                        {pr.description}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/projects/${pr.id}`)}
                      className="mt-6 self-start rounded-lg bg-orange-500 px-5 py-2 text-white font-semibold shadow
                      hover:bg-orange-600 active:scale-[0.99] transition
                      focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/40"  // brand
                    >
                      {t('projects.button_more')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </FancyCarousel>
        )}
      </div>
    </section>
  );
};

export default Projects;
