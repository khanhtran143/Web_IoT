/**
 * Format a Date object to "yyyy/mm/dd hh:mm:ss"
 */
export function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  precision: "YEAR" | "MONTH" | "DAY" | "HOUR" | "MINUTE" | "SECOND" | "INVALID";
}

/**
 * Smart Datetime Parser: Analyzes search text precision and creates range boundaries
 * Supports formats:
 * - "2026"
 * - "2026/08" or "2026-08"
 * - "2026/08/19" or "2026-08-19"
 * - "2026/08/19 07" or "2026-08-19 07"
 * - "2026/08/19 07:30" or "2026-08-19 07:30"
 * - "2026/08/19 07:30:25" or "2026-08-19 07:30:25"
 */
export function parseSmartDatetimeRange(input: string): DateRange | null {
  const cleanInput = input.trim().replace(/-/g, "/");

  // Regex patterns
  const secondRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  const minuteRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/;
  const hourRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2})$/;
  const dayRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
  const monthRegex = /^(\d{4})\/(\d{1,2})$/;
  const yearRegex = /^(\d{4})$/;

  let match: RegExpMatchArray | null;

  // 1. Exact Second
  if ((match = cleanInput.match(secondRegex))) {
    const [_, y, m, d, h, min, s] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), parseInt(s), 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), parseInt(s), 999);
    return { startDate, endDate, precision: "SECOND" };
  }

  // 2. Minute Range
  if ((match = cleanInput.match(minuteRegex))) {
    const [_, y, m, d, h, min] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min), 59, 999);
    return { startDate, endDate, precision: "MINUTE" };
  }

  // 3. Hour Range
  if ((match = cleanInput.match(hourRegex))) {
    const [_, y, m, d, h] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), 0, 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), 59, 59, 999);
    return { startDate, endDate, precision: "HOUR" };
  }

  // 4. Day Range
  if ((match = cleanInput.match(dayRegex))) {
    const [_, y, m, d] = match;
    const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 0, 0, 0, 0);
    const endDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 23, 59, 59, 999);
    return { startDate, endDate, precision: "DAY" };
  }

  // 5. Month Range
  if ((match = cleanInput.match(monthRegex))) {
    const [_, y, m] = match;
    const year = parseInt(y);
    const month = parseInt(m) - 1;
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { startDate, endDate, precision: "MONTH" };
  }

  // 6. Year Range
  if ((match = cleanInput.match(yearRegex))) {
    const year = parseInt(match[1]);
    const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    return { startDate, endDate, precision: "YEAR" };
  }

  return null;
}
