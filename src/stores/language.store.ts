import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'it'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export const useLanguageStore = defineStore('language', () => {
  const currentLocale = ref<Locale>(
    (localStorage.getItem('just_eat_lang') as Locale) || 'en',
  );

  const locale = computed(() => currentLocale.value);

  function setLocale(newLocale: string) {
    if (!SUPPORTED_LOCALES.includes(newLocale as Locale)) return;
    currentLocale.value = newLocale as Locale;
    localStorage.setItem('just_eat_lang', newLocale);
    document.documentElement.lang = newLocale;
  }

  return { currentLocale, locale, setLocale, SUPPORTED_LOCALES };
});
