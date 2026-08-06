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
