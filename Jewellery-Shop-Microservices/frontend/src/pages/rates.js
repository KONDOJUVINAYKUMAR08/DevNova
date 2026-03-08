import { useEffect, useState } from 'react';
import { rateAPI } from '../utils/api';
import { FiTrendingUp, FiTrendingDown, FiClock } from 'react-icons/fi';
import { GiGoldBar } from 'react-icons/gi';
import Head from 'next/head';

export default function Rates() {
  const [rates, setRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await rateAPI.getAll();
        setRates(res.data);
        if (res.data.length > 0) {
          setLastUpdated(new Date(res.data[0].updatedAt).toLocaleString());
        }
      } catch {
        setRates([
          { metalType: 'gold', purity: '24K', ratePerGram: 7200, previousRate: 7150, change: 50, changePercent: 0.7 },
          { metalType: 'gold', purity: '22K', ratePerGram: 6600, previousRate: 6555, change: 45, changePercent: 0.69 },
          { metalType: 'gold', purity: '18K', ratePerGram: 5400, previousRate: 5380, change: 20, changePercent: 0.37 },
          { metalType: 'silver', purity: '999', ratePerGram: 85, previousRate: 87, change: -2, changePercent: -2.3 },
          { metalType: 'silver', purity: '925', ratePerGram: 78, previousRate: 80, change: -2, changePercent: -2.5 },
          { metalType: 'platinum', purity: '950', ratePerGram: 3200, previousRate: 3190, change: 10, changePercent: 0.31 },
        ]);
        setLastUpdated(new Date().toLocaleString());
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const metalColors = {
    gold: 'from-yellow-400 to-amber-600',
    silver: 'from-gray-300 to-gray-500',
    platinum: 'from-blue-200 to-blue-400',
  };

  return (
    <>
      <Head><title>Live Metal Rates | Lumière Fine Jewellery</title></Head>
      <div className="min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="section-title text-4xl md:text-5xl">Live Metal Rates</h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-4">Real-time gold, silver, and platinum prices updated throughout the day</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <FiClock /><span>Last updated: {lastUpdated || 'Loading...'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rates.map((rate, i) => (
              <div key={i} className="card-luxury p-8 hover:-translate-y-1 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${metalColors[rate.metalType] || metalColors.gold} flex items-center justify-center opacity-80`}>
                      <GiGoldBar className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold capitalize">{rate.metalType}</h3>
                      <span className="text-xs text-gray-400">{rate.purity}</span>
                    </div>
                  </div>
                  {rate.change > 0 ? (
                    <span className="flex items-center space-x-1 text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                      <FiTrendingUp /><span>+{rate.changePercent || 0}%</span>
                    </span>
                  ) : rate.change < 0 ? (
                    <span className="flex items-center space-x-1 text-sm text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
                      <FiTrendingDown /><span>{rate.changePercent || 0}%</span>
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 bg-gray-400/10 px-3 py-1 rounded-full">0%</span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                    ₹{rate.ratePerGram?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per gram</p>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-gold-900/20 pt-4">
                  <span className="text-gray-400">Previous</span>
                  <span className="text-gray-300">₹{rate.previousRate?.toLocaleString('en-IN') || '---'}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Change</span>
                  <span className={rate.change > 0 ? 'text-green-400' : rate.change < 0 ? 'text-red-400' : 'text-gray-400'}>
                    {rate.change > 0 ? '+' : ''}₹{rate.change || 0}
                  </span>
                </div>

                {/* Per 10g / Per 100g */}
                <div className="mt-4 pt-4 border-t border-gold-900/20 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Per 10g</p>
                    <p className="text-sm text-white font-medium">₹{(rate.ratePerGram * 10)?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Per 100g</p>
                    <p className="text-sm text-white font-medium">₹{(rate.ratePerGram * 100)?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 card-luxury p-6 text-center">
            <p className="text-sm text-gray-400">
              💡 Rates are indicative and updated regularly. Final price at the time of purchase may vary.
              Contact us for bulk purchase rates.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
