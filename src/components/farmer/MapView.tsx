'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Compass, Layers, Users, Clock, Ticket, Calendar, X, ArrowRight } from 'lucide-react';
import { formatWaitTime } from '@/lib/eta';

interface CenterMapInfo {
  id: string;
  name: string;
  address?: string;
  distanceKm: number;
  status: string;
  currentQueue?: number;
  estimatedWaitMins?: number;
  availableSlotsCount?: number;
}

interface MapViewProps {
  centers?: CenterMapInfo[];
  onSelectCenter?: (id: string) => void;
  fullHeight?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  centers = [],
  onSelectCenter,
  fullHeight = false,
}) => {
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>('SHIV');
  const [showPopup, setShowPopup] = useState<boolean>(true);

  // Markers mapped to realistic geography and statuses
  const defaultMarkers = [
    {
      id: 'SHIV',
      name: 'Shivapur Procurement Center',
      shortName: 'Shivapur',
      distanceKm: 3.2,
      status: 'OPEN',
      currentQueue: 12,
      estimatedWaitMins: 18,
      availableSlotsCount: 63,
      x: '38%',
      y: '30%',
    },
    {
      id: 'RAM',
      name: 'Ram Nagar Procurement Center',
      shortName: 'Ram Nagar',
      distanceKm: 5.8,
      status: 'BUSY',
      currentQueue: 28,
      estimatedWaitMins: 42,
      availableSlotsCount: 35,
      x: '72%',
      y: '42%',
    },
    {
      id: 'KOL',
      name: 'Kolar Procurement Center',
      shortName: 'Kolar',
      distanceKm: 8.1,
      status: 'OPEN',
      currentQueue: 7,
      estimatedWaitMins: 12,
      availableSlotsCount: 82,
      x: '52%',
      y: '72%',
    },
  ];

  // Merge live centers data if passed
  const markers = defaultMarkers.map((m) => {
    const live = centers.find((c) => c.id === m.id || c.name.toLowerCase().includes(m.shortName.toLowerCase()));
    if (live) {
      return {
        ...m,
        id: live.id,
        name: live.name,
        distanceKm: live.distanceKm || m.distanceKm,
        status: live.status || m.status,
        currentQueue: live.currentQueue !== undefined ? live.currentQueue : m.currentQueue,
        estimatedWaitMins: live.estimatedWaitMins !== undefined ? live.estimatedWaitMins : m.estimatedWaitMins,
        availableSlotsCount: live.availableSlotsCount !== undefined ? live.availableSlotsCount : m.availableSlotsCount,
      };
    }
    return m;
  });

  const selectedCenter = markers.find((m) => m.id === selectedCenterId) || markers[0];

  // Marker colors by status:
  // 🟢 Green: Open and available
  // 🟡 Yellow / Orange: Busy or longer wait
  // 🔴 Red: Full or unavailable
  // 🔵 Blue: User location
  const getMarkerStyling = (status: string, availableSlots = 1) => {
    if (status === 'CLOSED' || availableSlots === 0) {
      return {
        pinColor: 'bg-red-600 ring-red-200 text-white',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
        dotColor: 'bg-red-500',
        statusLabel: availableSlots === 0 ? '● FULL' : '● CLOSED',
      };
    }
    if (status === 'BUSY') {
      return {
        pinColor: 'bg-amber-500 ring-amber-200 text-white',
        badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
        dotColor: 'bg-amber-500',
        statusLabel: '● BUSY',
      };
    }
    return {
      pinColor: 'bg-emerald-600 ring-emerald-200 text-white',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dotColor: 'bg-emerald-500',
      statusLabel: '● OPEN',
    };
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-soft bg-[#EEF2E6] ${
        fullHeight ? 'h-[520px]' : 'h-80'
      }`}
    >
      {/* Stylized SVG Map Canvas Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8D8" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="#EEF2E6" />
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6" />

        {/* River */}
        <path
          d="M -10 210 C 60 190, 120 230, 200 200 C 280 170, 320 220, 420 195"
          fill="none"
          stroke="#C8DCF0"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M -10 210 C 60 190, 120 230, 200 200 C 280 170, 320 220, 420 195"
          fill="none"
          stroke="#B5D1ED"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Green Reserve */}
        <path
          d="M 220 30 C 260 20, 330 40, 350 90 C 370 140, 300 160, 260 140 C 220 120, 200 60, 220 30 Z"
          fill="#D8E8CD"
          opacity="0.7"
        />

        {/* Roads */}
        <path
          d="M 50 0 C 70 80, 110 140, 160 180 C 210 220, 250 260, 280 310"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="6"
        />
        <path
          d="M 0 110 C 90 120, 180 100, 270 130 C 330 150, 380 130, 410 120"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="6"
        />

        {/* Main Highway */}
        <path d="M 20 290 Q 150 160, 390 40" fill="none" stroke="#F8FAFC" strokeWidth="9" />
        <path
          d="M 20 290 Q 150 160, 390 40"
          fill="none"
          stroke="#FDE047"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>

      {/* Blue User Location Pulse Marker (🔵 Blue = User) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{ left: '26%', top: '56%' }}
      >
        <span className="relative flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-md items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        </span>
        <span className="absolute top-5 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
          You are here
        </span>
      </div>

      {/* Mandi Pins */}
      {markers.map((marker) => {
        const isSelected = selectedCenter?.id === marker.id;
        const styling = getMarkerStyling(marker.status, marker.availableSlotsCount);

        return (
          <div
            key={marker.id}
            onClick={() => {
              setSelectedCenterId(marker.id);
              setShowPopup(true);
              onSelectCenter?.(marker.id);
            }}
            className="absolute transform -translate-x-1/2 -translate-y-full z-20 cursor-pointer group"
            style={{ left: marker.x, top: marker.y }}
          >
            {/* Tooltip badge */}
            <div
              className={`mb-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border whitespace-nowrap flex items-center gap-1 transition-all ${
                styling.badgeColor
              } ${isSelected ? 'scale-105 ring-2 ring-emerald-700' : 'group-hover:scale-105'}`}
            >
              <span>{marker.shortName}</span>
              <span className="font-normal opacity-80">({marker.distanceKm} km)</span>
            </div>

            {/* Pin head */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ring-4 shadow-md transition-all ${
                  styling.pinColor
                } ${isSelected ? 'scale-120 ring-offset-2 ring-emerald-400' : 'group-hover:scale-110'}`}
              >
                <MapPin className="w-4 h-4 fill-white text-white" />
              </div>
              <div className="w-1 h-2 bg-slate-800/60 rounded-full mt-[-1px]" />
            </div>
          </div>
        );
      })}

      {/* Floating Compass & Layers */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          aria-label="Compass heading"
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-soft border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-800"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Toggle map layers"
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-soft border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-800"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Center Info Popup Card (Triggered by marker click) */}
      {selectedCenter && showPopup && (
        <div className="absolute bottom-2 left-2 right-2 z-30 bg-white/98 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-xl animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {selectedCenter.name}
                </h4>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                    getMarkerStyling(selectedCenter.status, selectedCenter.availableSlotsCount).badgeColor
                  }`}
                >
                  {getMarkerStyling(selectedCenter.status, selectedCenter.availableSlotsCount).statusLabel}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                <span>📍 {selectedCenter.distanceKm} km away</span>
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              title="Close Popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick 3 Metrics */}
          <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-slate-50 rounded-xl border border-slate-100 my-2 text-center text-[10px]">
            <div>
              <span className="text-slate-400 font-medium">In queue</span>
              <div className="text-xs font-black text-slate-900 mt-0.5">{selectedCenter.currentQueue} farmers</div>
            </div>
            <div className="border-x border-slate-200 px-0.5">
              <span className="text-slate-400 font-medium">Wait time</span>
              <div className="text-xs font-black text-slate-900 mt-0.5">~{formatWaitTime(selectedCenter.estimatedWaitMins)}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Slots left</span>
              <div className="text-xs font-black text-emerald-800 mt-0.5">{selectedCenter.availableSlotsCount}</div>
            </div>
          </div>

          {/* Popup Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <Link
              href={`/farmer/centers/${selectedCenter.id}`}
              className="py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-bold text-[11px] text-center transition-colors shadow-2xs"
            >
              View Details
            </Link>

            <Link
              href={
                selectedCenter.status === 'CLOSED' || selectedCenter.availableSlotsCount === 0
                  ? '#'
                  : `/farmer/booking/${selectedCenter.id}`
              }
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] text-white text-center transition-all shadow-xs flex items-center justify-center gap-1 ${
                selectedCenter.status === 'CLOSED' || selectedCenter.availableSlotsCount === 0
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-[#065F46] hover:bg-emerald-900 active:scale-98'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>
                {selectedCenter.status === 'CLOSED'
                  ? 'Closed'
                  : selectedCenter.availableSlotsCount === 0
                  ? 'Full'
                  : 'Book Slot'}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Pill: View Full Map (when popup is closed) */}
      {!showPopup && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 hover:text-emerald-900 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Show Center Card</span>
          </button>
        </div>
      )}
    </div>
  );
};
