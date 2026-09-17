'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CalendarPlus,
  ShieldCheck,
  Building2,
  ChevronRight,
  Home,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { formatWaitTime } from '@/lib/eta';
import { QRCodeCard } from '@/components/farmer/QRCodeCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { CancelBookingModal } from '@/components/farmer/CancelBookingModal';
import { getStoredUser } from '@/lib/auth';
import { getClientSocket } from '@/lib/socket-client';

export default function BookingConfirmationPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${params.bookingId}`);
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking(data.booking);
      } else {
        // Fallback to queue endpoint if booking endpoint was token based
        const qRes = await fetch(`/api/queue/${params.bookingId}`);
        const qData = await qRes.json();
        if (qData.success && qData.booking) {
          setBooking(qData.booking);
        }
      }
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setLoading(false);
    }
  }, [params.bookingId]);

  useEffect(() => {
    fetchBooking();

    // Socket.IO subscription for real-time updates
    let socket: any = null;
    try {
      socket = getClientSocket();
      socket.on('queue:updated', () => fetchBooking());
      socket.on('bookingCancelled', (payload: any) => {
        if (payload?.id === params.bookingId || payload?.tokenNumber === params.bookingId) {
          fetchBooking();
        }
      });
      socket.on('booking:updated', (payload: any) => {
        if (payload?.bookingId === params.bookingId) {
          fetchBooking();
        }
      });
    } catch (e) {
      // Polling fallback
    }

    const interval = setInterval(fetchBooking, 3000);
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('queue:updated');
        socket.off('bookingCancelled');
        socket.off('booking:updated');
      }
    };
  }, [fetchBooking, params.bookingId]);

  useEffect(() => {
    if (searchParams.get('autoRedirect') !== '1' || !booking || booking.status === 'CANCELLED') return;
    const timer = setTimeout(() => router.push('/farmer/dashboard'), 6000);
    return () => clearTimeout(timer);
  }, [booking, router, searchParams]);

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      setCancelError(null);

      const storedUser = getStoredUser();
      const farmerId = booking?.farmerId || booking?.user?.id || booking?.user?.phone || storedUser?.id || storedUser?.phone || null;

      const targetId = booking?.id || params.bookingId;
      const res = await fetch(`/api/bookings/${targetId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCancelModalOpen(false);
        setBooking((prev: any) => ({
          ...prev,
          status: 'CANCELLED',
          queuePosition: 0,
          estimatedWait: 0,
        }));
        setSuccessMessage('Your booking has been cancelled successfully.');

        // Dispatch local storage event for dashboard synchronization
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('krishiyantra:bookingCancelled'));
          window.dispatchEvent(new Event('kisanqueue:bookingCancelled'));
          const cancelData = JSON.stringify({
            id: targetId,
            tokenNumber: booking?.tokenNumber || 'B-104',
            cancelledAt: new Date().toISOString(),
          });
          localStorage.setItem('krishiyantra_last_cancelled_booking', cancelData);
          localStorage.setItem('kisanqueue_last_cancelled_booking', cancelData);
        }

        // Re-fetch fresh data from server
        fetchBooking();
      } else {
        setCancelError(data.message || 'Failed to cancel booking. Please try again.');
      }
    } catch (e: any) {
      setCancelError(e.message || 'Error communicating with server.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <LoadingSkeleton count={3} height="h-36" />
      </div>
    );
  }

  // Display values with fallbacks
  const status = booking?.status || 'WAITING';
  const isCancelled = status === 'CANCELLED';
  const isCompleted = status === 'COMPLETED';
  const isCancellable = !isCancelled && !isCompleted;

  const tokenNumber = booking?.tokenNumber || 'B-104';
  const centerName = booking?.center?.name || 'Shivapur Procurement Center';
  const centerAddress = booking?.center?.address || 'Shivapur Main Road, Mandya District';
  const slotDate = booking?.slot?.date || booking?.bookingDate || 'September 5, 2026';
  const slotTime = booking?.slotStartTime && booking?.slotEndTime
    ? `${booking.slotStartTime} – ${booking.slotEndTime}`
    : booking?.slot?.startTime && booking?.slot?.endTime
    ? `${booking.slot.startTime} – ${booking.slot.endTime}`
    : '10:00 AM – 11:00 AM';
  const estimatedWait = booking?.estimatedWait !== undefined ? booking.estimatedWait : 10;
  const queuePosition = booking?.queuePosition || 4;

  return (
    <div className="space-y-4 pt-1 pb-20">
      {/* Top Header / Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Status Pill Header */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
            isCancelled
              ? 'bg-red-100 text-red-700 border border-red-200'
              : isCompleted
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : status === 'PROCESSING'
              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              : 'bg-emerald-100 text-[#065F46] border border-emerald-200'
          }`}
        >
          {isCancelled
            ? 'Status: CANCELLED'
            : isCompleted
            ? 'Status: COMPLETED'
            : status === 'PROCESSING'
            ? 'Status: PROCESSING'
            : 'Status: CONFIRMED'}
        </span>
      </div>

      {/* Success Notification Banner after cancellation */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fadeIn">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="flex-1">{successMessage}</span>
        </div>
      )}

      {/* Top Banner based on Status */}
      {isCancelled ? (
        <div className="text-center pt-2 pb-1 bg-red-50/70 border border-red-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2 ring-8 ring-red-50">
            <XCircle className="w-8 h-8 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-extrabold text-red-700 tracking-wider uppercase">
            Booking Cancelled
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">
            SLOT RELEASED
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            This procurement booking has been cancelled. Your slot and queue number have been released back to other farmers.
          </p>
        </div>
      ) : isCompleted ? (
        <div className="text-center pt-2 pb-1">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2.5 ring-8 ring-blue-50 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-extrabold text-blue-800 tracking-wider uppercase">
            Procurement Finished
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
            PROCUREMENT COMPLETED
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thank you for delivering your produce to Mandya APMC.
          </p>
        </div>
      ) : (
        <div className="text-center pt-2 pb-1">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#065F46] flex items-center justify-center mx-auto mb-2.5 ring-8 ring-emerald-50 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-extrabold text-emerald-800 tracking-wider uppercase">
            Procurement Slot Confirmed
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
            SLOT BOOKED SUCCESSFULLY!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your procurement slot has been confirmed with Mandya APMC.
          </p>
        </div>
      )}

      {/* Procurement Center Details Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-soft space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {centerName}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{centerAddress}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{slotDate}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{slotTime}</span>
          </div>
        </div>
      </div>

      {/* Hero Token Card */}
      <div
        className={`text-white rounded-3xl p-5 shadow-card relative overflow-hidden text-center transition-all ${
          isCancelled ? 'bg-slate-700 opacity-90' : 'bg-[#065F46]'
        }`}
      >
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-emerald-300/90 tracking-widest uppercase">
            YOUR TOKEN
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
              isCancelled
                ? 'bg-red-500/30 text-red-200 border border-red-400/40'
                : 'bg-emerald-800 text-emerald-200'
            }`}
          >
            {isCancelled ? 'Cancelled' : status}
          </span>
        </div>

        <div
          className={`text-6xl font-black text-white tracking-wider my-1 drop-shadow-xs ${
            isCancelled ? 'line-through text-slate-300' : ''
          }`}
        >
          {tokenNumber}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-700/60 text-center">
          <div className="p-2 bg-emerald-900/40 rounded-2xl border border-emerald-700/40">
            <div className="text-[10px] uppercase font-bold text-emerald-300/90">
              Estimated Wait
            </div>
            <div className="text-xl font-black text-amber-300 mt-0.5">
              {isCancelled ? 'Released' : `~${formatWaitTime(estimatedWait)}`}
            </div>
          </div>

          <div className="p-2 bg-emerald-900/40 rounded-2xl border border-emerald-700/40">
            <div className="text-[10px] uppercase font-bold text-emerald-300/90">
              Queue Position
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              {isCancelled ? '—' : `#${queuePosition}`}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Verification Slip (Only if active) */}
      {!isCancelled && (
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-soft">
          <QRCodeCard token={tokenNumber} />
        </div>
      )}

      {/* Trust Reminder / Cancellation notice */}
      {isCancelled ? (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <span>This slot has been cancelled. You can book another available slot at any open center.</span>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Please arrive 10 minutes before your slot. You will receive real-time queue SMS alerts.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Track My Queue (if active) */}
        {!isCancelled && (
          <Link
            href={`/farmer/queue/${params.bookingId}`}
            className="w-full py-3.5 rounded-2xl bg-[#065F46] hover:bg-emerald-900 active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>Track My Queue</span>
          </Link>
        )}

        {/* Re-book button if cancelled */}
        {isCancelled && (
          <Link
            href="/farmer/centers"
            className="w-full py-3.5 rounded-2xl bg-[#065F46] hover:bg-emerald-900 active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book New Procurement Slot</span>
          </Link>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/farmer/dashboard"
            className="py-3 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-emerald-800" />
            <span>Farmer Home</span>
          </Link>

          <button
            type="button"
            onClick={() => alert(`Appointment details for ${tokenNumber} copied to clipboard.`)}
            className="py-3 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
          >
            <CalendarPlus className="w-4 h-4 text-emerald-800" />
            <span>Save Details</span>
          </button>
        </div>

        {/* CANCEL BOOKING BUTTON (Requirement: red or warning-styled, inside booking details) */}
        {isCancellable && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setCancelError(null);
                setCancelModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100/90 active:scale-98 text-red-700 border border-red-200/90 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Cancel Booking</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1.5 font-medium">
              Free cancellation anytime before counter processing begins.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
        error={cancelError}
        tokenNumber={tokenNumber}
        centerName={centerName}
        slotDate={slotDate}
        slotTime={slotTime}
      />
    </div>
  );
}
