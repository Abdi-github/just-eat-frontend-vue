import { createI18n } from 'vue-i18n';
import type { I18n } from 'vue-i18n';

// EN locale — all namespaces (eager load as fallback)
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enRestaurants from './locales/en/restaurants.json';
import enSearch from './locales/en/search.json';
import enCart from './locales/en/cart.json';
import enCheckout from './locales/en/checkout.json';
import enAuth from './locales/en/auth.json';
import enOrders from './locales/en/orders.json';
import enProfile from './locales/en/profile.json';
import enAddresses from './locales/en/addresses.json';
import enFavorites from './locales/en/favorites.json';
import enReviews from './locales/en/reviews.json';
import enNotifications from './locales/en/notifications.json';
import enPromotions from './locales/en/promotions.json';
import enRestaurantDashboard from './locales/en/restaurant-dashboard.json';
import enCourierDashboard from './locales/en/courier-dashboard.json';
import enStatic from './locales/en/static.json';

const enMessages = {
  common: enCommon,
  home: enHome,
  restaurants: enRestaurants,
  search: enSearch,
  cart: enCart,
  checkout: enCheckout,
  auth: enAuth,
  orders: enOrders,
  profile: enProfile,
  addresses: enAddresses,
  favorites: enFavorites,
  reviews: enReviews,
  notifications: enNotifications,
  promotions: enPromotions,
  'restaurant-dashboard': enRestaurantDashboard,
  'courier-dashboard': enCourierDashboard,
  static: enStatic,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const i18n: I18n<any, any, any, string, false> = createI18n({
  legacy: false,
  locale: (localStorage.getItem('just_eat_lang') as string) || 'en',
  fallbackLocale: 'en',
  messages: {
    en: enMessages,
  },
});

const NAMESPACES = [
  'common', 'home', 'restaurants', 'search', 'cart', 'checkout',
  'auth', 'orders', 'profile', 'addresses', 'favorites', 'reviews',
  'notifications', 'promotions', 'restaurant-dashboard', 'courier-dashboard', 'static',
];

export async function loadLocaleMessages(locale: string) {
  if (locale === 'en') return;
  if (i18n.global.availableLocales.includes(locale)) return;

  const modules = import.meta.glob('./locales/*/*.json');
  const messages: Record<string, unknown> = {};

  await Promise.all(
    NAMESPACES.map(async (ns) => {
      const key = `./locales/${locale}/${ns}.json`;
      if (modules[key]) {
        const mod = (await modules[key]()) as { default: unknown };
        messages[ns] = mod.default;
      }
    }),
  );

  i18n.global.setLocaleMessage(locale, messages);
}
