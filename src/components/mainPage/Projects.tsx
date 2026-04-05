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

const FIXED_H = 'md:h-[300px] lg:h-[360px]';
const Q = { teal: '#4db8b8', text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)', meta: 'rgba(200,230,230,0.45)' };

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
          const fa = a.featured ? 1 : 0, fb = b.featured ? 1 : 0;
          if (fa !== fb) return fb - fa;
          return String(a.dateYMD || '') > String(b.dateYMD || '') ? -1 : 1;
        });
        setItems(list.slice(0, 5));
      } catch (e: any) { setErr(e?.message || 'Failed to load projects'); }
      finally { setLoading(false); }
    })();
  }, []);

  const slides = useMemo(() => {
    const locale = (lang as Lang) === 'ua' ? 'uk-UA' : 'en-GB';
    return items.map((pr) => {
      const title = pickL10n(pr.title as any, lang as Lang);
      const description = stripHtmlToText(pickL10n((pr as any).descriptionHtml, lang as Lang) || '', 240);
      const funding = pickL10n((pr as any).funding, lang as Lang);
      const duration = pickL10n((pr as any).duration, lang as Lang) || formatYMD(pr.dateYMD, locale);
      const participants = pickL10n((pr as any).participants, lang as Lang);
      const location = pickL10n((pr as any).location, lang as Lang);
      const image = pickL10n((pr as any).image, lang as Lang) || (pr as any).image || '';
      return { ...pr, title, description, funding, duration, participants, location, image };
    });
  }, [items, lang]);

  return (
    <div className="max-w-6xl mx-auto px-4 w-full">
      <div className="text-center mb-8">
       
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-raleway" style={{ color: Q.text }}>
          {t('projects.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg,#4db8b8,#2d7d9a)', borderRadius: 2, margin: '0 auto 14px' }} />
        <p className="max-w-3xl mx-auto text-[15px] sm:text-lg leading-relaxed" style={{ color: Q.muted }}>
          {t('projects.intro')}
        </p>
      </div>

      {err && (
        <div className="mb-4 rounded-xl p-4" style={{ border: '0.5px solid rgba(255,100,100,0.3)', background: 'rgba(255,80,80,0.08)', color: '#f87171' }}>{err}</div>
      )}

      {loading ? (
        <div className={`h-[240px] ${FIXED_H} rounded-xl animate-pulse`} style={{ background: 'rgba(77,184,184,0.06)' }} />
      ) : items.length === 0 ? (
        <div className="text-center" style={{ color: Q.muted }}>No projects yet</div>
      ) : (
        <FancyCarousel className="mt-4" autoplayMs={7000} showOverlayDate={false} fixedHeight={FIXED_H}>
          {slides.map((pr, i) => (
            <div key={pr.id || `slide-${i}`}>
              <div className={`flex flex-col lg:flex-row ${FIXED_H} rounded-xl overflow-hidden`}
                style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(77,184,184,0.16)' }}>
                {/* Image */}
                <div className="relative w-full lg:w-1/2 h-48 sm:h-56 md:h-full">
                  {pr.image
                    ? <img src={pr.image} alt={pr.title} className="h-full w-full object-cover" loading="lazy" />
                    : <div className="h-full w-full" style={{ background: 'rgba(77,184,184,0.07)' }} />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  {pr.featured && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">Featured</span>
                  )}
                </div>
                {/* Content */}
                <div className="w-full lg:w-1/2 p-5 lg:p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="font-raleway uppercase text-xl sm:text-2xl mb-2 line-clamp-2" style={{ color: Q.text }}>{pr.title}</h3>
                    {(pr.duration || pr.location) && (
                      <div className="text-sm mb-3 flex flex-wrap gap-x-2" style={{ color: Q.meta }}>
                        {pr.duration && <span>{pr.duration}</span>}
                        {pr.duration && pr.location && <span>•</span>}
                        {pr.location && <span>{pr.location}</span>}
                      </div>
                    )}
                    {(pr.funding || pr.participants) && (
                      <div className="text-sm font-semibold mb-2 flex flex-wrap gap-x-2" style={{ color: Q.teal }}>
                        {pr.funding && <span>{pr.funding}</span>}
                        {pr.funding && pr.participants && <span>•</span>}
                        {pr.participants && <span>{pr.participants}</span>}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed line-clamp-5" style={{ color: Q.muted }}>{pr.description}</p>
                  </div>
                  <button onClick={() => navigate(`/projects/${pr.id}`)}
                    className="mt-4 self-start rounded-lg bg-orange-500 px-4 py-2 text-white font-semibold hover:bg-orange-600 transition">
                    {t('projects.button_more')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </FancyCarousel>
      )}
    </div>
  );
};

export default Projects;
