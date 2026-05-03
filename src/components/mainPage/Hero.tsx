import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { useNavigate } from 'react-router-dom';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.65)' };

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goLearnMore = () => {
    if (typeof (window as any).__snapGoTo === 'function') {
      (window as any).__snapGoTo('organisation');
    } else {
      document.querySelector('#organisation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const stats = [
    { value: t('mission.stat_1_value') || '300+', label: t('mission.stat_1_label') || 'Учасників' },
    { value: t('mission.stat_2_value') || '35',   label: t('mission.stat_2_label') || 'Країн' },
    { value: t('mission.stat_3_value') || '50+',  label: t('mission.stat_3_label') || 'Проєктів' },
  ];

  return (
    <section
      id="home"
      aria-label="Hero"
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      {/* ── Фото на весь экран ── */}
      <img
        src="/images/Q1.jpg"
        alt=""
        loading="eager"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* ── Градиент слева направо — тёмный слева, прозрачный справа ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(6,9,16,0.97) 0%, rgba(6,9,16,0.82) 35%, rgba(6,9,16,0.45) 65%, rgba(6,9,16,0.15) 100%)',
      }} />

      {/* ── Дополнительный тёмный низ ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(6,9,16,0.7) 0%, transparent 40%)',
      }} />

      {/* ── Контент — прижат влево ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1200, width: '100%',
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ maxWidth: 680 }}>

         
          {/* Title */}

          <h1
            className="font-raleway"
            style={{
              color: '#fff', fontWeight: 700,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.15, marginBottom: 20,
            }}
          >
            Qhub - {t('hero.title')}
          </h1>

          {/* Description */}
          <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', lineHeight: 1.75, color: Q.muted, marginBottom: 8, maxWidth: 480 }}>
            {t('hero.description1')}
          </p>
          <p style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1rem)', lineHeight: 1.75, color: 'rgba(200,230,230,0.5)', marginBottom: 36, maxWidth: 480 }}>
            {t('hero.description2')}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
            <button
              onClick={goLearnMore}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 50, padding: '0 28px', borderRadius: 12,
                border: 'none', background: '#f97316', color: '#fff',
                fontWeight: 600, fontSize: 15, cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {t('hero.button_learn_more')}
              <ArrowRight style={{ width: 18, height: 18 }} />
            </button>

            <button
              onClick={() => navigate('/media')}
              style={{
                display: 'inline-flex', alignItems: 'center',
                height: 50, padding: '0 28px', borderRadius: 12,
                border: '1.5px solid rgba(77,184,184,0.5)',
                background: 'transparent', color: Q.teal,
                fontWeight: 600, fontSize: 15, cursor: 'pointer',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,184,184,0.1)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {t('hero.button_media')}
            </button>
          </div>

         
        </div>
      </div>

      {/* ── Статистика — правый нижний угол ── */}
      <div style={{
        position: 'absolute', bottom: 48, right: 48, zIndex: 2,
        display: 'flex', gap: 32, alignItems: 'flex-end',
      }}>
        {/* Вертикальный разделитель */}
        <div style={{ width: 1, height: 60, background: 'rgba(77,184,184,0.2)', alignSelf: 'center' }} />
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div className="font-raleway" style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: Q.teal, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(200,230,230,0.45)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 5 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Scroll indicator ── */}
      <div  className="hidden sm:flex" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <div className="animate-bounce">
          <div style={{ width: 24, height: 40, borderRadius: 12, border: '2px solid rgba(77,184,184,0.5)', display: 'flex', justifyContent: 'center' }}>
            <div className="animate-pulse" style={{ width: 4, height: 12, borderRadius: 4, background: 'rgba(77,184,184,0.8)', marginTop: 8 }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
