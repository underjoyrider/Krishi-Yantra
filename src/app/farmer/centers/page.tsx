'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  List,
  Map as MapIcon,
  Sliders,
} from 'lucide-react';
import { FarmerHeader } from '@/components/farmer/FarmerHeader';
import { CenterCard } from '@/components/farmer/CenterCard';
import { RecommendationCard } from '@/components/farmer/RecommendationCard';
import { MapView } from '@/components/farmer/MapView';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { useLanguage } from '@/lib/language-context';
import { getClientSocket } from '@/lib/socket-client';

type ViewMode = 'list' | 'map';
type FilterType = 'all' | 'nearest' | 'wait' | 'slots' | 'open';

export default function FarmerCentersPage() {
  const { t } = useLanguage();
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<FilterType>('nearest');

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/centers');
      const data = await res.json();
      const list = data.centers || data.data?.centers;
      if (data.success && Array.isArray(list)) {
        setCenters(list);
      } else {
        setError(data.message || data.error || 'Unable to load procurement centers');
      }
    } catch (err: any) {
      console.error('Failed to load centers:', err);
      setError('Unable to load procurement centers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();

    const socket = getClientSocket();
    if (socket) {
      const handleLiveRefresh = () => {
        fetch('/api/centers')
          .then((r) => r.json())
          .then((d) => {
            const items = d.centers || d.data?.centers;
            if (d.success && Array.isArray(items)) setCenters(items);
          })
          .catch((e) => console.error('Live socket update error:', e));
      };

      socket.on('queueUpdated', handleLiveRefresh);
      socket.on('queue:updated', handleLiveRefresh);
      socket.on('bookingCreated', handleLiveRefresh);
      socket.on('booking:created', handleLiveRefresh);
      socket.on('bookingCancelled', handleLiveRefresh);
      socket.on('booking:cancelled', handleLiveRefresh);
      socket.on('centerStatusChanged', handleLiveRefresh);

      return () => {
        socket.off('queueUpdated', handleLiveRefresh);
        socket.off('queue:updated', handleLiveRefresh);
        socket.off('bookingCreated', handleLiveRefresh);
        socket.off('booking:created', handleLiveRefresh);
        socket.off('bookingCancelled', handleLiveRefresh);
        socket.off('booking:cancelled', handleLiveRefresh);
        socket.off('centerStatusChanged', handleLiveRefresh);
      };
    }
  }, []);

  const filteredCenters = useMemo(() => {
    let list = centers.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.address?.toLowerCase().includes(query.toLowerCase())
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
  }, [centers, query, activeFilter]);

  const filterChips: { id: FilterType; label: string }[] = [
    { id: 'nearest', label: t.filterNearest || 'Nearest' },
    { id: 'wait', label: t.filterLowestWait || 'Shortest Wait' },
    { id: 'slots', label: t.filterMostSlots || 'Most Slots' },
    { id: 'open', label: t.filterOpenNow || 'Open Now' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header with Mandya, Karnataka Location Mode */}
      <FarmerHeader
        locationMode={true}
        locationText="Mandya, Karnataka"
        hasUnreadAlerts={true}
        userInitial="R"
      />

      {/* Title & Subtitle */}
      <div className="pt-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.procurementCentersTitle || 'Procurement Centers'}
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          {t.procurementCentersSub || 'Find and book slots at nearby centers'}
        </p>
      </div>

      {/* Search Input & Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder || 'Search by name or location...'}
            className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs rounded-2xl pl-10 pr-3.5 py-3 border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => setActiveFilter(activeFilter === 'nearest' ? 'open' : 'nearest')}
          className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs text-slate-700 hover:text-emerald-800 transition-colors"
          title="Toggle Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Control: List | Map */}
      <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-2xs">
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'list'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>{t.listMode || 'List'}</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('map')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'map'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>{t.mapMode || 'Map'}</span>
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

      {/* Main Content Area: Conditional or Combined */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <MapView
            centers={filteredCenters}
            fullHeight={true}
          />
          {/* Quick summary below full map */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 px-1">Nearby Mandis</h4>
            <div className="space-y-2">
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
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Smart Center Recommendation */}
          {!loading && centers.length > 0 && !query && (
            <RecommendationCard centers={centers} />
          )}

          {/* Centers List */}
          {loading ? (
            <LoadingSkeleton count={3} height="h-44" />
          ) : error ? (
            <ErrorState
              title="Unable to load procurement centers"
              message="Please check your connection and try again."
              onRetry={fetchCenters}
              retryText="Try Again"
            />
          ) : filteredCenters.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No Procurement Centers Found"
              description="There are currently no procurement centers matching your selected filters."
              actionText="Clear Filters"
              onAction={() => {
                setQuery('');
                setActiveFilter('nearest');
              }}
              secondaryActionText="Search Again"
              onSecondaryAction={() => setQuery('')}
            />
          ) : (
            <div className="space-y-3">
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
          )}

          {/* Map Preview Section at the bottom matching Screen 2 */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2 px-1">
              <h4 className="text-xs font-bold text-slate-700">Map View</h4>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900"
              >
                Expand map →
              </button>
            </div>
            <MapView centers={filteredCenters} />
          </div>
        </div>
      )}
    </div>
  );
}
