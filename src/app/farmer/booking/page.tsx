'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CalendarDays, ChevronRight, Loader2, MapPin, Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';
import { useLanguage } from '@/lib/language-context';

export default function FarmerBookingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [centers, setCenters] = useState<any[]>([]);
  const [centerId, setCenterId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [slotId, setSlotId] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('09:00 AM');
  const [slotEndTime, setSlotEndTime] = useState('10:00 AM');
  const [cropType, setCropType] = useState('Paddy / Rice');
  const [quantityKg, setQuantityKg] = useState('100');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedCenter = centers.find((center) => center.id === centerId);
  const availableSlots = selectedCenter?.slots?.filter((slot: any) => slot.date === appointmentDate && slot.bookedCount < slot.capacity && slot.status !== 'DISABLED') || [];
  const standardSlots = [
    ['08:00 AM', '09:00 AM'],
    ['09:00 AM', '10:00 AM'],
    ['10:00 AM', '11:00 AM'],
    ['11:00 AM', '12:00 PM'],
    ['01:00 PM', '02:00 PM'],
    ['02:00 PM', '03:00 PM'],
    ['03:00 PM', '04:00 PM'],
    ['04:00 PM', '05:00 PM'],
  ];
  const selectableSlots = availableSlots.length > 0
    ? availableSlots
    : standardSlots.map(([startTime, endTime]) => ({ id: `${appointmentDate}-${startTime}`, startTime, endTime, capacity: 0, bookedCount: 0 }));
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch('/api/centers')
      .then((response) => response.json())
      .then((data) => {
        const availableCenters = data.centers || data.data?.centers || [];
        setCenters(availableCenters);
        if (availableCenters[0]) setCenterId(availableCenters[0].id);
        setAppointmentDate(new Date().toISOString().slice(0, 10));
      })
      .catch(() => setError('Unable to load procurement centers.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const firstSlot = selectableSlots[0];
    if (firstSlot && !selectableSlots.some((slot: any) => slot.id === slotId)) {
      setSlotId(firstSlot.id);
      setSlotStartTime(firstSlot.startTime);
      setSlotEndTime(firstSlot.endTime);
    }
  }, [appointmentDate, selectedCenter, selectableSlots, slotId]);

  const submitBooking = async (event: FormEvent) => {
    event.preventDefault();
    const farmer = getStoredUser();
    if (!farmer?.id) {
      setError('Please log in again before booking a slot.');
      return;
    }
    if (!centerId || !appointmentDate || !slotStartTime || !slotEndTime || !cropType.trim() || Number(quantityKg) <= 0) {
      setError('Please complete crop, quantity, center, date, and time slot.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: farmer.id,
          centerId,
          slotId: availableSlots.some((slot: any) => slot.id === slotId) ? slotId : undefined,
          bookingDate: appointmentDate,
          slotStartTime,
          slotEndTime,
          cropType: cropType.trim(),
          quantityKg: Number(quantityKg),
        }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned an unexpected response. Please try again.');
      }

      const booking = data.booking || data.data?.booking;
      if (!response.ok || !data.success || !booking) {
        setError(data.message || data.error || 'Unable to create the booking. Please choose another slot.');
        return;
      }
      router.push(`/farmer/booking/confirmation/${booking.id || booking.tokenNumber}?autoRedirect=1`);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the booking service.');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-emerald-700" /></div>;

  return (
    <main className="mx-auto max-w-2xl space-y-6 pb-20">
      <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t.farmerPortalLabel}</p><h1 className="mt-2 text-3xl font-black text-slate-900">{t.bookSlotTitle}</h1><p className="mt-2 text-sm text-slate-500">{t.bookSlotDesc}</p></div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      <form onSubmit={submitBooking} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">{t.cropTypeLabel}<div className="relative mt-2"><Wheat className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input required value={cropType} onChange={(event) => setCropType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none focus:border-emerald-600 focus:bg-white" placeholder="Paddy, wheat, maize..." /></div></label>
          <label className="text-sm font-bold text-slate-700">{t.cropQuantityLabel}<input required type="number" min="1" step="1" value={quantityKg} onChange={(event) => setQuantityKg(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-emerald-600 focus:bg-white" placeholder="Quantity in kilograms" /></label>
        </div>
        <label className="block text-sm font-bold text-slate-700">{t.procurementCentreLabel}<div className="relative mt-2"><MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><select required value={centerId} onChange={(event) => setCenterId(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none focus:border-emerald-600 focus:bg-white"><option value="">{t.selectCenterOption}</option>{centers.map((center) => <option key={center.id} value={center.id}>{center.name}</option>)}</select></div></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">{t.appointmentDateLabel}<div className="relative mt-2"><CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input required type="date" min={today} value={appointmentDate} onChange={(event) => { setAppointmentDate(event.target.value); setSlotId(''); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none focus:border-emerald-600 focus:bg-white" /></div></label>
          <label className="text-sm font-bold text-slate-700">{t.availableTimeSlotLabel}<select required value={slotId} onChange={(event) => { const selected = selectableSlots.find((slot: any) => slot.id === event.target.value); setSlotId(event.target.value); setSlotStartTime(selected?.startTime || '09:00 AM'); setSlotEndTime(selected?.endTime || '10:00 AM'); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-emerald-600 focus:bg-white"><option value="">{t.selectSlotOption}</option>{selectableSlots.map((slot: any) => <option key={slot.id} value={slot.id}>{slot.startTime} - {slot.endTime}{slot.capacity ? ` (${slot.capacity - slot.bookedCount} left)` : ''}</option>)}</select></label>
        </div>
        <button type="button" onClick={() => router.push('/farmer/dashboard')} disabled={submitting} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">{t.skipBookingBtn}</button>
        <button type="submit" disabled={submitting || !centerId || !appointmentDate || !slotStartTime} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#124734] px-4 py-3.5 text-sm font-black text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? t.confirmingBookingBtn : t.continueToConfirmationBtn}<ChevronRight className="h-4 w-4" /></button>
      </form>
    </main>
  );
}
