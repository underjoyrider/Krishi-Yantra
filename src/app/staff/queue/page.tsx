'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Bell,
  RefreshCw,
  Phone,
  Play,
  Check,
  ChevronRight,
} from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { SimulateButton } from '@/components/staff/SimulateButton';
import { getClientSocket } from '@/lib/socket-client';
import { formatWaitTime } from '@/lib/eta';

export default function StaffQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [center, setCenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/staff/queue?centerCode=SHIV');
      const data = await res.json();
      if (data.success) {
        setQueue(data.queue || []);
        setCenter(data.center);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    // Socket.IO event listener
    let socket: any = null;
    try {
      socket = getClientSocket();
      socket.on('queue:updated', () => {
        fetchQueue();
      });
    } catch (e) {
      console.log('Using polling');
    }

    const interval = setInterval(fetchQueue, 3000);

    return () => {
      clearInterval(interval);
      if (socket) socket.off('queue:updated');
    };
  }, []);

  // Update status handler
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      setActionInProgress(bookingId);
      await fetch(`/api/staff/queue/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar
        currentStatus={center?.status || 'OPEN'}
        centerName={center?.name || 'Shivapur Procurement Center'}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Real-Time Verification Gate
            </span>
            <h1 className="text-xl font-black text-gray-900">Live Intake Queue</h1>
          </div>

          <div className="flex items-center gap-3">
            <SimulateButton onSimulated={fetchQueue} />
            <button
              onClick={fetchQueue}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
              title="Refresh queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Queue Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Active Queue ({queue.length} Farmers)</span>
            </h3>
            <span className="text-xs text-gray-400 font-semibold">
              Ordered by appointment slot & sequence
            </span>
          </div>

          {loading ? (
            <div className="p-6">
              <LoadingSkeleton count={5} height="h-16" />
            </div>
          ) : queue.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-semibold">
              No farmers currently in queue. All active bookings completed!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Slot</th>
                    <th className="py-3 px-4 text-center">Position</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Wait</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {queue.map((item) => {
                    const isProcessing = item.status === 'PROCESSING';
                    const isRavi = item.tokenNumber === 'B-104';

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isProcessing
                            ? 'bg-purple-50/60 font-semibold'
                            : isRavi
                            ? 'bg-emerald-50/50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Token */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 tracking-wide font-mono text-base">
                              {item.tokenNumber}
                            </span>
                            {isRavi && (
                              <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                                DEMO
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Farmer */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{item.user?.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{item.cropType || 'Paddy'}</span>
                            <span>•</span>
                            <span>{item.quantityKg || 1200} kg</span>
                          </div>
                        </td>

                        {/* Slot */}
                        <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                          {item.slot?.startTime || '10:00 AM'}
                        </td>

                        {/* Queue Position */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold ${
                              isProcessing
                                ? 'bg-purple-600 text-white ring-2 ring-purple-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {isProcessing ? '⚡' : `#${item.queuePosition}`}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={item.status} size="sm" />
                        </td>

                        {/* Wait */}
                        <td className="py-3.5 px-4 text-xs font-bold text-gray-600">
                          {isProcessing ? '—' : formatWaitTime(item.estimatedWait)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isProcessing ? (
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'COMPLETED')}
                                disabled={actionInProgress === item.id}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Complete</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'PROCESSING')}
                                  disabled={actionInProgress === item.id}
                                  className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                >
                                  <Play className="w-3 h-3" />
                                  <span>Call Next</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'NOTIFY')}
                                  disabled={actionInProgress === item.id}
                                  className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-colors"
                                  title="Send proactive SMS alert"
                                >
                                  <Bell className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
