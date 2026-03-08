import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, productAPI, categoryAPI, rateAPI, orderAPI, reviewAPI, authAPI } from '../../utils/api';
import { FiPackage, FiUsers, FiDollarSign, FiStar, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiGrid, FiList, FiSettings, FiShoppingBag, FiMessageSquare, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { GiGoldBar } from 'react-icons/gi';
import toast from 'react-hot-toast';
import Head from 'next/head';

export default function AdminDashboard() {
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rates, setRates] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', category: '', metalType: 'gold', purity: '22K', netWeight: '', grossWeight: '', price: '', makingCharges: '', stock: 1, isFeatured: false, images: [] });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [rateForm, setRateForm] = useState({ metalType: 'gold', purity: '24K', ratePerGram: '' });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) router.push('/login');
  }, [isAuthenticated, isAdmin, authLoading]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) loadTabData(activeTab);
  }, [activeTab, isAuthenticated, isAdmin]);

  const loadTabData = async (tab) => {
    try {
      switch (tab) {
        case 'overview':
          const dashRes = await adminAPI.getDashboard();
          setDashboard(dashRes.data);
          break;
        case 'products':
          const [prodRes, catRes] = await Promise.all([productAPI.getAll({ limit: 50 }), categoryAPI.getAll()]);
          setProducts(prodRes.data.products || []);
          setCategories(catRes.data || []);
          break;
        case 'categories':
          const catRes2 = await categoryAPI.getAll();
          setCategories(catRes2.data || []);
          break;
        case 'rates':
          const rateRes = await rateAPI.getAll();
          setRates(rateRes.data || []);
          break;
        case 'orders':
          const orderRes = await orderAPI.getAll({ limit: 50 });
          setOrders(orderRes.data.orders || []);
          break;
        case 'reviews':
          const revRes = await reviewAPI.getAll({ limit: 50 });
          setReviews(revRes.data.reviews || []);
          break;
        case 'customers':
          const userRes = await authAPI.getAllUsers({ role: 'customer', limit: 50 });
          setUsers(userRes.data.users || []);
          break;
      }
    } catch (err) {
      // Dashboard may fail when services are starting up
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await productAPI.update(editProduct._id, productForm);
        toast.success('Product updated');
      } else {
        await productAPI.create(productForm);
        toast.success('Product created');
      }
      setShowProductForm(false);
      setEditProduct(null);
      setProductForm({ name: '', description: '', category: '', metalType: 'gold', purity: '22K', netWeight: '', grossWeight: '', price: '', makingCharges: '', stock: 1, isFeatured: false, images: [] });
      loadTabData('products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      loadTabData('products');
    } catch (err) { toast.error('Failed to delete'); }
  };

  // Category CRUD
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await categoryAPI.create(categoryForm);
      toast.success('Category created');
      setShowCategoryForm(false);
      setCategoryForm({ name: '', description: '' });
      loadTabData('categories');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create category'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await categoryAPI.delete(id); toast.success('Category deleted'); loadTabData('categories'); }
    catch (err) { toast.error('Failed to delete'); }
  };

  // Rate update
  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      await rateAPI.update({ ...rateForm, ratePerGram: Number(rateForm.ratePerGram) });
      toast.success('Rate updated');
      setRateForm({ metalType: 'gold', purity: '24K', ratePerGram: '' });
      loadTabData('rates');
    } catch (err) { toast.error('Failed to update rate'); }
  };

  // Order status
  const handleOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      toast.success('Order status updated');
      loadTabData('orders');
    } catch (err) { toast.error('Failed to update'); }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try { await reviewAPI.delete(id); toast.success('Review deleted'); loadTabData('reviews'); }
    catch (err) { toast.error('Failed to delete'); }
  };

  // Seed rates
  const handleSeedRates = async () => {
    try { await rateAPI.seed(); toast.success('Rates seeded'); loadTabData('rates'); }
    catch (err) { toast.error('Failed to seed'); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 /> },
    { id: 'products', label: 'Products', icon: <FiPackage /> },
    { id: 'categories', label: 'Categories', icon: <FiGrid /> },
    { id: 'rates', label: 'Rates', icon: <GiGoldBar /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
    { id: 'reviews', label: 'Reviews', icon: <FiMessageSquare /> },
    { id: 'customers', label: 'Customers', icon: <FiUsers /> },
  ];

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div></div>;

  return (
    <>
      <Head><title>Admin Dashboard | Lumière Fine Jewellery</title></Head>
      <div className="min-h-screen py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <button onClick={() => loadTabData(activeTab)} className="p-2 rounded-lg border border-gold-900/30 text-gray-400 hover:text-gold-400 transition-colors" title="Refresh">
              <FiRefreshCw />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-56 flex-shrink-0">
              <div className="card-luxury p-3 lg:sticky lg:top-28">
                <div className="flex lg:flex-col gap-1 overflow-x-auto">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2.5 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300
                        ${activeTab === tab.id ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      <span className="text-base">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Products', value: dashboard?.products?.total || 0, icon: <FiPackage />, color: 'from-blue-500 to-blue-600' },
                      { label: 'Total Orders', value: dashboard?.orders?.totalOrders || 0, icon: <FiShoppingBag />, color: 'from-green-500 to-green-600' },
                      { label: 'Revenue', value: formatPrice(dashboard?.orders?.totalRevenue), icon: <FiDollarSign />, color: 'from-gold-500 to-gold-600' },
                      { label: 'Reviews', value: dashboard?.reviews?.totalReviews || 0, icon: <FiStar />, color: 'from-purple-500 to-purple-600' },
                    ].map((stat, i) => (
                      <div key={i} className="card-luxury p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-400">{stat.label}</span>
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>{stat.icon}</div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="card-luxury p-6">
                    <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gold-500/5 rounded-lg border border-gold-900/20">
                        <p className="text-2xl font-bold text-gold-400">{dashboard?.orders?.pendingOrders || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Pending Orders</p>
                      </div>
                      <div className="text-center p-4 bg-gold-500/5 rounded-lg border border-gold-900/20">
                        <p className="text-2xl font-bold text-gold-400">{dashboard?.users?.total || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Total Users</p>
                      </div>
                      <div className="text-center p-4 bg-gold-500/5 rounded-lg border border-gold-900/20">
                        <p className="text-2xl font-bold text-gold-400">{dashboard?.reviews?.averageRating || 0}★</p>
                        <p className="text-xs text-gray-400 mt-1">Avg Rating</p>
                      </div>
                      <div className="text-center p-4 bg-gold-500/5 rounded-lg border border-gold-900/20">
                        <p className="text-2xl font-bold text-gold-400">{dashboard?.rates?.length || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Active Rates</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-white font-semibold">Products</h2>
                    <button onClick={() => { setEditProduct(null); setShowProductForm(true); }} className="btn-gold text-sm py-2 flex items-center space-x-2">
                      <FiPlus /><span>Add Product</span>
                    </button>
                  </div>

                  {showProductForm && (
                    <div className="card-luxury p-6 mb-6">
                      <h3 className="text-white font-semibold mb-4">{editProduct ? 'Edit Product' : 'New Product'}</h3>
                      <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs text-gray-400 mb-1">Name *</label>
                          <input value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="input-luxury text-sm" required /></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Category *</label>
                          <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="input-luxury text-sm" required>
                            <option value="">Select...</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Metal Type *</label>
                          <select value={productForm.metalType} onChange={(e) => setProductForm({...productForm, metalType: e.target.value})} className="input-luxury text-sm">
                            <option value="gold">Gold</option><option value="silver">Silver</option><option value="platinum">Platinum</option><option value="diamond">Diamond</option>
                          </select></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Purity *</label>
                          <input value={productForm.purity} onChange={(e) => setProductForm({...productForm, purity: e.target.value})} className="input-luxury text-sm" placeholder="22K" required /></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Net Weight (g) *</label>
                          <input type="number" value={productForm.netWeight} onChange={(e) => setProductForm({...productForm, netWeight: e.target.value})} className="input-luxury text-sm" required /></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Gross Weight (g)</label>
                          <input type="number" value={productForm.grossWeight} onChange={(e) => setProductForm({...productForm, grossWeight: e.target.value})} className="input-luxury text-sm" /></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Price (₹) *</label>
                          <input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="input-luxury text-sm" required /></div>
                        <div><label className="block text-xs text-gray-400 mb-1">Making Charges (₹)</label>
                          <input type="number" value={productForm.makingCharges} onChange={(e) => setProductForm({...productForm, makingCharges: e.target.value})} className="input-luxury text-sm" /></div>
                        <div className="md:col-span-2"><label className="block text-xs text-gray-400 mb-1">Description</label>
                          <textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="input-luxury text-sm h-20 resize-none" /></div>
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" id="isFeatured" checked={productForm.isFeatured} onChange={(e) => setProductForm({...productForm, isFeatured: e.target.checked})} className="accent-gold-500" />
                          <label htmlFor="isFeatured" className="text-sm text-gray-400">Featured Product</label>
                        </div>
                        <div className="flex items-center space-x-3 justify-end">
                          <button type="button" onClick={() => setShowProductForm(false)} className="btn-outline-gold text-sm py-2 px-4">Cancel</button>
                          <button type="submit" className="btn-gold text-sm py-2 px-6">Save</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-3">
                    {products.map(p => (
                      <div key={p._id} className="card-luxury p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center flex-shrink-0">
                            {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover rounded-lg" /> : <FiPackage className="text-gold-400" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.metalType} • {p.purity} • {p.netWeight}g</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <span className="text-gold-400 font-semibold hidden sm:block">{formatPrice(p.price)}</span>
                          {p.isFeatured && <span className="badge-gold text-[10px] hidden sm:block">Featured</span>}
                          <button onClick={() => { setEditProduct(p); setProductForm({...p, category: p.category?._id || p.category}); setShowProductForm(true); }} className="p-2 text-gray-400 hover:text-gold-400 transition-colors"><FiEdit2 /></button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><FiTrash2 /></button>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && <p className="text-gray-400 text-center py-8">No products yet. Add your first product!</p>}
                  </div>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === 'categories' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-white font-semibold">Categories</h2>
                    <button onClick={() => setShowCategoryForm(!showCategoryForm)} className="btn-gold text-sm py-2 flex items-center space-x-2"><FiPlus /><span>Add</span></button>
                  </div>
                  {showCategoryForm && (
                    <form onSubmit={handleCategorySubmit} className="card-luxury p-6 mb-6 flex flex-col sm:flex-row gap-4">
                      <input value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} className="input-luxury text-sm flex-1" placeholder="Category name" required />
                      <input value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} className="input-luxury text-sm flex-1" placeholder="Description" />
                      <button type="submit" className="btn-gold text-sm py-2 px-6 flex-shrink-0">Create</button>
                    </form>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(c => (
                      <div key={c._id} className="card-luxury p-5 flex items-center justify-between">
                        <div><p className="text-white font-medium">{c.name}</p><p className="text-xs text-gray-400">{c.slug}</p></div>
                        <button onClick={() => handleDeleteCategory(c._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RATES TAB */}
              {activeTab === 'rates' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-white font-semibold">Metal Rates</h2>
                    <button onClick={handleSeedRates} className="btn-outline-gold text-sm py-2 px-4 flex items-center space-x-2"><FiRefreshCw /><span>Seed Defaults</span></button>
                  </div>
                  <form onSubmit={handleRateSubmit} className="card-luxury p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">Update Rate</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <select value={rateForm.metalType} onChange={(e) => setRateForm({...rateForm, metalType: e.target.value})} className="input-luxury text-sm flex-1">
                        <option value="gold">Gold</option><option value="silver">Silver</option><option value="platinum">Platinum</option>
                      </select>
                      <input value={rateForm.purity} onChange={(e) => setRateForm({...rateForm, purity: e.target.value})} className="input-luxury text-sm flex-1" placeholder="Purity (e.g. 22K)" />
                      <input type="number" value={rateForm.ratePerGram} onChange={(e) => setRateForm({...rateForm, ratePerGram: e.target.value})} className="input-luxury text-sm flex-1" placeholder="Rate per gram (₹)" required />
                      <button type="submit" className="btn-gold text-sm py-2 px-6 flex-shrink-0">Update</button>
                    </div>
                  </form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rates.map((r, i) => (
                      <div key={i} className="card-luxury p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium capitalize">{r.metalType} {r.purity}</span>
                          {r.change > 0 ? <span className="text-green-400 text-sm flex items-center"><FiTrendingUp /> +{r.change}</span>
                          : r.change < 0 ? <span className="text-red-400 text-sm">▼ {r.change}</span>
                          : <span className="text-gray-400 text-sm">—</span>}
                        </div>
                        <p className="text-2xl font-bold text-gold-400">₹{r.ratePerGram?.toLocaleString('en-IN')}/g</p>
                        <p className="text-xs text-gray-500 mt-1">Updated: {new Date(r.updatedAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl text-white font-semibold mb-6">Orders</h2>
                  <div className="space-y-3">
                    {orders.map(o => (
                      <div key={o._id} className="card-luxury p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div>
                            <p className="text-white font-medium">#{o._id?.slice(-8)} — {o.customerName}</p>
                            <p className="text-xs text-gray-500">{o.customerEmail} • {new Date(o.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                            <select value={o.status} onChange={(e) => handleOrderStatus(o._id, e.target.value)} className="input-luxury text-xs py-1.5 w-32">
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <span className="text-gold-400 font-semibold">{formatPrice(o.totalAmount)}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {o.items?.map((item, i) => <span key={i}>{item.productName} ×{item.quantity}{i < o.items.length - 1 ? ', ' : ''}</span>)}
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-gray-400 text-center py-8">No orders yet</p>}
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl text-white font-semibold mb-6">Reviews</h2>
                  <div className="space-y-3">
                    {reviews.map(r => (
                      <div key={r._id} className="card-luxury p-5 flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="text-white font-medium">{r.customerName}</p>
                            <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= r.rating ? 'text-gold-400' : 'text-gray-600'}`}>★</span>)}</div>
                          </div>
                          <p className="text-gray-300 text-sm">{r.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">Product: {r.productId?.slice(-8)} • {new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteReview(r._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"><FiTrash2 /></button>
                      </div>
                    ))}
                    {reviews.length === 0 && <p className="text-gray-400 text-center py-8">No reviews yet</p>}
                  </div>
                </div>
              )}

              {/* CUSTOMERS TAB */}
              {activeTab === 'customers' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl text-white font-semibold mb-6">Customers</h2>
                  <div className="space-y-3">
                    {users.map(u => (
                      <div key={u._id} className="card-luxury p-5 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && <p className="text-gray-400 text-center py-8">No customers yet</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
