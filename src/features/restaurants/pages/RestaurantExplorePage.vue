<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header with view switcher -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground sm:text-3xl">{{ t('restaurants.exploreSection.title') }}</h1>
        <p class="mt-1 text-muted-foreground">{{ t('restaurants.exploreSection.subtitle') }}</p>
      </div>

      <!-- View mode switcher -->
      <div class="flex items-center rounded-lg border border-border bg-muted p-1 text-sm w-auto self-start sm:self-auto">
        <RouterLink
          :to="{ name: 'restaurants', params: { locale } }"
          class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <i class="pi pi-list text-sm" />
          {{ t('restaurants.exploreSection.paginatedView') }}
        </RouterLink>
        <span class="flex items-center gap-1.5 rounded-md px-3 py-1.5 bg-white text-foreground font-medium shadow-sm">
          <i class="pi pi-th-large text-sm" />
          {{ t('restaurants.exploreSection.infiniteView') }}
        </span>
      </div>
    </div>

    <!-- Filters (same as list page) -->
    <div class="mb-6 rounded-xl border border-border bg-white p-4 shadow-sm space-y-3">
      <!-- Row 1: Search + Sort -->
      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input
            v-model="filters.search"
            type="text"
            :placeholder="t('restaurants.filters.searchPlaceholder')"
            class="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            @input="resetAndReload"
          />
        </div>
        <select
          v-model="filters.sort"
          class="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary sm:w-48"
          @change="resetAndReload"
        >
          <option value="-rating">{{ t('restaurants.list.sortOptions.rating') }}</option>
          <option value="-total_reviews">{{ t('restaurants.list.sortOptions.reviewCount') }}</option>
          <option value="delivery_fee">{{ t('restaurants.list.sortOptions.deliveryFee') }}</option>
          <option value="name">{{ t('restaurants.list.sortOptions.name') }}</option>
          <option value="-created_at">{{ t('restaurants.list.sortOptions.newest') }}</option>
        </select>
      </div>

      <!-- Row 2: Cuisine + Rating + Fee -->
      <div class="flex flex-wrap gap-3">
        <select
          v-model="filters.cuisine"
          class="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @change="resetAndReload"
        >
          <option value="">{{ t('restaurants.filters.allCuisines') }}</option>
          <option v-for="c in cuisines" :key="String(c._id ?? c.id ?? '')" :value="String(c._id ?? c.id ?? '')">
            {{ c.name }}
          </option>
        </select>

        <select
          v-model="filters.rating"
          class="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @change="resetAndReload"
        >
          <option value="">{{ t('restaurants.filters.anyRating') }}</option>
          <option v-for="r in [3, 3.5, 4, 4.5]" :key="r" :value="String(r)">
            {{ t('restaurants.filters.ratingAbove', { rating: r }) }}
          </option>
        </select>

        <select
          v-model="filters.fee"
          class="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          @change="resetAndReload"
        >
          <option value="">{{ t('restaurants.filters.anyFee') }}</option>
          <option value="0">{{ t('restaurants.filters.freeDelivery') }}</option>
          <option v-for="fee in [3, 5, 8, 10]" :key="fee" :value="String(fee)">
            {{ t('restaurants.filters.maxFee', { amount: fee }) }}
          </option>
        </select>

        <button
          v-if="hasActiveFilters"
          class="rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
          @click="clearFilters"
        >
          {{ t('restaurants.list.clearFilters') }}
        </button>
      </div>
    </div>

    <!-- Results count -->
    <p v-if="!isLoading && total > 0" class="mb-4 text-sm text-muted-foreground">
      {{ t('restaurants.exploreSection.showing', { loaded: allRestaurants.length, total }) }}
    </p>

    <!-- Loading skeleton (first load) -->
    <div v-if="isLoading && allRestaurants.length === 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="i in 12" :key="i" class="animate-pulse rounded-xl bg-muted h-60" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!isLoading && allRestaurants.length === 0" class="flex flex-col items-center justify-center py-16">
      <i class="pi pi-building text-[4rem] text-muted-foreground/40" />
      <h2 class="mt-4 text-xl font-semibold text-muted-foreground">{{ t('restaurants.list.noResults') }}</h2>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('restaurants.list.noResultsDescription') }}</p>
      <button class="mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors" @click="clearFilters">
        {{ t('restaurants.list.clearFilters') }}
      </button>
    </div>

    <!-- Restaurant grid -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <RestaurantCard v-for="restaurant in allRestaurants" :key="restaurant.id" :restaurant="restaurant" />
    </div>

    <!-- Load More button -->
    <div v-if="hasMore && !isLoading" class="mt-8 flex flex-col items-center gap-2">
      <button
        class="min-w-[200px] rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
        :disabled="isFetchingMore"
        @click="loadMore"
      >
        <span v-if="isFetchingMore" class="flex items-center gap-2">
          <i class="pi pi-spin pi-spinner" />
          {{ t('restaurants.exploreSection.loading') }}
        </span>
        <span v-else>{{ t('restaurants.exploreSection.loadMore') }}</span>
      </button>
      <p class="text-xs text-muted-foreground">
        {{ t('restaurants.exploreSection.loadMoreHint', { remaining: total - allRestaurants.length }) }}
      </p>
    </div>

    <!-- End of results -->
    <p v-if="!hasMore && !isLoading && allRestaurants.length > 0" class="mt-8 text-center text-sm text-muted-foreground">
      {{ t('restaurants.exploreSection.endOfResults') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/app/axios';
import RestaurantCard from '@/features/restaurants/components/RestaurantCard.vue';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'en');

const PAGE_SIZE = 12;

const filters = ref({
  search: '',
  sort: '-rating',
  cuisine: '',
  rating: '',
  fee: '',
});
const currentPage = ref(1);
const allRestaurants = ref<any[]>([]);
const isFetchingMore = ref(false);

const hasActiveFilters = computed(() =>
  !!filters.value.search || !!filters.value.cuisine || !!filters.value.rating || !!filters.value.fee,
);

function resetAndReload() {
  currentPage.value = 1;
  allRestaurants.value = [];
}

function clearFilters() {
  filters.value = { search: '', sort: '-rating', cuisine: '', rating: '', fee: '' };
  resetAndReload();
}

async function loadMore() {
  isFetchingMore.value = true;
  currentPage.value++;
  isFetchingMore.value = false;
}

// Build query params
const queryParams = computed(() => ({
  page: currentPage.value,
  limit: PAGE_SIZE,
  sort: filters.value.sort,
  search: filters.value.search || undefined,
  cuisine_id: filters.value.cuisine || undefined,
  min_rating: filters.value.rating || undefined,
  max_delivery_fee: filters.value.fee || undefined,
  is_active: true,
}));

const { data: restaurantData, isLoading, isFetching } = useQuery({
  queryKey: ['explore-restaurants', queryParams],
  queryFn: async () => {
    const { data } = await api.get('/public/restaurants', { params: queryParams.value });
    const list = Array.isArray(data.data) ? data.data : (data.data?.restaurants ?? []);
    const total = data.pagination?.total ?? data.data?.total ?? 0;
    return { restaurants: list, total };
  },
});

const total = computed(() => restaurantData.value?.total ?? 0);
const hasMore = computed(() => allRestaurants.value.length < total.value);

// Accumulate restaurants when new data arrives
watch(restaurantData, (newData) => {
  if (!newData) return;
  if (currentPage.value === 1) {
    allRestaurants.value = newData.restaurants;
  } else {
    allRestaurants.value = [...allRestaurants.value, ...newData.restaurants];
  }
}, { immediate: true });

// Cuisines for filter
const { data: cuisinesData } = useQuery({
  queryKey: ['cuisines-filter'],
  queryFn: async () => {
    const { data } = await api.get('/public/cuisines', { params: { limit: 50 } });
    return data.data ?? [];
  },
  staleTime: 5 * 60 * 1000,
});
const cuisines = computed(() => cuisinesData.value ?? []);
</script>
