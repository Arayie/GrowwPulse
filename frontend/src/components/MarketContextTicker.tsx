'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexItem {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const mockIndices: IndexItem[] = [
  { name: 'NIFTY 50', value: '24,312.45', change: '+0.68%', isPositive: true },
  { name: 'SENSEX', value: '79,842.10', change: '+0.54%', isPositive: true },
  { name: 'BANK NIFTY', value: '51,980.30', change: '-0.22%', isPositive: false },
  { name: 'FINNIFTY', value: '23,890.15', change: '+0.41%', isPositive: true },
  { name: 'GROWW APP STORE', value: '4.4 ★', change: '880 Wk Reviews', isPositive: true },
];

export const MarketContextTicker: React.FC = () => {
  return (
    <div className="w-full bg-[#0d1322] border-y border-[#1f293d] py-2 px-6 overflow-x-auto scrollbar-none mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 min-w-max text-xs">
        <span className="text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
          Market Context
        </span>
        <div className="flex items-center gap-8">
          {mockIndices.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 font-mono">
              <span className="text-slate-400 font-sans font-medium">{item.name}</span>
              <span className="text-slate-200 font-bold">{item.value}</span>
              <span
                className={`flex items-center text-[11px] px-1.5 py-0.5 rounded ${
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
    </div>
  );
};
