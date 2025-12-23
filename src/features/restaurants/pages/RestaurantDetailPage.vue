<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Back link -->
    <RouterLink
      :to="{ name: 'restaurants', params: { locale } }"
      class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
    >
      <i class="pi pi-arrow-left text-xs" />
      {{ t('restaurants.detail.backToRestaurants') }}
    </RouterLink>

    <!-- Loading skeleton -->
    <div v-if="isLoadingRestaurant" class="animate-pulse space-y-4">
      <div class="h-64 rounded-xl bg-muted" />
      <div class="h-5 w-48 rounded bg-muted" />
      <div class="h-4 w-32 rounded bg-muted" />
    </div>

    <!-- Error state -->
    <div v-else-if="!restaurant" class="flex flex-col items-center justify-center py-16 text-center">
      <i class="pi pi-building text-[4rem] text-muted-foreground/40" />
      <h2 class="mt-4 text-xl font-semibold">Restaurant not found</h2>
      <p class="mt-1 text-muted-foreground">The restaurant you're looking for doesn't exist or has been removed.</p>
      <RouterLink
        :to="{ name: 'restaurants', params: { locale } }"
        class="mt-4 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
      >
        {{ t('restaurants.detail.backToRestaurants') }}
      </RouterLink>
    </div>

    <template v-else>
      <!-- Restaurant Info Header -->
      <div class="mb-6">
        <!-- Cover image -->
        <div class="relative h-48 overflow-hidden rounded-xl bg-muted sm:h-64 md:h-72">
          <img
            :src="restaurant.cover_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'"
            :alt="restaurant.name"
            class="h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <!-- Name overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div class="flex items-end gap-4">
              <img
                v-if="restaurant.logo_url"
                :src="restaurant.logo_url"
                :alt="`${restaurant.name} logo`"
                class="h-16 w-16 rounded-lg border-2 border-white bg-white object-contain shadow-md sm:h-20 sm:w-20"
              />
              <div class="min-w-0 flex-1">
                <h1 class="text-2xl font-bold text-white sm:text-3xl">{{ restaurant.name }}</h1>
                <p v-if="cuisineNames" class="mt-0.5 text-sm text-white/80">{{ cuisineNames }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Info bar -->
        <div class="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div v-if="Number(restaurant.total_reviews) > 0" class="flex items-center gap-1.5">
            <div class="flex items-center gap-0.5 rounded-md bg-primary/10 px-2 py-1">
              <i class="pi pi-star-fill text-primary text-sm" />
              <span class="font-semibold text-primary">{{ formatRating(restaurant.average_rating) }}</span>
            </div>
            <span class="text-muted-foreground">({{ restaurant.total_reviews }})</span>
          </div>

          <div v-if="restaurant.estimated_delivery_time" class="flex items-center gap-1 text-muted-foreground">
            <i class="pi pi-clock text-sm" />
            <span>{{ restaurant.estimated_delivery_time }} min</span>
          </div>

          <div class="flex items-center gap-1 text-muted-foreground">
            <i class="pi pi-truck text-sm" />
            <span>{{ isFreeDelivery ? t('restaurants.detail.freeDelivery') : formatPrice(restaurant.delivery_fee) }}</span>
          </div>

          <div v-if="restaurant.minimum_order && Number(restaurant.minimum_order) > 0" class="flex items-center gap-1 text-muted-foreground">
            <i class="pi pi-shopping-bag text-sm" />
            <span>{{ t('restaurants.detail.minimumOrder') }}: {{ formatPrice(Number(restaurant.minimum_order)) }}</span>
          </div>

          <!-- Order type badges -->
          <div class="flex gap-1.5">
            <span v-if="restaurant.accepts_delivery" class="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {{ t('restaurants.detail.supportsDelivery') }}
            </span>
            <span v-if="restaurant.accepts_pickup" class="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {{ t('restaurants.detail.supportsPickup') }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p v-if="restaurant.description" class="mt-3 text-sm text-muted-foreground">{{ restaurant.description }}</p>

        <!-- Contact row -->
        <div class="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div v-if="restaurant.address?.city?.name" class="flex items-center gap-1.5">
            <i class="pi pi-map-marker text-sm" />
            <span>{{ restaurant.address.street }}, {{ restaurant.address.city.name }}</span>
          </div>
          <a v-if="restaurant.phone" :href="`tel:${restaurant.phone}`" class="flex items-center gap-1.5 hover:text-primary">
            <i class="pi pi-phone text-sm" />
            <span>{{ restaurant.phone }}</span>
          </a>
          <a v-if="restaurant.email" :href="`mailto:${restaurant.email}`" class="flex items-center gap-1.5 hover:text-primary">
            <i class="pi pi-envelope text-sm" />
            <span>{{ restaurant.email }}</span>
          </a>
        </div>
      </div>

      <div class="border-t border-border my-6" />

      <!-- Tabs: Menu / Reviews -->
      <div class="flex flex-col gap-8 lg:flex-row">
        <!-- Main content -->
        <div class="min-w-0 flex-1">
          <!-- Tab nav -->
          <div class="flex gap-2 border-b border-border mb-6">
            <button
              :class="['px-4 py-2 text-sm font-medium border-b-2 transition-colors', activeTab === 'menu' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']"
              @click="activeTab = 'menu'"
            >
              {{ t('restaurants.detail.menu') }}
            </button>
            <button
              :class="['px-4 py-2 text-sm font-medium border-b-2 transition-colors', activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']"
              @click="activeTab = 'reviews'"
            >
              {{ t('restaurants.detail.reviews') }}
              <span v-if="Number(restaurant.total_reviews) > 0" class="ml-1 text-xs text-muted-foreground">({{ restaurant.total_reviews }})</span>
            </button>
          </div>

          <!-- Menu tab -->
          <div v-if="activeTab === 'menu'">
            <div v-if="isLoadingMenu" class="space-y-4">
              <div v-for="i in 6" :key="i" class="h-24 rounded-lg bg-muted animate-pulse" />
            </div>
            <div v-else-if="!menuCategories.length" class="py-12 text-center">
              <i class="pi pi-building text-[3rem] text-muted-foreground/40" />
              <h3 class="mt-3 text-lg font-semibold text-muted-foreground">No menu available</h3>
            </div>
            <div v-else>
              <!-- Category scroll nav -->
              <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
                <button
                  v-for="cat in menuCategories"
                  :key="cat.id"
                  :class="['shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors', activeCategoryId === String(cat.id) ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80']"
                  @click="scrollToCategory(String(cat.id))"
                >
                  {{ cat.name }}
                  <span class="ml-1 text-xs opacity-70">({{ cat.items?.length ?? 0 }})</span>
                </button>
              </div>

              <!-- Category sections -->
              <div class="space-y-8">
                <div
                  v-for="cat in menuCategories"
                  :key="cat.id"
                  :ref="(el) => setCategoryRef(String(cat.id), el as HTMLElement | null)"
                >
                  <h3 class="mb-3 text-lg font-bold">{{ cat.name }}</h3>
                  <div class="space-y-2">
                    <div
                      v-for="item in cat.items"
                      :key="item.id"
                      class="flex items-start gap-4 rounded-xl border border-border p-4 hover:shadow-sm transition-shadow cursor-pointer"
                      @click="selectItem(item)"
                    >
                      <div class="min-w-0 flex-1">
                        <p class="font-medium text-foreground">{{ item.name }}</p>
                        <p v-if="item.description" class="mt-0.5 text-sm text-muted-foreground line-clamp-2">{{ item.description }}</p>
                        <p class="mt-2 font-semibold text-foreground">{{ formatPrice(Number(item.price)) }}</p>
                      </div>
                      <img
                        v-if="item.image_url"
                        :src="item.image_url"
                        :alt="item.name"
                        class="h-20 w-24 shrink-0 rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews tab -->
          <div v-if="activeTab === 'reviews'">
            <div v-if="isLoadingReviews" class="space-y-4">
              <div v-for="i in 4" :key="i" class="h-24 rounded-lg bg-muted animate-pulse" />
            </div>
            <div v-else-if="!reviews.length" class="py-12 text-center">
              <i class="pi pi-comments text-[3rem] text-muted-foreground/40" />
              <h3 class="mt-3 text-lg font-semibold text-muted-foreground">No reviews yet</h3>
            </div>
            <div v-else class="space-y-4">
              <div v-for="review in reviews" :key="review.id" class="rounded-xl border border-border p-4">
                <div class="flex items-start gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {{ getInitials(review.user?.first_name, review.user?.last_name) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-foreground">{{ review.user?.first_name }} {{ review.user?.last_name }}</span>
                      <div class="flex items-center gap-0.5">
                        <i v-for="s in 5" :key="s" :class="['pi pi-star-fill text-xs', s <= review.rating ? 'text-warning' : 'text-muted']" />
                      </div>
                    </div>
                    <p v-if="review.comment" class="mt-1 text-sm text-muted-foreground">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery info sidebar -->
        <div class="hidden w-full shrink-0 space-y-4 lg:block lg:w-80">
          <div class="rounded-xl border border-border p-4 space-y-3">
            <h3 class="font-semibold text-foreground">Delivery info</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ t('restaurants.detail.deliveryFee') }}</span>
                <span class="font-medium">{{ isFreeDelivery ? t('restaurants.card.freeDelivery') : formatPrice(restaurant.delivery_fee) }}</span>
              </div>
              <div v-if="restaurant.minimum_order && Number(restaurant.minimum_order) > 0" class="flex justify-between">
                <span class="text-muted-foreground">{{ t('restaurants.detail.minimumOrder') }}</span>
                <span class="font-medium">{{ formatPrice(Number(restaurant.minimum_order)) }}</span>
              </div>
              <div v-if="restaurant.estimated_delivery_time" class="flex justify-between">
                <span class="text-muted-foreground">{{ t('restaurants.detail.estimatedTime') }}</span>
                <span class="font-medium">{{ restaurant.estimated_delivery_time }} min</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Delivery</span>
                <span class="font-medium">{{ restaurant.accepts_delivery ? 'Available' : 'Not available' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Pickup</span>
                <span class="font-medium">{{ restaurant.accepts_pickup ? 'Available' : 'Not available' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/app/axios';
import { formatPrice, formatRating, getInitials } from '@/shared/utils/formatters';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'en');
const slug = computed(() => route.params.slug as string);

const activeTab = ref('menu');
const activeCategoryId = ref<string | null>(null);
const categoryRefs: Record<string, HTMLElement | null> = {};

function setCategoryRef(id: string, el: HTMLElement | null) {
  categoryRefs[id] = el;
}

function scrollToCategory(id: string) {
  activeCategoryId.value = id;
  categoryRefs[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectItem(item: MenuItem) {
  // TODO: open cart/dialog
  console.log('Selected item:', item.name);
}

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  image_url?: string;
  is_available?: boolean;
}

interface MenuCategory {
  id: number;
  name: string;
  items?: MenuItem[];
}

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  is_active?: boolean;
  average_rating?: string | number;
  total_reviews?: number;
  delivery_fee?: string | number;
  minimum_order?: string | number;
  estimated_delivery_time?: string | number;
  accepts_delivery?: boolean;
  accepts_pickup?: boolean;
  phone?: string;
  email?: string;
  cuisines?: Array<{ id: number; name: string }>;
  address?: {
    street?: string;
    city?: { name: string };
  };
}

interface Review {
  id: number;
  rating: number;
  comment?: string;
  user?: { first_name?: string; last_name?: string };
}

const { data: restaurantData, isLoading: isLoadingRestaurant } = useQuery({
  queryKey: ['restaurant', slug],
  queryFn: async () => {
    const { data } = await api.get(`/public/restaurants/slug/${slug.value}`);
    return data.data as Restaurant;
  },
  enabled: computed(() => !!slug.value),
});

const restaurant = computed(() => restaurantData.value ?? null);

const cuisineNames = computed(() =>
  restaurant.value?.cuisines?.map(c => c.name).join(', ') ?? '',
);

const isFreeDelivery = computed(() => {
  const fee = Number(restaurant.value?.delivery_fee ?? 0);
  return fee === 0;
});

const { data: menuData, isLoading: isLoadingMenu } = useQuery({
  queryKey: ['restaurant-menu', computed(() => restaurant.value?.id)],
  queryFn: async () => {
    const { data } = await api.get(`/public/restaurants/${restaurant.value!.id}/menu`);
    return data.data as MenuCategory[];
  },
  enabled: computed(() => !!restaurant.value?.id),
});
const menuCategories = computed(() => menuData.value ?? []);

// Auto-select the first category when menu loads
watch(menuCategories, (cats) => {
  if (cats.length > 0 && !activeCategoryId.value) {
    activeCategoryId.value = String(cats[0].id);
  }
}, { immediate: true });

const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
  queryKey: ['restaurant-reviews', computed(() => restaurant.value?.id)],
  queryFn: async () => {
    const { data } = await api.get(`/public/reviews/restaurant/${restaurant.value!.id}`, {
      params: { limit: 20, sort: '-created_at' },
    });
    return (data.data ?? []) as Review[];
  },
  enabled: computed(() => !!restaurant.value?.id),
});
const reviews = computed(() => reviewsData.value ?? []);
</script>
