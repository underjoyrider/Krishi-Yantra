'use client';

import React, { useState, useEffect } from 'react';
import {
  Headphones,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  User,
  Send,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { StaffTopBar } from '@/components/staff/StaffTopBar';

export default function StaffSupportDeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/support/tickets?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
        if (selectedTicket) {
          const updated = data.tickets.find((t: any) => t.id === selectedTicket.id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const handleStatusUpdate = async (status: string) => {
    if (!selectedTicket) return;
    try {
      await fetch(`/api/support/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      setSending(true);
      await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderType: 'SUPPORT',
          senderName: 'Shivapur Mandi Desk',
          message: replyText.trim(),
        }),
      });
      setReplyText('');
      fetchTickets();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <StaffTopBar currentStatus="OPEN" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Mandi Assistance Desk
            </span>
            <h1 className="text-xl font-black text-gray-900">
              Farmer Support Inquiries & Tickets
            </h1>
          </div>
          <button
            onClick={fetchTickets}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Tickets' },
            { id: 'SUBMITTED', label: 'Submitted' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'RESOLVED', label: 'Resolved' },
            { id: 'CLOSED', label: 'Closed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                filter === f.id
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 2-Column Split: Ticket List + Conversation Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tickets */}
          <div className="lg:col-span-5 space-y-2.5">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
                No tickets matching this status.
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-black text-sm text-gray-900">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-900'
                            : t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-gray-900">{t.user?.name}</div>
                    <div className="text-[11px] text-gray-500 font-semibold">{t.category}</div>
                    <p className="text-xs text-gray-600 truncate mt-1">{t.description}</p>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Ticket Details & Thread */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 font-mono">
                      {selectedTicket.ticketNumber} • {selectedTicket.category}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold">
                      Farmer: {selectedTicket.user?.name} (+91 {selectedTicket.user?.phone})
                    </p>
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <button
                      onClick={() => handleStatusUpdate('IN_PROGRESS')}
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('RESOLVED')}
                      className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg hover:bg-emerald-200"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('CLOSED')}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Conversation messages */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
                  {selectedTicket.messages?.map((m: any) => {
                    const isSupport = m.senderType === 'SUPPORT';
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl ${
                          isSupport
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 ml-6'
                            : 'bg-gray-50 border border-gray-200 text-gray-800 mr-6'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span>{m.senderName || (isSupport ? 'Mandi Desk' : 'Farmer')}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="leading-relaxed">{m.message}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Staff Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official reply to farmer (dispatches in-app notification)..."
                    className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-emerald-700 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="px-4 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-400 text-xs">
                Select a ticket from the left to inspect conversation and reply.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
