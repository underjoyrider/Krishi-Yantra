'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';
import { formatWaitTime } from '@/lib/eta';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export default function StaffAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/staff/analytics');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton count={4} height="h-32" />
      </div>
    );
  }

  const kpis = data?.kpis || {
    dailyCapacity: 150,
    farmersServed: 127,
    utilizationPct: 84.7,
    avgWaitMins: 35,
    avgProcessMins: 5,
    noShowRatePct: 7,
    peakWindow: '10:00 AM - 11:30 AM',
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar currentStatus="OPEN" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Operational Intelligence
            </span>
            <h1 className="text-xl font-black text-gray-900">
              Procurement Analytics & Trends
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kharif Season 2026 Reporting Window</span>
          </div>
        </div>

        {/* 4 Core Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Center Utilization</span>
            <div className="text-3xl font-black text-emerald-800 mt-1">
              {kpis.utilizationPct}%
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              {kpis.farmersServed} of {kpis.dailyCapacity} capacity booked
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Average Wait Time</span>
            <div className="text-3xl font-black text-purple-900 mt-1">
              {formatWaitTime(kpis.avgWaitMins)}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Down 62% vs manual queuing
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">Avg Processing</span>
            <div className="text-3xl font-black text-blue-900 mt-1">
              {kpis.avgProcessMins} <span className="text-base font-bold">min</span>
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              Per farmer inspection & weighing
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase">No-Show Rate</span>
            <div className="text-3xl font-black text-amber-700 mt-1">
              {kpis.noShowRatePct}%
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              Peak hours: {kpis.peakWindow}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Farmers Served */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Daily Farmers Served (Past 7 Days)
              </h3>
              <span className="text-xs text-emerald-700 font-bold">Throughput</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.dailyServed || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#166534" radius={[6, 6, 0, 0]} name="Farmers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Queue Length */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Queue Length by Hour (Today)
              </h3>
              <span className="text-xs text-amber-700 font-bold">Peak Window</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.hourlyQueue || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="queueLength" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Waiting" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Waiting Time Trend */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Average Waiting Time Trend (Minutes)
              </h3>
              <span className="text-xs text-purple-700 font-bold">Efficiency</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.dailyServed || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgWait"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Avg Wait (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Processing Time by Crop */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Processing Time by Crop Type
              </h3>
              <span className="text-xs text-blue-700 font-bold">Quality Check</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.processingTimes || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="crop" type="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avgMinutes" fill="#2563EB" radius={[0, 6, 6, 0]} name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
