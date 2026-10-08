/**
 * Formats a Date to "yyyy/mm/dd hh:mm:ss"
 */
export function formatDateTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export type DatetimePrecision = "YEAR" | "MONTH" | "DAY" | "HOUR" | "MINUTE" | "SECOND" | "UNKNOWN";

export interface PrecisionMatch {
  precision: DatetimePrecision;
  description: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Smart Precision Datetime Parser for frontend filtering & validation
 */
export function parseSmartDatetime(input: string): PrecisionMatch | null {
  const clean = input.trim().replace(/-/g, "/");
  if (!clean) return null;

  const secondRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  const minuteRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/;
  const hourRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2})$/;
  const dayRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
  const monthRegex = /^(\d{4})\/(\d{1,2})$/;
  const yearRegex = /^(\d{4})$/;

  let match: RegExpMatchArray | null;

  if ((match = clean.match(secondRegex))) {
    const [_, y, m, d, h, min, s] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), parseInt(s), 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), parseInt(s), 999);
    return { precision: "SECOND", description: `Exact second: ${clean}`, startDate, endDate };
  }

  if ((match = clean.match(minuteRegex))) {
    const [_, y, m, d, h, min] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), 59, 999);
    return { precision: "MINUTE", description: `Within minute: ${y}/${m}/${d} ${h}:${min}:00 - 59`, startDate, endDate };
  }

  if ((match = clean.match(hourRegex))) {
    const [_, y, m, d, h] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), 0, 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), 59, 59, 999);
    return { precision: "HOUR", description: `Within hour ${h}:00 on ${y}/${m}/${d}`, startDate, endDate };
  }

  if ((match = clean.match(dayRegex))) {
    const [_, y, m, d] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 0, 0, 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 23, 59, 59, 999);
    return { precision: "DAY", description: `Full day: ${y}/${m}/${d}`, startDate, endDate };
  }

  if ((match = clean.match(monthRegex))) {
    const [_, y, m] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m), 0, 23, 59, 59, 999);
    return { precision: "MONTH", description: `Full month: ${m}/${y}`, startDate, endDate };
  }

  if ((match = clean.match(yearRegex))) {
    const y = parseInt(match[1]);
    const startDate = new Date(y, 0, 1, 0, 0, 0, 0);
    const endDate = new Date(y, 11, 31, 23, 59, 59, 999);
    return { precision: "YEAR", description: `Full year: ${y}`, startDate, endDate };
  }

  return null;
}
