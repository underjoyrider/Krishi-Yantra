'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sprout, Bell, ChevronDown } from 'lucide-react';
import { getStoredUser } from '@/lib/auth';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface FarmerHeaderProps {
  locationMode?: boolean;
  locationText?: string;
  hasUnreadAlerts?: boolean;
  userInitial?: string;
}

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({
  locationMode = false,
  locationText = 'Mandya, Karnataka',
  hasUnreadAlerts = true,
  userInitial = 'R',
}) => {
  const [initial, setInitial] = useState(userInitial);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.name) {
      setInitial(user.name.trim().charAt(0).toUpperCase());
    }
  }, [userInitial]);

  return (
    <header className="flex items-center justify-between py-2 px-1 select-none border-b border-emerald-900/10 pb-3 mb-2 bg-white/60 backdrop-blur-md rounded-2xl sticky top-0 z-30 shadow-2xs">
      {/* Brand on Left */}
      <Link href="/farmer/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-2xl bg-[#124734] text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-800 transition-colors shrink-0">
          <Sprout className="w-5 h-5 text-emerald-200" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
              KrishiYantra
            </h1>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              App
            </span>
          </div>
          {!locationMode && (
            <p className="text-[10px] font-bold text-emerald-800 tracking-tight mt-0.5">
              Farmers Mobile Portal
            </p>
          )}
        </div>
      </Link>

      {/* Middle Location Picker (if locationMode enabled) */}
      {locationMode && (
        <button
          type="button"
          onClick={() => alert('Location selector: Mandya, Karnataka')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900 transition-colors shadow-2xs"
        >
          <span className="text-emerald-700">📍</span>
          <span>{locationText}</span>
          <ChevronDown className="w-3 h-3 text-emerald-600" />
        </button>
      )}

      {/* Right Controls: Language, Notification Bell and Avatar */}
      <div className="flex items-center gap-1.5">
        <LanguageSelector />

        <Link
          href="/farmer/notifications"
          className="relative p-2 rounded-xl text-slate-700 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200"
          title="Alerts & Notifications"
        >
          <Bell className="w-5 h-5 text-emerald-900" />
          {hasUnreadAlerts && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </Link>

        <Link
          href="/farmer/profile"
          className="w-9 h-9 rounded-full bg-[#124734] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-emerald-300 transition-all shrink-0"
          title="Farmer Profile"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
};
