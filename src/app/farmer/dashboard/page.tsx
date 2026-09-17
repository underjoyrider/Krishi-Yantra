'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sprout,
  ChevronRight,
  Building2,
  Ticket,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { getStoredUser } from '@/lib/auth';
import { FarmerHeader } from '@/components/farmer/FarmerHeader';
import { BookingHeroCard } from '@/components/farmer/BookingHeroCard';
import { CenterCard } from '@/components/farmer/CenterCard';
import { RecommendationCard } from '@/components/farmer/RecommendationCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

type FilterType = 'all' | 'nearest' | 'wait' | 'slots' | 'open';

export default function FarmerDashboard() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState<any[]>([]);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [cancelledBooking, setCancelledBooking] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('nearest');
  const [farmerName, setFarmerName] = useState('Ravi');
  const [farmerInitial, setFarmerInitial] = useState('R');

  // Load dynamically stored user name on client mount
  useEffect(() => {
    const user = getStoredUser();
    if (user?.name) {
      const first = user.name.trim().split(' ')[0];
      setFarmerName(first);
      setFarmerInitial(user.name.trim().charAt(0).toUpperCase());
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load centers
      const cRes = await fetch('/api/centers');
      const cData = await cRes.json();
      if (cData.success && Array.isArray(cData.centers)) {
        setCenters(cData.centers);
      }

      // Load the signed-in farmer's latest active booking.
      const storedUser = getStoredUser();
      const bookingLookup = storedUser?.id
        ? `/api/bookings/farmer/${storedUser.id}`
        : '/api/bookings/B-104';
      const bRes = await fetch(bookingLookup);
      const bData = await bRes.json();
      const currentBooking = bData?.data?.active || bData?.active || bData?.booking || bData?.data?.booking;

      if (currentBooking) {
        if (currentBooking.status === 'CANCELLED') {
          setActiveBooking(null);
          setCancelledBooking(currentBooking);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('krishiyantra_active_booking');
          }
        } else if (['WAITING', 'PROCESSING', 'BOOKED'].includes(currentBooking.status)) {
          setCancelledBooking(null);
          const pos = currentBooking.queuePosition || 6;
          const waitMins = currentBooking.estimatedWait || 8;
          const ahead = currentBooking.farmersAhead !== undefined ? currentBooking.farmersAhead : Math.max(0, pos - 1);

          const bookingPayload = {
            id: currentBooking.id || 'B-104',
            centerName: currentBooking.center?.name || 'Shivapur Procurement Center',
            address: currentBooking.center?.address || 'Shivapur Main Road, Mandya District',
            distanceKm: 3.2,
            date: currentBooking.bookingDate || currentBooking.slot?.date || 'September 5, 2026',
            time: currentBooking.slotStartTime && currentBooking.slotEndTime
              ? `${currentBooking.slotStartTime} - ${currentBooking.slotEndTime}`
              : '10:30 AM',
            tokenNumber: currentBooking.tokenNumber || 'B-104',
            estimatedWaitMins: waitMins,
            queuePosition: pos,
            peopleAhead: ahead,
            status: currentBooking.status || 'Confirmed',
          };

          setActiveBooking(bookingPayload);

          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'krishiyantra_active_booking',
              JSON.stringify({
                id: currentBooking.id || 'B-104',
                tokenNumber: currentBooking.tokenNumber || 'B-104',
              })
            );
          }
        } else {
          setActiveBooking(null);
        }
      } else {
        // Fallback check from queue
        const qRes = await fetch('/api/staff/queue?centerCode=SHIV');
        const qData = await qRes.json();
        if (qData.success && Array.isArray(qData.queue)) {
          const ravi = qData.queue.find((b: any) => b.tokenNumber === 'B-104');
          if (ravi) {
            setActiveBooking({
              id: ravi.id || 'B-104',
              centerName: 'Shivapur Procurement Center',
              address: 'Shivapur Main Road, Mandya District',
              distanceKm: 3.2,
              date: 'September 5, 2026',
              time: '10:30 AM',
              tokenNumber: 'B-104',
              estimatedWaitMins: ravi.estimatedWait || 8,
              queuePosition: ravi.queuePosition || 6,
              peopleAhead: Math.max(0, (ravi.queuePosition || 6) - 1),
              status: 'Confirmed',
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Socket.IO real-time subscriptions
    let socket: any = null;
    try {
      const { getClientSocket } = require('@/lib/socket-client');
      socket = getClientSocket();
      socket.on('queue:updated', () => loadDashboardData());
      socket.on('bookingCancelled', () => loadDashboardData());
    } catch (e) {
      // Polling fallback
    }

    // Local event listener for same-tab updates
    const handleLocalCancel = () => loadDashboardData();
    window.addEventListener('krishiyantra:bookingCancelled', handleLocalCancel);
    window.addEventListener('kisanqueue:bookingCancelled', handleLocalCancel);

    // Periodic resilient polling
    const interval = setInterval(loadDashboardData, 3000);

    return () => {
      window.removeEventListener('krishiyantra:bookingCancelled', handleLocalCancel);
      window.removeEventListener('kisanqueue:bookingCancelled', handleLocalCancel);
      clearInterval(interval);
      if (socket) {
        socket.off('queue:updated');
        socket.off('bookingCancelled');
      }
    };
  }, []);

  // Filter and sort centers based on search query & active filter
  const filteredCenters = useMemo(() => {
    let list = centers.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (activeFilter) {
      case 'nearest':
        return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
      case 'wait':
        return [...list].sort((a, b) => a.estimatedWaitMins - b.estimatedWaitMins);
      case 'slots':
        return [...list].sort((a, b) => b.availableSlotsCount - a.availableSlotsCount);
      case 'open':
        return list.filter((c) => c.status === 'OPEN');
      default:
        return list;
    }
  }, [centers, searchQuery, activeFilter]);

  const filterChips: { id: FilterType; label: string }[] = [
    { id: 'nearest', label: t.filterNearest || 'Nearest' },
    { id: 'wait', label: t.filterLowestWait || 'Shortest Wait' },
    { id: 'slots', label: t.filterMostSlots || 'Most Slots' },
    { id: 'open', label: t.filterOpenNow || 'Open Now' },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Mobile Header */}
      <FarmerHeader
        locationMode={false}
        hasUnreadAlerts={true}
        userInitial={farmerInitial}
      />

      {/* 2. Farmer Greeting */}
      <div className="pt-0.5 pb-0.5 select-none">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 leading-tight">
          <span>{t.namaste || 'Namaste'}, {farmerName}</span>
          <span className="text-2xl animate-pulse">👋</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          {t.greetingSub || "Good morning! Here's your next booking."}
        </p>
      </div>

      {/* 3. Next Procurement Hero Card */}
      {activeBooking ? (
        <BookingHeroCard
          bookingId={activeBooking.id}
          centerName={activeBooking.centerName}
          address={activeBooking.address}
          distanceKm={activeBooking.distanceKm}
          date={activeBooking.date}
          time={activeBooking.time}
          tokenNumber={activeBooking.tokenNumber}
          estimatedWaitMins={activeBooking.estimatedWaitMins}
          queuePosition={activeBooking.queuePosition}
          peopleAhead={activeBooking.peopleAhead}
          status={activeBooking.status}
        />
      ) : (
        <div className="space-y-3">
          <EmptyState
            icon={Ticket}
            title={t.noActiveBookingTitle || 'No Active Booking'}
            description={t.noActiveBookingDesc || "You currently don't have any upcoming procurement bookings."}
            actionText={t.findProcurementCenters || 'Find Procurement Centers'}
            actionHref="/farmer/centers"
          />

          {cancelledBooking && (
            <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Recent Booking History
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Status: CANCELLED
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {cancelledBooking.center?.name || 'Shivapur Procurement Center'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Token: <strong className="text-slate-800">{cancelledBooking.tokenNumber || 'B-104'}</strong> • Slot released
                  </div>
                </div>
                <Link
                  href={`/farmer/booking/confirmation/${cancelledBooking.id || 'B-104'}`}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Information / Motivational Card: Better Markets. Brighter Futures. */}
      <Link
        href="/farmer/centers"
        className="bg-[#EBF7EE] border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs hover:bg-[#E4F4E8] transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Sprout className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-950 leading-tight">
              {t.quoteTitle || 'Better Markets. Brighter Futures.'}
            </h4>
            <p className="text-[11px] text-emerald-800/90 font-medium mt-0.5">
              {t.quoteSub || 'Support our farmers, strengthen our nation.'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0" />
      </Link>

      {/* 5. Recommended Procurement Center */}
      {!loading && centers.length > 0 && (
        <RecommendationCard centers={centers} />
      )}

      {/* 6. Nearby Procurement Centers Section */}
      <div className="pt-2 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {t.nearbyProcurementCenters || 'Nearby Procurement Centers'}
            </h3>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              {filteredCenters.length} {t.centersAvailableNearYou || 'centers available near you'}
            </p>
          </div>
          <Link
            href="/farmer/centers"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>{t.viewAll || 'View all'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Search Bar & Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder || 'Search procurement center...'}
              className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs rounded-2xl pl-10 pr-3.5 py-3 border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'nearest' ? 'open' : 'nearest')}
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs text-slate-700 hover:text-emerald-800 transition-colors"
            title="Filter Centers"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterChips.map((chip) => {
            const isSelected = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#065F46] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Centers List */}
        {loading ? (
          <LoadingSkeleton count={3} height="h-44" />
        ) : filteredCenters.length > 0 ? (
          <div className="space-y-3 pt-1">
            {filteredCenters.map((center) => (
              <CenterCard
                key={center.id}
                id={center.id}
                name={center.name}
                address={center.address}
                distanceKm={center.distanceKm}
                status={center.status}
                currentQueue={center.currentQueue}
                estimatedWaitMins={center.estimatedWaitMins}
                availableSlotsCount={center.availableSlotsCount}
                openingTime={center.openingTime}
                closingTime={center.closingTime}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No Procurement Centers Found"
            description="There are currently no procurement centers matching your selected filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveFilter('nearest');
            }}
            secondaryActionText="Search Again"
            onSecondaryAction={() => setSearchQuery('')}
          />
        )}
      </div>
    </div>
  );
}
