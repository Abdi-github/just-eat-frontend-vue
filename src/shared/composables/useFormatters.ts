import { useLanguageStore } from '@/stores/language.store';
import {
  formatPrice,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDeliveryTime,
  formatRating,
  truncateText,
  getInitials,
} from '@/shared/utils/formatters';

export function useFormatters() {
  const languageStore = useLanguageStore();

  return {
    formatPrice,
    formatDate: (date: string | Date, fmt?: string) =>
      formatDate(date, languageStore.currentLocale, fmt),
    formatDateTime: (date: string | Date) =>
      formatDateTime(date, languageStore.currentLocale),
    formatRelativeTime: (date: string | Date) =>
      formatRelativeTime(date, languageStore.currentLocale),
    formatDeliveryTime,
    formatRating,
    truncateText,
    getInitials,
  };
}
