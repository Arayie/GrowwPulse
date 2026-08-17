'use client';

import React, { useState } from 'react';
import { MarketBar } from '@/components/MarketBar';
import { Navbar } from '@/components/Navbar';
import { Database, Download, Search, ShieldCheck, Filter, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface ReviewRow {
  id: string;
  store: string;
  rating: number;
  text: string;
  date: string;
  version: string;
  week: string;
}

const sampleReviews: ReviewRow[] = [
  {
    id: '86a51a55',
    store: 'android',
    rating: 1,
    text: 'If we pledge our shares once and later unpledge them, we are being charged twice — once for pledging and once for unpledging. Charges billed repeatedly for account [ID REDACTED].',
    date: '2026-04-23',
    version: '18.7.1',
    week: 'Wk 17',
  },
  {
    id: 'd65dcb66',
    store: 'ios',
    rating: 1,
    text: 'Raised ticket 7 days ago regarding delayed bank verification. No response received from email [EMAIL REDACTED]. Very poor support.',
    date: '2026-03-29',
    version: '5.42.0',
    week: 'Wk 17',
  },
  {
    id: '9a8d13bd',
    store: 'android',
    rating: 1,
    text: 'SIP amount deducted twice this month. Double deduction happened without any reason. Ticket reference [ID REDACTED] unresolved.',
    date: '2026-03-29',
    version: '5.42.0',
    week: 'Wk 17',
  },
  {
    id: '929d3902',
    store: 'ios',
    rating: 1,
    text: 'Money deducted from bank but investment not done. Transaction shows failed status. Contacted phone [PHONE REDACTED] with no response.',
    date: '2026-03-29',
    version: '5.42.0',
    week: 'Wk 17',
  },
  {
    id: '94447c72',
    store: 'android',
    rating: 1,
    text: 'Withdrawal pending for 5 days. Urgently need money but no response from support team or user [USERNAME REDACTED].',
    date: '2026-03-28',
    version: '5.42.0',
    week: 'Wk 17',
  },
  {
    id: '139ab341',
    store: 'android',
    rating: 2,
    text: 'Transaction stuck in processing state for 48 hours. No update no resolution given for user [EMAIL REDACTED].',
    date: '2026-03-28',
    version: '5.42.0',
    week: 'Wk 17',
  },
];

export default function DataLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [storeFilter, setStoreFilter] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredReviews = sampleReviews.filter((r) => {
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
        a.download = 'groww_sanitized_reviews_wk17.csv';
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
        sampleReviews
          .map((e) => `"${e.id}","${e.store}",${e.rating},"${e.text}","${e.date}","${e.version}","${e.week}"`)
          .join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'groww_sanitized_reviews_wk17.csv');
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
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#1f293d] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#00d09c]/10 text-[#00d09c]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100">Data Library & Raw Review Repository</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> PII Scrubbed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Week 17 Payments & Withdrawals Dataset (880 Processed Public App Reviews)
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            className="flex items-center gap-2 text-xs font-semibold text-slate-900 bg-[#00d09c] hover:bg-[#00b386] px-4 py-2.5 rounded-lg shadow-lg transition shrink-0 disabled:opacity-50"
          >
            {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Downloading...' : 'Download Sanitized CSV'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Total Reviews Analyzed</span>
              <p className="text-xl font-bold text-slate-100 font-mono mt-1">880</p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-[#00d09c]/40" />
          </div>
          <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Platform Breakdown</span>
              <p className="text-xl font-bold text-slate-100 font-mono mt-1">72% Android / 28% iOS</p>
            </div>
            <Filter className="w-8 h-8 text-indigo-400/40" />
          </div>
          <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Sanitization Rules Applied</span>
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
