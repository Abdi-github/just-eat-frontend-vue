<template>
  <aside class="w-56 bg-secondary text-white flex flex-col min-h-0 shrink-0">
    <div class="p-4 border-b border-white/10">
      <p class="text-xs text-gray-400 uppercase tracking-wide">Courier Dashboard</p>
    </div>
    <nav class="flex-1 p-3 space-y-1">
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
  { name: 'courier-dashboard', icon: 'pi pi-chart-bar', label: 'courierDashboard.nav.dashboard' },
  { name: 'courier-active', icon: 'pi pi-map', label: 'courierDashboard.nav.active' },
  { name: 'courier-history', icon: 'pi pi-history', label: 'courierDashboard.nav.history' },
];
</script>
