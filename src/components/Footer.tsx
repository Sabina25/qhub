import {
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube
} from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('footer.quick_links.about'), href: '#organisation' },
    { name: t('footer.quick_links.projects'), href: '#projects' },
    { name: t('footer.quick_links.news'), href: '#news' },
    { name: t('footer.quick_links.members'), href: '#members' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

          {/* Brand & Contact */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <div className="text-2xl font-bold mb-4">
                Q<span className="text-orange-400">hub</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Q-hub {t('footer.description')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{t('footer.contact.email')}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{t('footer.contact.phone')}</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="text-sm whitespace-pre-line">{t('footer.contact.address')}</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-3">{t('footer.social')}</h4>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/devamibar/" target='_blank' className="text-gray-300 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/q_hub/" target='_blank' className="text-gray-300 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.youtube.com/@q-hub8132/videos" target='_blank' className="text-gray-300 hover:text-white">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">{t('footer.quick_links_title')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-300 hover:text-white text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-20 border-t pt-8 mt-12 border-gray-800">
           <div className="flex items-center justify-between text-sm text-gray-300">
            <span>
              {t('footer.copyright').replace('{year}', `${currentYear}`)}
            </span>
            <img
              src="/images/tamga.png"
              className="h-8 mr-10 transition-transform duration-300 transform hover:scale-105"
              alt="Tamga"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-xs text-center">
              {t('footer.funding_notice')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
