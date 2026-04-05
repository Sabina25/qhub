import { useState } from 'react';
import memberLogos from '../../data/members';
import LogoMarquee from '../LogoMarquee';
import { useTranslation } from '../../context/TranslationContext';

const Q = {
  teal: '#4db8b8',
  teal2: '#2d7d9a',
  text: '#e8f4f4',
  muted: 'rgba(200,230,230,0.6)',
  faint: 'rgba(200,230,230,0.38)',
  bg: '#080c14',
};

const Avatar = ({ src, name, size = 40 }: { src?: string; name: string; size?: number }) => {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${Q.teal2}, ${Q.teal})`,
      border: '1.5px solid rgba(77,184,184,0.25)',
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontWeight: 700, fontSize: size * 0.3, color: Q.bg }}>{initials}</span>}
    </div>
  );
};

const Members = () => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const visible = showAll ? memberLogos : memberLogos.slice(0, 4);
  const hasMore = memberLogos.length > 4;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

      <div className="text-center mb-10">
       
        <h2 className="font-raleway font-semibold text-4xl md:text-5xl mb-4" style={{ color: Q.text }}>
          {t('members.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 16px' }} />
        <p className="font-notosans text-xl max-w-3xl mx-auto" style={{ color: Q.muted }}>
          {t('members.subtitle')}
        </p>
      </div>

      <LogoMarquee />

      <div className="mt-10">
        <h3 className="font-raleway font-semibold text-2xl text-center mb-8" style={{ color: Q.text }}>
          {t('members.team')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {visible.map((member, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 flex flex-col items-center text-center group transition-all duration-250"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(77,184,184,0.14)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(77,184,184,0.4)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(77,184,184,0.07)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(77,184,184,0.14)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              <div className="group-hover:scale-105 transition-transform duration-200 mb-4">
                <Avatar src={member.imageUrl} name={t(member.name)} size={80} />
              </div>

              <p style={{ fontSize: 14, fontWeight: 500, color: Q.text, lineHeight: 1.35, marginBottom: 4 }}>
                {t(member.name)}
              </p>

              <p style={{ fontSize: 12, color: Q.faint, lineHeight: 1.4 }}>
                {t(member.role)}
              </p>

              <div style={{
                marginTop: 14, width: 24, height: 1.5,
                background: `linear-gradient(90deg, ${Q.teal}, transparent)`,
                borderRadius: 1,
              }} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: 'transparent',
                border: '0.5px solid rgba(77,184,184,0.35)',
                borderRadius: 30,
                padding: '10px 28px',
                color: Q.teal,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {showAll
                ? t('members.show_less')
                : `${t('members.show_more') || 'Показати більше'} (${memberLogos.length - 12})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;