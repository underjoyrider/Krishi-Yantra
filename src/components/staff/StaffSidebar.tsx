'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Bell,
  Headphones,
  Settings,
  Tractor,
  LogOut,
} from 'lucide-react';
import { clearStoredUser, getStoredUser } from '@/lib/auth';

export const StaffSidebar: React.FC = () => {
  const pathname = usePathname();
  const [portalLabel, setPortalLabel] = useState('Staff Portal');

  useEffect(() => {
    setPortalLabel('Staff Portal');
  }, []);

  const menu = [
    { label: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Live Queue', href: '/staff/queue', icon: Users },
    { label: 'Daily Schedule', href: '/staff/schedule', icon: Calendar },
    { label: 'Analytics', href: '/staff/analytics', icon: BarChart3 },
    { label: 'Broadcasts', href: '/staff/notifications', icon: Bell },
    { label: 'Support Desk', href: '/staff/support', icon: Headphones },
    { label: 'Settings', href: '/staff/settings', icon: Settings },
  ];

  const handleLogout = () => {
    clearStoredUser();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-[#143d22] text-white flex flex-col justify-between p-4 min-h-screen border-r border-emerald-950">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-emerald-800/60">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">KrishiYantra</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              {portalLabel} • APMC
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200/80 hover:bg-emerald-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Area */}
      <div className="border-t border-emerald-800/60 pt-4">
        <div className="flex items-center justify-between px-3 py-2 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
          <div>
            <div className="text-xs font-bold text-white">Shivapur APMC</div>
            <div className="text-[11px] text-emerald-300">Operator #3</div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
