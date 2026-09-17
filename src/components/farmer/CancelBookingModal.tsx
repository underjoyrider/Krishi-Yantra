'use client';

import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  error?: string | null;
  tokenNumber?: string;
  centerName?: string;
  slotDate?: string;
  slotTime?: string;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error,
  tokenNumber = 'B-104',
  centerName = 'Shivapur Procurement Center',
  slotDate = 'September 5, 2026',
  slotTime = '10:00 AM – 11:00 AM',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 space-y-4 animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
      >
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto ring-8 ring-red-50">
          <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
        </div>

        {/* Modal Title & Subtitle */}
        <div className="text-center space-y-1">
          <h3 id="cancel-modal-title" className="text-lg font-black text-slate-900">
            Cancel this booking?
          </h3>
          <p className="text-xs font-medium text-slate-500">
            Your procurement slot and queue position will be released.
          </p>
        </div>

        {/* Booking Summary Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Token Number
            </span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              {tokenNumber}
            </span>
          </div>
          <div className="text-xs font-bold text-slate-800 truncate">
            {centerName}
          </div>
          <div className="text-[11px] text-slate-500">
            {slotDate} • {slotTime}
          </div>
        </div>

        {/* Caution Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 leading-relaxed font-medium">
          ⚠️ Another farmer from the waiting list will be allocated this slot. This action cannot be reversed.
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Modal Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
          >
            Keep Booking
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3 px-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Yes, Cancel Booking</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
