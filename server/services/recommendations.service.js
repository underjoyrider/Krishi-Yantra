const centersService = require('./centers.service');

async function getBestRecommendation(centersList = null) {
  const centers = centersList || (await centersService.getAllCenters());
  if (!centers || centers.length === 0) return null;

  const scored = centers.map((center) => {
    let score = 0;

    // Status weighting
    if (center.status === 'OPEN') score += 100;
    else if (center.status === 'BUSY') score += 35;
    else if (center.status === 'HIGH_DEMAND') score += 5;
    else if (center.status === 'CLOSED') score -= 999;

    // Distance: closer is better
    score += Math.max(0, 20 - (center.distanceKm || 5)) * 4;

    // Wait time: shorter is better
    score += Math.max(0, 70 - (center.estimatedWaitMins || 20)) * 1.2;

    // Slots availability
    score += Math.min(80, center.availableSlotsCount || 0) * 0.5;

    return { center, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.center;

  if (!best || best.status === 'CLOSED') return null;

  const rationale = `Recommended because it is only ${best.distanceKm} km away, has an estimated ${best.estimatedWaitMins}-minute wait, and has ${best.availableSlotsCount} slots available.`;

  return {
    center: best,
    score: scored[0].score,
    rationale,
  };
}

async function getAlternativeCenterIfCrowded(centerId) {
  const center = await centersService.getCenterById(centerId);
  if (!center) return null;

  // If wait time is > 60 minutes or HIGH_DEMAND
  if (center.estimatedWaitMins > 60 || center.status === 'HIGH_DEMAND') {
    const all = await centersService.getAllCenters();
    const alternatives = all
      .filter((c) => c.id !== center.id && c.status === 'OPEN' && c.availableSlotsCount > 10)
      .map((c) => ({
        ...c,
        timeSavedMins: Math.max(0, center.estimatedWaitMins - c.estimatedWaitMins),
      }))
      .filter((c) => c.timeSavedMins >= 20);

    alternatives.sort((a, b) => b.timeSavedMins - a.timeSavedMins);
    const topAlt = alternatives[0];

    if (topAlt) {
      return {
        hasAlternative: true,
        currentCenterName: center.name,
        currentWaitMins: center.estimatedWaitMins,
        alternativeCenter: topAlt,
        timeSavedMinutes: topAlt.timeSavedMins,
        message: `A nearby procurement center (${topAlt.name}) may save you approximately ${topAlt.timeSavedMins} minutes.`,
      };
    }
  }

  return { hasAlternative: false };
}

module.exports = {
  getBestRecommendation,
  getAlternativeCenterIfCrowded,
};
