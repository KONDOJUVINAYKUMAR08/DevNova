import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiDiamondRing } from 'react-icons/gi';
import toast from 'react-hot-toast';
import Head from 'next/head';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name}! Account created.`);
      router.push(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | Lumière Fine Jewellery</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card-luxury p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <GiDiamondRing className="text-white text-3xl" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
              <p className="text-gray-400">Join the Lumière family</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="name" value={form.name} onChange={handleChange}
                    className="input-luxury pl-11" placeholder="John Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    className="input-luxury pl-11" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="input-luxury pl-11" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={handleChange} className="input-luxury pl-11 pr-11" placeholder="Min 6 characters" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Account Type</label>
                <div className="flex space-x-4">
                  {['customer', 'admin'].map((role) => (
                    <label key={role}
                      className={`flex-1 text-center py-3 rounded-lg border cursor-pointer transition-all duration-300
                        ${form.role === role
                          ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                          : 'border-gold-900/30 text-gray-400 hover:border-gold-500/50'}`}>
                      <input type="radio" name="role" value={role} checked={form.role === role}
                        onChange={handleChange} className="hidden" />
                      <span className="capitalize font-medium">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
