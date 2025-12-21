import { computed } from 'vue';
import { useLanguageStore } from '@/stores/language.store';

export function useLocalizedName() {
  const languageStore = useLanguageStore();

  function getLocalizedName(field: Record<string, string> | undefined | null, fallback = ''): string {
    if (!field) return fallback;
    const locale = languageStore.currentLocale;
    return field[locale] || field['en'] || Object.values(field)[0] || fallback;
  }

  function localizedNameFor(field: Record<string, string> | undefined | null) {
    return computed(() => getLocalizedName(field));
  }

  return { getLocalizedName, localizedNameFor };
}
