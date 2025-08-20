import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import { useAuth } from '../../auth/AuthContext';
import { ADMIN_EMAIL } from '../../auth/constants';

export type Language = 'ua' | 'en';
export type Appearance = 'auto' | 'solid' | 'transparent';

type NavRoute = { label: string; to: string; isRoute: true };
type NavAnchor = { label: string; to: string; isRoute?: false };
export type NavItem = NavRoute | NavAnchor;

const HEADER_BASE_H = 56;

export function useHeaderLogic(appearance: Appearance = 'auto') {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string>('');
  const navRef = useRef<HTMLElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

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

  useEffect(() => {
    const onHash = () => setActiveAnchor(window.location.hash);
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const chromeSolid = appearance === 'transparent' ? false : scrolled;
  const textDark = appearance === 'solid' || (appearance === 'auto' && scrolled);

  const mainNav: NavItem[] = [
    { label: t('header.nav_main.home'), to: '/', isRoute: true },
    { label: t('header.nav_main.projects'), to: '/projects', isRoute: true },
    { label: t('header.nav_main.news'), to: '/events', isRoute: true },
    { label: t('header.nav_main.media'), to: '/media', isRoute: true },
    ...(isAdmin ? [{ label: 'Admin', to: '/admin', isRoute: true } as const] : []),
  ];

  const anchorNav: NavItem[] = [
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
    const headerH = (headerEl?.getBoundingClientRect().height ?? HEADER_BASE_H) + 8;
    const top = window.scrollY + (el.getBoundingClientRect().top - headerH);

    window.scrollTo({ top, behavior: 'smooth' });

    if (history.replaceState) {
      const url = `${location.pathname}#${id}`;
      history.replaceState(null, '', url);
      setActiveAnchor(`#${id}`);
    } else {
      window.location.hash = `#${id}`;
    }
  };

  const onNavClick = (item: NavItem) => {
    if ('isRoute' in item && item.isRoute) {
      navigate(item.to);
      return;
    }
    if (location.pathname !== '/') {
      navigate('/');
      let tries = 0;
      const int = setInterval(() => {
        tries++;
        if (document.getElementById(item.to) || tries >= 15) {
          clearInterval(int);
          scrollToId(item.to);
        }
      }, 60);
    } else {
      scrollToId(item.to);
    }
  };

  const logoClick = () => navigate('/');

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  const isHome = location.pathname === '/';

  return {
    // state
    isMenuOpen,
    activeAnchor,
    scrolled,
    textDark,
    chromeSolid,
    lang,
    // refs
    navRef,
    // data
    mainNav,
    anchorNav,
    isHome,
    // actions
    setLang,
    toggleMenu,
    onNavClick,
    logoClick,
  };
}