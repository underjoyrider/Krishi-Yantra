const prisma = require('../prisma');
const { calculateWaitTime } = require('../utils/eta.util');
const { emitCenterStatusChanged } = require('../utils/socket.util');

const TODAY_DATE_STR = '2026-09-05';

// Distance calculation helper (defaulting around Mandya coordinate 12.5234, 76.8967)
function computeDistanceKm(lat1, lon1, lat2 = 12.5234, lon2 = 76.8967) {
  if (!lat1 || !lon1) return 5.0;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Queue congestion detection logic
function evaluateCongestionStatus(currentQueue, waitMins, baseStatus) {
  if (baseStatus === 'CLOSED') return 'CLOSED';
  if (currentQueue > 30 || waitMins > 80) return 'HIGH_DEMAND';
  if (currentQueue > 15 || waitMins > 30) return 'BUSY';
  return 'OPEN';
}

async function getAllCenters(filters = {}) {
  const { sort, status, search } = filters;

  const centers = await prisma.procurementCenter.findMany({
    orderBy: { name: 'asc' },
    include: {
      slots: {
        where: { date: TODAY_DATE_STR },
        orderBy: { startTime: 'asc' },
      },
      bookings: {
        where: {
          status: { in: ['WAITING', 'PROCESSING', 'BOOKED', 'CHECKED_IN'] },
        },
      },
      queueEntries: {
        where: {
          status: { in: ['WAITING', 'PROCESSING'] },
        },
      },
    },
  });

  let enriched = centers.map((center) => {
    // Current queue is counted from active bookings/queue entries
    const currentQueue = Math.max(center.bookings.length, center.queueEntries.length, center.currentQueueCount || 0);

    const eta = calculateWaitTime({
      farmersAhead: currentQueue,
      avgProcessMins: center.avgProcessMins || center.averageProcessingTime || 5,
      activeCounters: center.activeCounters || 3,
    });

    const availableSlotsCount = center.slots.reduce((acc, slot) => {
      return acc + Math.max(0, slot.capacity - slot.bookedCount);
    }, 0);

    // Calculate distance
    let distanceKm = computeDistanceKm(center.latitude, center.longitude);
    if (center.code === 'SHIV') distanceKm = 3.2;
    if (center.code === 'RAM') distanceKm = 5.8;
    if (center.code === 'KOL') distanceKm = 8.1;
    if (center.code === 'MAD') distanceKm = 11.4;
    if (center.code === 'MAL') distanceKm = 14.2;
    if (center.code === 'MKT') distanceKm = 6.5;
    if (center.code === 'SRI') distanceKm = 18.0;
    if (center.code === 'NAG') distanceKm = 22.5;
    if (center.code === 'PAN') distanceKm = 16.2;
    if (center.code === 'CHK') distanceKm = 26.0;

    const dynamicStatus = evaluateCongestionStatus(currentQueue, eta.minutes, center.status);

    return {
      id: center.id,
      name: center.name,
      code: center.code,
      address: center.address,
      village: center.village || 'Mandya',
      district: center.district || 'Mandya',
      state: center.state || 'Karnataka',
      latitude: center.latitude,
      longitude: center.longitude,
      capacity: center.capacity || center.dailyCapacity || 135,
      dailyCapacity: center.dailyCapacity || 135,
      activeCounters: center.activeCounters,
      avgProcessMins: center.avgProcessMins || center.averageProcessingTime || 5,
      averageProcessingTime: center.avgProcessMins || center.averageProcessingTime || 5,
      status: dynamicStatus,
      rawStatus: center.status,
      openingTime: center.openingTime,
      closingTime: center.closingTime,
      slots: center.slots,
      distanceKm,
      currentQueue,
      currentQueueCount: currentQueue,
      estimatedWaitMins: eta.minutes,
      estimatedWaitFormatted: eta.formatted,
      availableSlotsCount,
      slotsLeft: availableSlotsCount,
      operatingHours: `${center.openingTime} – ${center.closingTime}`,
    };
  });

  // Search filter
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    enriched = enriched.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (status) {
    if (status.toLowerCase() === 'open') {
      enriched = enriched.filter((c) => c.status === 'OPEN');
    } else {
      enriched = enriched.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }
  }

  // Sorting
  if (sort === 'nearest') {
    enriched.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sort === 'shortest-wait' || sort === 'wait') {
    enriched.sort((a, b) => a.estimatedWaitMins - b.estimatedWaitMins);
  } else if (sort === 'most-slots' || sort === 'slots') {
    enriched.sort((a, b) => b.availableSlotsCount - a.availableSlotsCount);
  }

  return enriched;
}

async function getCenterById(id) {
  const center = await prisma.procurementCenter.findFirst({
    where: {
      OR: [{ id: id }, { code: id }],
    },
    include: {
      slots: {
        where: { date: TODAY_DATE_STR },
        orderBy: { startTime: 'asc' },
      },
      bookings: {
        where: {
          status: { in: ['WAITING', 'PROCESSING', 'BOOKED', 'CHECKED_IN'] },
        },
      },
      queueEntries: {
        where: { status: { in: ['WAITING', 'PROCESSING'] } },
        orderBy: { queuePosition: 'asc' },
      },
    },
  });

  if (!center) {
    return null;
  }

  const currentQueue = Math.max(center.bookings.length, center.queueEntries.length, center.currentQueueCount || 0);

  const eta = calculateWaitTime({
    farmersAhead: currentQueue,
    avgProcessMins: center.avgProcessMins || center.averageProcessingTime || 5,
    activeCounters: center.activeCounters || 3,
  });

  const availableSlotsCount = center.slots.reduce((acc, slot) => {
    return acc + Math.max(0, slot.capacity - slot.bookedCount);
  }, 0);

  let distanceKm = computeDistanceKm(center.latitude, center.longitude);
  if (center.code === 'SHIV') distanceKm = 3.2;
  if (center.code === 'RAM') distanceKm = 5.8;
  if (center.code === 'KOL') distanceKm = 8.1;
  if (center.code === 'MAD') distanceKm = 11.4;
  if (center.code === 'MAL') distanceKm = 14.2;
  if (center.code === 'MKT') distanceKm = 6.5;

  const dynamicStatus = evaluateCongestionStatus(currentQueue, eta.minutes, center.status);

  return {
    ...center,
    status: dynamicStatus,
    distanceKm,
    currentQueue,
    currentQueueCount: currentQueue,
    estimatedWaitMins: eta.minutes,
    estimatedWaitFormatted: eta.formatted,
    availableSlotsCount,
    slotsLeft: availableSlotsCount,
    operatingHours: `${center.openingTime} – ${center.closingTime}`,
  };
}

async function updateCenterStatus(id, newStatus) {
  const updated = await prisma.procurementCenter.update({
    where: { id },
    data: { status: newStatus },
  });
  emitCenterStatusChanged(updated.id, newStatus);
  return updated;
}

module.exports = {
  getAllCenters,
  getCenterById,
  updateCenterStatus,
};
