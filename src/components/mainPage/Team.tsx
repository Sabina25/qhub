import memberLogos from '../../data/members';
import { useTranslation } from '../../context/TranslationContext';

const Q = {
  teal: '#4db8b8', teal2: '#2d7d9a',
  text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)',
  faint: 'rgba(200,230,230,0.38)', bg: '#080c14',
};

const Avatar = ({ src, name, size = 56 }: { src?: string; name: string; size?: number }) => {
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

const Team = () => {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%' }}>
      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        @media (min-width: 640px) {
          .team-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }
        }
        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 12px;
          }
        }

        .team-card {
          border-radius: 12px;
          padding: 12px 8px 10px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(77,184,184,0.14);
          transition: border-color 0.25s, background 0.25s;
        }
        .team-card:hover {
          border-color: rgba(77,184,184,0.4);
          background: rgba(77,184,184,0.07);
        }
        .team-avatar { margin-bottom: 8px; transition: transform 0.2s; }
        .team-card:hover .team-avatar { transform: scale(1.05); }

        .team-name { font-size: 11px; font-weight: 500; color: #e8f4f4; line-height: 1.3; margin-bottom: 2px; }
        .team-role { font-size: 10px; color: rgba(200,230,230,0.38); line-height: 1.3; }
        @media (min-width: 640px) {
          .team-name { font-size: 12px; margin-bottom: 3px; }
          .team-role { font-size: 10px; }
        }
      `}</style>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 className="font-raleway font-semibold"
          style={{ color: Q.text, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: 10 }}>
          {t('members.team')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto' }} />
      </div>

      {/* Grid — все 18 карточек */}
      <div className="team-grid">
        {memberLogos.map((m, i) => (
          <div key={i} className="team-card">
            <div className="team-avatar">
              <Avatar src={m.imageUrl} name={t(m.name)} size={48} />
            </div>
            <p className="team-name">{t(m.name)}</p>
            <p className="team-role">{t(m.role)}</p>
            <div style={{ marginTop: 6, width: 16, height: 1.5, background: `linear-gradient(90deg, #4db8b8, transparent)`, borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
