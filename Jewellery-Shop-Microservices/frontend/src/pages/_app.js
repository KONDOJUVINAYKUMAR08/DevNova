import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RatesTicker from '../components/RatesTicker';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Lumière Fine Jewellery | Exquisite Handcrafted Collections</title>
        <meta name="description" content="Discover exquisite handcrafted jewellery at Lumière. Browse our collections of gold, silver, and diamond rings, necklaces, bangles, and earrings with live metal prices." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a2e', color: '#e8e6e3', border: '1px solid rgba(212,136,28,0.3)' },
        success: { iconTheme: { primary: '#f59e0b', secondary: '#1a1a2e' } },
        error: { iconTheme: { primary: '#e94560', secondary: '#1a1a2e' } },
      }} />
      <RatesTicker />
      <Navbar />
      <main className="min-h-screen pt-20">
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}
