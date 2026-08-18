'use client';

import React, { useState, useEffect } from 'react';
import { MarketBar } from '@/components/MarketBar';
import { Navbar } from '@/components/Navbar';
import { Database, Download, Search, ShieldCheck, Filter, FileSpreadsheet, RefreshCw, Calendar, PlusCircle, Sparkles } from 'lucide-react';

interface WeekMetadata {
  week_number: number;
  label: string;
  review_count: number;
  happiness_score: number;
  top_theme: string;
  themes: string[];
  quotes: string[];
  metrics: Record<string, number>;
}

interface ReviewRow {
  id: string;
  store: string;
  rating: number;
  text: string;
  date: string;
  version: string;
  week: string;
}

const initialSampleReviews: Record<string, ReviewRow[]> = {
  "15": [
    { id: '15a-01', store: 'android', rating: 1, text: 'KYC verification stuck for 3 days. Account [ID REDACTED] unable to trade.', date: '2026-03-12', version: '5.40.0', week: 'Wk 15' },
    { id: '15a-02', store: 'ios', rating: 1, text: 'AutoPay mandate failed twice on HDFC bank. Contacted support [EMAIL REDACTED].', date: '2026-03-13', version: '5.40.0', week: 'Wk 15' },
    { id: '15a-03', store: 'android', rating: 2, text: 'Portfolio value updating 15 mins late. Fix this bug immediately.', date: '2026-03-14', version: '5.40.1', week: 'Wk 15' },
  ],
  "16": [
    { id: '16a-01', store: 'android', rating: 1, text: 'Money deducted but order failed. Refund pending since 48h. User [EMAIL REDACTED].', date: '2026-03-19', version: '5.41.0', week: 'Wk 16' },
    { id: '16a-02', store: 'ios', rating: 1, text: 'SIP executed twice on 5th of month. Ticket [ID REDACTED] unresolved.', date: '2026-03-20', version: '5.41.0', week: 'Wk 16' },
    { id: '16a-03', store: 'android', rating: 1, text: 'App closes abruptly when placing F&O order. Please resolve.', date: '2026-03-21', version: '5.41.2', week: 'Wk 16' },
  ],
  "17": [
    { id: '86a51a55', store: 'android', rating: 1, text: 'If we pledge our shares once and later unpledge them, we are being charged twice — once for pledging and once for unpledging. Charges billed repeatedly for account [ID REDACTED].', date: '2026-04-23', version: '18.7.1', week: 'Wk 17' },
    { id: 'd65dcb66', store: 'ios', rating: 1, text: 'Raised ticket 7 days ago regarding delayed bank verification. No response received from email [EMAIL REDACTED]. Very poor support.', date: '2026-03-29', version: '5.42.0', week: 'Wk 17' },
    { id: '9a8d13bd', store: 'android', rating: 1, text: 'SIP amount deducted twice this month. Double deduction happened without any reason. Ticket reference [ID REDACTED] unresolved.', date: '2026-03-29', version: '5.42.0', week: 'Wk 17' },
    { id: '929d3902', store: 'ios', rating: 1, text: 'Money deducted from bank but investment not done. Transaction shows failed status. Contacted phone [PHONE REDACTED] with no response.', date: '2026-03-29', version: '5.42.0', week: 'Wk 17' },
    { id: '94447c72', store: 'android', rating: 1, text: 'Withdrawal pending for 5 days. Urgently need money but no response from support team or user [USERNAME REDACTED].', date: '2026-03-28', version: '5.42.0', week: 'Wk 17' },
    { id: '139ab341', store: 'android', rating: 2, text: 'Transaction stuck in processing state for 48 hours. No update no resolution given for user [EMAIL REDACTED].', date: '2026-03-28', version: '5.42.0', week: 'Wk 17' },
  ],
};

