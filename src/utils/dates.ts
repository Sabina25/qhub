import { Timestamp } from 'firebase/firestore';

export type Lang = 'ua' | 'en';

export function ensureYMD(input: any): string {
  try {
    if (!input) return '';
    // Firestore Timestamp-like
    if (typeof input === 'object' && 'seconds' in input) {
      const d = new Date(input.seconds * 1000);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (typeof input === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      const d = new Date(input);
      if (isNaN(+d)) return '';
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return '';
  } catch {
    return '';
  }
}

export function ymdToUtcDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0, 0));
}

export function ymdToTimestampUTC(ymd: string): Timestamp {
  return Timestamp.fromDate(ymdToUtcDate(ymd));
}

export function formatLocaleDate(ymd: string, lang: Lang): string {
  if (!ymd) return '—';
  const d = new Date(`${ymd}T00:00:00Z`);
  return d.toLocaleDateString(lang === 'ua' ? 'uk-UA' : 'en-GB');
}


// YYYY-MM-DD из Firestore Timestamp или строки/Date-подобного
export function toDateString(input: any): string {
  try {
    if (!input) return '';
    // Firestore Timestamp { seconds: number }
    if (typeof input === 'object' && 'seconds' in input) {
      const d = new Date(input.seconds * 1000);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (typeof input === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
      const d = new Date(input);
      if (isNaN(+d)) return '';
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    if (input instanceof Date) {
      const d = input;
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return '';
  } catch {
    return '';
  }
}