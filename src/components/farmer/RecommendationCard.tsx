'use client';

import React from 'react';
import { formatWaitTime } from '@/lib/eta';
import Link from 'next/link';
import { Star, MapPin, Users, Clock, Ticket, Sparkles, ArrowRight } from 'lucide-react';

export interface CenterData {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  status: string;
  currentQueue: number;
  estimatedWaitMins: number;
  availableSlotsCount: number;
}

interface RecommendationCardProps {
  centers: CenterData[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ centers = [] }) => {
  if (!centers || centers.length === 0) return null;

  // Simple, transparent scoring algorithm:
  // 1. OPEN status (+100 points), BUSY (+40), FULL/CLOSED (0)
  // 2. Shorter distance: +max(0, 10 - distanceKm) * 6
  // 3. Lower waiting time: +max(0, 60 - waitMins) * 0.8
  // 4. Available slots: +availableSlots * 0.5
  const scored = centers.map((c) => {
    let score = 0;
    if (c.status === 'OPEN') score += 100;
    else if (c.status === 'BUSY') score += 40;

    score += Math.max(0, 10 - (c.distanceKm || 5)) * 6;
    score += Math.max(0, 60 - (c.estimatedWaitMins || 20)) * 0.8;
    score += Math.min(100, c.availableSlotsCount || 0) * 0.5;

    return { center: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.center;

  if (!best) return null;

  const isClosed = best.status === 'CLOSED';
  const isFull = best.availableSlotsCount === 0;

  return (
    <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-50/90 rounded-3xl p-4 border border-emerald-300 shadow-soft relative overflow-hidden select-none">
      {/* Top Badge Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#065F46] text-white text-[10px] font-black tracking-wider uppercase shadow-2xs">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span>RECOMMENDED FOR YOU</span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>OPEN</span>
        </span>
      </div>

      {/* Center Title & Distance */}
      <h3 className="text-base font-black text-slate-900 leading-tight">
        {best.name}
      </h3>
      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span className="truncate">{best.address}</span>
        <span className="font-bold text-slate-800 shrink-0">• {best.distanceKm} km away</span>
      </p>

      {/* 3 Metric Columns: In queue, Wait time, Slots left */}
      <div className="grid grid-cols-3 gap-1 py-2.5 px-2 bg-white/95 rounded-2xl border border-emerald-200/80 my-2.5 text-center shadow-2xs">
        <div className="px-1">
          <div className="text-[10px] text-slate-400 font-medium">In queue</div>
          <div className="text-xs font-black text-slate-900 mt-0.5">
            {best.currentQueue} farmers
          </div>
        </div>
        <div className="border-x border-slate-200 px-1">
          <div className="text-[10px] text-slate-400 font-medium">Wait time</div>
          <div className="text-xs font-black text-[#065F46] mt-0.5">
            ~{formatWaitTime(best.estimatedWaitMins)}
          </div>
        </div>
        <div className="px-1">
          <div className="text-[10px] text-slate-400 font-medium">Slots left</div>
          <div className="text-xs font-black text-slate-900 mt-0.5">
            {best.availableSlotsCount}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <Link
          href={`/farmer/centers/${best.id}`}
          className="flex items-center justify-center py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs text-center"
        >
          View Details
        </Link>

        <Link
          href={isClosed || isFull ? '#' : `/farmer/booking/${best.id}`}
          className={`flex items-center justify-center gap-1 py-2 px-3 text-xs font-bold text-white rounded-xl transition-all shadow-xs text-center ${
            isClosed || isFull
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-[#065F46] hover:bg-emerald-900 active:scale-98'
          }`}
        >
          <span>Book Slot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
