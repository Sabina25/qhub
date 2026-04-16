import { useState } from 'react';
import memberLogos from '../../data/members';
import LogoMarquee from '../LogoMarquee';
import { useTranslation } from '../../context/TranslationContext';

const Q = {
  teal: '#4db8b8', teal2: '#2d7d9a',
  text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)',
  faint: 'rgba(200,230,230,0.38)', bg: '#080c14',
};

const Avatar = ({ src, name, size = 40 }: { src?: string; name: string; size?: number }) => {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${Q.teal2}, ${Q.teal})`,
      border: '1.5px solid rgba(77,184,184,0.25)',
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontWeight: 700, fontSize: size * 0.3, color: Q.bg }}>{initials}</span>}
    </div>
  );
};

const MemberCard = ({ member, avatarSize, t }: { member: any; avatarSize: number; t: (k: string) => string }) => (
  <div className="member-card">
    <div className="member-avatar">
      <Avatar src={member.imageUrl} name={t(member.name)} size={avatarSize} />
    </div>
    <p className="member-name">{t(member.name)}</p>
    <p className="member-role">{t(member.role)}</p>
    <div style={{ marginTop: 10, width: 20, height: 1.5, background: `linear-gradient(90deg, #4db8b8, transparent)`, borderRadius: 1 }} />
  </div>
);

const Members = () => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const DESKTOP_INITIAL = 4;
  const MOBILE_INITIAL  = 6;

  const visibleDesktop = showAll ? memberLogos : memberLogos.slice(0, DESKTOP_INITIAL);
  const visibleMobile  = showAll ? memberLogos : memberLogos.slice(0, MOBILE_INITIAL);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%' }}>
      <style>{`
        /* ── Grid ── */
        .members-desktop { display: none !important; }
        .members-mobile  { display: grid !important; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }

        @media (min-width: 640px) {
          .members-desktop { display: grid !important; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
          .members-mobile  { display: none !important; }
        }

        /* ── Card ── */
        .member-card {
          border-radius: 14px;
          padding: 14px 10px 12px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(77,184,184,0.14);
          transition: border-color 0.25s, background 0.25s;
        }
        .member-card:hover {
          border-color: rgba(77,184,184,0.4);
          background: rgba(77,184,184,0.07);
        }
        @media (min-width: 640px) {
          .member-card { border-radius: 20px; padding: 28px 18px 22px; }
        }

        /* ── Avatar ── */
        .member-avatar { margin-bottom: 10px; transition: transform 0.2s; }
        .member-card:hover .member-avatar { transform: scale(1.05); }
        @media (min-width: 640px) { .member-avatar { margin-bottom: 16px; } }

        /* ── Text ── */
        .member-name { font-size: 12px; font-weight: 500; color: #e8f4f4; line-height: 1.35; margin-bottom: 3px; }
        .member-role { font-size: 11px; color: rgba(200,230,230,0.38); line-height: 1.4; }
        @media (min-width: 640px) {
          .member-name { font-size: 15px; margin-bottom: 5px; }
          .member-role { font-size: 13px; }
        }

        /* ── Button ── */
        .members-more-btn {
          display: inline-block; margin-top: 24px;
          padding: 10px 28px; border-radius: 30px;
          border: 0.5px solid rgba(77,184,184,0.35);
          background: transparent; color: #4db8b8;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: background 0.2s;
        }
        .members-more-btn:hover { background: rgba(77,184,184,0.08); }
      `}</style>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 className="font-raleway font-semibold"
          style={{ color: Q.text, fontSize: 'clamp(1.875rem, 4vw, 3rem)', marginBottom: 16 }}>
          {t('members.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 16px' }} />
        <p style={{ fontSize: 18, maxWidth: 720, margin: '0 auto', color: Q.muted }}>
          {t('members.subtitle')}
        </p>
      </div>

      <LogoMarquee />

      <div style={{ marginTop: 40 }}>
        <h3 className="font-raleway font-semibold"
          style={{ color: Q.text, fontSize: 22, textAlign: 'center', marginBottom: 24 }}>
          {t('members.team')}
        </h3>

        {/* Desktop: 4 initial */}
        <div className="members-desktop">
          {visibleDesktop.map((m, i) => <MemberCard key={i} member={m} avatarSize={88} t={t} />)}
        </div>

        {/* Mobile: 6 initial */}
        <div className="members-mobile">
          {visibleMobile.map((m, i) => <MemberCard key={i} member={m} avatarSize={52} t={t} />)}
        </div>

        {memberLogos.length > DESKTOP_INITIAL && (
          <div style={{ textAlign: 'center' }}>
            <button className="members-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll
                ? t('members.show_less')
                : `${t('members.show_more') || 'Показати більше'} (${memberLogos.length - DESKTOP_INITIAL})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
