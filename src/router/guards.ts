import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'it'];

export function validateLocale(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const locale = to.params.locale as string;
  if (locale && !SUPPORTED_LOCALES.includes(locale)) {
    next({ path: `/en${to.path.replace(`/${locale}`, '')}` });
  } else {
    next();
  }
}

export function requireAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    const locale = (to.params.locale as string) || 'en';
    next({ path: `/${locale}/login`, query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

export function requireGuest(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    const locale = (to.params.locale as string) || 'en';
    next({ path: `/${locale}/account/orders` });
  } else {
    next();
  }
}

export function requireRole(roles: string[]) {
  return (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const authStore = useAuthStore();
    const locale = (to.params.locale as string) || 'en';
    if (!authStore.isAuthenticated) {
      next({ path: `/${locale}/login`, query: { redirect: to.fullPath } });
    } else if (!roles.some((r) => authStore.user?.roles.includes(r))) {
      next({ path: `/${locale}` });
    } else {
      next();
    }
  };
}
