import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const SLIDES = [
  { imageSrc: '/images/aziz-axtemov.jpeg',  startISO: '2021-09-04', nameKey: 'politicalPrisoners.azizAkhtemov.name',  textKey: 'politicalPrisoners.azizAkhtemov.text' },
  { imageSrc: '/images/asan_axtemov.png',   startISO: '2021-09-04', nameKey: 'politicalPrisoners.asanAkhtemov.name',  textKey: 'politicalPrisoners.asanAkhtemov.text' },
  { imageSrc: '/images/Appaz_Kurtamet.png', startISO: '2022-07-22', nameKey: 'politicalPrisoners.appazKurtamet.name', textKey: 'politicalPrisoners.appazKurtamet.text' },
];

const BANNER_H = 54; // px — высота баннера

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export const AnnouncementBanner = () => {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [fade, setFade] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Добавляем/убираем класс на body
  useEffect(() => {
    document.body.classList.add('has-banner');
    // Устанавливаем CSS переменную
    document.documentElement.style.setProperty('--banner-h', `${BANNER_H}px`);
    return () => {
      document.body.classList.remove('has-banner');
      document.documentElement.style.removeProperty('--banner-h');
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    document.body.classList.remove('has-banner');
    document.documentElement.style.removeProperty('--banner-h');
  };

  const goTo = (next: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFade(0);
    setTimeout(() => {
      setIdx(next % SLIDES.length);
      setFade(1);
    }, 220);
  };

  useEffect(() => {
    if (dismissed) return;
    timerRef.current = setInterval(() => goTo(idx + 1), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [idx, dismissed]);

  if (dismissed) return null;

  const slide = SLIDES[idx];
  const days = daysSince(slide.startISO);

  return (
    <>
      <style>{`
        .ann-banner {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: ${BANNER_H}px;
          z-index: 300;
          background: #0a0d14;
          border-bottom: 0.5px solid rgba(249,115,22,0.22);
          display: flex;
          align-items: center;
        }
        .ann-inner {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: opacity 0.22s ease;
        }
        /* Сдвигаем хедер и snap-container вниз */
        body.has-banner #site-header {
          top: ${BANNER_H}px !important;
        }
        body.has-banner .snap-container {
          top: ${BANNER_H + 60}px !important;
        }
        body.has-banner .snap-dots {
          top: calc(50% + ${BANNER_H / 2}px) !important;
        }
        body.has-banner .snap-section {
          height: calc(100vh - ${BANNER_H}px) !important;
          scroll-snap-align: start;
        }
        body.has-banner .snap-section--hero {
          height: calc(100vh - ${BANNER_H}px) !important;
        }
        /* Мобайл — меньше паддинга */
       @media (max-width: 640px) {
        .ann-inner { padding: 0 10px; gap: 8px; }
        .ann-text  { display: none; }
      }
      `}</style>

      <div className="ann-banner">
        <div className="ann-inner" style={{ opacity: fade }}>

          {/* Фото */}
          <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(249,115,22,0.5)' }}>
            <img src={slide.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Дні */}
          <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 44 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f97316', lineHeight: 1 }}>
              {days.toLocaleString()}
            </div>
            <div style={{ fontSize: 8, color: 'rgba(200,230,230,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {t('politicalPrisoners.days_in_detention')}
            </div>
          </div>

          <div style={{ width: 1, height: 20, background: 'rgba(249,115,22,0.25)', flexShrink: 0 }} />

          {/* Ім'я + текст */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="ann-name" style={{ fontSize: 13, fontWeight: 600, color: '#e8f4f4', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t(slide.nameKey)}
            </span>
            <span
              className="ann-text"
              style={{ fontSize: 12, color: 'rgba(200,230,230,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {t(slide.textKey)}
            </span>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {SLIDES.map((_, i) => (
              <button key={i}
                onClick={() => goTo(i)}
                style={{ width: i === idx ? 14 : 5, height: 5, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s', background: i === idx ? '#f97316' : 'rgba(249,115,22,0.22)' }}
              />
            ))}
          </div>

          {/* Close */}
          <button
            onClick={dismiss}
            style={{ width: 22, height: 22, borderRadius: '50%', border: '0.5px solid rgba(77,184,184,0.2)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(200,230,230,0.35)', flexShrink: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8f4f4')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,230,230,0.35)')}>
            <X style={{ width: 11, height: 11 }} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AnnouncementBanner;
