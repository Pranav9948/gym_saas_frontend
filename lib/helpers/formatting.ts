// ===========================================
// Formatting Helpers - Date, currency, etc.
// ===========================================

import {
  format,
  formatDistance,
  formatRelative,
  parseISO,
  isValid,
} from 'date-fns';

// Date formatting
export function formatDate(
  date: string | Date | null | undefined,
  formatStr = 'PPP',
): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '-';

  return format(parsedDate, formatStr);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'PPp');
}

export function formatShortDate(
  date: string | Date | null | undefined,
): string {
  return formatDate(date, 'MMM d, yyyy');
}

export function formatTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'p');
}

export function formatDateForInput(
  date: string | Date | null | undefined,
): string {
  return formatDate(date, 'yyyy-MM-dd');
}

export function formatRelativeTime(
  date: string | Date | null | undefined,
): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '-';

  return formatDistance(parsedDate, new Date(), { addSuffix: true });
}

export function formatRelativeDate(
  date: string | Date | null | undefined,
): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '-';

  return formatRelative(parsedDate, new Date());
}

// Currency formatting
import { formatInr } from '@/lib/money';

export function formatCurrency(
  amount: number,
  currency = 'INR',
  _locale = 'en-IN',
): string {
  return formatInr(amount, currency);
}

export function formatCents(cents: number, currency = 'INR'): string {
  return formatCurrency(cents / 100, currency);
}

// Number formatting
export function formatNumber(
  num: number,
  locale = 'en-US',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(num);
}

export function formatCompactNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(num);
}

export function formatPercentage(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`;
}

// Name formatting
export function formatFullName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : '-';
}

export function formatInitials(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}` || '?';
}

// Phone formatting
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';

  // Remove non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Basic US format
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // With country code
  if (cleaned.startsWith('+1') && cleaned.length === 12) {
    return `+1 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }

  // Return as-is if doesn't match expected format
  return phone;
}

// Truncate text
export function truncate(
  text: string,
  maxLength: number,
  suffix = '...',
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

// Pluralize helper
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
}
