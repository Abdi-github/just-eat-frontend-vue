<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-secondary">{{ t('orders.list.title') }}</h1>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="rounded-xl border border-border p-4 animate-pulse">
        <div class="h-4 bg-muted rounded w-1/3 mb-2" />
        <div class="h-3 bg-muted rounded w-1/4" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!isLoading && orders.length === 0" class="text-center py-12">
      <i class="pi pi-receipt text-5xl text-gray-200" />
      <p class="text-secondary font-medium mt-4">{{ t('orders.list.empty') }}</p>
      <p class="text-gray-400 text-sm mt-1">{{ t('orders.list.emptyHint') }}</p>
      <Button
        :label="t('orders.list.orderNow')"
        class="mt-4 !bg-primary !border-primary"
        @click="router.push({ name: 'restaurants', params: { locale } })"
      />
    </div>

    <!-- Order list -->
    <div v-else class="space-y-3">
      <div
        v-for="order in orders"
        :key="order._id"
        class="bg-white rounded-xl border border-border p-4 hover:shadow-sm transition-shadow cursor-pointer"
        @click="router.push({ name: 'order-detail', params: { locale, id: order._id } })"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-secondary">{{ order.restaurant?.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ formatDate(order.created_at) }} · {{ order.items?.length }} {{ t('orders.detail.items') }}
            </p>
          </div>
          <Tag :severity="getStatusSeverity(order.status)" :value="t(`orders.status.${order.status}`)" />
        </div>

        <div class="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <p class="font-semibold text-secondary">{{ formatPrice(order.total_amount) }}</p>
          <div class="flex gap-2">
            <Button
              v-if="['PLACED','ACCEPTED','PREPARING','READY','PICKED_UP','IN_TRANSIT'].includes(order.status)"
              :label="t('orders.detail.trackOrder')"
              outlined
              size="small"
              @click.stop="router.push({ name: 'order-tracking', params: { locale, id: order._id } })"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Paginator
      v-if="total > pageSize"
      :rows="pageSize"
      :total-records="total"
      :first="(currentPage - 1) * pageSize"
      class="mt-6"
      @page="(e) => { currentPage = e.page + 1; }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import type { OrderStatus } from '@/types/api';
import { api } from '@/app/axios';
import { ORDER_STATUS_SEVERITY, DEFAULT_PAGE_SIZE } from '@/shared/utils/constants';
import { formatPrice, formatDate } from '@/shared/utils/formatters';

function getStatusSeverity(status: string) {
  return ORDER_STATUS_SEVERITY[status as OrderStatus];
}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const locale = computed(() => (route.params.locale as string) || 'en');
const currentPage = ref(1);
const pageSize = DEFAULT_PAGE_SIZE;

const { data, isLoading } = useQuery({
  queryKey: ['my-orders', currentPage],
  queryFn: async () => {
    const { data } = await api.get('/account/orders', {
      params: { page: currentPage.value, limit: pageSize },
    });
    return data.data;
  },
});

const orders = computed(() => data.value?.orders || []);
const total = computed(() => data.value?.total || 0);
</script>

