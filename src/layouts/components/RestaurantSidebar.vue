<template>
  <aside class="w-56 bg-secondary text-white flex flex-col min-h-0 shrink-0">
    <div class="p-4 border-b border-white/10">
      <p class="text-xs text-gray-400 uppercase tracking-wide">{{ t('restaurantDashboard.nav.title') }}</p>
    </div>
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name, params: { locale } }"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline"
        :class="route.name === item.name
          ? 'bg-primary text-white'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'"
      >
        <i :class="`${item.icon} text-base w-5`" />
        {{ t(item.label) }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'en');

const navItems = [
  { name: 'restaurant-dashboard', icon: 'pi pi-chart-bar', label: 'restaurantDashboard.nav.dashboard' },
  { name: 'restaurant-menu', icon: 'pi pi-list', label: 'restaurantDashboard.nav.menu' },
  { name: 'restaurant-orders', icon: 'pi pi-receipt', label: 'restaurantDashboard.nav.orders' },
  { name: 'restaurant-promotions', icon: 'pi pi-tag', label: 'restaurantDashboard.nav.promotions' },
  { name: 'restaurant-reviews', icon: 'pi pi-star', label: 'restaurantDashboard.nav.reviews' },
  { name: 'restaurant-analytics', icon: 'pi pi-chart-line', label: 'restaurantDashboard.nav.analytics' },
  { name: 'restaurant-settings', icon: 'pi pi-cog', label: 'restaurantDashboard.nav.settings' },
];
</script>
