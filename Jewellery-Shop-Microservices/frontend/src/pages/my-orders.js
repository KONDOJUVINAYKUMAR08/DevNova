import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { orderAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Head from 'next/head';

export default function MyOrders() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (isAuthenticated) {
      orderAPI.getMyOrders().then(res => setOrders(res.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading]);

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    processing: 'text-purple-400 bg-purple-400/10',
    shipped: 'text-cyan-400 bg-cyan-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  const statusIcons = {
    pending: <FiClock />, confirmed: <FiCheckCircle />, delivered: <FiCheckCircle />, cancelled: <FiXCircle />,
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div></div>;
  }

  return (
    <>
      <Head><title>My Orders | Lumière Fine Jewellery</title></Head>
      <div className="min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-3xl mb-10">My Orders</h1>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="card-luxury p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FiPackage className="text-gold-400 text-xl" />
                      <div>
                        <p className="text-white font-medium">Order #{order._id?.slice(-8)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`mt-2 md:mt-0 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status] || statusColors.pending}`}>
                      {statusIcons[order.status] || <FiClock />}
                      <span>{order.status}</span>
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gold-900/10 last:border-0">
                        <span className="text-gray-300">{item.productName} × {item.quantity}</span>
                        <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-luxury p-12 text-center">
              <FiPackage className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-2">No orders yet</p>
              <p className="text-gray-500 text-sm">Start exploring our collections to find your perfect piece</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
