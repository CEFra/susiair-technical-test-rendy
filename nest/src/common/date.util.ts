/** Operational reference date. Configurable via TODAY env variable. */
export const TODAY: string = process.env.TODAY ?? '2026-05-15';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Adds (or subtracts) whole days to a YYYY-MM-DD string, in UTC. */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function diffDays(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / MS_PER_DAY);
}
