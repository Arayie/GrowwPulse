'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Smile } from 'lucide-react';

interface HappinessData {
  week: string;
  score: number;
  nps: number;
}

const mockHappinessData: HappinessData[] = [
  { week: 'Wk 9', score: 78, nps: 42 },
  { week: 'Wk 10', score: 82, nps: 48 },
  { week: 'Wk 11', score: 85, nps: 52 },
  { week: 'Wk 12', score: 80, nps: 45 },
  { week: 'Wk 13', score: 74, nps: 38 },
  { week: 'Wk 14', score: 71, nps: 34 },
  { week: 'Wk 15', score: 68, nps: 29 },
  { week: 'Wk 16', score: 65, nps: 25 },
  { week: 'Wk 17', score: 62, nps: 21 }, // Current week showing dip due to payments/withdrawals issue
];

export const HappinessGraph: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 shadow-lg flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#00d09c]/10 text-[#00d09c]">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Customer Happiness Index</h3>
            <p className="text-xs text-slate-400">9-Week Trend (NPS & Satisfaction Score)</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-rose-400">62.0</span>
          <span className="text-[10px] text-rose-400 block">-4.6% vs Wk 16</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockHappinessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
            <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[50, 100]} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f293d',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f3f4f6',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Happiness Score"
              stroke="#00d09c"
              strokeWidth={3}
              dot={{ fill: '#00d09c', r: 4 }}
              activeDot={{ r: 6, fill: '#00e6ac' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
