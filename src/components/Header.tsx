import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../auth/AuthContext';
import { ADMIN_EMAIL } from '../auth/constants';

type Language = 'ua' | 'en';
type Appearance = 'auto' | 'solid' | 'transparent';

type HeaderProps = {
  appearance?: Appearance;
};

const HEADER_BASE_H = 56; 

const Header: React.FC<HeaderProps> = ({ appearance = 'auto' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string>('');
  const navRef = useRef<HTMLElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  // --- Scroll handling (throttled via rAF)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Track hash changes (route → same page anchors)
  useEffect(() => {
    const onHash = () => setActiveAnchor(window.location.hash);
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // --- Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // chrome (фон/blur/тень)
  const chromeSolid = appearance === 'transparent' ? false : scrolled;
  const textDark = appearance === 'solid' || (appearance === 'auto' && scrolled);

  const mainNav = [
    { label: t('header.nav_main.home'), to: '/', isRoute: true },
    { label: t('header.nav_main.projects'), to: '/projects', isRoute: true },
    { label: t('header.nav_main.news'), to: '/events', isRoute: true },
    { label: t('header.nav_main.media'), to: '/media', isRoute: true },
    ...(isAdmin ? [{ label: 'Admin', to: '/admin', isRoute: true }] : []),
  ];

  const anchorNav = [
    { label: t('header.nav_anchors.organisation'), to: 'organisation' },
    { label: t('header.nav_anchors.projects'), to: 'projects' },
    { label: t('header.nav_anchors.news'), to: 'news' },
    { label: t('header.nav_anchors.members'), to: 'members' },
    { label: t('header.nav_anchors.contact'), to: 'contact' },
  ];


  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerEl = navRef.current;
    const headerH =
      (headerEl?.getBoundingClientRect().height ?? HEADER_BASE_H) + 8; 

    const top =
      window.scrollY +
      (el.getBoundingClientRect().top - headerH);

    window.scrollTo({ top, behavior: 'smooth' });

  
    if (history.replaceState) {
      const url = `${location.pathname}#${id}`;
      history.replaceState(null, '', url);
      setActiveAnchor(`#${id}`);
    } else {
      window.location.hash = `#${id}`;
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { label: string; to: string; isRoute?: boolean }
  ) => {
    e.preventDefault();

    if (item.isRoute) {
      navigate(item.to);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      const attempts = 15;
      let i = 0;
      const int = setInterval(() => {
        i++;
        if (document.getElementById(item.to) || i >= attempts) {
          clearInterval(int);
          scrollToId(item.to);
        }
      }, 60);
    } else {
      scrollToId(item.to);
    }
  };

  const desktopLinkIdle = textDark
    ? 'lg:text-gray-900 lg:hover:text-blue-600'
    : 'lg:text-white lg:hover:text-white/85';
  const desktopLinkActive = textDark ? 'lg:text-blue-600' : 'lg:text-white';

  const headerClasses = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    'bg-white/95 shadow-sm',
    chromeSolid
      ? 'lg:bg-white/80 lg:backdrop-blur-md lg:shadow-md lg:border-b lg:border-black/5'
      : 'lg:bg-transparent lg:backdrop-blur-0 lg:shadow-none lg:border-b-0',
  ].join(' ');

  return (
    <header className={headerClasses}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        {t('common.skip_to_content') ?? 'Skip to content'}
      </a>

      <nav ref={navRef} aria-label="Primary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className={`text-2xl font-bold transition ${
              textDark ? 'text-blue-700 hover:text-blue-800' : 'text-blue-600 hover:text-blue-700 lg:text-white lg:hover:text-white/90'
            }`}
            aria-label="Go home"
          >
            Q<span className="text-orange-500">hub</span>
          </button>

          {/* Desktop main nav */}
          <div className="hidden lg:flex items-center gap-6 ml-auto pr-[160px]">
            {mainNav.map((item) => {
              const isActiveRoute = item.isRoute && location.pathname === item.to;
              return (
                <a
                  key={`${item.to}-${lang}`}
                  href={item.to}
                  onClick={(e) => handleNavClick(e, item)}
                  className={[
                    'font-notosans font-medium uppercase tracking-wide transition',
                    'text-gray-800 hover:text-blue-600', 
                    desktopLinkIdle,                    
                    isActiveRoute ? `${desktopLinkActive} lg:font-semibold` : '',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Language (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Globe
              className={[
                'h-4 w-4',
                textDark ? 'text-gray-600' : 'lg:text-white text-gray-600',
              ].join(' ')}
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="lang-select">
              Language
            </label>
            <select
              id="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className={[
                'font-notosans text-sm bg-transparent border-none focus:outline-none cursor-pointer',
                textDark ? 'text-gray-800' : 'lg:text-white text-gray-700',
              ].join(' ')}
            >
              <option value="en">EN</option>
              <option value="ua">UA</option>
            </select>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Anchor nav (desktop, only on home) */}
        {location.pathname === '/' && (
          <div
            className="hidden lg:flex text-sm font-normal tracking-wide py-1 gap-4 pr-[200px] justify-end"
            aria-label="Section"
          >
            {anchorNav.map((item) => {
              const active = activeAnchor === `#${item.to}`;
              return (
                <a
                  key={`${item.to}-${lang}`}
                  href={`#${item.to}`}
                  onClick={(e) => handleNavClick(e, item as any)}
                  className={[
                    'transition capitalize lowercase',
                    textDark ? 'text-gray-500 hover:text-blue-600' : 'text-white/90 hover:text-white',
                    active &&
                      (textDark
                        ? 'text-blue-600 font-semibold underline underline-offset-4 decoration-2'
                        : 'text-white font-semibold underline underline-offset-4 decoration-2'),
                  ].join(' ')}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        )}

        {/* Mobile nav */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white border-t pt-3 pb-6 space-y-1">
            {[...mainNav, ...anchorNav as any].map((item: any) => {
              const isRoute = !!item.isRoute;
              const isActive =
                (isRoute && location.pathname === item.to) ||
                (!isRoute && activeAnchor === `#${item.to}`);
              return (
                <a
                  key={`${item.to}-${isRoute ? 'route' : 'anchor'}`}
                  href={isRoute ? item.to : `#${item.to}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`block px-4 py-2 text-base uppercase transition ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-gray-800 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="flex items-center gap-2 px-4 pt-3 border-t">
              <Globe className="h-4 w-4 text-gray-600" aria-hidden="true" />
              <label className="sr-only" htmlFor="lang-select-m">Language</label>
              <select
                id="lang-select-m"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="text-sm text-gray-800 border border-gray-300 rounded px-2 py-1"
              >
                <option value="en">EN</option>
                <option value="ua">UA</option>
              </select>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
