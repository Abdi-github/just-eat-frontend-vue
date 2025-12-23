<template>
  <RouterLink
    :to="{ name: 'restaurant-detail', params: { locale, slug: restaurant.slug } }"
    class="group block overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-all duration-200 hover:shadow-lg no-underline"
    :data-testid="`restaurant-card-${restaurantId}`"
  >
    <!-- Cover image -->
    <div class="relative aspect-[16/10] overflow-hidden bg-muted">
      <img
        v-if="restaurant.cover_image_url"
        :src="restaurant.cover_image_url"
        :alt="displayName"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-border">
        <i class="pi pi-building text-4xl text-gray-300" />
      </div>

      <!-- Badges overlay (top-left) -->
      <div class="absolute left-2 top-2 flex flex-wrap gap-1.5">
        <span
          v-if="restaurant.is_featured"
          class="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
        >
          <i class="pi pi-star-fill text-[10px]" />
          {{ t('restaurants.card.featured') }}
        </span>
        <span
          v-if="!restaurant.is_active"
          class="inline-flex bg-error text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
        >
          {{ t('restaurants.card.closed') }}
        </span>
      </div>

      <!-- Delivery fee badge (bottom-right) -->
      <div class="absolute bottom-2 right-2">
        <span
          v-if="isFreeDelivery"
          class="inline-flex bg-success text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
        >
          {{ t('restaurants.card.freeDelivery') }}
        </span>
        <span
          v-else
          class="inline-flex bg-white/90 text-secondary text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
        >
          {{ formatPrice(deliveryFee) }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <!-- Restaurant name -->
      <h3 class="line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {{ displayName }}
      </h3>

      <!-- Cuisines -->
      <p v-if="cuisineNames.length" class="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
        {{ cuisineNames.join(', ') }}
      </p>

      <!-- Meta row: rating, delivery time, min order -->
      <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <!-- Rating -->
        <span v-if="restaurant.average_rating" class="flex items-center gap-1 font-medium text-foreground">
          <i class="pi pi-star-fill text-warning text-xs" />
          {{ formatRating(restaurant.average_rating) }}
          <span v-if="reviewCount" class="font-normal text-muted-foreground">({{ reviewCount }})</span>
        </span>

        <!-- Delivery time -->
        <span v-if="deliveryTimeLabel" class="flex items-center gap-1">
          <i class="pi pi-clock text-xs" />
          {{ deliveryTimeLabel }}
        </span>

        <!-- Min order -->
        <span v-if="minimumOrder > 0" class="flex items-center gap-1">
          <i class="pi pi-shopping-cart text-xs" />
          {{ t('restaurants.card.minOrder', { amount: formatPrice(minimumOrder) }) }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalizedName } from '@/shared/composables/useLocalizedName';
import { formatPrice, formatRating, formatDeliveryTime } from '@/shared/utils/formatters';

interface Restaurant {
  _id?: string;
  id?: string | number;
  name: string | Record<string, string>;
  slug: string;
  cover_image_url?: string;
  // Node API format
  cuisine_types?: string[];
  review_count?: number;
  delivery_time_min?: number;
  delivery_time_max?: number;
  is_free_delivery?: boolean;
  // Laravel API format
  cuisines?: Array<{ id: number | string; name: string }>;
  total_reviews?: number;
  estimated_delivery_time?: number | string | null;
  // Shared fields
  average_rating?: number | string;
  delivery_fee?: number | string;
  minimum_order?: number | string;
  is_featured?: boolean;
  is_active?: boolean;
}

const props = defineProps<{
  restaurant: Restaurant;
  locale: string;
}>();

const { t } = useI18n();
const { getLocalizedName } = useLocalizedName();

const displayName = computed(() => {
  if (typeof props.restaurant.name === 'string') return props.restaurant.name;
  return getLocalizedName(props.restaurant.name);
});

// Normalize data across Node API and Laravel API formats
const restaurantId = computed(() => props.restaurant._id ?? String(props.restaurant.id));
const cuisineNames = computed(() => {
  if (props.restaurant.cuisine_types?.length) return props.restaurant.cuisine_types;
  if (props.restaurant.cuisines?.length) return props.restaurant.cuisines.map(c => c.name);
  return [];
});
const reviewCount = computed(() => props.restaurant.review_count ?? props.restaurant.total_reviews);
const deliveryFee = computed(() => Number(props.restaurant.delivery_fee ?? 0));
const isFreeDelivery = computed(() => props.restaurant.is_free_delivery || deliveryFee.value === 0);
const minimumOrder = computed(() => Number(props.restaurant.minimum_order ?? 0));
const deliveryTimeLabel = computed(() => {
  if (props.restaurant.delivery_time_min && props.restaurant.delivery_time_max) {
    return formatDeliveryTime(props.restaurant.delivery_time_min, props.restaurant.delivery_time_max);
  }
  if (props.restaurant.estimated_delivery_time) {
    return `${props.restaurant.estimated_delivery_time} min`;
  }
  return null;
});
</script>
