'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface DimensionData {
  dimension: string;
  urgencyScore: number;
  fullMark: number;
}

const mockDimensions: DimensionData[] = [
  { dimension: 'Payments & Withdrawals', urgencyScore: 92, fullMark: 100 },
  { dimension: 'Customer Success', urgencyScore: 84, fullMark: 100 },
  { dimension: 'App Stability', urgencyScore: 58, fullMark: 100 },
  { dimension: 'Onboarding & KYC', urgencyScore: 45, fullMark: 100 },
  { dimension: 'Portfolio View', urgencyScore: 30, fullMark: 100 },
];

export const UrgencyHeatmap: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 shadow-lg flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Urgency Radar Heatmap</h3>
            <p className="text-xs text-slate-400">5-Dimensional Issue Intensity</p>
          </div>
        </div>
        <span className="text-[11px] text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          Peak: Payments (92)
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockDimensions}>
            <PolarGrid stroke="#1f293d" />
            <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
            <Radar
              name="Urgency Intensity"
              dataKey="urgencyScore"
              stroke="#00d09c"
              fill="#00d09c"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f293d',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f3f4f6',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
