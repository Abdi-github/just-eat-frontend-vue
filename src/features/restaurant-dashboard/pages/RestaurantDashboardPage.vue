<template>
  <div>
    <h1 class="text-xl font-bold text-secondary mb-6">{{ t('restaurantDashboard.title') }}</h1>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.key"
        class="bg-white rounded-xl border border-border p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-400 uppercase tracking-wide font-medium">{{ t(stat.labelKey) }}</span>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="stat.bg">
            <i :class="`${stat.icon} text-sm ${stat.color}`" />
          </div>
        </div>
        <p class="text-2xl font-black text-secondary">
          <template v-if="isLoading">
            <div class="h-7 w-16 bg-muted rounded animate-pulse" />
          </template>
          <template v-else>{{ stat.value }}</template>
        </p>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="bg-white rounded-2xl border border-border p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-secondary">{{ t('restaurantDashboard.recentOrders.title') }}</h2>
        <RouterLink
          :to="{ name: 'restaurant-orders', params: { locale } }"
          class="text-primary text-sm hover:underline no-underline"
        >
          {{ t('restaurantDashboard.recentOrders.viewAll') }} →
        </RouterLink>
      </div>

      <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-400">
        <i class="pi pi-receipt text-3xl text-gray-200 mb-2" />
        <p class="text-sm">{{ t('restaurantDashboard.recentOrders.empty') }}</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div
          v-for="order in recentOrders"
          :key="order._id"
          class="py-3 flex items-center justify-between"
        >
          <div>
            <p class="font-medium text-sm text-secondary">{{ order.customer_name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatRelativeTime(order.created_at) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <Tag :severity="getStatusSeverity(order.status)" :value="t(`orders.status.${order.status}`)" />
            <span class="font-semibold text-sm text-secondary">{{ formatPrice(order.total_amount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import Tag from 'primevue/tag';
import type { OrderStatus } from '@/types/api';
import { api } from '@/app/axios';
import { ORDER_STATUS_SEVERITY } from '@/shared/utils/constants';
import { formatPrice, formatRelativeTime } from '@/shared/utils/formatters';

function getStatusSeverity(status: string) {
  return ORDER_STATUS_SEVERITY[status as OrderStatus];
}

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'en');

const { data, isLoading } = useQuery({
  queryKey: ['restaurant-dashboard'],
  queryFn: async () => {
    const { data } = await api.get('/restaurant/dashboard');
    return data.data;
  },
});

const stats = computed(() => [
  {
    key: 'orders',
    labelKey: 'restaurantDashboard.stats.todayOrders',
    value: data.value?.today_orders ?? 0,
    icon: 'pi pi-receipt',
    bg: 'bg-blue-50',
    color: 'text-blue-500',
  },
  {
    key: 'revenue',
    labelKey: 'restaurantDashboard.stats.todayRevenue',
    value: formatPrice(data.value?.today_revenue ?? 0),
    icon: 'pi pi-dollar',
    bg: 'bg-green-50',
    color: 'text-green-500',
  },
  {
    key: 'rating',
    labelKey: 'restaurantDashboard.stats.rating',
    value: data.value?.average_rating?.toFixed(1) ?? '—',
    icon: 'pi pi-star-fill',
    bg: 'bg-yellow-50',
    color: 'text-yellow-500',
  },
  {
    key: 'active',
    labelKey: 'restaurantDashboard.stats.activeOrders',
    value: data.value?.active_orders ?? 0,
    icon: 'pi pi-spin pi-spinner',
    bg: 'bg-orange-50',
    color: 'text-orange-500',
  },
]);

const recentOrders = computed(() => data.value?.recent_orders || []);
</script>

