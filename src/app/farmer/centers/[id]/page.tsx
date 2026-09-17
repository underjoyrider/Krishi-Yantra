'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  CalendarCheck,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useLanguage } from '@/lib/language-context';
import { formatWaitTime } from '@/lib/eta';

export default function CenterDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [center, setCenter] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/centers/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setCenter(data.center);
          setSlots(data.center.slots || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton count={4} height="h-32" />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Center not found</h3>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Center Overview
          </span>
          <h2 className="text-xl font-black text-gray-900 leading-tight">
            {center.name}
          </h2>
        </div>
      </div>

      {/* Hero Badge & Status Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{center.address}</span>
            </div>
            <div className="text-xs font-bold text-emerald-800 mt-1">
              Distance: {center.distanceKm} km from your registered village
            </div>
          </div>
          <StatusBadge status={center.status} size="md" />
        </div>

        {/* Visual Queue Indicator */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-emerald-950">
              {center.currentQueue} {t.farmersWaiting}
            </div>
            <div className="text-xs text-emerald-700 font-medium">
              Estimated wait: ~{formatWaitTime(center.estimatedWaitMins)} ({center.activeCounters} active counters)
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">
              Daily Capacity
            </div>
            <div className="text-lg font-black text-gray-900 mt-0.5">
              {center.capacity} Farmers
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">
              Available Slots Today
            </div>
            <div className="text-lg font-black text-emerald-800 mt-0.5">
              {center.availableSlotsCount} Left
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-1 flex items-center justify-between border-t border-gray-100">
          <span>Operating Hours:</span>
          <span className="font-bold text-gray-800">
            {center.openingTime} - {center.closingTime}
          </span>
        </div>
      </div>

      {/* Today's Schedule Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-gray-900">
            {t.todaysSchedule} (Today, Sep 5)
          </h3>
          <span className="text-xs text-emerald-800 font-bold">30 min slots</span>
        </div>

        <div className="space-y-2">
          {slots.map((slot) => {
            const remaining = Math.max(0, slot.capacity - slot.bookedCount);
            const isFull = remaining === 0 || slot.status === 'FULL';

            return (
              <div
                key={slot.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isFull
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="text-xs mt-0.5">
                    {isFull ? (
                      <span className="font-bold text-red-600">FULL</span>
                    ) : (
                      <span className="font-bold text-emerald-700">
                        {remaining} {t.slotsLeft}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isFull ? (
                    <span className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-gray-200 rounded-xl cursor-not-allowed">
                      FULL
                    </span>
                  ) : (
                    <Link
                      href={`/farmer/booking/${center.id}?slotId=${slot.id}`}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm active:scale-95 transition-all inline-block"
                    >
                      {t.bookSlot}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
