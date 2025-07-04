import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNav = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects', isRoute: true }
  ];

  const anchorNav = [
    { label: 'Organisation', to: 'organisation' },
    { label: 'Members', to: 'members' },
    { label: 'News', to: 'news' },
    { label: 'Contact', to: 'contact' }
  ];

  const handleNavClick = (e, item) => {
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
      }, 300);
    } else {
      document.getElementById(item.to)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const languages = ['EN', 'IT', 'ES', 'DE', 'FR'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: logo and main nav */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            Q<span className="text-orange-500">hub</span>
          </div>

          {/* Desktop Main Navigation */}
          <div className="hidden lg:flex space-x-6 pr-[150px] ml-auto">
            {mainNav.map((item) => (
              <a
                key={item.label}
                href={item.to}
                onClick={(e) => handleNavClick(e, item)}
                className="text-gray-800 hover:text-blue-600 font-medium transition"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <select className="text-sm text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer">
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Bottom row: anchor nav */}
       {/* Bottom row: anchor nav (only on homepage) */}
{location.pathname === '/' && (
  <div className="hidden lg:flex border-t border-gray-100 text-xs text-gray-500 font-light tracking-wide py-1 space-x-4 pr-[200px] justify-end">
    {anchorNav.map((item) => (
      <a
        key={item.label}
        href={`#${item.to}`}
        onClick={(e) => handleNavClick(e, item)}
        className="hover:text-blue-600 transition"
      >
        {item.label}
      </a>
    ))}
  </div>
)}


        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t pt-4 pb-6 space-y-4">
            {mainNav.concat(anchorNav).map((item) => (
              <a
                key={item.label}
                href={item.isRoute ? item.to : `#${item.to}`}
                onClick={(e) => handleNavClick(e, item)}
                className="block px-4 text-gray-700 hover:text-blue-600 text-base"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center space-x-2 px-4 pt-2 border-t">
              <Globe className="h-4 w-4 text-gray-600" />
              <select className="text-sm text-gray-700 border border-gray-300 rounded px-2 py-1">
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
