import { useEffect, useState } from 'react';
import { rateAPI } from '../utils/api';
import { GiGoldBar } from 'react-icons/gi';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

export default function RatesTicker() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await rateAPI.getAll();
        setRates(res.data);
      } catch (err) {
        // fallback static rates
        setRates([
          { metalType: 'gold', purity: '24K', ratePerGram: 7200, change: 50 },
          { metalType: 'gold', purity: '22K', ratePerGram: 6600, change: 45 },
          { metalType: 'silver', purity: '999', ratePerGram: 85, change: -2 },
        ]);
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  if (rates.length === 0) return null;

  const getTrendIcon = (change) => {
    if (change > 0) return <FiTrendingUp className="text-green-400" />;
    if (change < 0) return <FiTrendingDown className="text-red-400" />;
    return <FiMinus className="text-gray-400" />;
  };

  return (
    <div className="bg-luxury-dark/60 backdrop-blur-sm border-b border-gold-900/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center py-2 space-x-8 overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <GiGoldBar className="text-gold-400 text-lg" />
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Live Rates</span>
          </div>
          {rates.map((rate, i) => (
            <div key={i} className="flex items-center space-x-3 flex-shrink-0">
              <span className="text-xs text-gray-400 capitalize">{rate.metalType} {rate.purity}</span>
              <span className="text-sm font-bold text-white">₹{rate.ratePerGram?.toLocaleString('en-IN')}/g</span>
              <span className={`flex items-center space-x-1 text-xs ${rate.change > 0 ? 'text-green-400' : rate.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {getTrendIcon(rate.change)}
                <span>{rate.change > 0 ? '+' : ''}{rate.change}</span>
              </span>
              {i < rates.length - 1 && <span className="text-gold-900/40">|</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
