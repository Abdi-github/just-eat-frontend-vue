import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface SearchFilters {
  query: string;
  cuisineId: string | null;
  minRating: number | null;
  maxDeliveryTime: number | null;
  freeDelivery: boolean | null;
  sort: string;
  page: number;
  limit: number;
}

export const useSearchStore = defineStore('search', () => {
  const query = ref('');
  const cuisineId = ref<string | null>(null);
  const minRating = ref<number | null>(null);
  const maxDeliveryTime = ref<number | null>(null);
  const freeDelivery = ref<boolean | null>(null);
  const sort = ref('-rating');
  const page = ref(1);
  const limit = ref(20);

  const hasActiveFilters = computed(
    () =>
      !!cuisineId.value ||
      !!minRating.value ||
      !!maxDeliveryTime.value ||
      !!freeDelivery.value,
  );

  const queryParams = computed(() => ({
    ...(query.value ? { search: query.value } : {}),
    ...(cuisineId.value ? { cuisine_id: cuisineId.value } : {}),
    ...(minRating.value ? { min_rating: minRating.value } : {}),
    ...(maxDeliveryTime.value ? { max_delivery_time: maxDeliveryTime.value } : {}),
    ...(freeDelivery.value ? { free_delivery: true } : {}),
    sort: sort.value,
    page: page.value,
    limit: limit.value,
  }));

  function setFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    if (key === 'query') query.value = value as string;
    else if (key === 'cuisineId') cuisineId.value = value as string | null;
    else if (key === 'minRating') minRating.value = value as number | null;
    else if (key === 'maxDeliveryTime') maxDeliveryTime.value = value as number | null;
    else if (key === 'freeDelivery') freeDelivery.value = value as boolean | null;
    else if (key === 'sort') sort.value = value as string;
    else if (key === 'page') page.value = value as number;
    else if (key === 'limit') limit.value = value as number;
    // Reset to page 1 on filter change (not pagination)
    if (key !== 'page') page.value = 1;
  }

  function resetFilters() {
    query.value = '';
    cuisineId.value = null;
    minRating.value = null;
    maxDeliveryTime.value = null;
    freeDelivery.value = null;
    sort.value = '-rating';
    page.value = 1;
  }

  function setPage(n: number) {
    page.value = n;
  }

  function updateFromRoute(routeQuery: Record<string, string>) {
    if (routeQuery.q) query.value = routeQuery.q;
    if (routeQuery.cuisine_id) cuisineId.value = routeQuery.cuisine_id;
    if (routeQuery.min_rating) minRating.value = Number(routeQuery.min_rating);
    if (routeQuery.max_delivery_time) maxDeliveryTime.value = Number(routeQuery.max_delivery_time);
    if (routeQuery.free_delivery) freeDelivery.value = routeQuery.free_delivery === 'true';
    if (routeQuery.sort) sort.value = routeQuery.sort;
    if (routeQuery.page) page.value = Number(routeQuery.page);
  }

  return {
    query,
    cuisineId,
    minRating,
    maxDeliveryTime,
    freeDelivery,
    sort,
    page,
    limit,
    hasActiveFilters,
    queryParams,
    setFilter,
    resetFilters,
    setPage,
    updateFromRoute,
  };
});
