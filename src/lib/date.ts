/**
 * Parses a "YYYY-MM-DD" text column into a local Date, avoiding the UTC-shift
 * bug `new Date("YYYY-MM-DD")` has (that form is parsed as UTC midnight, which
 * renders as the previous day in negative-offset timezones). Returns null for
 * empty/invalid input so callers can render a placeholder for in-progress
 * drafts instead of crashing.
 */
export function parseLocalDate(
  dateStr: string | null | undefined
): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a "YYYY-MM-DD" text column as "Month Day, Year" (e.g. "March 5, 2026"). */
export function formatDisplayDate(
  dateStr: string | null | undefined
): string | null {
  const date = parseLocalDate(dateStr);
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Formats a "HH:MM" (or "HH:MM:SS") 24-hour text column as "h:MM AM/PM". */
export function formatDisplayTime(
  timeStr: string | null | undefined
): string | null {
  if (!timeStr) return null;
  const [hStr, mStr] = timeStr.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
