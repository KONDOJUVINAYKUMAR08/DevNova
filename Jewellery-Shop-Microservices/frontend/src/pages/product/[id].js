import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { productAPI, reviewAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FiStar, FiShoppingBag, FiHeart, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { GiGoldBar } from 'react-icons/gi';
import toast from 'react-hot-toast';
import Head from 'next/head';
import Link from 'next/link';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [prodRes, revRes] = await Promise.allSettled([
          productAPI.getById(id),
          reviewAPI.getProductReviews(id)
        ]);
        if (prodRes.status === 'fulfilled') setProduct(prodRes.value.data);
        if (revRes.status === 'fulfilled') {
          setReviews(revRes.value.data.reviews || []);
          setAvgRating(revRes.value.data.averageRating || 0);
        }
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to submit a review'); return; }
    try {
      await reviewAPI.create({ productId: id, ...reviewForm });
      toast.success('Review posted!');
      const revRes = await reviewAPI.getProductReviews(id);
      setReviews(revRes.data.reviews || []);
      setAvgRating(revRes.data.averageRating || 0);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post review');
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-400 text-lg mb-4">Product not found</p>
        <Link href="/collections" className="btn-outline-gold">Back to Collections</Link>
      </div>
    );
  }

  return (
    <>
      <Head><title>{product.name} | Lumière Fine Jewellery</title></Head>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="flex items-center space-x-2 text-gray-400 hover:text-gold-400 transition-colors mb-8">
            <FiChevronLeft /><span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="card-luxury overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-[#2a2a45] to-[#1a1a30] flex items-center justify-center relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mb-4">
                      <GiGoldBar className="text-gold-400 text-6xl" />
                    </div>
                    <p className="text-gray-500">{product.categoryName || 'Fine Jewellery'}</p>
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full text-sm font-semibold text-white">✨ Featured</div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-gold mb-3 inline-block">{product.categoryName || product.metalType}</span>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{product.name}</h1>
                </div>
                <div className="flex space-x-2">
                  <button className="p-3 rounded-full border border-gold-900/30 text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all"><FiHeart /></button>
                  <button className="p-3 rounded-full border border-gold-900/30 text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-all"><FiShare2 /></button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(s => (
                    <FiStar key={s} className={`${s <= Math.round(avgRating) ? 'text-gold-400 fill-current' : 'text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">{avgRating} ({reviews.length} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Specs */}
              <div className="card-luxury p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Metal', value: product.metalType },
                    { label: 'Purity', value: product.purity },
                    { label: 'Net Weight', value: `${product.netWeight}g` },
                    { label: 'Gross Weight', value: product.grossWeight ? `${product.grossWeight}g` : 'N/A' },
                    { label: 'Making Charges', value: product.makingCharges ? formatPrice(product.makingCharges) : 'Included' },
                    { label: 'Stock', value: product.stock > 0 ? 'In Stock' : 'Out of Stock' },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gold-900/10">
                      <span className="text-sm text-gray-400">{spec.label}</span>
                      <span className="text-sm text-white font-medium capitalize">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>

              <Link href={isAuthenticated ? `/product/${id}#enquiry` : '/login'}
                className="btn-gold w-full text-center flex items-center justify-center space-x-2 text-lg py-4">
                <FiShoppingBag /><span>Enquire Now</span>
              </Link>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-white mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Form */}
              <div className="card-luxury p-6">
                <h3 className="text-white font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                          className={`text-2xl transition-colors ${s <= reviewForm.rating ? 'text-gold-400' : 'text-gray-600'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Comment</label>
                    <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="input-luxury h-24 resize-none" placeholder="Share your experience..." />
                  </div>
                  <button type="submit" className="btn-gold w-full text-sm py-2.5">Post Review</button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev._id} className="card-luxury p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-sm font-bold">
                          {rev.customerName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{rev.customerName}</p>
                          <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex">{[1, 2, 3, 4, 5].map(s => <span key={s} className={`text-sm ${s <= rev.rating ? 'text-gold-400' : 'text-gray-600'}`}>★</span>)}</div>
                    </div>
                    <p className="text-gray-300 text-sm">{rev.comment}</p>
                  </div>
                )) : (
                  <div className="card-luxury p-8 text-center">
                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
