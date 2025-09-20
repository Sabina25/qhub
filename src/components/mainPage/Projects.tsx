import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../../context/TranslationContext';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

import { fetchProjects, ProjectDoc } from '../../data/projects';
import { FancyCarousel } from '../FancyCarousel';

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

const FIXED_H = 'h-[460px]'; // ← единая высота карточки/слайда

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
      const title = pickL10n(pr.title as any, lang as Lang);
  
      const descHtmlRaw = pickL10n((pr as any).descriptionHtml, lang as Lang);
      const description = stripHtmlToText(descHtmlRaw || '', 240);

      const funding = pickL10n((pr as any).funding, lang as Lang);
      const durationRaw = pickL10n((pr as any).duration, lang as Lang);
      const participants = pickL10n((pr as any).participants, lang as Lang);
      const location = pickL10n((pr as any).location, lang as Lang);
  
      const duration = durationRaw || formatYMD(pr.dateYMD, locale);
  
      const image = pickL10n((pr as any).image, lang as Lang) || (pr as any).image || '';
  
      return {
        ...pr,
        title,
        description,
        funding: funding || '',
        duration: duration || '',
        participants: participants || '',
        location: location || '',
        image,
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
          <p className="mt-4 text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
            {t('projects.intro')}
          </p>
        </div>

        {err && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
            {err}
          </div>
        )}

        {loading ? (
          <div className={`${FIXED_H} bg-gray-100 rounded-lg animate-pulse`} />
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">No projects yet</div>
        ) : (
          <FancyCarousel
            className="mt-4"
            autoplayMs={7000}
            showOverlayDate={false}
            fixedHeight={FIXED_H}
          >
            {slides.map((pr, i) => (
              <div key={pr.id || `slide-${i}`}>
                <div className={`flex flex-col lg:flex-row ${FIXED_H}`}>
                  {/* LEFT — image */}
                  <div className="relative lg:w-1/2 w-full h-1/2 lg:h-full">
                    {pr.image ? (
                      <img
                        src={pr.image}
                        alt={pr.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                    {pr.featured && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* RIGHT — content */}
                  <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between h-1/2 lg:h-full">
                    <div>
                      <h3 className="font-raleway uppercase text-3xl text-gray-900 mb-2 line-clamp-2">
                        {pr.title}
                      </h3>

                      {/* Дата и локация под тайтлом */}
                      {(pr.duration || pr.location) && (
                        <div className="text-sm text-gray-600 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                          {pr.duration && <span>{pr.duration}</span>}
                          {pr.duration && pr.location && <span>•</span>}
                          {pr.location && <span>{pr.location}</span>}
                        </div>
                      )}

                      {(pr.funding || pr.participants) && (
                        <div className="text-sm font-semibold mb-3 flex flex-wrap gap-x-2 gap-y-1 text-[#319795]">
                          {pr.funding && <span>{pr.funding}</span>}
                          {pr.funding && pr.participants && <span>•</span>}
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
                      focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/40"
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
