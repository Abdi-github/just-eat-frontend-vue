<template>
  <aside class="space-y-1">
    <RouterLink
      v-for="item in navItems"
      :key="item.name"
      :to="{ name: item.name, params: { locale } }"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors no-underline"
      :class="route.name === item.name
        ? 'bg-primary/10 text-primary'
        : 'text-secondary hover:bg-muted hover:text-primary'"
    >
      <i :class="`${item.icon} text-base w-5`" />
      {{ t(item.label) }}
    </RouterLink>
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
  { name: 'orders', icon: 'pi pi-receipt', label: 'common.nav.myOrders' },
  { name: 'favorites', icon: 'pi pi-heart', label: 'common.nav.favorites' },
  { name: 'addresses', icon: 'pi pi-map-marker', label: 'common.nav.addresses' },
  { name: 'profile', icon: 'pi pi-user', label: 'common.nav.profile' },
  { name: 'notifications', icon: 'pi pi-bell', label: 'common.nav.notifications' },
  { name: 'reviews', icon: 'pi pi-star', label: 'common.nav.reviews' },
  { name: 'promotions', icon: 'pi pi-tag', label: 'common.nav.promotions' },
];
</script>

