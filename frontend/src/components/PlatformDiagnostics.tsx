'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Smartphone, Layers } from 'lucide-react';

interface PlatformData {
  category: string;
  Android: number;
  iOS: number;
}

const mockPlatformData: PlatformData[] = [
  { category: 'Negative Feedback', Android: 520, iOS: 208 },
  { category: 'Neutral / Support', Android: 110, iOS: 39 },
  { category: 'Positive / Feature', Android: 2, iOS: 1 },
];

export const PlatformDiagnostics: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 shadow-lg flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Platform Diagnostics</h3>
            <p className="text-xs text-slate-400">Android vs. iOS Volume & Sentiment Breakdown</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-300 font-mono">Android: 72%</span>
          <span className="text-slate-300 font-mono">iOS: 28%</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockPlatformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
            <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f293d',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f3f4f6',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Bar dataKey="Android" fill="#00d09c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="iOS" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
