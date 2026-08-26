import { parseLocalDate } from "@/lib/date";
import type { Database } from "@/types/supabase";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** Events with date >= today, sorted soonest first. */
export function getUpcomingEvents(
  events: EventRow[],
  options?: { withinMonths?: number }
): EventRow[] {
  const today = startOfToday();
  const cutoff = options?.withinMonths
    ? new Date(
        today.getFullYear(),
        today.getMonth() + options.withinMonths,
        today.getDate()
      )
    : null;

  return events
    .filter((ev) => {
      const d = parseLocalDate(ev.date);
      if (!d || d < today) return false;
      return cutoff ? d <= cutoff : true;
    })
    .sort(
      (a, b) =>
        parseLocalDate(a.date)!.getTime() - parseLocalDate(b.date)!.getTime()
    );
}

/** Events with date < today, sorted most recent first. */
export function getPastEvents(events: EventRow[]): EventRow[] {
  const today = startOfToday();

  return events
    .filter((ev) => {
      const d = parseLocalDate(ev.date);
      return d !== null && d < today;
    })
    .sort(
      (a, b) =>
        parseLocalDate(b.date)!.getTime() - parseLocalDate(a.date)!.getTime()
    );
}
