import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI, rateAPI } from '../utils/api';
import { GiDiamondRing, GiNecklace, GiRing, GiGemPendant } from 'react-icons/gi';
import { FiArrowRight, FiShield, FiTruck, FiAward, FiRefreshCw } from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes, rateRes] = await Promise.allSettled([
          productAPI.getFeatured(),
          categoryAPI.getAll(),
          rateAPI.getAll()
        ]);
        if (prodRes.status === 'fulfilled') setFeatured(prodRes.value.data);
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data);
        if (rateRes.status === 'fulfilled') setRates(rateRes.value.data);
      } catch (e) {}
    };
    loadData();
  }, []);

  const categoryIcons = {
    'rings': <GiRing className="text-3xl" />,
    'necklaces': <GiNecklace className="text-3xl" />,
    'earrings': <GiGemPendant className="text-3xl" />,
    'bangles': <GiDiamondRing className="text-3xl" />,
  };

  const staticCategories = [
    { name: 'Rings', slug: 'rings', icon: <GiRing className="text-3xl" /> },
    { name: 'Necklaces', slug: 'necklaces', icon: <GiNecklace className="text-3xl" /> },
    { name: 'Earrings', slug: 'earrings', icon: <GiGemPendant className="text-3xl" /> },
    { name: 'Bangles', slug: 'bangles', icon: <GiDiamondRing className="text-3xl" /> },
  ];

  const features = [
    { icon: <FiShield />, title: 'BIS Hallmarked', desc: 'Every piece is BIS hallmark certified' },
    { icon: <FiTruck />, title: 'Free Shipping', desc: 'Insured delivery across India' },
    { icon: <FiAward />, title: 'Lifetime Exchange', desc: 'Full value exchange on all gold' },
    { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '15-day hassle-free returns' },
  ];

  return (
    <div>
      {/* ─────── HERO SECTION ─────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-luxury"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gold-600/5 rounded-full blur-[100px] animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-sm font-medium mb-6">
              ✨ New Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
              Where <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Elegance</span> Meets Craftsmanship
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
              Discover our exquisite collection of handcrafted jewellery, from timeless gold pieces to stunning diamond creations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/collections" className="btn-gold flex items-center space-x-2 text-lg">
                <span>Explore Collections</span>
                <FiArrowRight />
              </Link>
              <Link href="/rates" className="btn-outline-gold flex items-center space-x-2">
                <span>Live Rates</span>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center animate-float">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-2xl"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gold-400/10 to-transparent border border-gold-500/20 flex items-center justify-center">
                <GiDiamondRing className="text-gold-400 text-[140px] drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── CATEGORIES ─────── */}
      <section className="py-20 bg-luxury-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Shop By Category</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Browse our curated collections designed for every occasion</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(categories.length > 0 ? categories : staticCategories).map((cat, i) => (
              <Link href={`/collections?category=${cat.slug || cat.name?.toLowerCase()}`} key={i}
                className="card-luxury p-8 text-center group cursor-pointer hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:from-gold-400/30 group-hover:to-gold-600/20 group-hover:border-gold-500/40 transition-all duration-500">
                  {categoryIcons[cat.slug || cat.name?.toLowerCase()] || <GiDiamondRing className="text-3xl" />}
                </div>
                <h3 className="font-display text-lg text-white group-hover:text-gold-400 transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── FEATURED PRODUCTS ─────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Featured Collection</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Handpicked pieces that define luxury and elegance</p>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { _id: '1', name: 'Royal Gold Necklace', categoryName: 'Necklaces', metalType: 'gold', purity: '22K', netWeight: 45, price: 297000, isFeatured: true },
                { _id: '2', name: 'Diamond Solitaire Ring', categoryName: 'Rings', metalType: 'gold', purity: '18K', netWeight: 8, price: 85000, isFeatured: true },
                { _id: '3', name: 'Pearl Drop Earrings', categoryName: 'Earrings', metalType: 'gold', purity: '22K', netWeight: 12, price: 79200, isFeatured: true },
                { _id: '4', name: 'Traditional Bangles Set', categoryName: 'Bangles', metalType: 'gold', purity: '22K', netWeight: 60, price: 396000, isFeatured: true },
              ].map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/collections" className="btn-outline-gold inline-flex items-center space-x-2">
              <span>View All Collections</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────── LIVE RATES ─────── */}
      <section className="py-20 bg-luxury-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Today&apos;s Metal Rates</h2>
          <p className="text-center text-gray-400 mb-12">Updated live — always shop at the best price</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(rates.length > 0 ? rates.slice(0, 3) : [
              { metalType: 'gold', purity: '24K', ratePerGram: 7200, change: 50 },
              { metalType: 'gold', purity: '22K', ratePerGram: 6600, change: 45 },
              { metalType: 'silver', purity: '999', ratePerGram: 85, change: -2 },
            ]).map((rate, i) => (
              <div key={i} className="card-luxury p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                  <span className="text-2xl">{rate.metalType === 'gold' ? '🥇' : rate.metalType === 'silver' ? '🥈' : '💎'}</span>
                </div>
                <h3 className="font-display text-lg text-white capitalize mb-1">{rate.metalType} {rate.purity}</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent mb-2">
                  ₹{rate.ratePerGram?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500">per gram</p>
                {rate.change !== undefined && (
                  <p className={`text-sm mt-2 ${rate.change > 0 ? 'text-green-400' : rate.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {rate.change > 0 ? '▲' : rate.change < 0 ? '▼' : '─'} ₹{Math.abs(rate.change)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── FEATURES/TRUST ─────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass p-8 text-center group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-xl group-hover:bg-gold-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/10 to-luxury-purple/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Discover Your Perfect <span className="text-gold-400">Piece</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8">Join thousands of happy customers who found their dream jewellery at Lumière</p>
          <Link href="/register" className="btn-gold text-lg inline-flex items-center space-x-2 px-8 py-4">
            <span>Get Started</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
