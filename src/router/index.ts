import { createRouter, createWebHistory } from 'vue-router';
import { validateLocale, requireAuth, requireGuest, requireRole } from './guards';
import { i18n, loadLocaleMessages } from '@/i18n';

const MainLayout = () => import('@/layouts/MainLayout.vue');
const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const AccountLayout = () => import('@/layouts/AccountLayout.vue');
const RestaurantLayout = () => import('@/layouts/RestaurantLayout.vue');
const CourierLayout = () => import('@/layouts/CourierLayout.vue');

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: () => {
        const lang = localStorage.getItem('just_eat_lang') || 'en';
        return `/${lang}`;
      },
    },
    {
      path: '/:locale',
      beforeEnter: validateLocale,
      children: [
        // ── Main Layout (public) ────────────────────────────────────────────
        {
          path: '',
          component: MainLayout,
          children: [
            {
              path: '',
              name: 'home',
              component: () => import('@/features/home/pages/HomePage.vue'),
            },
            {
              path: 'restaurants',
              name: 'restaurants',
              component: () => import('@/features/restaurants/pages/RestaurantListPage.vue'),
            },
            {
              path: 'restaurants/explore',
              name: 'restaurants-explore',
              component: () => import('@/features/restaurants/pages/RestaurantExplorePage.vue'),
            },
            {
              path: 'restaurants/:slug',
              name: 'restaurant-detail',
              component: () => import('@/features/restaurants/pages/RestaurantDetailPage.vue'),
            },
            {
              path: 'search',
              name: 'search',
              component: () => import('@/features/search/pages/SearchResultsPage.vue'),
            },
            {
              path: 'cart',
              name: 'cart',
              component: () => import('@/features/cart/pages/CartPage.vue'),
            },
            {
              path: 'partner',
              name: 'partner',
              component: () => import('@/features/auth/pages/PartnerPage.vue'),
            },
            {
              path: 'become-courier',
              name: 'become-courier',
              component: () => import('@/features/auth/pages/BecomeCourierPage.vue'),
            },
            {
              path: 'application-status',
              name: 'application-status',
              beforeEnter: requireAuth,
              component: () => import('@/features/auth/pages/ApplicationStatusPage.vue'),
            },
            {
              path: 'about',
              name: 'about',
              component: () => import('@/features/static/pages/AboutPage.vue'),
            },
            {
              path: 'terms',
              name: 'terms',
              component: () => import('@/features/static/pages/TermsPage.vue'),
            },
            {
              path: 'privacy',
              name: 'privacy',
              component: () => import('@/features/static/pages/PrivacyPage.vue'),
            },
            {
              path: 'contact',
              name: 'contact',
              component: () => import('@/features/static/pages/ContactPage.vue'),
            },
            // ── Protected (customer) ───────────────────────────────────────
            {
              path: 'checkout',
              name: 'checkout',
              beforeEnter: requireAuth,
              component: () => import('@/features/checkout/pages/CheckoutPage.vue'),
            },
            {
              path: 'order-confirmation/:id',
              name: 'order-confirmation',
              beforeEnter: requireAuth,
              component: () => import('@/features/checkout/pages/OrderConfirmationPage.vue'),
            },
          ],
        },

        // ── Payment Simulation (no layout) ─────────────────────────────────
        {
          path: 'payment/simulate/:provider/:txnId',
          name: 'payment-simulation',
          component: () => import('@/features/checkout/pages/PaymentSimulationPage.vue'),
        },

        // ── Auth Layout ────────────────────────────────────────────────────
        {
          path: '',
          component: AuthLayout,
          children: [
            {
              path: 'login',
              name: 'login',
              beforeEnter: requireGuest,
              component: () => import('@/features/auth/pages/LoginPage.vue'),
            },
            {
              path: 'register',
              name: 'register',
              beforeEnter: requireGuest,
              component: () => import('@/features/auth/pages/RegisterPage.vue'),
            },
            {
              path: 'forgot-password',
              name: 'forgot-password',
              beforeEnter: requireGuest,
              component: () => import('@/features/auth/pages/ForgotPasswordPage.vue'),
            },
            {
              path: 'reset-password',
              name: 'reset-password',
              component: () => import('@/features/auth/pages/ResetPasswordPage.vue'),
            },
          ],
        },

        // ── Account Layout (customer) ──────────────────────────────────────
        {
          path: 'account',
          component: AccountLayout,
          beforeEnter: requireAuth,
          children: [
            {
              path: 'orders',
              name: 'orders',
              component: () => import('@/features/orders/pages/OrdersPage.vue'),
            },
            {
              path: 'orders/:id',
              name: 'order-detail',
              component: () => import('@/features/orders/pages/OrderDetailPage.vue'),
            },
            {
              path: 'orders/:id/tracking',
              name: 'order-tracking',
              component: () => import('@/features/orders/pages/OrderTrackingPage.vue'),
            },
            {
              path: 'favorites',
              name: 'favorites',
              component: () => import('@/features/favorites/pages/FavoritesPage.vue'),
            },
            {
              path: 'addresses',
              name: 'addresses',
              component: () => import('@/features/addresses/pages/AddressesPage.vue'),
            },
            {
              path: 'profile',
              name: 'profile',
              component: () => import('@/features/profile/pages/ProfilePage.vue'),
            },
            {
              path: 'reviews',
              name: 'reviews',
              component: () => import('@/features/reviews/pages/MyReviewsPage.vue'),
            },
            {
              path: 'notifications',
              name: 'notifications',
              component: () => import('@/features/notifications/pages/NotificationsPage.vue'),
            },
            {
              path: 'promotions',
              name: 'promotions',
              component: () => import('@/features/promotions/pages/PromotionsPage.vue'),
            },
          ],
        },

        // ── Restaurant Layout ──────────────────────────────────────────────
        {
          path: 'restaurant',
          component: RestaurantLayout,
          beforeEnter: requireRole(['restaurant_owner', 'restaurant_staff']),
          children: [
            {
              path: 'dashboard',
              name: 'restaurant-dashboard',
              component: () =>
                import('@/features/restaurant-dashboard/pages/RestaurantDashboardPage.vue'),
            },
            {
              path: 'menu',
              name: 'restaurant-menu',
              component: () =>
                import('@/features/restaurant-dashboard/pages/MenuManagementPage.vue'),
            },
            {
              path: 'orders',
              name: 'restaurant-orders',
              component: () =>
                import('@/features/restaurant-dashboard/pages/RestaurantOrdersPage.vue'),
            },
            {
              path: 'settings',
              name: 'restaurant-settings',
              component: () =>
                import('@/features/restaurant-dashboard/pages/RestaurantSettingsPage.vue'),
            },
            {
              path: 'promotions',
              name: 'restaurant-promotions',
              component: () =>
                import('@/features/restaurant-dashboard/pages/RestaurantPromotionsPage.vue'),
            },
            {
              path: 'reviews',
              name: 'restaurant-reviews',
              component: () =>
                import('@/features/restaurant-dashboard/pages/RestaurantReviewsPage.vue'),
            },
            {
              path: 'analytics',
              name: 'restaurant-analytics',
              component: () =>
                import('@/features/restaurant-dashboard/pages/RestaurantAnalyticsPage.vue'),
            },
          ],
        },

        // ── Courier Layout ─────────────────────────────────────────────────
        {
          path: 'courier',
          component: CourierLayout,
          beforeEnter: requireRole(['courier']),
          children: [
            {
              path: 'dashboard',
              name: 'courier-dashboard',
              component: () =>
                import('@/features/courier-dashboard/pages/CourierDashboardPage.vue'),
            },
            {
              path: 'active',
              name: 'courier-active',
              component: () =>
                import('@/features/courier-dashboard/pages/ActiveDeliveryPage.vue'),
            },
            {
              path: 'history',
              name: 'courier-history',
              component: () =>
                import('@/features/courier-dashboard/pages/DeliveryHistoryPage.vue'),
            },
          ],
        },

        // ── 404 ──────────────────────────────────────────────────────────
        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/shared/components/NotFoundPage.vue'),
        },
      ],
    },
  ],
});

// Global navigation guard — update locale on every navigation
router.beforeEach(async (to, _from, next) => {
  const locale = (to.params.locale as string) || 'en';

  // Load locale messages if needed (lazy for non-EN locales)
  await loadLocaleMessages(locale);

  // Update i18n locale and html lang attribute
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
  localStorage.setItem('just_eat_lang', locale);

  next();
});

export default router;
