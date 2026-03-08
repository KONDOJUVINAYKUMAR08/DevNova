import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../utils/api';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import Head from 'next/head';

export default function Collections() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    category: router.query.category || '',
    metalType: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1
  });

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (router.query.category) {
      setFilters(f => ({ ...f, category: router.query.category }));
    }
  }, [router.query.category]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.metalType) params.metalType = filters.metalType;
        if (filters.search) params.search = filters.search;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        params.sort = filters.sort;
        params.page = filters.page;
        params.limit = 12;

        const res = await productAPI.getAll(params);
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        setProducts([
          { _id: '1', name: 'Royal Gold Necklace', categoryName: 'Necklaces', metalType: 'gold', purity: '22K', netWeight: 45, price: 297000, description: 'Exquisite 22K gold necklace with intricate temple design' },
          { _id: '2', name: 'Diamond Solitaire Ring', categoryName: 'Rings', metalType: 'gold', purity: '18K', netWeight: 8, price: 85000, description: 'Stunning solitaire diamond ring in 18K white gold' },
          { _id: '3', name: 'Pearl Drop Earrings', categoryName: 'Earrings', metalType: 'gold', purity: '22K', netWeight: 12, price: 79200, description: 'Elegant pearl drop earrings with gold filigree work' },
          { _id: '4', name: 'Traditional Bangles Set', categoryName: 'Bangles', metalType: 'gold', purity: '22K', netWeight: 60, price: 396000, description: 'Set of 4 traditional gold bangles with meenakari work' },
          { _id: '5', name: 'Silver Anklet Pair', categoryName: 'Others', metalType: 'silver', purity: '925', netWeight: 50, price: 4500, description: 'Sterling silver anklets with bell charms' },
          { _id: '6', name: 'Gold Chain 24K', categoryName: 'Necklaces', metalType: 'gold', purity: '24K', netWeight: 20, price: 144000, description: 'Pure 24K gold rope chain, 20 inches' },
        ]);
        setTotal(6);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const clearFilters = () => {
    setFilters({ category: '', metalType: '', search: '', minPrice: '', maxPrice: '', sort: '-createdAt', page: 1 });
    router.push('/collections', undefined, { shallow: true });
  };

  return (
    <>
      <Head><title>Collections | Lumière Fine Jewellery</title></Head>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-title text-4xl md:text-5xl">Our Collections</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our curated range of exquisite jewellery pieces</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="card-luxury p-6 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    <FiFilter className="text-gold-400" /><span>Filters</span>
                  </h3>
                  <button onClick={clearFilters} className="text-xs text-gold-400 hover:text-gold-300 transition-colors">Clear All</button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                    <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                      className="input-luxury pl-9 text-sm py-2" placeholder="Search jewellery..." />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Category</label>
                  <div className="space-y-2">
                    {(categories.length > 0 ? categories : [
                      { _id: 'rings', name: 'Rings' }, { _id: 'necklaces', name: 'Necklaces' },
                      { _id: 'earrings', name: 'Earrings' }, { _id: 'bangles', name: 'Bangles' }
                    ]).map(cat => (
                      <button key={cat._id} onClick={() => setFilters({ ...filters, category: filters.category === cat._id ? '' : cat._id, page: 1 })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.category === cat._id ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metal Type */}
                <div className="mb-6">
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Metal</label>
                  <div className="space-y-2">
                    {['gold', 'silver', 'platinum', 'diamond'].map(metal => (
                      <button key={metal} onClick={() => setFilters({ ...filters, metalType: filters.metalType === metal ? '' : metal, page: 1 })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${filters.metalType === metal ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Price Range</label>
                  <div className="flex space-x-2">
                    <input value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="input-luxury text-sm py-2 w-1/2" placeholder="Min" type="number" />
                    <input value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="input-luxury text-sm py-2 w-1/2" placeholder="Max" type="number" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400 text-sm">{total} product{total !== 1 ? 's' : ''} found</p>
                <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="input-luxury text-sm py-2 w-40">
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card-product animate-pulse">
                      <div className="aspect-square bg-gray-800"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-800 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No products found</p>
                  <button onClick={clearFilters} className="btn-outline-gold mt-4 text-sm">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
