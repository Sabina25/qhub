
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '#organisation' },
    { name: 'Our Projects', href: '#projects' },
    { name: 'Annual Meeting', href: '#annual-meeting' },
    { name: 'News & Updates', href: '#news' },
    { name: 'Become a Member', href: '#members' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Code of Conduct', href: '#conduct' }
  ];

    {/*const resources = [
    { name: 'Erasmus+ Programme', href: 'https://erasmus-plus.ec.europa.eu/', external: true },
    { name: 'European Commission', href: 'https://ec.europa.eu/', external: true },
    { name: 'Youth Portal', href: 'https://europa.eu/youth/', external: true },
    { name: 'Your Europe', href: 'https://europa.eu/youreurope/', external: true }
  ];*/}

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
              is a project and educational platform working to strenghten cultural, professional and personal growth of residents, IDP's and citizens of Ukraine. 
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">hub.qirim@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+380 95 681 2469</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                ул. Омельяновича-Павленко, 9<br />
                Kyiv, Ukraine
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href='https://www.facebook.com/devamibar/' className="text-gray-300 hover:text-white transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/q_hub/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          {/*<div>
            <h4 className="font-semibold mb-6">European Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center"
                    {...(resource.external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {resource.name}
                    {resource.external && (
                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          */}

          {/* Newsletter */}
          {/* <div>
            <h4 className="font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest news, events, and opportunities.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {currentYear} Q-hub. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* EU Funding Notice */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-xs text-center">
            Crimean project and educational platform Q-hub is a non-governmental organization founded by Crimean Tatar activists 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;