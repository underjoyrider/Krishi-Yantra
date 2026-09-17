'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  user: any;
  onTicketCreated?: () => void;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Booking problem',
  user,
  onTicketCreated,
}) => {
  const { t } = useLanguage();
  const [category, setCategory] = useState(defaultCategory);
  const [tokenInput, setTokenInput] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a brief description of what went wrong.');
      return;
    }
    if (!user?.id) {
      setError('We could not verify your account. Please close this and try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          category,
          description: tokenInput ? `[Token: ${tokenInput}] ${description}` : description,
          senderName: user?.name || 'Ravi Kumar',
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setSubmittedTicket(data.ticket);
        if (onTicketCreated) onTicketCreated();
      } else {
        setError(data.error || 'Unable to submit your request right now. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setSubmittedTicket(null);
    setDescription('');
    setTokenInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedTicket ? (
          <div className="py-4 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Ticket Created Successfully
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {submittedTicket.ticketNumber}
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                "Your request has been received. You can check its status from Support."
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Issue Type:</span>
                <span className="font-bold text-gray-900">{submittedTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Status:</span>
                <span className="font-bold text-amber-700">Submitted</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Support Desk
              </span>
              <h3 className="text-lg font-black text-gray-900">
                Submit Support Request
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Send your question or report a booking problem directly to our mandi staff.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Readonly farmer details */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold">Farmer Name</span>
                <div className="font-bold text-gray-800">{user?.name || 'Ravi Kumar'}</div>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold">Mobile</span>
                <div className="font-bold text-gray-800">+91 {user?.phone || '9876543210'}</div>
              </div>
            </div>

            {/* Issue Type Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Issue Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-700"
              >
                <option value="Booking problem">Booking problem</option>
                <option value="Slot unavailable">Slot unavailable</option>
                <option value="Queue problem">Queue problem</option>
                <option value="Notification problem">Notification problem</option>
                <option value="Center information">Center information</option>
                <option value="Account problem">Account problem</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Optional Token */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Booking / Token Number (Optional)
              </label>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. B-104"
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-700"
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what went wrong..."
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Submit Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
