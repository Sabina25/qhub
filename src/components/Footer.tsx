import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.5)', faint: 'rgba(200,230,230,0.25)' };

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('footer.quick_links.about'),    href: '#organisation' },
    { name: t('footer.quick_links.projects'), href: '#projects' },
    { name: t('footer.quick_links.news'),     href: '#news' },
    { name: t('footer.quick_links.members'),  href: '#members' },
  ];

  const socials = [
    { Icon: Facebook,  href: 'https://www.facebook.com/devamibar/',         label: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/q_hub/',            label: 'Instagram' },
    { Icon: Youtube,   href: 'https://www.youtube.com/@q-hub8132/videos',   label: 'YouTube' },
  ];

  const contacts = [
    { Icon: Mail,   value: t('footer.contact.email') },
    { Icon: Phone,  value: t('footer.contact.phone') },
    { Icon: MapPin, value: t('footer.contact.address') },
  ];

  return (
    <footer style={{ background: 'rgba(6,9,16,0.98)', borderTop: '0.5px solid rgba(77,184,184,0.12)', width: '100%' }}>

      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${Q.teal}, ${Q.teal2}, transparent)` }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 32px' }}>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <img src="/images/Qlogo-l.png" alt="Q-hub" style={{ height: 40, width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} draggable={false} />

            <p style={{ fontSize: 13, lineHeight: 1.7, color: Q.muted, maxWidth: 260 }}>
              {t('footer.description') || 'Кримськотатарська молодіжна організація, що об\'єднує молодь по всій Європі.'}
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(77,184,184,0.08)',
                    border: '0.5px solid rgba(77,184,184,0.2)',
                    color: Q.muted,
                    transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.5)';
                    (e.currentTarget as HTMLAnchorElement).style.color = Q.teal;
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(77,184,184,0.14)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,184,184,0.2)';
                    (e.currentTarget as HTMLAnchorElement).style.color = Q.muted;
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(77,184,184,0.08)';
                  }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: Q.teal, marginBottom: 20, opacity: 0.8 }}>
              {t('footer.quick_links_title')}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    style={{ fontSize: 14, color: Q.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = Q.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = Q.muted)}
                  >
                    <span style={{ width: 14, height: 1, background: Q.teal2, display: 'inline-block', borderRadius: 1, flexShrink: 0 }} />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {contacts.map(({ Icon, value }) => (
                <div key={value} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                    background: 'rgba(77,184,184,0.08)',
                    border: '0.5px solid rgba(77,184,184,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 13, height: 13, color: Q.teal }} />
                  </div>
                  <span style={{ fontSize: 13, color: Q.muted, lineHeight: 1.6, paddingTop: 4 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(77,184,184,0.1)', marginBottom: 24 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: Q.faint }}>
            {t('footer.copyright').replace('{year}', `${currentYear}`)}
          </span>
          <img src="/images/tamga.png" alt="Tamga" style={{ height: 28, opacity: 0.5, transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')} />
        </div>

        {/* Funding notice */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '0.5px solid rgba(77,184,184,0.07)' }}>
          <p style={{ fontSize: 11, color: Q.faint, textAlign: 'center', lineHeight: 1.6 }}>
            {t('footer.funding_notice')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
