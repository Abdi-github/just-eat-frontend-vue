import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { enUS, fr, de, it, type Locale } from 'date-fns/locale';
import { CURRENCY } from './constants';

const DATE_FNS_LOCALES: Record<string, Locale> = { en: enUS, fr, de, it };

export function formatPrice(price: number | string, currency = CURRENCY): string {
  return `${currency} ${Number(price).toFixed(2)}`;
}

export function formatDate(date: string | Date, locale = 'en', formatStr = 'dd MMM yyyy'): string {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, formatStr, { locale: DATE_FNS_LOCALES[locale] ?? enUS });
}

export function formatDateTime(date: string | Date, locale = 'en'): string {
  return formatDate(date, locale, 'dd MMM yyyy, HH:mm');
}

export function formatRelativeTime(date: string | Date, locale = 'en'): string {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsed, { addSuffix: true, locale: DATE_FNS_LOCALES[locale] ?? enUS });
}

export function formatDeliveryTime(min: number, max: number): string {
  return `${min}–${max} min`;
}

export function formatRating(rating: number | string): string {
  return Number(rating).toFixed(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getInitials(firstName?: string, lastName?: string): string {
  return `${(firstName ?? '').charAt(0)}${(lastName ?? '').charAt(0)}`.toUpperCase();
}

export function formatPhoneNumber(phone: string): string {
  // Format Swiss phone numbers: +41 79 123 45 67
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('41') && cleaned.length === 11) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
