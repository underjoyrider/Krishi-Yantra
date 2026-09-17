'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Ticket, Bell, User } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export const FarmerBottomNav: React.FC<{ activeBookingId?: string }> = ({
  activeBookingId = 'B-104',
}) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [currentBookingId, setCurrentBookingId] = useState(activeBookingId);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('krishiyantra_active_booking') || localStorage.getItem('kisanqueue_active_booking');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id || parsed?.tokenNumber) {
          setCurrentBookingId(parsed.tokenNumber || parsed.id);
        }
      }
    } catch {}
  }, []);

  const navItems = [
    {
      label: t.navHome || 'Home',
      href: '/farmer/dashboard',
      icon: Home,
      isActive: pathname === '/farmer/dashboard',
    },
    {
      label: t.navCenters || 'Centers',
      href: '/farmer/centers',
      icon: MapPin,
      isActive: pathname.startsWith('/farmer/centers') || pathname.startsWith('/farmer/booking/'),
    },
    {
      label: t.navMyBooking || 'My Booking',
      href: currentBookingId ? `/farmer/booking/confirmation/${currentBookingId}` : '/farmer/dashboard',
      icon: Ticket,
      isActive: pathname.startsWith('/farmer/booking/confirmation') || pathname.startsWith('/farmer/queue'),
    },
    {
      label: t.navNotifications || 'Alerts',
      href: '/farmer/notifications',
      icon: Bell,
      isActive: pathname === '/farmer/notifications',
      hasBadge: true,
    },
    {
      label: t.navProfile || 'Profile',
      href: '/farmer/profile',
      icon: User,
      isActive: pathname === '/farmer/profile' || pathname.startsWith('/farmer/support'),
    },
  ];

  return (
    <nav
      aria-label="Farmer Navigation"
      className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[390px] sm:max-w-[390px] z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:rounded-b-[40px] sm:border-x sm:border-slate-200/80"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                item.isActive
                  ? 'text-[#065F46] font-bold'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 mb-1 transition-transform ${
                    item.isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.hasBadge && !item.isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
