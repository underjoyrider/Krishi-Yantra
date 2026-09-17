'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { QueueTracker } from '@/components/farmer/QueueTracker';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { getClientSocket } from '@/lib/socket-client';
import { useLanguage } from '@/lib/language-context';

export default function LiveQueueTrackingPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchQueueData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/queue/${params.bookingId}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Queue fetch failed:', e);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchQueueData();

    // 1. Socket.IO Real-time subscription
    let socket: any = null;
    try {
      socket = getClientSocket();
      socket.on('queue:updated', () => {
        fetchQueueData();
      });
      socket.on('booking:statusChanged', (payload: any) => {
        if (payload.bookingId === params.bookingId) {
          fetchQueueData();
        }
      });
    } catch (e) {
      console.log('Socket fallback to polling');
    }

    // 2. 3-Second Resilient Polling Fallback
    const interval = setInterval(() => {
      fetchQueueData();
    }, 3000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('queue:updated');
        socket.off('booking:statusChanged');
      }
    };
  }, [params.bookingId]);

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <LoadingSkeleton count={3} height="h-36" />
      </div>
    );
  }

  const booking = data?.booking || {
    tokenNumber: 'B-104',
    queuePosition: 4,
    estimatedWait: 10,
    status: 'WAITING',
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Live Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push('/farmer/dashboard')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            title={t.backToDashboardTitle}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
              {t.liveQueueTrackerLabel}
            </span>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {data?.centerName || 'Shivapur Procurement Center'}
            </h2>
          </div>
        </div>

        <button
          onClick={fetchQueueData}
          title="Refresh Queue Status"
          className="p-2.5 text-emerald-900 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200/90 shadow-2xs transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-700' : ''}`} />
        </button>
      </div>

      {/* Main Queue Tracker Component */}
      <QueueTracker
        tokenNumber={booking.tokenNumber}
        queuePosition={booking.queuePosition}
        estimatedWait={booking.estimatedWait || 10}
        currentlyServingToken={data?.currentlyServingToken || 'B-101'}
        status={booking.status}
        movementHistory={data?.movementHistory || [12, 7, 5, booking.queuePosition]}
        centerName={data?.centerName || 'Shivapur Procurement Center'}
        slotTime={booking.slot?.startTime || '09:30 AM'}
      />
    </div>
  );
}
