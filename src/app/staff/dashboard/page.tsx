'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  PauseCircle,
  PlayCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';
import { formatWaitTime } from '@/lib/eta';
import { SimulateButton } from '@/components/staff/SimulateButton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export default function StaffDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff/dashboard?centerCode=SHIV');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!data?.center?.id) return;
    try {
      await fetch('/api/staff/center/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centerId: data.center.id, status: newStatus }),
      });
      loadDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton count={4} height="h-28" />
      </div>
    );
  }

  const center = data?.center || {
    name: 'Shivapur Procurement Center',
    status: 'OPEN',
    activeCounters: 3,
    avgProcessMins: 5,
  };

  const metrics = data?.metrics || {
    capacity: 150,
    booked: 127,
    inQueue: 23,
    completed: 64,
    avgWaitMins: 35,
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar
        currentStatus={center.status}
        onStatusChange={handleStatusChange}
        centerName={center.name}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Simulation Trigger Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-gray-900">Operational Overview</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live Mandi statistics for Rabi & Kharif procurement intake
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Hackathon demo simulator button */}
            <SimulateButton onSimulated={loadDashboard} />

            <Link
              href="/staff/queue"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Manage Live Queue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 5 Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
              <span>Today's Capacity</span>
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-gray-900">{metrics.capacity}</div>
            <div className="text-[11px] text-gray-400 mt-1">Total farmer slots</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
              <span>Booked</span>
              <Users className="w-4 h-4 text-blue-700" />
            </div>
            <div className="text-2xl font-black text-blue-900">{metrics.booked}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              {Math.round((metrics.booked / metrics.capacity) * 100)}% allocation
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
              <span>In Queue</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900">{metrics.inQueue}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Currently on yard</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-900">{metrics.completed}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Receipts cleared</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
              <span>Average Wait</span>
              <TrendingUp className="w-4 h-4 text-purple-700" />
            </div>
            <div className="text-2xl font-black text-purple-900">
              {formatWaitTime(metrics.avgWaitMins)}
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">Yard throughput</div>
          </div>
        </div>

        {/* Prominent Live Status Control Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Gate & Yard Control
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="text-xl font-black text-gray-900">CENTER STATUS</h3>
                <StatusBadge status={center.status} size="lg" />
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleStatusChange('OPEN')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300 transition-all flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4 text-emerald-700" />
                <span>Resume Admissions</span>
              </button>

              <button
                onClick={() => handleStatusChange('PAUSED')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-all flex items-center gap-1.5"
              >
                <PauseCircle className="w-4 h-4 text-amber-700" />
                <span>Pause Admissions</span>
              </button>

              <button
                onClick={() => handleStatusChange('CLOSED')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-100 text-red-900 hover:bg-red-200 border border-red-300 transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-red-700" />
                <span>Close Center</span>
              </button>
            </div>
          </div>

          {/* Center Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-sm">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-500 font-semibold">Current Queue:</span>
              <div className="text-xl font-black text-gray-900 mt-0.5">
                {metrics.inQueue} farmers waiting
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-500 font-semibold">Active Counters:</span>
              <div className="text-xl font-black text-gray-900 mt-0.5">
                {center.activeCounters} Inspection Counters
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-500 font-semibold">Avg Processing Time:</span>
              <div className="text-xl font-black text-gray-900 mt-0.5">
                {center.avgProcessMins} min / farmer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
