<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground sm:text-3xl">{{ t('restaurants.list.title') }}</h1>
      <p class="mt-1 text-muted-foreground">{{ t('restaurants.list.subtitle') }}</p>
    </div>

    <!-- Filters (horizontal, matching React) -->
    <div class="mb-6 space-y-3">
      <!-- Search + Sort row -->
      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input
            v-model="search"
            type="text"
            :placeholder="t('restaurants.filters.searchPlaceholder')"
            class="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            @input="applyFilters"
          />
        </div>
        <Select
          v-model="sortBy"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('restaurants.list.sortBy')"
          class="w-full sm:w-[200px]"
          @change="applyFilters"
        />
      </div>

      <!-- Filter row -->
      <div class="flex flex-wrap gap-3">
        <Select
          v-model="cuisineId"
          :options="cuisineOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('restaurants.filters.cuisine')"
          :loading="isLoadingCuisines"
          class="w-full sm:w-[180px]"
          @change="applyFilters"
        />
        <Select
          v-model="minRating"
          :options="ratingOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('restaurants.filters.rating')"
          class="w-full sm:w-[160px]"
          @change="applyFilters"
        />
        <Select
          v-model="maxDeliveryFee"
          :options="feeOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('restaurants.filters.deliveryFee')"
          class="w-full sm:w-[180px]"
          @change="applyFilters"
        />
        <button
          v-if="hasActiveFilters"
          class="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          @click="resetFilters"
        >
          <i class="pi pi-times text-xs" />
          {{ t('restaurants.list.clearFilters') }}
        </button>
      </div>
    </div>

    <!-- Results count -->
    <p v-if="!isLoading && total > 0" class="mb-4 text-sm text-muted-foreground">
      {{ t('restaurants.list.showing', { count: restaurants.length, total }) }}
    </p>

    <!-- Loading state -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="rounded-xl border border-border overflow-hidden bg-white">
        <div class="aspect-[16/10] bg-muted animate-pulse" />
        <div class="p-4 space-y-2">
          <div class="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div class="h-3 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="restaurants.length === 0" class="flex flex-col items-center justify-center py-16">
      <i class="pi pi-building text-[4rem] text-muted-foreground/40" />
      <h2 class="mt-4 text-xl font-semibold text-muted-foreground">{{ t('restaurants.list.noResults') }}</h2>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('restaurants.list.noResultsDescription') }}</p>
      <button
        class="mt-4 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        @click="resetFilters"
      >
        {{ t('restaurants.list.clearFilters') }}
      </button>
    </div>

    <!-- Restaurant grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant._id"
        :restaurant="restaurant"
        :locale="locale"
      />
    </div>

    <!-- Pagination -->
    <Paginator
      v-if="total > pageSize"
      :rows="pageSize"
      :total-records="total"
      :first="(currentPage - 1) * pageSize"
      class="mt-8"
      @page="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import Select from 'primevue/select';
import Paginator from 'primevue/paginator';
import RestaurantCard from '../components/RestaurantCard.vue';
import { api } from '@/app/axios';
import { DEFAULT_PAGE_SIZE } from '@/shared/utils/constants';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const locale = computed(() => (route.params.locale as string) || 'en');

// Filter state
const search = ref((route.query.search as string) || '');
const sortBy = ref((route.query.sort as string) || '-rating');
const cuisineId = ref((route.query.cuisine as string) || '');
const minRating = ref((route.query.rating as string) || '');
const maxDeliveryFee = ref((route.query.fee as string) || '');
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = DEFAULT_PAGE_SIZE;

const sortOptions = [
  { label: t('restaurants.list.sortOptions.rating'), value: '-rating' },
  { label: t('restaurants.list.sortOptions.reviewCount'), value: '-review_count' },
  { label: t('restaurants.list.sortOptions.deliveryFee'), value: 'delivery_fee' },
  { label: t('restaurants.list.sortOptions.name'), value: 'name' },
  { label: t('restaurants.list.sortOptions.newest'), value: '-created_at' },
];

const ratingOptions = [
  { label: t('restaurants.filters.anyRating'), value: '' },
  { label: t('restaurants.filters.ratingAbove', { rating: '3' }), value: '3' },
  { label: t('restaurants.filters.ratingAbove', { rating: '3.5' }), value: '3.5' },
  { label: t('restaurants.filters.ratingAbove', { rating: '4' }), value: '4' },
  { label: t('restaurants.filters.ratingAbove', { rating: '4.5' }), value: '4.5' },
];

const feeOptions = [
  { label: t('restaurants.filters.anyFee'), value: '' },
  { label: t('restaurants.filters.freeDelivery'), value: '0' },
  { label: t('restaurants.filters.maxFee', { amount: '3' }), value: '3' },
  { label: t('restaurants.filters.maxFee', { amount: '5' }), value: '5' },
  { label: t('restaurants.filters.maxFee', { amount: '8' }), value: '8' },
];

const hasActiveFilters = computed(() => !!(search.value || cuisineId.value || minRating.value || maxDeliveryFee.value));

// Cuisines for filter dropdown
const { data: cuisinesData, isLoading: isLoadingCuisines } = useQuery({
  queryKey: ['cuisinesFilter'],
  queryFn: async () => {
    const { data } = await api.get('/public/cuisines', { params: { limit: 50 } });
    return data.data ?? [];
  },
});
const cuisineOptions = computed(() => [
  { label: t('restaurants.filters.allCuisines'), value: '' },
  ...(cuisinesData.value || []).map((c: { _id?: string; id?: number | string; name: string }) => ({
    label: c.name,
    value: String(c._id ?? c.id ?? ''),
  })),
]);

const queryParams = computed(() => ({
  sort: sortBy.value,
  search: search.value || undefined,
  cuisine_id: cuisineId.value || undefined,
  min_rating: minRating.value || undefined,
  max_delivery_fee: maxDeliveryFee.value || undefined,
  page: currentPage.value,
  limit: pageSize,
}));

const { data, isLoading } = useQuery({
  queryKey: ['restaurants', queryParams],
  queryFn: async () => {
    const { data } = await api.get('/public/restaurants', { params: queryParams.value });
    // Laravel returns { data: [...], pagination: { total } }
    // Node returns { data: { restaurants: [...], total } }
    if (Array.isArray(data.data)) {
      return { restaurants: data.data, total: data.pagination?.total ?? data.data.length };
    }
    return data.data;
  },
});

const restaurants = computed(() => data.value?.restaurants ?? []);
const total = computed(() => data.value?.total ?? 0);

function applyFilters() {
  currentPage.value = 1;
  updateRoute();
}

function resetFilters() {
  search.value = '';
  sortBy.value = '-rating';
  cuisineId.value = '';
  minRating.value = '';
  maxDeliveryFee.value = '';
  currentPage.value = 1;
  updateRoute();
}

function updateRoute() {
  router.replace({
    query: {
      search: search.value || undefined,
      sort: sortBy.value !== '-rating' ? sortBy.value : undefined,
      cuisine: cuisineId.value || undefined,
      rating: minRating.value || undefined,
      fee: maxDeliveryFee.value || undefined,
      page: currentPage.value > 1 ? currentPage.value : undefined,
    },
  });
}

function onPageChange(event: { page: number }) {
  currentPage.value = event.page + 1;
  updateRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

