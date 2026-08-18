'use client';

import React, { useState, useEffect } from 'react';
import { MarketBar } from '@/components/MarketBar';
import { Navbar } from '@/components/Navbar';
import { RoleSelector, RoleType } from '@/components/RoleSelector';
import { HappinessGraph } from '@/components/HappinessGraph';
import { UrgencyHeatmap } from '@/components/UrgencyHeatmap';
import { PlatformDiagnostics } from '@/components/PlatformDiagnostics';
import { PulseNoteView } from '@/components/PulseNoteView';
import { RefreshCw, Calendar, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>('Product');
  const [selectedWeek, setSelectedWeek] = useState<string>('17');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>('');
  const [weeksList, setWeeksList] = useState<Array<{ week_number: number; label: string }>>([
    { week_number: 15, label: 'Week 15 (Historical)' },
    { week_number: 16, label: 'Week 16 (Historical)' },
    { week_number: 17, label: 'Week 17 (Current)' },
    { week_number: 18, label: 'Week 18 (Auto-Generated)' },
  ]);

  const fetchWeeks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/weeks');
      if (res.ok) {
        const data = await res.json();
        if (data.weeks) {
          setWeeksList(data.weeks.map((w: any) => ({ week_number: w.week_number, label: w.label })));
        }
      }
    } catch (err) {
      console.warn('Backend offline, using historical static weeks list.', err);
    }
  };

  const fetchRoleReport = async (roleName: RoleType, weekId: string = selectedWeek) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/generate-weekly-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleName, csv_file_path: 'reviews.csv', week_id: weekId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReportText(data.report);
      }
    } catch (error) {
      console.warn('Backend API offline, utilizing reactive role state fallback.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (newRole: RoleType) => {
    setSelectedRole(newRole);
    fetchRoleReport(newRole, selectedWeek);
  };

  const handleWeekChange = (newWeek: string) => {
    setSelectedWeek(newWeek);
    fetchRoleReport(selectedRole, newWeek);
  };

  useEffect(() => {
    fetchWeeks();
    fetchRoleReport('Product', '17');
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* 1. Animated Market Bar at top */}
      <MarketBar />

      {/* 2. Global Navbar */}
      <Navbar />

      {/* 3. Role Selector Toggle Menu */}
      <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleChange} />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 overflow-x-hidden">
        {/* Dashboard Control Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#1f293d] rounded-xl p-4 sm:p-5 shadow-lg">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100">Executive Insights Dashboard</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/30">
                {selectedRole} Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Week {selectedWeek} • Historical & Automated Review Insights for {selectedRole} Lens
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
            {/* Week Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#1f293d] px-3 py-2 rounded-xl border border-slate-700 text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#00d09c]" />
              <select
                value={selectedWeek}
                onChange={(e) => handleWeekChange(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {weeksList.map((w) => (
                  <option key={w.week_number} value={String(w.week_number)} className="bg-[#111827] text-slate-200">
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => fetchRoleReport(selectedRole, selectedWeek)}
              disabled={isLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-semibold text-slate-100 bg-[#00d09c]/10 hover:bg-[#00d09c]/20 text-[#00d09c] border border-[#00d09c]/40 px-4 py-2 rounded-xl transition cursor-pointer touch-manipulation active:scale-95 transition-transform relative z-10 shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00d09c] ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Cluster & Generate</span>
            </button>
          </div>
        </div>

        {/* Visual Charts Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HappinessGraph />
          <UrgencyHeatmap />
          <PlatformDiagnostics />
        </div>

        {/* Formatted Pulse Note & Role Action Cards */}
        <div className="w-full">
          <PulseNoteView reportText={reportText} selectedRole={selectedRole} isLoading={isLoading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#1f293d] text-center text-xs text-slate-500 bg-slate-950">
        <p>© 2026 Groww Pulse Insights Engine • Reactive Role & Timeline Dashboard</p>
      </footer>
    </div>
  );
}
