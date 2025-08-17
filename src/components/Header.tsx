import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../auth/AuthContext';
import { ADMIN_EMAIL } from '../auth/constants';

type Language = 'ua' | 'en';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onHash = () => setActiveAnchor(window.location.hash);
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const mainNav = [
    { label: t('header.nav_main.home'), to: '/' },
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

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    item: { label: string; to: string; isRoute?: boolean }
  ) => {
    e.preventDefault();

    if (item.isRoute) {
      navigate(item.to);
      setIsMenuOpen(false);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(item.to)?.scrollIntoView({ behavior: 'smooth' });
        window.location.hash = `#${item.to}`;
      }, 250);
    } else {
      document.getElementById(item.to)?.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = `#${item.to}`;
    }

    setIsMenuOpen(false);
  };

  // десктопные цвета ссылок: сверху — белые, после скролла — тёмные
  const desktopLinkIdle = isScrolled
    ? 'lg:text-gray-900 lg:hover:text-blue-600'
    : 'lg:text-white lg:hover:text-white/80';
  const desktopLinkActive = isScrolled ? 'lg:text-blue-600' : 'lg:text-white';

  const headerClasses = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    // на мобиле — белая шапка всегда
    'bg-white',
    // на десктопе: прозрачная сверху, проявляется при скролле
    isScrolled
      ? 'lg:bg-white/80 lg:backdrop-blur-md lg:shadow-md lg:border-b lg:border-black/5'
      : 'lg:bg-transparent lg:backdrop-blur-0 lg:shadow-none lg:border-b-0',
  ].join(' ');

  return (
    <header className={headerClasses}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[45px]">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
            aria-label="Go home"
          >
            Q<span className="text-orange-500">hub</span>
          </button>

          {/* Desktop main nav */}
          <div className="hidden lg:flex space-x-6 pr-[150px] ml-auto">
            {mainNav.map((item) => {
              const isActiveRoute = location.pathname === item.to;
              return (
                <a
                  key={`${item.to}-${lang}`}
                  href={item.to}
                  onClick={(e) => handleNavClick(e, item)}
                  className={[
                    'font-notosans font-medium uppercase transition',
                    // мобильная палитра (не влияет — меню спрятано)
                    'text-gray-800 hover:text-blue-600',
                    // десктопная палитра по состоянию скролла
                    desktopLinkIdle,
                    isActiveRoute && desktopLinkActive,
                    isActiveRoute ? 'lg:font-semibold' : '',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Language (desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <Globe className={['h-4 w-4', isScrolled ? 'lg:text-gray-600' : 'lg:text-white', 'text-gray-600'].join(' ')} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className={[
                'font-notosans text-sm bg-transparent border-none focus:outline-none cursor-pointer',
                'text-gray-700',
                isScrolled ? 'lg:text-gray-800' : 'lg:text-white',
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
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Anchor nav (desktop, only on home) */}
        {location.pathname === '/' && (
          <div className="hidden lg:flex text-s font-light tracking-wide py-1 space-x-4 pr-[200px] justify-end">
            {anchorNav.map((item) => {
              const active = activeAnchor === `#${item.to}`;
              return (
                <a
                  key={`${item.to}-${lang}`}
                  href={`#${item.to}`}
                  onClick={(e) => handleNavClick(e, item as any)}
                  className={[
                    'transition capitalize lowercase',
                    isScrolled ? 'text-gray-500 hover:text-blue-600' : 'text-white/90 hover:text-white',
                    active && (isScrolled ? 'text-blue-600 font-semibold' : 'text-white font-semibold underline underline-offset-4 decoration-2'),
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
          <div className="lg:hidden bg-white border-t pt-4 pb-6 space-y-4">
            {mainNav.concat(anchorNav as any).map((item: any) => (
              <a
                key={`${item.to}-${item.isRoute ? 'route' : 'anchor'}`}
                href={item.isRoute ? item.to : `#${item.to}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`block px-4 text-base ${
                  item.isRoute
                    ? location.pathname === item.to
                      ? 'text-blue-600 font-semibold uppercase'
                      : 'text-gray-700 hover:text-blue-600 uppercase'
                    : activeAnchor === `#${item.to}`
                      ? 'text-blue-600 font-semibold uppercase'
                      : 'text-gray-700 hover:text-blue-600 uppercase'
                }`}
              >
                {item.label}
              </a>
            ))}

            <div className="flex items-center space-x-2 px-4 pt-2 border-t">
              <Globe className="h-4 w-4 text-gray-600" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="text-sm text-gray-700 border border-gray-300 rounded px-2 py-1"
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
