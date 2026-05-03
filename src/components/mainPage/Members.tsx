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
    <div style={{ marginTop: 8, width: 16, height: 1.5, background: `linear-gradient(90deg, #4db8b8, transparent)`, borderRadius: 1 }} />
  </div>
);

const DESKTOP_INITIAL = 5;
const MOBILE_INITIAL  = 3;

interface MembersProps {
  onExpandChange?: (expanded: boolean) => void;
}

const Members = ({ onExpandChange }: MembersProps) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    const next = !showAll;
    setShowAll(next);
    onExpandChange?.(next);
  };

  const visibleDesktop = showAll ? memberLogos : memberLogos.slice(0, DESKTOP_INITIAL);
  const visibleMobile  = showAll ? memberLogos : memberLogos.slice(0, MOBILE_INITIAL);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%' }}>
      <style>{`
        .members-desktop { display: none !important; }
        .members-mobile  { display: grid !important; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }

        @media (min-width: 640px) {
          .members-desktop { display: grid !important; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 12px; }
          .members-mobile  { display: none !important; }
        }

        .member-card {
          border-radius: 12px;
          padding: 12px 8px 10px;
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
          .member-card { border-radius: 14px; padding: 16px 12px 14px; }
        }

        .member-avatar { margin-bottom: 8px; transition: transform 0.2s; }
        .member-card:hover .member-avatar { transform: scale(1.05); }
        @media (min-width: 640px) { .member-avatar { margin-bottom: 10px; } }

        .member-name { font-size: 11px; font-weight: 500; color: #e8f4f4; line-height: 1.3; margin-bottom: 2px; }
        .member-role { font-size: 10px; color: rgba(200,230,230,0.38); line-height: 1.3; }
        @media (min-width: 640px) {
          .member-name { font-size: 13px; margin-bottom: 3px; }
          .member-role { font-size: 11px; }
        }

        .members-more-btn {
          display: inline-block; margin-top: 20px;
          padding: 9px 24px; border-radius: 30px;
          border: 0.5px solid rgba(77,184,184,0.35);
          background: transparent; color: #4db8b8;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: background 0.2s;
        }
        .members-more-btn:hover { background: rgba(77,184,184,0.08); }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 className="font-raleway font-semibold"
          style={{ color: Q.text, fontSize: 'clamp(1.875rem, 4vw, 3rem)', marginBottom: 12 }}>
          {t('members.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 12px' }} />
        <p style={{ fontSize: 16, maxWidth: 620, margin: '0 auto', color: Q.muted }}>
          {t('members.subtitle')}
        </p>
      </div>

      <LogoMarquee />

      <div style={{ marginTop: 28 }}>
        <h3 className="font-raleway font-semibold"
          style={{ color: Q.text, fontSize: 18, textAlign: 'center', marginBottom: 16 }}>
          {t('members.team')}
        </h3>

        <div className="members-desktop">
          {visibleDesktop.map((m, i) => <MemberCard key={i} member={m} avatarSize={48} t={t} />)}
        </div>

        <div className="members-mobile">
          {visibleMobile.map((m, i) => <MemberCard key={i} member={m} avatarSize={44} t={t} />)}
        </div>

        {memberLogos.length > DESKTOP_INITIAL && (
          <div style={{ textAlign: 'center' }}>
            <button className="members-more-btn" onClick={handleToggle}>
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
