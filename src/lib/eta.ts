/**
 * Transparent Rule-Based ETA Calculator
 * Formula: Estimated wait = (people ahead * avg processing time) / active counters
 */

/**
 * Formats a wait time given in minutes into a short, human-friendly string
 * that scales up to hours and days instead of always showing raw minutes.
 *
 * Examples:
 *   formatWaitTime(0)     -> "0 min"
 *   formatWaitTime(8)     -> "8 min"
 *   formatWaitTime(75)    -> "1 hr 15 min"
 *   formatWaitTime(120)   -> "2 hr"
 *   formatWaitTime(1500)  -> "1 day 1 hr"
 *   formatWaitTime(2880)  -> "2 days"
 */
export function formatWaitTime(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes || 0));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const MINUTES_PER_DAY = 24 * 60;
  const days = Math.floor(minutes / MINUTES_PER_DAY);
  const remAfterDays = minutes % MINUTES_PER_DAY;
  const hours = Math.floor(remAfterDays / 60);
  const mins = remAfterDays % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} hr`);
  // Only show leftover minutes if we're not already spanning a full day,
  // to keep the label short (e.g. "1 day 2 hr" instead of "1 day 2 hr 5 min").
  if (mins > 0 && days === 0) parts.push(`${mins} min`);

  return parts.join(' ') || '0 min';
}

export interface ETAParams {
  peopleAhead: number;
  avgProcessMins?: number;
  activeCounters?: number;
}

export function calculateETA({
  peopleAhead,
  avgProcessMins = 5,
  activeCounters = 2,
}: ETAParams): { minutes: number; label: string } {
  if (peopleAhead <= 0) {
    return {
      minutes: 0,
      label: 'Your turn is next! Please proceed to the counter.',
    };
  }

  const counters = Math.max(1, activeCounters);
  const avgTime = Math.max(2, avgProcessMins);

  const rawMinutes = Math.ceil((peopleAhead * avgTime) / counters);

  return {
    minutes: rawMinutes,
    label: `Estimated wait: ~${rawMinutes} min (based on ${peopleAhead} ahead, ${counters} active counters)`,
  };
}
