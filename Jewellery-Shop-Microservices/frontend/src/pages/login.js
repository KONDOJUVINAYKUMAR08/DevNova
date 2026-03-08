import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiDiamondRing } from 'react-icons/gi';
import toast from 'react-hot-toast';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      router.push(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Lumière Fine Jewellery</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card-luxury p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <GiDiamondRing className="text-white text-3xl" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-400">Sign in to your Lumière account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-luxury pl-11" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-luxury pl-11 pr-11" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
