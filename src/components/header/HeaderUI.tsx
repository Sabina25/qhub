import React, { useEffect, useState } from 'react';
import { Globe, X, Menu, Home, FolderOpen, Newspaper, Radio } from 'lucide-react';

export type Language = 'en' | 'ua';
export type UIItem = { label: string; to: string; isRoute?: boolean };

type Props = {
  navRef: React.RefObject<HTMLElement>;
  textDark: boolean;
  chromeSolid: boolean;
  forceSolidLogo?: boolean;
  isHome: boolean;
  mainNav: UIItem[];
  anchorNav: UIItem[];
  activeAnchor: string;
  isMenuOpen: boolean;
  lang: Language;
  onNavClick: (item: UIItem) => void;
  onToggleMenu: () => void;
  onLogoClick: () => void;
  onLangChange: (next: Language) => void;
  skipToContentLabel?: string;
};

const NAV_ICONS: Record<string, React.ElementType> = {
  '/':         Home,
  '/projects': FolderOpen,
  '/events':   Newspaper,
  '/media':    Radio,
};

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.55)' };

const HeaderUI: React.FC<Props> = ({
  navRef,
  isHome,
  mainNav,
  anchorNav,
  activeAnchor,
  isMenuOpen,
  lang,
  onNavClick,
  onToggleMenu,
  onLogoClick,
  onLangChange,
  skipToContentLabel = 'Skip to content',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    if (isMenuOpen) requestAnimationFrame(() => setPanelVisible(true));
    else setPanelVisible(false);
  }, [isMenuOpen]);

  useEffect(() => {
    const getScroller = (): EventTarget =>
      document.querySelector('.snap-container') ?? window;
    const onScroll = () => {
      const el = document.querySelector('.snap-container');
      setScrolled(el ? (el as HTMLElement).scrollTop > 80 : window.scrollY > 80);
    };
    const scroller = getScroller();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isMenuOpen]);

  const snapTo = (id: string) => {
    if (typeof (window as any).__snapGoTo === 'function') {
      (window as any).__snapGoTo(id);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (item: UIItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (isMenuOpen) onToggleMenu();
    if (item.isRoute) { onNavClick(item); return; }
    snapTo(item.to);
  };

  const socials = [
    { label: 'fb', href: 'https://www.facebook.com/devamibar/' },
    { label: 'ig', href: 'https://www.instagram.com/q_hub/' },
    { label: 'yt', href: 'https://www.youtube.com/@q-hub8132/videos' },
  ];

  const headerBg    = scrolled ? 'rgba(13,17,23,0.92)' : 'rgba(13,17,23,0.35)';
  const borderColor = scrolled ? 'rgba(77,184,184,0.18)' : 'rgba(77,184,184,0.08)';

  return (
    <>
      {/* ══ Все стили через CSS — без Tailwind breakpoints ══ */}
      <style>{`
        /* ── Desktop nav visible / burger hidden by default ── */
        .qh-desktop-nav   { display: flex; }
        .qh-desktop-lang  { display: flex; }
        .qh-mobile-burger { display: none; }

        /* ── На мобиле (<1024px): прячем десктоп, показываем бургер ── */
        @media (max-width: 1023px) {
          .qh-desktop-nav   { display: none !important; }
          .qh-desktop-lang  { display: none !important; }
          .qh-mobile-burger { display: flex !important; }
        }

        /* ── Slide-in panel ── */
        .qhub-panel {
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .qhub-panel.open { transform: translateX(0); }

        .qhub-overlay {
          opacity: 0;
          transition: opacity 0.32s ease;
          pointer-events: none;
        }
        .qhub-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Nav link ── */
        .qhub-nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
          border: 0.5px solid transparent;
          cursor: pointer;
        }
        .qhub-nav-link:hover {
          background: rgba(77,184,184,0.08);
          border-color: rgba(77,184,184,0.18);
        }
        .qhub-nav-link.active {
          background: rgba(77,184,184,0.1);
          border-color: rgba(77,184,184,0.3);
        }

        /* ── Anchor link ── */
        .qhub-anchor-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px 8px 20px;
          font-size: 13px;
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.15s;
          color: rgba(200,230,230,0.5);
        }
        .qhub-anchor-link:hover { color: #4db8b8; }

        /* ── Desktop nav link ── */
        .qhub-desk-link {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
          padding-bottom: 2px;
          white-space: nowrap;
        }

        /* ── Social btn ── */
        .qhub-soc {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(77,184,184,0.07);
          border: 0.5px solid rgba(77,184,184,0.18);
          color: rgba(200,230,230,0.55);
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .qhub-soc:hover {
          background: rgba(77,184,184,0.15);
          color: #4db8b8;
          border-color: rgba(77,184,184,0.4);
        }
      `}</style>

      {/* ══ HEADER ══ */}
      <header
        id="site-header"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          transition: 'background 0.3s, border-color 0.3s',
          background: headerBg,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: `0.5px solid ${borderColor}`,
        }}
      >

        <a href="#main"
          style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
          onFocus={e => { e.currentTarget.style.left = '8px'; e.currentTarget.style.top = '8px'; e.currentTarget.style.width = 'auto'; e.currentTarget.style.height = 'auto'; }}
          onBlur={e => { e.currentTarget.style.left = '-9999px'; }}>
          {skipToContentLabel}
        </a>

        <nav ref={navRef as any} aria-label="Primary"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: 24 }}>

            {/* Logo */}
            <img src="/images/Qlogo-l.png" alt="Q-hub" onClick={onLogoClick}
              style={{ height: 38, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
              draggable={false} />

            {/* ── Desktop nav ── */}
            <div className="qh-desktop-nav"
              style={{ alignItems: 'center', gap: 28, marginLeft: 'auto' }}>
              {mainNav.map((item) => {
                const isActive = item.isRoute
                  ? window.location.pathname === item.to
                  : activeAnchor === `#${item.to}`;
                return (
                  <a key={item.to} href={item.to}
                    className="qhub-desk-link"
                    onClick={(e) => handleNavClick(item, e)}
                    style={{
                      color: isActive ? Q.teal : 'rgba(220,240,240,0.75)',
                      borderBottom: isActive ? `1.5px solid ${Q.teal}` : '1.5px solid transparent',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = Q.teal)}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? Q.teal : 'rgba(220,240,240,0.75)')}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* ── Anchor nav desktop ── */}
            {isHome && (
              <div className="qh-desktop-nav" style={{ alignItems: 'center', gap: 18 }}>
                <div style={{ width: 1, height: 16, background: 'rgba(77,184,184,0.25)', flexShrink: 0 }} />
                {anchorNav.map((item) => {
                  const isActive = activeAnchor === `#${item.to}`;
                  return (
                    <a key={item.to} href={`#${item.to}`}
                      onClick={(e) => handleNavClick(item, e)}
                      style={{
                        fontSize: 12, color: isActive ? Q.teal : 'rgba(200,230,230,0.5)',
                        textDecoration: 'none', transition: 'color 0.2s',
                        textTransform: 'capitalize', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = Q.teal)}
                      onMouseLeave={e => (e.currentTarget.style.color = isActive ? Q.teal : 'rgba(200,230,230,0.5)')}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}

            {/* ── Lang desktop ── */}
            <div className="qh-desktop-lang"
              style={{ alignItems: 'center', gap: 6, marginLeft: 8 }}>
              <Globe style={{ width: 14, height: 14, color: 'rgba(77,184,184,0.7)' }} />
              <select value={lang} onChange={e => onLangChange(e.target.value as Language)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(220,240,240,0.7)', fontSize: 12, fontWeight: 500, cursor: 'pointer', outline: 'none' }}>
                <option value="en" style={{ background: '#0d1117' }}>EN</option>
                <option value="ua" style={{ background: '#0d1117' }}>UA</option>
              </select>
            </div>

            {/* ── Mobile burger ── */}
            <button
              className="qh-mobile-burger"
              onClick={onToggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              style={{
                background: 'transparent',
                border: '0.5px solid rgba(77,184,184,0.3)',
                borderRadius: 8, padding: '6px 8px',
                cursor: 'pointer', color: Q.teal,
                alignItems: 'center', marginLeft: 'auto',
              }}>
              {isMenuOpen
                ? <X style={{ width: 20, height: 20 }} />
                : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ══ MOBILE SLIDE-IN PANEL ══ */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>

          {/* Overlay */}
          <div
            className={`qhub-overlay${panelVisible ? ' open' : ''}`}
            onClick={onToggleMenu}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
          />

          {/* Panel */}
          <div
            className={`qhub-panel${panelVisible ? ' open' : ''}`}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '78%', maxWidth: 320,
              background: '#090d16',
              borderLeft: '0.5px solid rgba(77,184,184,0.18)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Panel header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', height: 60, flexShrink: 0,
              borderBottom: '0.5px solid rgba(77,184,184,0.1)',
            }}>
              <img src="/images/Qlogo-l.png" alt="Q-hub" style={{ height: 32 }} />
              <button onClick={onToggleMenu}
                style={{ background: 'transparent', border: '0.5px solid rgba(77,184,184,0.25)', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', color: Q.teal, display: 'flex' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Main links */}
            <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {mainNav.map((item) => {
                const isActive = item.isRoute ? window.location.pathname === item.to : false;
                const Icon = item.isRoute ? (NAV_ICONS[item.to] ?? Home) : Home;
                return (
                  <a key={item.to} href={item.to}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`qhub-nav-link${isActive ? ' active' : ''}`}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isActive ? 'rgba(77,184,184,0.15)' : 'rgba(77,184,184,0.07)',
                      border: `0.5px solid ${isActive ? 'rgba(77,184,184,0.4)' : 'rgba(77,184,184,0.18)'}`,
                    }}>
                      <Icon style={{ width: 16, height: 16, color: isActive ? Q.teal : 'rgba(200,230,230,0.55)' }} />
                    </div>
                    <span style={{
                      fontSize: 14, fontWeight: 500,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: isActive ? Q.teal : 'rgba(220,240,240,0.85)',
                    }}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: Q.teal }} />
                    )}
                  </a>
                );
              })}

              {/* Anchor links */}
              {isHome && anchorNav.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 12, borderTop: '0.5px solid rgba(77,184,184,0.08)' }}>
                  <p style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(77,184,184,0.4)', padding: '0 16px', marginBottom: 6 }}>
                    Секції
                  </p>
                  {anchorNav.map((item) => (
                    <a key={item.to} href={`#${item.to}`}
                      onClick={(e) => handleNavClick(item, e)}
                      className="qhub-anchor-link">
                      <span style={{ width: 12, height: 1, background: Q.teal2, display: 'inline-block', borderRadius: 1, flexShrink: 0, opacity: 0.5 }} />
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: lang + socials */}
            <div style={{ padding: '16px', borderTop: '0.5px solid rgba(77,184,184,0.1)', display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
              {/* Language toggle */}
              <div style={{ display: 'flex', gap: 8 }}>
                {(['ua', 'en'] as Language[]).map((l) => (
                  <button key={l} onClick={() => onLangChange(l)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer',
                      fontWeight: 600, fontSize: 12, letterSpacing: '1px',
                      transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                      background: lang === l ? 'rgba(77,184,184,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `0.5px solid ${lang === l ? 'rgba(77,184,184,0.4)' : 'rgba(77,184,184,0.15)'}`,
                      color: lang === l ? Q.teal : 'rgba(200,230,230,0.45)',
                    }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 8 }}>
                {socials.map(({ label, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="qhub-soc">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderUI;
