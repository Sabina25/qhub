import { useEffect, useRef } from 'react';
import { useTranslation } from '../context/TranslationContext';

const logos = [
  { src: '/images/partnersLogo/logo_01.png',          link: 'https://www.youtube.com/@crimea_vox' },
  { src: '/images/partnersLogo/Logo_3@4x.png',        link: 'https://www.dumk.org/' },
  { src: '/images/partnersLogo/logo_text_white.jpg',  link: 'https://amu.org.ua/' },
  { src: '/images/partnersLogo/logo_takava_page-0001.jpg', link: 'https://www.instagram.com/takava_coffeebuffet/' },
  { src: '/images/partnersLogo/CD.png',               link: 'https://www.instagram.com/crimeadaily/' },
  { src: '/images/partnersLogo/kf.jpg',               link: 'https://crimeanfront.org/' },
  { src: '/images/partnersLogo/kd.jpg',               link: 'https://crimeanhouse.org/' },
  { src: '/images/partnersLogo/f.jpg',                link: 'https://www.instagram.com/qirim.young/' },
  { src: '/images/partnersLogo/m.jpg',                link: 'https://qtmm.org/' },
  { src: '/images/partnersLogo/icon-tamga.png',       link: 'https://qmvf.org/' },
  { src: '/images/partnersLogo/qd.jpg',               link: 'https://www.instagram.com/qadindivani/' },
];

const Q = { teal: '#4db8b8', teal2: '#2d7d9a' };
const SPEED = 0.6; // px/frame
const LOGO_H = 44;

const LogoMarquee = () => {
  const trackRef    = useRef<HTMLDivElement>(null);
  const isHovered   = useRef(false);
  const xRef        = useRef(0);
  const halfWRef    = useRef(0);
  const rafRef      = useRef<number>(0);
  const { t }       = useTranslation();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const half = Math.ceil(children.length / 2);
      halfWRef.current = children.slice(0, half).reduce((w, el) => w + el.offsetWidth, 0);
    };

    const step = () => {
      if (!isHovered.current) {
        xRef.current -= SPEED;
        if (xRef.current <= -halfWRef.current) xRef.current += halfWRef.current;
        track.style.transform = `translateX(${xRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      style={{ width: '100%', padding: '28px 0 24px' }}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      <style>{`
        .lm-desktop { display: block; }
        .lm-mobile  { display: none; }
        @media (max-width: 767px) {
          .lm-desktop { display: none !important; }
          .lm-mobile  { display: block !important; }
        }
        .lm-logo-link {
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; height: ${LOGO_H}px;
          transition: opacity 0.2s;
          text-decoration: none;
        }
        .lm-logo-link:hover { opacity: 0.75; }
        .lm-logo-link img {
          max-height: ${LOGO_H}px;
          width: auto;
          object-fit: contain;
          filter: none;
          opacity: 0.65;
          transition: opacity 0.2s;
        }
        .lm-logo-link:hover img { opacity: 1; }
        .lm-sep {
          width: 1px;
          height: 20px;
          background: rgba(77,184,184,0.2);
          flex-shrink: 0;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <span style={{
            fontSize: 10, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap',
            background: 'rgba(77,184,184,0.1)',
            border: '0.5px solid rgba(77,184,184,0.3)',
            color: Q.teal, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500,
          }}>
            {t('members.title')}
          </span>
          <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(90deg, rgba(77,184,184,0.4), rgba(77,184,184,0.05))` }} />
        </div>

        {/* ── Marquee track ── */}
        <div style={{
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          maskImage:        'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              willChange: 'transform',
              height: LOGO_H + 8,
            }}
          >
            {/* Дублируем для бесконечной прокрутки */}
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <a
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lm-logo-link"
                  style={{ padding: '0 24px' }}
                >
                  <img src={logo.src} alt={`partner-${i}`} loading="lazy" />
                </a>
                {/* Разделитель */}
                <div className="lm-sep" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
