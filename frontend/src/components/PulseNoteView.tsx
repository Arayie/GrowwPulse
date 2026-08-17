'use client';

import React from 'react';
import { RoleType } from './RoleSelector';
import {
  Sparkles,
  AlertCircle,
  Quote,
  CheckCircle2,
  Copy,
  Layers,
  Wrench,
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface PulseNoteViewProps {
  reportText?: string;
  selectedRole?: RoleType;
  isLoading?: boolean;
}

export const PulseNoteView: React.FC<PulseNoteViewProps> = ({
  reportText,
  selectedRole = 'Product',
  isLoading = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (reportText) {
      navigator.clipboard.writeText(reportText);
    } else {
      navigator.clipboard.writeText(`Groww Pulse Report - ${selectedRole} Lens`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic role-curated dataset
  const roleDataMap = {
    Product: {
      themes: [
        { title: 'Double SIP AutoPay Mandate Duplication', desc: 'Recurring payment microservice executing SIP mandates twice in a month without authorization (159 reports).', tag: 'Payments' },
        { title: 'iOS Candlestick Chart Freezes during Peak F&O', desc: 'Post-update UI regression causing charts to freeze on iOS during opening trading hours (9:15 AM).', tag: 'Mobile App' },
        { title: 'Bank Account & Mandate Validation Stalls', desc: 'Multi-day delays in bank account verification blocking fund deposits and AutoPay setups (158 reports).', tag: 'Onboarding' },
      ],
      quotes: [
        'SIP amount deducted twice this month. Double deduction happened without any reason. User [EMAIL REDACTED] ticket unresolved.',
        'Latest update freezes option charts on iOS. Screen goes blank during fast market moves for account [ID REDACTED].',
        'Bank verification stuck for 5 days. Cannot set up AutoPay mandate. Contacted support at [EMAIL REDACTED].',
      ],
      actions: [
        { title: 'Payment Microservice Guardrail', desc: 'Build an automated mandate deduplication engine in payment backend services to block double debits.', category: 'Architecture', color: 'border-[#00d09c] text-[#00d09c] bg-[#00d09c]/10' },
        { title: 'iOS Metal Chart Hotfix', desc: 'Deploy hotfix patch optimizing iOS chart rendering pipeline and WebSocket data stream buffers.', category: 'Mobile Engineering', color: 'border-indigo-400 text-indigo-400 bg-indigo-500/10' },
        { title: 'Instant NPCI Penny-Drop', desc: 'Automate real-time bank validation via direct NPCI API webhooks to clear KYC bottlenecks.', category: 'User Onboarding', color: 'border-amber-400 text-amber-400 bg-amber-500/10' },
      ],
    },
    Support: {
      themes: [
        { title: 'Withdrawal Tickets Stalled over 5 Days', desc: 'High volume of angry user escalations regarding locked funds and unacknowledged support tickets.', tag: 'Escalations' },
        { title: 'Unresolved CS Tickets (7+ Days Inactive)', desc: 'Users reporting long response latency and automated bot loops with no human agent resolution (130 reports).', tag: 'Ticket Aging' },
        { title: 'Silent Payment Failures without SMS Triggers', desc: 'Bank account debited for investments showing failed status without clear status tracking.', tag: 'User Comms' },
      ],
      quotes: [
        'Withdrawal pending for 5 days. Urgently need money but no response from support team or phone [PHONE REDACTED].',
        'Raised ticket 7 days ago regarding failed transaction. No response received from email [EMAIL REDACTED]. Very poor service.',
        'Money deducted from bank but investment not done. Transaction shows failed status. Contacted [EMAIL REDACTED].',
      ],
      actions: [
        { title: 'Priority Escalation Desk', desc: 'Establish a 24/7 priority escalation desk for withdrawal tickets pending over 48 hours.', category: 'Support Operations', color: 'border-[#00d09c] text-[#00d09c] bg-[#00d09c]/10' },
        { title: 'Automated Status Triggers', desc: 'Deploy automated WhatsApp and SMS status tracking triggers for failed or processing transactions.', category: 'Customer Comms', color: 'border-indigo-400 text-indigo-400 bg-indigo-500/10' },
        { title: 'Instant Refund Credit Protocol', desc: 'Update CS playbooks to enable instant wallet provisional credits for verified double SIP debits.', category: 'Support Playbook', color: 'border-amber-400 text-amber-400 bg-amber-500/10' },
      ],
    },
    Leadership: {
      themes: [
        { title: 'Public Store Brand & Rating Risk', desc: 'Surge in 1-star App Store/Play Store reviews impacting public rating due to payment execution issues.', tag: 'Brand Health' },
        { title: 'Partner Bank Payment Gateway Latency', desc: 'Banking partner gateway timeouts causing transaction processing stalls and refund delays.', tag: 'Banking SLA' },
        { title: 'High-LTV F&O Trader Churn Risk', desc: 'Peak trading hour latencies causing user dissatisfaction among high-volume active traders.', tag: 'Trader Churn' },
      ],
      quotes: [
        'Order failed twice during market peak at 9:15 AM! Stop-loss didn’t trigger. Account [ID REDACTED] unresolved.',
        'Groww used to be great but latest payment issues are terrible. Moving my portfolio to another broker.',
        'Double deduction happened twice. Unacceptable for a financial app managing user funds. User [EMAIL REDACTED].',
      ],
      actions: [
        { title: 'Banking Partner SLA Audit', desc: 'Renegotiate SLA parameters and instant refund webhook requirements with primary payment gateway partners.', category: 'Strategic Partnerships', color: 'border-[#00d09c] text-[#00d09c] bg-[#00d09c]/10' },
        { title: 'AutoPay Compliance Review', desc: 'Convene internal risk task force to audit AutoPay mandate clearing against regulatory guidelines.', category: 'Risk & Compliance', color: 'border-indigo-400 text-indigo-400 bg-indigo-500/10' },
        { title: 'Emergency Infrastructure Resource', desc: 'Authorize emergency engineering resource allocation to scale peak opening-hour trading engine capacity.', category: 'Exec Resource', color: 'border-amber-400 text-amber-400 bg-amber-500/10' },
      ],
    },
  };

  const currentData = roleDataMap[selectedRole] || roleDataMap.Product;

  return (
    <div className="bg-[#111827] border border-[#1f293d] rounded-2xl p-6 shadow-2xl flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f293d]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">Weekly Pulse Executive Note</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/30">
                {selectedRole} Lens
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Curated specifically for <span className="text-slate-200 font-semibold">{selectedRole}</span> perspective
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#1f293d] hover:bg-slate-700 px-3.5 py-2 rounded-lg border border-slate-700 transition shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? 'Copied to Clipboard' : 'Copy Note'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
          <div className="w-8 h-8 border-2 border-[#00d09c] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Re-clustering 880 reviews for {selectedRole} perspective...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Top 3 Themes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-[#00d09c]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Top 3 {selectedRole} Themes
              </h3>
            </div>

            <div className="space-y-3">
              {currentData.themes.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#192233] border border-[#27354e] hover:border-[#00d09c]/40 transition group shadow-md"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-[#00d09c] transition">
                      {idx + 1}. {t.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: PII-Scrubbed Real User Quotes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Scrubbed User Quotes
              </h3>
            </div>

            <div className="space-y-3">
              {currentData.quotes.map((q, idx) => (
                <blockquote
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-indigo-500 text-xs text-slate-300 italic shadow-md relative"
                >
                  &ldquo;{q}&rdquo;
                  <span className="block mt-2 text-[10px] font-sans not-italic text-slate-500 font-medium">
                    — Play Store / App Store Public Review
                  </span>
                </blockquote>
              ))}
            </div>
          </div>

          {/* Column 3: Visual Action Cards (Elevated Modular Cards) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Role Action Cards
              </h3>
            </div>

            <div className="space-y-3">
              {currentData.actions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#192233] border border-[#27354e] shadow-lg flex flex-col justify-between hover:border-[#00d09c]/40 transition group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${act.color}`}>
                        {act.category}
                      </span>
                      <Zap className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 transition" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mb-1 group-hover:text-[#00d09c] transition">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">{act.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#27354e]/50 flex items-center justify-end text-[10px] font-semibold text-[#00d09c] gap-1 cursor-pointer">
                    Execute Action <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
