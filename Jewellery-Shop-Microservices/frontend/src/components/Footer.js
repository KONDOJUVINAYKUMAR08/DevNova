import Link from 'next/link';
import { GiDiamondRing } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-luxury-dark to-[#0a0a15] border-t border-gold-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <GiDiamondRing className="text-white text-xl" />
              </div>
              <span className="text-xl font-display font-bold text-gold-400">Lumière</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Exquisite handcrafted jewellery for every occasion. Discover timeless elegance in every piece.
            </p>
            <div className="flex space-x-3">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gold-900/30 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/collections', label: 'Collections' },
                { href: '/collections?category=rings', label: 'Rings' },
                { href: '/collections?category=necklaces', label: 'Necklaces' },
                { href: '/collections?category=bangles', label: 'Bangles' },
                { href: '/collections?category=earrings', label: 'Earrings' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold-400 text-sm transition-colors duration-300 flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gold-600 rounded-full"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Services</h4>
            <ul className="space-y-3">
              {['Custom Design', 'Gold Exchange', 'Jewellery Repair', 'Certification', 'Gift Wrapping'].map((item) => (
                <li key={item}>
                  <span className="text-gray-400 text-sm flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gold-600 rounded-full"></span>
                    <span>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <FiMapPin className="mt-0.5 text-gold-500 flex-shrink-0" />
                <span>123 Gold Street, Jewellery District, Mumbai 400001</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <FiPhone className="text-gold-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <FiMail className="text-gold-500 flex-shrink-0" />
                <span>info@lumiere.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-900/20 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; 2024 Lumière Fine Jewellery. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
