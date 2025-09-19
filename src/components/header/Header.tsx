import React from 'react';
import HeaderUI from './HeaderUI';
import { useHeaderLogic, Appearance, Language } from './useHeaderLogic';

type Props = { appearance?: Appearance };

const Header: React.FC<Props> = ({ appearance = 'auto' }) => {
  const {
    navRef,
    isMenuOpen,
    activeAnchor,
    scrolled,
    textDark,
    chromeSolid,
    lang,
    mainNav,
    anchorNav,
    isHome,
    setLang,
    toggleMenu,
    onNavClick,
    logoClick,
  } = useHeaderLogic(appearance);

  return (
    <HeaderUI
      navRef={navRef}
      textDark={textDark}
      chromeSolid={chromeSolid}
      isHome={isHome}
      mainNav={mainNav}
      anchorNav={anchorNav}
      activeAnchor={activeAnchor}
      isMenuOpen={isMenuOpen}
      forceSolidLogo={appearance != 'auto'} 
      lang={lang}
      onNavClick={onNavClick}
      onToggleMenu={toggleMenu}
      onLogoClick={logoClick}
      onLangChange={(l) => setLang(l as Language)}
      skipToContentLabel="Skip to content"
    />
  );
};

export default Header;