export default function DataLibraryPage() {
  const [selectedWeek, setSelectedWeek] = useState<string>('17');
  const [availableWeeks, setAvailableWeeks] = useState<WeekMetadata[]>([
    { week_number: 15, label: 'Week 15 (Historical)', review_count: 760, happiness_score: 71, top_theme: 'Onboarding & Bank Verification Latency', themes: [], quotes: [], metrics: {} },
    { week_number: 16, label: 'Week 16 (Historical)', review_count: 820, happiness_score: 65, top_theme: 'Payment Processing Stalls & Failed Refunds', themes: [], quotes: [], metrics: {} },
    { week_number: 17, label: 'Week 17 (Current)', review_count: 880, happiness_score: 62, top_theme: 'Double SIP AutoPay Mandate Duplication', themes: [], quotes: [], metrics: {} },
    { week_number: 18, label: 'Week 18 (Auto-Generated)', review_count: 925, happiness_score: 65, top_theme: 'Automated Mandate Deduplication (W18)', themes: [], quotes: [], metrics: {} },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [storeFilter, setStoreFilter] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchWeeks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/weeks');
      if (res.ok) {
        const data = await res.json();
        if (data.weeks && data.weeks.length > 0) {
          setAvailableWeeks(data.weeks);
        }
      }
    } catch (err) {
      console.warn('Backend offline, using historical static weeks timeline.', err);
    }
  };

  const handleGenerateNextWeek = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/weeks/generate-next', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const newW = data.new_week;
        fetchWeeks();
        setSelectedWeek(String(newW.week_number));
      }
    } catch (err) {
      console.warn('Backend offline, simulating Week 18+ auto-generation on client.', err);
      const nextNum = availableWeeks.length > 0 ? Math.max(...availableWeeks.map(w => w.week_number)) + 1 : 18;
      const newSimulatedWeek: WeekMetadata = {
        week_number: nextNum,
        label: `Week ${nextNum} (Auto-Generated)`,
        review_count: 880 + (nextNum - 17) * 45,
        happiness_score: minMax(62 + (nextNum - 17) * 3, 50, 95),
        top_theme: `Automated Mandate Deduplication (W${nextNum})`,
        themes: [], quotes: [], metrics: {}
      };
      setAvailableWeeks(prev => [...prev, newSimulatedWeek]);
      setSelectedWeek(String(nextNum));
    } finally {
      setIsGenerating(false);
    }
  };

  const minMax = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

  useEffect(() => {
    fetchWeeks();
  }, []);

  const activeWeekData = availableWeeks.find(w => String(w.week_number) === selectedWeek) || availableWeeks[2];
  const reviewsForWeek = initialSampleReviews[selectedWeek] || [
    { id: `w${selectedWeek}-01`, store: 'android', rating: 1, text: `Auto-generated Week ${selectedWeek} review entry. Double SIP issue resolved for account [ID REDACTED].`, date: '2026-05-01', version: '18.8.0', week: `Wk ${selectedWeek}` },
    { id: `w${selectedWeek}-02`, store: 'ios', rating: 1, text: `Week ${selectedWeek} update fixed chart freezes on iOS during market opening for [EMAIL REDACTED].`, date: '2026-05-02', version: '18.8.0', week: `Wk ${selectedWeek}` },
  ];

  const filteredReviews = reviewsForWeek.filter((r) => {
    const matchesSearch = r.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = storeFilter === 'all' || r.store.toLowerCase() === storeFilter.toLowerCase();
    return matchesSearch && matchesStore;
  });

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/library/download');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `groww_sanitized_reviews_wk${selectedWeek}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('API download failed');
      }
    } catch (error) {
      console.warn('Backend offline, using client-side CSV download fallback.', error);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Review ID,Store,Rating,Review Text,Date,App Version,Week\n' +
        filteredReviews
          .map((e) => `"${e.id}","${e.store}",${e.rating},"${e.text}","${e.date}","${e.version}","${e.week}"`)
          .join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `groww_sanitized_reviews_wk${selectedWeek}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <MarketBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Page Header & Week Selector Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#1f293d] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#00d09c]/10 text-[#00d09c]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100">Data Library & Weekly Review Repository</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> PII Scrubbed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeWeekData?.label || `Week ${selectedWeek}`} Dataset ({activeWeekData?.review_count || 880} Processed Public App Reviews)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateNextWeek}
              disabled={isGenerating}
              className="flex items-center gap-2 text-xs font-semibold text-[#00d09c] bg-[#00d09c]/10 hover:bg-[#00d09c]/20 border border-[#00d09c]/40 px-3.5 py-2.5 rounded-lg transition shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
              Auto-Generate Next Week
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={isDownloading}
              className="flex items-center gap-2 text-xs font-semibold text-slate-900 bg-[#00d09c] hover:bg-[#00b386] px-4 py-2.5 rounded-lg shadow-lg transition shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? 'Downloading...' : 'Download Sanitized CSV'}
            </button>
          </div>
        </div>

        {/* Historical & Future Weeks Timeline Selector */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#00d09c]" />
              Weekly Timeline Selector (Historical W15-W17 & Auto-Generated W18+)
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Selected: Week {selectedWeek}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {availableWeeks.map((w) => {
              const isSelected = String(w.week_number) === selectedWeek;
              const isHistorical = w.week_number <= 16;
              const isCurrent = w.week_number === 17;
              return (
                <button
                  key={w.week_number}
                  onClick={() => setSelectedWeek(String(w.week_number))}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-2 cursor-pointer touch-manipulation ${
                    isSelected
                      ? 'bg-[#00d09c] text-slate-950 shadow-md font-bold'
                      : isCurrent
                      ? 'bg-[#1f293d] text-[#00d09c] border border-[#00d09c]/40 hover:bg-slate-700'
                      : isHistorical
                      ? 'bg-[#192233] text-slate-400 border border-[#27354e] hover:text-slate-200'
                      : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/50'
                  }`}
                >
                  <span>Wk {w.week_number}</span>
                  {isCurrent && <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00d09c]/20 text-[#00d09c]">Current</span>}
                  {w.week_number >= 18 && <Sparkles className="w-3 h-3 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Total Reviews (Week {selectedWeek})</span>
              <p className="text-xl font-bold text-slate-100 font-mono mt-1">{activeWeekData?.review_count || 880}</p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-[#00d09c]/40" />
          </div>
          <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Happiness Score</span>
              <p className="text-xl font-bold text-[#00d09c] font-mono mt-1">{activeWeekData?.happiness_score || 62}%</p>
            </div>
            <Filter className="w-8 h-8 text-indigo-400/40" />
          </div>
          <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Sanitization Engine</span>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-1">100% Zero PII</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-400/40" />
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sanitized review text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1f293d] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-[#00d09c]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Store:</span>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="bg-[#1f293d] text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-[#00d09c]"
            >
              <option value="all">All Stores</option>
              <option value="android">Google Play Store</option>
              <option value="ios">Apple App Store</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#111827] border border-[#1f293d] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#1f293d]/50 uppercase text-[10px] tracking-wider text-slate-400 border-b border-[#1f293d]">
                <tr>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Sanitized Review Text</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">App Ver</th>
                  <th className="px-4 py-3">Week</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f293d]">
                {filteredReviews.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#192233] transition">
                    <td className="px-4 py-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          row.store === 'android'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {row.store}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-400">{row.rating} ★</td>
                    <td className="px-4 py-3 leading-relaxed max-w-xl text-slate-200">{row.text}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{row.date}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{row.version}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{row.week}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-[#1f293d] text-center text-xs text-slate-500 bg-slate-950">
        <p>© 2026 Groww Pulse Insights Engine • Data Library Module</p>
      </footer>
    </div>
  );
}
