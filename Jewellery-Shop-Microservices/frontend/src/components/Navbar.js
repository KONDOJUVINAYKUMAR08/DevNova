import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingBag, FiGrid, FiHome } from 'react-icons/fi';
import { GiDiamondRing, GiGoldBar } from 'react-icons/gi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: <FiHome /> },
    { href: '/collections', label: 'Collections', icon: <GiDiamondRing /> },
    { href: '/rates', label: 'Live Rates', icon: <GiGoldBar /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-dark/80 backdrop-blur-xl border-b border-gold-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <GiDiamondRing className="text-white text-xl" />
            </div>
            <div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Lumière
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-gold-500/60 uppercase -mt-1">
                Fine Jewellery
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${router.pathname === link.href
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-gray-300 hover:text-gold-400 hover:bg-gold-500/5'}`}>
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-all">
                    <FiGrid className="text-base" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link href="/my-orders" className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-gold-400 transition-all">
                    <FiShoppingBag className="text-base" />
                    <span>My Orders</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3 pl-3 border-l border-gold-900/30">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gold-500/60 capitalize">{user?.role}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Logout">
                    <FiLogOut />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline-gold text-sm py-2 px-5">Login</Link>
                <Link href="/register" className="btn-gold text-sm py-2 px-5">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-gray-300 hover:text-gold-400 transition-colors">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-luxury-dark/95 backdrop-blur-xl border-t border-gold-900/20 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${router.pathname === link.href ? 'text-gold-400 bg-gold-500/10' : 'text-gray-300 hover:text-gold-400'}`}>
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-400">
                    <FiGrid /><span>Dashboard</span>
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 w-full">
                  <FiLogOut /><span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="btn-outline-gold text-sm py-2 flex-1 text-center">Login</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="btn-gold text-sm py-2 flex-1 text-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
