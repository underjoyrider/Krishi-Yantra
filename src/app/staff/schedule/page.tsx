'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Ban,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export default function StaffSchedulePage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(15);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/centers');
      const data = await res.json();
      if (data.success && data.centers) {
        const shiv = data.centers.find((c: any) => c.code === 'SHIV');
        setCenter(shiv);
        if (shiv) {
          const sRes = await fetch(`/api/centers/${shiv.id}/slots?date=${selectedDate}`);
          const sData = await sRes.json();
          if (sData.success) {
            setSlots(sData.slots);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const handleSaveCapacity = async (slotId: string) => {
    try {
      await fetch(`/api/staff/slots/${slotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: editCapacity }),
      });
      setEditingSlotId(null);
      fetchSlots();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleDisable = async (slotId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'DISABLED' ? 'AVAILABLE' : 'DISABLED';
      await fetch(`/api/staff/slots/${slotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchSlots();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar
        currentStatus={center?.status || 'OPEN'}
        centerName={center?.name || 'Shivapur Procurement Center'}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Procurement Windows
            </span>
            <h1 className="text-xl font-black text-gray-900">
              Daily Procurement Schedule
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
            >
              <option value="2026-09-05">Sep 5, 2026 (Today)</option>
              <option value="2026-09-06">Sep 6, 2026</option>
              <option value="2026-09-07">Sep 7, 2026</option>
              <option value="2026-09-08">Sep 8, 2026</option>
            </select>
          </div>
        </div>

        {/* Operational Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Opening</span>
            <div className="text-lg font-black text-gray-900 mt-1">08:00 AM</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Closing</span>
            <div className="text-lg font-black text-gray-900 mt-1">05:00 PM</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Slot Duration</span>
            <div className="text-lg font-black text-gray-900 mt-1">1 hour</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Capacity / Slot</span>
            <div className="text-lg font-black text-emerald-800 mt-1">15 Farmers</div>
          </div>
        </div>

        {/* Slots Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">
              Procurement Slots List ({slots.length} windows)
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">
              Live capacity limits active
            </span>
          </div>

          {loading ? (
            <div className="p-6">
              <LoadingSkeleton count={5} height="h-14" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Time Window</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Booked</th>
                    <th className="py-3 px-4">Remaining</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {slots.map((slot) => {
                    const remaining = Math.max(0, slot.capacity - slot.bookedCount);
                    const isEditing = editingSlotId === slot.id;
                    const displayStatus =
                      slot.status === 'DISABLED'
                        ? 'DISABLED'
                        : remaining === 0 || slot.bookedCount >= slot.capacity
                        ? 'FULL'
                        : slot.status || 'AVAILABLE';

                    return (
                      <tr key={slot.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {slot.startTime} - {slot.endTime}
                        </td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editCapacity}
                                onChange={(e) => setEditCapacity(parseInt(e.target.value))}
                                className="w-16 p-1 border rounded text-xs font-bold"
                              />
                              <button
                                onClick={() => handleSaveCapacity(slot.id)}
                                className="p-1 bg-emerald-700 text-white rounded"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-semibold text-gray-800">
                              {slot.capacity}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {slot.bookedCount}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`font-black ${
                              remaining === 0 ? 'text-red-600' : 'text-emerald-700'
                            }`}
                          >
                            {remaining}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <StatusBadge status={displayStatus} size="sm" />
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-xs">
                            <button
                              onClick={() => {
                                setEditingSlotId(slot.id);
                                setEditCapacity(slot.capacity);
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                              title="Edit Capacity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleDisable(slot.id, slot.status)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                slot.status === 'DISABLED'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                              title={slot.status === 'DISABLED' ? 'Enable Slot' : 'Disable Slot'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
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
