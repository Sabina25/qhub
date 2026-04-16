import React from 'react';
import { Target, Heart, Globe, Award } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const Q = {
  teal: '#4db8b8', teal2: '#2d7d9a',
  text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)',
  faint: 'rgba(200,230,230,0.38)',
};

const TealLine = () => (
  <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, marginBottom: 16 }} />
);

const cell: React.CSSProperties = {
  borderRadius: 16, padding: '20px 22px',
  background: 'rgba(255,255,255,0.04)',
  border: '0.5px solid rgba(77,184,184,0.13)',
  transition: 'border-color 0.25s',
};
const cellAccent: React.CSSProperties = {
  ...cell,
  background: 'rgba(77,184,184,0.07)',
  border: '0.5px solid rgba(77,184,184,0.28)',
};

const hov = (e: React.MouseEvent<HTMLDivElement>, on: boolean, accent = false) => {
  e.currentTarget.style.borderColor = on
    ? 'rgba(77,184,184,0.45)'
    : accent ? 'rgba(77,184,184,0.28)' : 'rgba(77,184,184,0.13)';
};

const Mission = () => {
  const { t } = useTranslation();

  const values = [
    { Icon: Target, color: Q.teal,    tk: 'vision',  num: '01' },
    { Icon: Heart,  color: '#f97316', tk: 'values',  num: '02' },
    { Icon: Globe,  color: Q.teal,    tk: 'mission', num: '03' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <style>{`
        .mission-mobile  { display: flex !important; }
        .mission-desktop { display: none  !important; }
        @media (min-width: 768px) {
          .mission-mobile  { display: none  !important; }
          .mission-desktop { display: block !important; }
        }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-raleway font-semibold text-3xl sm:text-4xl md:text-5xl mb-4" style={{ color: Q.text }}>
          {t('mission.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto' }} />
      </div>

      {/* ══ MOBILE ══ */}
      <div className="mission-mobile" style={{ flexDirection: 'column', gap: 12 }}>

        {/* Mission quote */}
        <div style={{ ...cellAccent }}
          onMouseEnter={e => hov(e, true, true)}
          onMouseLeave={e => hov(e, false, true)}>
          <TealLine />
          <h3 className="font-raleway font-semibold text-xl mb-3" style={{ color: Q.text, lineHeight: 1.4 }}>
            "{t('mission.subtitle')}"
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: Q.muted }}>{t('mission.vision_text')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, padding: '10px 14px', borderRadius: 10, background: 'rgba(249,115,22,0.1)', border: '0.5px solid rgba(249,115,22,0.25)' }}>
            <Award style={{ width: 18, height: 18, color: '#f97316', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#f97316' }}>{t('mission.award_label')}</p>
              <p style={{ fontSize: 11, color: 'rgba(249,115,22,0.55)' }}>{t('mission.award_subtext')}</p>
            </div>
          </div>
        </div>

        {/* Photo mobile */}
        <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', border: '0.5px solid rgba(77,184,184,0.15)', height: 220 }}>
          <img src="/images/team.jpg" alt="Team"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,20,0.6), transparent)' }} />
          <p style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(200,230,230,0.6)' }}>
            Наша команда
          </p>
        </div>

        {/* Values mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {values.map(({ Icon, color, tk, num }) => {
            const rgba = color === '#f97316' ? '249,115,22' : '77,184,184';
            return (
              <div key={tk} style={{ ...cell, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}
                onMouseEnter={e => hov(e, true)}
                onMouseLeave={e => hov(e, false)}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: Q.teal, opacity: 0.4 }}>{num}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `rgba(${rgba},0.1)`, border: `0.5px solid rgba(${rgba},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </div>
                </div>
                <div>
                  <h4 className="font-raleway font-semibold uppercase mb-1" style={{ fontSize: 12, color: Q.text }}>
                    {t(`mission.${tk}_title`)}
                  </h4>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: Q.muted }}>{t(`mission.${tk}_text`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ DESKTOP ══ */}
      <div className="mission-desktop">

        {/* Top: цитата слева + большое фото справа */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12, marginBottom: 12 }}>

          {/* Mission quote */}
          <div
            style={{ ...cellAccent, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onMouseEnter={e => hov(e, true, true)}
            onMouseLeave={e => hov(e, false, true)}
          >
            <div>
              <TealLine />
              <h3 className="font-raleway font-semibold"
                style={{ fontSize: 'clamp(18px,1.5vw,22px)', color: Q.text, lineHeight: 1.4, marginBottom: 16 }}>
                "{t('mission.subtitle')}"
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: Q.muted }}>
                {t('mission.vision_text')}
              </p>
            </div>

            {/* Award */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, padding: '12px 16px', borderRadius: 12, background: 'rgba(249,115,22,0.1)', border: '0.5px solid rgba(249,115,22,0.25)' }}>
              <Award style={{ width: 20, height: 20, color: '#f97316', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f97316' }}>{t('mission.award_label')}</p>
                <p style={{ fontSize: 11, color: 'rgba(249,115,22,0.55)' }}>{t('mission.award_subtext')}</p>
              </div>
            </div>
          </div>

          {/* Большое фото — занимает всю правую колонку */}
          <div style={{
            borderRadius: 16, overflow: 'hidden', position: 'relative',
            border: '0.5px solid rgba(77,184,184,0.18)',
            minHeight: 340,
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(77,184,184,0.35)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(77,184,184,0.18)')}
          >
            <img src="/images/team.jpg" alt="Team"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,20,0.65), transparent 50%)' }} />
            <p style={{ position: 'absolute', bottom: 16, left: 18, fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(200,230,230,0.6)' }}>
              Наша команда
            </p>
          </div>
        </div>

        {/* Bottom: 3 ценности */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
          {values.map(({ Icon, color, tk, num }) => {
            const rgba = color === '#f97316' ? '249,115,22' : '77,184,184';
            return (
              <div key={tk}
                style={{ ...cell, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}
                onMouseEnter={e => hov(e, true)}
                onMouseLeave={e => hov(e, false)}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: Q.teal, opacity: 0.4 }}>{num}</span>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${rgba},0.1)`, border: `0.5px solid rgba(${rgba},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 18, height: 18, color }} />
                  </div>
                </div>
                <div>
                  <h4 className="font-raleway font-semibold uppercase mb-2" style={{ fontSize: 13, color: Q.text }}>
                    {t(`mission.${tk}_title`)}
                  </h4>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: Q.muted }}>
                    {t(`mission.${tk}_text`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Mission;
