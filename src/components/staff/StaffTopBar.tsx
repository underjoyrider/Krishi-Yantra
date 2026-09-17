'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, ExternalLink, Play, Pause, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export interface StaffTopBarProps {
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
  centerName?: string;
  centerCode?: string;
}

export const StaffTopBar: React.FC<StaffTopBarProps> = ({
  currentStatus = 'OPEN',
  onStatusChange,
  centerName = 'Shivapur Procurement Center',
  centerCode = 'SHIV',
}) => {
  const [updating, setUpdating] = useState(false);

  const togglePause = async () => {
    try {
      setUpdating(true);
      const nextStatus = currentStatus === 'PAUSED' ? 'OPEN' : 'PAUSED';
      const res = await fetch('/api/staff/center/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centerId: 'cld1shiv0000center', // will fallback or find by code on server
          status: nextStatus,
        }),
      });
      if (onStatusChange) onStatusChange(nextStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-30">
      {/* Center Details */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">{centerName}</h2>
            <StatusBadge status={currentStatus} size="sm" />
          </div>
          <p className="text-xs text-gray-500">
            Mandya District • APMC Market Yard #{centerCode}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Toggle Pause / Resume */}
        <button
          onClick={togglePause}
          disabled={updating}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm ${
            currentStatus === 'PAUSED'
              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
          }`}
        >
          {currentStatus === 'PAUSED' ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Resume Admissions</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Admissions</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
