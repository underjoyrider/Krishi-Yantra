'use client';

import React, { useState } from 'react';
import { X, Send, User, Headphones, CheckCircle2, Clock } from 'lucide-react';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onMessageSent?: () => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onMessageSent,
}) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSending(true);
      await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderType: 'FARMER',
          senderName: 'Ravi Kumar',
          message: replyText.trim(),
        }),
      });
      setReplyText('');
      if (onMessageSent) onMessageSent();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            🟡 In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            🟢 Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-gray-900 font-mono">
                {ticket.ticketNumber}
              </span>
              {getStatusBadge(ticket.status)}
            </div>
            <div className="text-xs text-gray-500 font-semibold mt-0.5">
              {ticket.category} • Submitted {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
          {ticket.messages?.map((msg: any) => {
            const isSupport = msg.senderType === 'SUPPORT';
            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl ${
                  isSupport
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 ml-4'
                    : 'bg-gray-50 border border-gray-200 text-gray-800 mr-4'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-1">
                    {isSupport ? (
                      <Headphones className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    )}
                    <span>{msg.senderName || (isSupport ? 'Mandi Help Desk' : 'You')}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.message}</p>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="pt-3 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply to support..."
            className="flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-emerald-700 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !replyText.trim()}
            className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
