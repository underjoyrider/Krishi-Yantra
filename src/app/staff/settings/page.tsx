'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, ShieldCheck, Building2 } from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';

export default function StaffSettingsPage() {
  const [activeCounters, setActiveCounters] = useState(3);
  const [avgProcessMins, setAvgProcessMins] = useState(5);
  const [dailyCapacity, setDailyCapacity] = useState(150);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar currentStatus="OPEN" />

      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Configuration
          </span>
          <h1 className="text-xl font-black text-gray-900">Center Settings & Capacity</h1>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-800" />
            <span>Parameters updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Active Verification Counters
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={activeCounters}
                onChange={(e) => setActiveCounters(parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Used directly in rule-based ETA engine calculation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Avg Processing Time (Minutes)
              </label>
              <input
                type="number"
                min={2}
                max={30}
                value={avgProcessMins}
                onChange={(e) => setAvgProcessMins(parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Rolling historical average per farmer intake.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Daily Mandi Capacity (Farmers)
              </label>
              <input
                type="number"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(parseInt(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Notification Channel
              </label>
              <select
                defaultValue="mock"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900"
              >
                <option value="mock">In-App Simulation + WebSocket Broadcast (Default)</option>
                <option value="twilio">Twilio SMS Gateway (Production)</option>
                <option value="whatsapp">WhatsApp Business API</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
