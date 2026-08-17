'use client';

import React from 'react';
import Image from 'next/image';
import { Activity, RefreshCw } from 'lucide-react';

interface BrandHeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  currentRole,
  onRoleChange,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <header className="w-full bg-[#111827]/80 backdrop-blur-md border-b border-[#1f293d] px-6 py-4 mb-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-28 flex items-center">
            <Image
              src="/groww_logo.svg"
              alt="Groww Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-light tracking-wider text-slate-400 border-l border-slate-700 pl-3">
            pulse
          </span>
        </div>

        {/* Header Metadata & Controls */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Live Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00d09c]/10 border border-[#00d09c]/30 text-xs font-medium text-[#00d09c]">
            <span className="w-2 h-2 rounded-full bg-[#00d09c] animate-pulse" />
            Week 17 Pulse • Live Data
          </div>

          {/* Stakeholder Lens Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Stakeholder Lens:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-[#1f293d] text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-[#00d09c] cursor-pointer"
            >
              <option value="Lead Insights Analyst">Lead Insights Analyst</option>
              <option value="Product Manager">Product / Growth</option>
              <option value="Customer Support Lead">Support Lead</option>
              <option value="Engineering VP">Leadership / Engineering</option>
            </select>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#1f293d] hover:bg-slate-700 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00d09c]' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
