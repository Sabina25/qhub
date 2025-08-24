import React from 'react';
import { Menu, X, Globe } from 'lucide-react';
import type { Language } from './useHeaderLogic';

type UIItem = { label: string; to: string; isRoute?: boolean };

type Props = {
  navRef: React.RefObject<HTMLElement>;
  textDark: boolean;
  chromeSolid: boolean;        // авто-смена по скроллу
  /** Если true — всегда использовать «скролльный» логотип (для отдельных страниц) */
  forceSolidLogo?: boolean;    // ← НОВЫЙ ПРОП
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

export const HeaderUI: React.FC<Props> = ({
  navRef,
  textDark,
  chromeSolid,
  forceSolidLogo = false, // ← default
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
  const desktopLinkIdle = textDark
    ? 'lg:text-gray-900 lg:hover:text-blue-600'
    : 'lg:text-white lg:hover:text-white/85';
  const desktopLinkActive = textDark ? 'lg:text-blue-600' : 'lg:text-white';

  const headerClasses = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    'bg-white/95 shadow-sm', // mobile
    (chromeSolid || forceSolidLogo)
      ? 'lg:bg-white/80 lg:backdrop-blur-md lg:shadow-md lg:border-b lg:border-black/5'
      : 'lg:bg-transparent lg:backdrop-blur-0 lg:shadow-none lg:border-b-0',
  ].join(' ');

  // если forceSolidLogo=true → берём «скролльный» вариант
  const useSolid = forceSolidLogo || chromeSolid;
  const logoSrc = useSolid ? '/images/Qlogo-l.png' : '/images/QLogo-3.png';
  const logoAlt = 'Q-hub';

  return (
    <header className={headerClasses}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        {skipToContentLabel}
      </a>

      <nav ref={navRef as any} aria-label="Primary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo */}
          <img
            onClick={onLogoClick}
            src={logoSrc}
            alt={logoAlt}
            className="h-10 lg:h-14 cursor-pointer select-none transition-opacity duration-200"
            draggable={false}
          />

          {/* Desktop main nav */}
          <div className="hidden lg:flex items-center gap-6 ml-auto pr-[160px]">
            {mainNav.map((item) => {
              const isActiveRoute = item.isRoute && typeof window !== 'undefined'
                ? window.location.pathname === item.to
                : false;

              return (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={(e) => { e.preventDefault(); onNavClick(item); }}
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
              className={['h-4 w-4', textDark ? 'text-gray-600' : 'lg:text-white text-gray-600'].join(' ')}
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="lang-select">Language</label>
            <select
              id="lang-select"
              value={lang}
              onChange={(e) => onLangChange(e.target.value as Language)}
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
              onClick={onToggleMenu}
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
        {isHome && (
          <div className="hidden lg:flex text-sm font-normal tracking-wide py-1 gap-4 pr-[200px] justify-end" aria-label="Section">
            {anchorNav.map((item) => {
              const isActive = activeAnchor === `#${item.to}`;
              return (
                <a
                  key={item.to}
                  href={`#${item.to}`}
                  onClick={(e) => { e.preventDefault(); onNavClick(item); }}
                  className={[
                    'transition capitalize lowercase',
                    textDark ? 'text-gray-500 hover:text-blue-600' : 'text-white/90 hover:text-white',
                    isActive &&
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
            {[...mainNav, ...anchorNav].map((item) => {
              const isRoute = !!item.isRoute;
              const isActive =
                (isRoute && typeof window !== 'undefined' && window.location.pathname === item.to) ||
                (!isRoute && activeAnchor === `#${item.to}`);
              return (
                <a
                  key={`${item.to}-${isRoute ? 'route' : 'anchor'}`}
                  href={isRoute ? item.to : `#${item.to}`}
                  onClick={(e) => { e.preventDefault(); onNavClick(item); }}
                  className={`block px-4 py-2 text-base transition ${
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
                onChange={(e) => onLangChange(e.target.value as Language)}
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
