import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { useNavigate } from 'react-router-dom';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import DOMPurify from 'dompurify';
import { fetchProjects, ProjectDoc } from '../data/projects';

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

// простой плагин автоплей для keen-slider с паузой при наведении
function Autoplay(ms = 8000) {
  return (slider: any) => {
    let timeout: any;
    let mouseOver = false;
    const clearNext = () => timeout && clearTimeout(timeout);
    const next = () => {
      clearNext();
      if (mouseOver) return;
      timeout = setTimeout(() => slider.next(), ms);
    };
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => { mouseOver = true; clearNext(); });
      slider.container.addEventListener('mouseout', () => { mouseOver = false; next(); });
      next();
    });
    slider.on('dragStarted', clearNext);
    slider.on('animationEnded', next);
    slider.on('updated', next);
    slider.on('destroyed', clearNext);
  };
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

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    { loop: true, slides: { perView: 1 } },
    [Autoplay(8000)]
  );

  const slides = useMemo(() => {
    const locale = (lang as Lang) === 'ua' ? 'uk-UA' : 'en-GB';
    return items.map((pr) => {
      const title = pickL10n(pr.title, lang as Lang);
      const descHtml = pickL10n((pr as any).descriptionHtml, lang as Lang);
      const description = stripHtmlToText(descHtml, 240);

      // Доп. инфо: если funding/duration/participants нет — подставим дату
      const funding = (pr as any).funding || '';
      const duration = (pr as any).duration || formatYMD(pr.dateYMD, locale);
      const participants = (pr as any).participants || '';

      return { ...pr, title, description, funding, duration, participants };
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
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {slides.map((pr, index) => (
                <div key={pr.id || index} className="keen-slider__slide">
                  <div className="flex flex-col lg:flex-row bg-gray-50 rounded-lg shadow-md overflow-hidden min-h-[400px]">
                    {/* Left (cover) */}
                    <div className="lg:w-1/2 w-full h-80 lg:h-auto relative">
                      {pr.image ? (
                        <img
                          src={pr.image}
                          alt={pr.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      {pr.featured && (
                        <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Right */}
                    <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="font-raleway uppercase text-3xl text-gray-800 mb-4 line-clamp-2">
                          {pr.title}
                        </h3>

                        {(pr.funding || pr.duration || pr.participants) && (
                          <div className="text-sm text-blue-600 font-semibold mb-3 flex flex-wrap gap-x-2 gap-y-1">
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
                        className="mt-6 text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
                      >
                        {t('projects.button_more')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              type="button"
              onClick={() => instanceRef.current?.prev()}
              className="absolute top-1/2 left-0 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105 transition z-10"
              aria-label="Prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => instanceRef.current?.next()}
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105 transition z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
