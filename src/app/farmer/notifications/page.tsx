'use client';

import React, { useEffect, useState } from 'react';
import {
  Bell,
  CalendarCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

export default function FarmerNotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return <CalendarCheck className="w-5 h-5 text-emerald-700" />;
      case 'QUEUE':
        return <Users className="w-5 h-5 text-amber-600" />;
      case 'DELAY':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'COMPLETION':
        return <CheckCircle2 className="w-5 h-5 text-green-700" />;
      case 'CLOSURE':
        return <Building2 className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
          {t.updatesAndAlerts || 'Updates & SMS Alerts'}
        </span>
        <h2 className="text-xl font-black text-gray-900">{t.notificationsTitle || 'Notifications'}</h2>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-20" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={t.allCaughtUp || "You're All Caught Up!"}
          description={t.noNotifications || 'There are no new notifications.'}
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                n.read
                  ? 'bg-white border-gray-200'
                  : 'bg-emerald-50/60 border-emerald-300 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
