'use client';

import React from 'react';
import { Target, Headphones, ShieldAlert } from 'lucide-react';

export type RoleType = 'Product' | 'Support' | 'Leadership';

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const roles: { id: RoleType; label: string; sublabel: string; icon: React.ElementType }[] = [
    { id: 'Product', label: 'Product & Growth', sublabel: 'Bugs & Onboarding', icon: Target },
    { id: 'Support', label: 'Customer Support', sublabel: 'Sentiment & Complaints', icon: Headphones },
    { id: 'Leadership', label: 'Leadership Lens', sublabel: 'Strategic Standing', icon: ShieldAlert },
  ];

  return (
    <div className="w-full bg-[#111827] border-b border-[#1f293d] py-3 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Perspective:
          </span>
        </div>

        {/* Pill-based Toggle Menu */}
        <div className="flex items-center gap-2 bg-[#0b0f19] p-1.5 rounded-xl border border-[#1f293d] w-full sm:w-auto overflow-x-auto">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#00d09c] text-slate-950 shadow-md shadow-[#00d09c]/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f293d]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div>{r.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
