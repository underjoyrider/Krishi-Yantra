'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/lib/language-context';
import { FarmerBottomNav } from '@/components/farmer/FarmerBottomNav';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFarmerLogin = pathname === '/farmer/login';

  return (
    <LanguageProvider>
      {/* Outer desktop canvas: clean neutral light background */}
      <div className="min-h-screen bg-[#EEF2EB] flex justify-center items-start sm:py-8 sm:px-4">
        {/* Mobile viewport container: strictly 390px wide, min-h 844px on desktop */}
        <div className="w-full sm:w-[390px] sm:max-w-[390px] min-h-screen sm:min-h-[844px] bg-[#F9FBF7] sm:rounded-[40px] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.14)] sm:border sm:border-slate-200/80 flex flex-col relative overflow-x-hidden">
          
          {/* Native Mobile Status Bar (9:41, Cellular, WiFi, Battery) */}
          <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-slate-800 text-[12px] font-semibold select-none shrink-0">
            <span className="font-bold">9:41</span>
            <div className="flex items-center gap-1.5 text-slate-800">
              {/* Cellular Signal bars */}
              <svg className="w-4 h-3 fill-current" viewBox="0 0 17 12">
                <rect x="0" y="9" width="2.5" height="3" rx="0.5" />
                <rect x="4" y="6" width="2.5" height="6" rx="0.5" />
                <rect x="8" y="3" width="2.5" height="9" rx="0.5" />
                <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
              </svg>
              {/* WiFi icon */}
              <svg className="w-3.5 h-3 fill-current" viewBox="0 0 16 12">
                <path d="M8 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4.24-2.83a6 6 0 0 1 8.48 0 .75.75 0 0 1-1.06 1.06 4.5 4.5 0 0 0-6.36 0 .75.75 0 0 1-1.06-1.06zm-2.83-2.83a10 10 0 0 1 14.14 0 .75.75 0 0 1-1.06 1.06 8.5 8.5 0 0 0-12.02 0 .75.75 0 0 1-1.06-1.06z" />
              </svg>
              {/* Battery icon */}
              <div className="w-5 h-2.5 rounded-xs border border-slate-800 p-0.5 flex items-center">
                <div className="h-full w-3/4 bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 px-4 pt-1 pb-24">{children}</main>

          <Link
            href="/krishi_mandi_mitra.html"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Krishi Mandi Mitra chatbot"
            className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#124734] text-white shadow-lg ring-4 ring-white hover:bg-emerald-900 sm:bottom-24 sm:right-[calc(50%_-_175px)]"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>

          {/* Mobile Bottom Navigation */}
          {!isFarmerLogin && <FarmerBottomNav />}
        </div>
      </div>
    </LanguageProvider>
  );
}
