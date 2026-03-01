const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Convert a UTC Date to IST date string (YYYY-MM-DD) using fast arithmetic */
export function toISTDateString(date: Date): string {
  const istTime = new Date(date.getTime() + IST_OFFSET_MS);
  const y = istTime.getUTCFullYear();
  const m = String(istTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(istTime.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Get today's date in IST as YYYY-MM-DD */
export function todayIST(): string {
  return toISTDateString(new Date());
}

/** Get the start of an IST day as a UTC ISO string (for Supabase queries) */
export function istDayStartUTC(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - IST_OFFSET_MS).toISOString();
}

/** Convert a UTC timestamp string to IST date string (YYYY-MM-DD) — fast path */
export function utcToISTDate(utcTimestamp: string): string {
  return toISTDateString(new Date(utcTimestamp));
}

/** Subtract N days from a YYYY-MM-DD date string, return YYYY-MM-DD */
export function subtractDaysIST(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  const ry = dt.getUTCFullYear();
  const rm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const rd = String(dt.getUTCDate()).padStart(2, "0");
  return `${ry}-${rm}-${rd}`;
}
