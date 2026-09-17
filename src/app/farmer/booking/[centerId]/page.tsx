'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Wheat,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { formatWaitTime } from '@/lib/eta';
import { ensureFarmerUser } from '@/lib/auth';

export default function BookingWizardPage({
  params,
}: {
  params: { centerId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [center, setCenter] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wizard selections
  const dates = [
    { date: '2026-09-05', label: 'Sep 5', day: 'Today (Sat)' },
    { date: '2026-09-06', label: 'Sep 6', day: 'Sun' },
    { date: '2026-09-07', label: 'Sep 7', day: 'Mon' },
    { date: '2026-09-08', label: 'Sep 8', day: 'Tue' },
  ];
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Farmer form details
  const [farmerUser, setFarmerUser] = useState<any>(null);
  const [cropType, setCropType] = useState('Paddy / Rice');
  const [quantityKg, setQuantityKg] = useState('1500');

  useEffect(() => {
    ensureFarmerUser()
      .then((user) => {
        setFarmerUser(user);
        if (user.farmerProfile?.cropType) setCropType(user.farmerProfile.cropType);
      })
      .catch((err) => console.warn('Farmer auth warning:', err));
  }, []);

  useEffect(() => {
    async function loadCenterAndSlots() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/centers/${params.centerId}?date=${selectedDate}`);
        const text = await res.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch {}

        if (res.ok && data.success && data.center) {
          setCenter(data.center);
          const loadedSlots = data.center.slots || [];
          setSlots(loadedSlots);

          // Preselect slot if specified by query param or auto-select first available slot
          const preSlotId = searchParams.get('slotId');
          if (preSlotId) {
            const match = loadedSlots.find((s: any) => s.id === preSlotId);
            if (match && match.bookedCount < match.capacity) {
              setSelectedSlot(match);
            } else if (loadedSlots.length > 0) {
              setSelectedSlot(loadedSlots[0]);
            }
          } else if (loadedSlots.length > 0) {
            // Keep selected slot if it matches current date, otherwise set to first available
            if (!selectedSlot || selectedSlot.date !== selectedDate) {
              const firstAvail = loadedSlots.find((s: any) => s.bookedCount < s.capacity) || loadedSlots[0];
              setSelectedSlot(firstAvail);
            }
          }
        } else {
          setError(data.message || data.error || 'Failed to load center details.');
        }
      } catch (err) {
        console.error(err);
        setError('Network error while loading center slots. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadCenterAndSlots();
  }, [params.centerId, selectedDate, searchParams]);

  // Handle slot booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      setError('Please select an available time slot.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Ensure farmer user is resolved
      let activeUser = farmerUser;
      if (!activeUser?.id) {
        try {
          activeUser = await ensureFarmerUser();
          setFarmerUser(activeUser);
        } catch (e) {
          // Continue with fallback
        }
      }

      const farmerIdToUse = activeUser?.id || 'cmu42a4gp0000i7b2lvznl1gx';

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: farmerIdToUse,
          centerId: center?.id || params.centerId,
          slotId: selectedSlot.id,
          bookingDate: selectedDate,
          slotStartTime: selectedSlot.startTime,
          slotEndTime: selectedSlot.endTime,
          cropType,
          quantityKg: parseInt(quantityKg) || 1000,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const booking = data.booking || data.data?.booking;
      if (res.ok && data.success && booking) {
        router.push(`/farmer/booking/confirmation/${booking.id || booking.tokenNumber}`);
      } else {
        setError(data.message || data.error || 'Failed to complete booking. Please try another slot.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete booking. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (step > 1) setStep((step - 1) as any);
            else router.back();
          }}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Slot Booking Wizard
          </span>
          <h2 className="text-xl font-black text-gray-900 leading-tight">
            {center?.name || 'Procurement Center'}
          </h2>
        </div>
      </div>

      {/* 3 Step Breadcrumb Indicator */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { num: 1, label: 'Date' },
          { num: 2, label: 'Slot' },
          { num: 3, label: 'Confirm' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2 rounded-xl text-center border transition-all ${
              step === s.num
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm font-black'
                : step > s.num
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                : 'bg-white text-gray-400 border-gray-200 font-medium'
            }`}
          >
            <div className="text-xs">
              Step {s.num}: {s.label}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: CHOOSE DATE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-gray-900">{t.chooseDate}</h3>
          </div>

          <p className="text-xs text-gray-500">
            Select your preferred arrival date for crop unloading and verification.
          </p>

          {/* Horizontally scrollable date cards */}
          <div className="grid grid-cols-2 gap-3">
            {dates.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDate === d.date
                    ? 'bg-emerald-50 border-emerald-700 ring-2 ring-emerald-600 text-emerald-950 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-emerald-200 text-gray-700'
                }`}
              >
                <div className="text-lg font-black text-gray-900">{d.label}</div>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {d.day}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all mt-4"
          >
            Continue to Time Slot
          </button>
        </div>
      )}

      {/* STEP 2: CHOOSE TIME SLOT */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" />
              <h3 className="text-base font-bold text-gray-900">{t.chooseTimeSlot}</h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {selectedDate}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Choose an available slot. FULL slots are automatically locked to avoid overcrowding.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {slots.map((slot) => {
              const remaining = Math.max(0, slot.capacity - slot.bookedCount);
              const isFull = remaining === 0 || slot.status === 'FULL';
              const isSelected = selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isFull
                      ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed text-gray-400'
                      : isSelected
                      ? 'bg-emerald-100 border-emerald-700 ring-2 ring-emerald-600 text-emerald-950 font-bold shadow-sm'
                      : 'bg-white border-gray-200 hover:border-emerald-300 text-gray-800'
                  }`}
                >
                  <span className="text-sm font-bold">{slot.startTime}</span>
                  <span className="text-xs">
                    {isFull ? (
                      <span className="font-extrabold text-red-600">FULL</span>
                    ) : (
                      <span className="font-semibold text-emerald-800">
                        {remaining} {t.slotsLeft}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!selectedSlot}
            onClick={() => setStep(3)}
            className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all mt-4"
          >
            Review & Confirm
          </button>
        </div>
      )}

      {/* STEP 3: CONFIRMATION SUMMARY */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-gray-900">{t.confirmation}</h3>
          </div>

          <div className="space-y-3 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs text-gray-500 font-semibold">Farmer</span>
              <span className="font-bold text-gray-900">{farmerUser?.name || 'Ravi Kumar'}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs text-gray-500 font-semibold">Center</span>
              <span className="font-bold text-gray-900 text-right">{center?.name}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs text-gray-500 font-semibold">Appointment</span>
              <span className="font-bold text-gray-900">
                {selectedDate} • {selectedSlot?.startTime}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs text-gray-500 font-semibold">Estimated Wait</span>
              <span className="font-bold text-emerald-800">
                ~{formatWaitTime(center?.estimatedWaitMins || 25)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold">Expected Position</span>
              <span className="font-black text-amber-700">
                #{Math.max(1, (center?.currentQueue || 0) + 1)} in queue
              </span>
            </div>
          </div>

          {/* Crop specifics input */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
              >
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
                <option value="Soybean">Soybean</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Quantity (Kg)</label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Booking Error</span>
              </div>
              <p>{error}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(2);
                  }}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Choose Another Slot
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="px-3 py-1.5 bg-white border border-red-300 text-red-800 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirmBooking}
            className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-extrabold text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>{t.confirmBooking}</span>
          </button>
        </div>
      )}
    </div>
  );
}
