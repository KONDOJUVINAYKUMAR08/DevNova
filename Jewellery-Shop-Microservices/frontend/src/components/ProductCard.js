import Link from 'next/link';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/product/${product._id}`} className="card-product block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#2a2a45] to-[#1a1a30]">
        <div className="absolute inset-0 flex items-center justify-center">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mb-3">
                <FiHeart className="text-gold-400 text-2xl" />
              </div>
              <span className="text-xs text-gray-500">{product.categoryName || 'Jewellery'}</span>
            </div>
          )}
        </div>
        {/* Badges */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full text-xs font-semibold text-white shadow-lg">
            ✨ Featured
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-gold-400 border border-gold-500/20">
          {product.purity}
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <span className="btn-gold text-xs py-2 px-6">View Details</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="badge-gold">{product.categoryName || product.metalType}</span>
          <span className="text-xs text-gray-500">{product.netWeight}g</span>
        </div>
        <h3 className="font-display text-lg text-white group-hover:text-gold-400 transition-colors duration-300 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-1 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center space-x-1 text-gold-400">
            <FiStar className="fill-current text-sm" />
            <span className="text-xs text-gray-400">4.5</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
