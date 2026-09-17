/**
 * Dynamic Wait-Time and Arrival Calculation Utility
 * Formula: Estimated wait = (Farmers Ahead × Average Processing Time) ÷ Active Counters
 */

function calculateWaitTime({
  farmersAhead = 0,
  avgProcessMins = 5,
  activeCounters = 2,
}) {
  const ahead = Math.max(0, parseInt(farmersAhead, 10) || 0);
  const counters = Math.max(1, parseInt(activeCounters, 10) || 1);
  const avgTime = Math.max(1, parseFloat(avgProcessMins) || 5);

  if (ahead === 0) {
    return {
      minutes: 0,
      formatted: '0 min',
      label: 'Your turn is next! Please proceed to the counter.',
    };
  }

  const rawMinutes = Math.ceil((ahead * avgTime) / counters);

  return {
    minutes: rawMinutes,
    formatted: formatMinutes(rawMinutes),
    label: `Estimated wait: ~${formatMinutes(rawMinutes)} (${ahead} farmers ahead across ${counters} active counters)`,
  };
}

function formatMinutes(minutes) {
  const mins = Math.max(0, Math.round(minutes));
  if (mins === 0) return '0 min';
  if (mins < 60) return `${mins} min`;

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (remainingMins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMins} min`;
}

/**
 * Calculates recommended arrival time given a time string (e.g. "10:30 AM")
 * Recommends arriving 15 minutes before the time window.
 */
function calculateRecommendedArrival(timeStr, leadMinutes = 15) {
  if (!timeStr) return '15 minutes before slot';
  try {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return `15 mins before ${timeStr}`;

    let hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    let totalMins = hours * 60 + mins - leadMinutes;
    if (totalMins < 0) totalMins += 24 * 60;

    const arrHours24 = Math.floor(totalMins / 60);
    const arrMins = totalMins % 60;

    const arrPeriod = arrHours24 >= 12 ? 'PM' : 'AM';
    let arrHours = arrHours24 % 12;
    if (arrHours === 0) arrHours = 12;

    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(arrHours)}:${pad(arrMins)} ${arrPeriod}`;
  } catch (err) {
    return `15 mins prior`;
  }
}

module.exports = {
  calculateWaitTime,
  formatMinutes,
  calculateRecommendedArrival,
};
