'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const marketIndices: IndexItem[] = [
  { symbol: 'NIFTY 50', name: 'NIFTY 50', price: '24,312.45', change: '+0.68%', isPositive: true },
  { symbol: 'SENSEX', name: 'BSE SENSEX', price: '79,842.10', change: '+0.54%', isPositive: true },
  { symbol: 'BANK NIFTY', name: 'NIFTY BANK', price: '51,980.30', change: '-0.22%', isPositive: false },
  { symbol: 'FINNIFTY', name: 'FIN NIFTY', price: '23,890.15', change: '+0.41%', isPositive: true },
  { symbol: 'GOLD', name: 'GOLD 24K', price: '₹71,450/10g', change: '+0.15%', isPositive: true },
  { symbol: 'USD/INR', name: 'USD/INR', price: '83.92', change: '-0.08%', isPositive: false },
  { symbol: 'GROWW APP', name: 'GROWW RATING', price: '4.4 ★', change: '880 Reviews', isPositive: true },
];

export const MarketBar: React.FC = () => {
  // Duplicate array for seamless infinite looping
  const tickerItems = [...marketIndices, ...marketIndices];

  return (
    <div className="w-full max-w-full bg-slate-950 border-b border-[#1f293d] overflow-hidden py-2 select-none">
      <div className="animate-marquee">
        {tickerItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-6 border-r border-[#1f293d]/50 shrink-0 font-mono text-xs"
          >
            <span className="text-slate-400 font-sans font-medium text-[11px]">{item.name}</span>
            <span className="text-slate-100 font-bold">{item.price}</span>
            <span
              className={`flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                item.isPositive
                  ? 'text-[#00d09c] bg-[#00d09c]/10'
                  : 'text-rose-400 bg-rose-500/10'
              }`}
            >
              {item.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
