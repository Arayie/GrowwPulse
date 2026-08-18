'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Database, Send, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Data Library', href: '/library', icon: Database },
    { label: 'Send Report', href: '/intake', icon: Send },
  ];

  return (
    <nav className="w-full max-w-full bg-[#111827]/90 backdrop-blur-md border-b border-[#1f293d] px-4 sm:px-6 py-3 transition-all overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Header: Logo + "pulse" */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="relative h-6 sm:h-7 w-20 sm:w-26 flex items-center">
            <Image
              src="/groww_logo.svg"
              alt="Groww Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[11px] sm:text-xs font-light tracking-widest text-slate-400 border-l border-slate-700 pl-2 sm:pl-3 uppercase group-hover:text-slate-200 transition">
            pulse
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition cursor-pointer touch-manipulation active:scale-95 transition-transform ${
                  isActive
                    ? 'bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f293d]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00d09c]' : ''}`} />
                <span className="hidden xs:inline sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Badge */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#00d09c] font-medium px-2.5 py-1 rounded-full bg-[#00d09c]/10 border border-[#00d09c]/20 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Week 17 Live
        </div>
      </div>
    </nav>
  );
};
