'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  User,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { formatWaitTime } from '@/lib/eta';

export interface BookingHeroCardProps {
  bookingId: string;
  centerName: string;
  address: string;
  distanceKm: number;
  date: string;
  time: string;
  tokenNumber: string;
  estimatedWaitMins: number;
  queuePosition: number;
  peopleAhead: number;
  status?: string;
}

export const BookingHeroCard: React.FC<BookingHeroCardProps> = ({
  bookingId,
  centerName,
  address,
  distanceKm,
  date,
  time,
  tokenNumber,
  estimatedWaitMins,
  queuePosition,
  peopleAhead = 5,
  status = 'Confirmed',
}) => {
  const { t } = useLanguage();

  const totalIcons = 11;
  const filledCount = Math.max(1, Math.min(peopleAhead, totalIcons));

  // Clean formatted status
  const displayStatus = status === 'WAITING' || status === 'BOOKED' || !status ? 'Confirmed' : status;

  return (
    <div className="bg-[#065F46] text-white rounded-3xl p-5 shadow-card relative overflow-hidden select-none">
      {/* Top Tag & Status Pill */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-emerald-100/90 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-emerald-300" />
          <span>{t.yourNextProcurement || 'Your Next Procurement'}</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold text-emerald-100">
          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
          <span>{displayStatus === 'Confirmed' ? (t.confirmed || 'Confirmed') : displayStatus}</span>
        </div>
      </div>

      {/* Center Details */}
      <h2 className="text-lg font-black text-white tracking-tight leading-snug">
        {centerName}
      </h2>
      <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
        <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
        <span className="truncate max-w-[220px]">{address}</span>
        <span>• {distanceKm} km</span>
      </p>

      {/* Date & Time */}
      <div className="flex items-center gap-3 text-xs text-emerald-100/90 mt-2 mb-3.5 font-medium">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-300" />
          <span>{date}</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-300" />
          <span>{time}</span>
        </span>
      </div>

      {/* Token & Wait Row */}
      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-emerald-700/60">
        <div>
          <div className="text-[10px] tracking-wider uppercase font-bold text-emerald-300">
            {t.yourToken || 'YOUR TOKEN'}
          </div>
          <div className="text-3xl font-black text-white tracking-wide mt-0.5">
            {tokenNumber}
          </div>
        </div>

        <div>
          <div className="text-[10px] tracking-wider uppercase font-bold text-emerald-300">
            {t.estimatedWait || 'ESTIMATED WAIT'}
          </div>
          <div className="text-xl font-black text-amber-300 mt-0.5">
            ~{formatWaitTime(estimatedWaitMins)}
          </div>
          <div className="text-[11px] text-emerald-200 font-medium">
            {t.queuePosition || 'Queue Position'}: #{queuePosition}
          </div>
        </div>
      </div>

      {/* Visual Queue Progress with Person Icons */}
      <div className="py-3">
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
            {t.queueProgress || 'QUEUE PROGRESS'}
          </span>
          <span className="text-emerald-100 font-semibold">
            {peopleAhead} {t.peopleAhead || 'people ahead'}
          </span>
        </div>

        <div className="flex items-center gap-1 py-1">
          {Array.from({ length: totalIcons }).map((_, idx) => {
            const isFilled = idx < filledCount;
            return (
              <div
                key={idx}
                className={`flex-1 flex justify-center transition-colors ${
                  isFilled ? 'text-emerald-300' : 'text-emerald-950/60'
                }`}
              >
                <User
                  className="w-4 h-4"
                  fill={isFilled ? 'currentColor' : 'none'}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link
          href={`/farmer/queue/${bookingId}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-emerald-50 active:scale-98 text-[#065F46] font-extrabold text-xs rounded-2xl shadow-xs transition-all text-center"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#065F46]" />
          <span>{t.trackMyQueue || 'Track My Queue'}</span>
        </Link>

        <Link
          href={`/farmer/booking/confirmation/${bookingId}`}
          className="flex items-center justify-center gap-1 py-2.5 px-3 bg-[#044030] hover:bg-[#033024] active:scale-98 text-white font-bold text-xs rounded-2xl border border-emerald-600/40 transition-all text-center"
        >
          <span>{t.viewBooking || 'View Booking'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
