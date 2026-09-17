'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Users, Clock, Ticket, Calendar, Building2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { formatWaitTime } from '@/lib/eta';

export interface CenterCardProps {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  status: string;
  currentQueue: number;
  estimatedWaitMins: number;
  availableSlotsCount: number;
  openingTime?: string;
  closingTime?: string;
}

export const CenterCard: React.FC<CenterCardProps> = ({
  id,
  name,
  address,
  distanceKm,
  status,
  currentQueue,
  estimatedWaitMins,
  availableSlotsCount,
  openingTime = '08:30 AM',
  closingTime = '04:30 PM',
}) => {
  const { t } = useLanguage();

  const isClosed = status === 'CLOSED';
  const isBusy = status === 'BUSY';

  // Realistic thumbnail mock gradient / icon representation
  const getThumbnailTheme = () => {
    if (name.includes('Kolar')) return 'from-emerald-700 to-teal-800';
    if (name.includes('Ram Nagar')) return 'from-amber-700 to-yellow-800';
    return 'from-emerald-800 to-green-900';
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-soft hover:shadow-card transition-all">
      {/* Top Header Row with Thumbnail, Name, Location & Status */}
      <div className="flex items-start gap-3 mb-3">
        {/* Mandi Yard Thumbnail */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getThumbnailTheme()} flex items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden`}
        >
          <Building2 className="w-6 h-6 opacity-90" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Center Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
              {name}
            </h3>
            {/* Status Badge with clear text labels */}
            {status === 'HIGH_DEMAND' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-900 border border-rose-300 shrink-0 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                <span>● {t.highDemand || 'HIGH DEMAND'}</span>
              </span>
            ) : isBusy ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300 shrink-0 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>● {t.busy || 'BUSY'}</span>
              </span>
            ) : isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200 shrink-0 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>● {t.closed || 'CLOSED'}</span>
              </span>
            ) : availableSlotsCount === 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200 shrink-0 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>● {t.full || 'FULL'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>● {t.open || 'OPEN'}</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="truncate max-w-[170px]">{address}</span>
            <span className="font-semibold text-slate-700 shrink-0">
              • {distanceKm} km
            </span>
          </p>
        </div>
      </div>

      {/* 3 Equal Metric Columns with Vertical Dividers & Prominent Numbers */}
      <div className="grid grid-cols-3 gap-1 py-2.5 px-2 bg-slate-50/70 rounded-2xl border border-slate-100 mb-2.5 text-center">
        {/* Column 1: Farmers in queue */}
        <div className="px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium">
            <Users className="w-3 h-3 text-emerald-700" />
            <span>{t.inQueue || 'In queue'}</span>
          </div>
          <div className="text-sm font-black text-slate-900 mt-0.5 tracking-tight">
            {currentQueue} {t.farmers || 'farmers'}
          </div>
        </div>

        {/* Column 2: Wait time */}
        <div className="border-x border-slate-200/80 px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium">
            <Clock className="w-3 h-3 text-emerald-700" />
            <span>{t.estimatedWait || 'Wait time'}</span>
          </div>
          <div className="text-sm font-black text-slate-900 mt-0.5 tracking-tight">
            ~{formatWaitTime(estimatedWaitMins)}
          </div>
        </div>

        {/* Column 3: Slots left */}
        <div className="px-1">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium">
            <Ticket className="w-3 h-3 text-emerald-700" />
            <span>{t.slotsLeft || 'Slots left'}</span>
          </div>
          <div className="text-sm font-black text-emerald-800 mt-0.5 tracking-tight">
            {availableSlotsCount}
          </div>
        </div>
      </div>

      {/* High Demand / Congestion Warnings */}
      {status === 'HIGH_DEMAND' && (
        <div className="p-2 bg-rose-50 rounded-xl border border-rose-200/90 mb-2.5 text-[11px] text-rose-950 font-medium">
          <span>🔥 High Demand Alert: Heavy congestion (~{formatWaitTime(estimatedWaitMins)} wait, {currentQueue} farmers). Consider nearby centers to save time.</span>
        </div>
      )}

      {isBusy && (
        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/80 mb-2.5 text-[11px] text-amber-900 font-medium">
          <span>⚠️ High Demand: Operational with longer wait (~{formatWaitTime(estimatedWaitMins)} wait, {currentQueue} farmers in queue).</span>
        </div>
      )}

      {/* Slot Availability Warnings */}
      {availableSlotsCount > 0 && availableSlotsCount < 10 && (
        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/80 mb-2.5 text-[11px] text-amber-900 font-medium">
          <span>⚠️ Limited slots available ({availableSlotsCount} slots remaining today).</span>
        </div>
      )}

      {availableSlotsCount === 0 && !isClosed && (
        <div className="p-2 bg-red-50 rounded-xl border border-red-200/80 mb-2.5 text-[11px] text-red-900 font-medium">
          <span>🔴 Fully booked. All slots for today have been reserved.</span>
        </div>
      )}

      {/* Subtle Operating Hours */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-3 px-1">
        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
        <span>
          Operating Hours: {openingTime} – {closingTime}
        </span>
      </div>

      {/* Action Buttons: Equal Height */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/farmer/centers/${id}`}
          className="flex items-center justify-center py-2.5 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors text-center shadow-2xs"
        >
          {t.viewDetails || 'View Details'}
        </Link>

        <Link
          href={isClosed || availableSlotsCount === 0 ? '#' : `/farmer/booking/${id}`}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white rounded-xl transition-all text-center shadow-xs ${
            isClosed || availableSlotsCount === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'
              : 'bg-[#065F46] hover:bg-emerald-900 active:scale-98'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isClosed ? (t.closed || 'Closed') : availableSlotsCount === 0 ? (t.full || 'Center Full') : (t.bookSlot || 'Book Slot')}</span>
        </Link>
      </div>
    </div>
  );
};
