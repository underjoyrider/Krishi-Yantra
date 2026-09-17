'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Send, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';

export default function StaffNotificationsPage() {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch('/api/notifications');
        const json = await res.json();
        if (json.success) {
          setNotifications(json.notifications || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadNotifications();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setSentSuccess(true);
    setBroadcastMessage('');
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar currentStatus="OPEN" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Public Address & Alerts
          </span>
          <h1 className="text-xl font-black text-gray-900">
            Center Announcements & SMS Log
          </h1>
        </div>

        {/* Broadcast message composer */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-700" />
            <span>Broadcast SMS & App Notification to Waiting Yard</span>
          </h3>

          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Broadcast dispatched to all registered farmers in today's queue.</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3">
            <textarea
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. Counter #3 is now open for immediate Paddy moisture inspection..."
              className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-emerald-700 focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Yard Announcement</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recent Notifications Log */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" />
            <span>Recent System Dispatch Log</span>
          </h3>

          <div className="space-y-2">
            {notifications.slice(0, 10).map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900">{n.title}</div>
                  <div className="text-gray-600 mt-0.5">{n.message}</div>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold shrink-0 ml-4">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
