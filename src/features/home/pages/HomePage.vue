<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover py-16 md:py-24 px-4">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20" />
        <div class="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/15" />
      </div>
      <div class="relative max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-white/90 text-lg md:text-xl mb-8 max-w-xl mx-auto">
          {{ t('home.hero.subtitle') }}
        </p>

        <!-- Delivery / Pickup toggle -->
        <div class="mb-6 inline-flex rounded-full bg-white/20 p-1">
          <button
            :class="orderType === 'delivery' ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/10'"
            class="rounded-full px-6 py-2 text-sm font-medium transition-all"
            @click="orderType = 'delivery'"
          >
            {{ t('home.hero.delivery') }}
          </button>
          <button
            :class="orderType === 'pickup' ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/10'"
            class="rounded-full px-6 py-2 text-sm font-medium transition-all"
            @click="orderType = 'pickup'"
          >
            {{ t('home.hero.pickup') }}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative mx-auto max-w-2xl">
          <form class="flex items-center overflow-hidden rounded-xl bg-white shadow-lg" @submit.prevent="handleHeroSearch">
            <div class="flex flex-1 items-center px-4">
              <i class="pi pi-map-marker mr-3 text-muted-foreground shrink-0" />
              <input
                v-model="heroSearch"
                type="text"
                :placeholder="t('home.hero.searchPlaceholder')"
                class="w-full bg-transparent py-4 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="submit"
              class="m-1.5 rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
              <i class="pi pi-search" />
              <span class="hidden sm:inline">{{ t('home.hero.searchCta') }}</span>
            </button>
          </form>
        </div>

        <!-- Popular cities -->
        <div v-if="citiesData.length" class="mt-6 flex flex-wrap justify-center gap-2">
          <button
            v-for="city in citiesData.slice(0, 6)"
            :key="city.id"
            class="inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white hover:bg-white/30 transition-colors"
            @click="browseCity(city)"
          >
            <i class="pi pi-map-marker text-xs" />
            {{ city.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Popular Cuisines -->
    <section class="py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8 flex items-end justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('home.cuisines.title') }}</h2>
            <p class="mt-1 text-muted-foreground">{{ t('home.cuisines.subtitle') }}</p>
          </div>
          <button
            v-if="cuisines.length > INITIAL_CUISINE_COUNT"
            class="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            @click="showAllCuisines = !showAllCuisines"
          >
            {{ showAllCuisines ? t('home.cuisines.viewLess') : t('home.cuisines.viewAll') }}
            <i :class="showAllCuisines ? 'pi pi-chevron-up' : 'pi pi-chevron-right'" class="text-xs" />
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="cuisinesLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="i in INITIAL_CUISINE_COUNT" :key="i" class="flex flex-col items-center gap-3">
            <div class="h-24 w-24 rounded-full bg-muted animate-pulse" />
            <div class="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <!-- Cuisine grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <RouterLink
            v-for="cuisine in displayedCuisines"
            :key="cuisine.id"
            :to="{ name: 'restaurants', params: { locale }, query: { cuisine_id: cuisine.id } }"
            class="group flex flex-col items-center gap-3 rounded-xl p-4 transition-all hover:bg-accent no-underline"
          >
            <div class="relative h-24 w-24 overflow-hidden rounded-full bg-muted shadow-sm ring-2 ring-transparent transition-all group-hover:ring-primary group-hover:shadow-md">
              <img
                v-if="cuisine.image_url"
                :src="cuisine.image_url"
                :alt="cuisine.name"
                class="h-full w-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-primary/10 text-2xl">🍽️</div>
            </div>
            <span class="text-center text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {{ cuisine.name }}
            </span>
          </RouterLink>
        </div>

        <!-- Mobile view all/less -->
        <div v-if="cuisines.length > INITIAL_CUISINE_COUNT" class="mt-6 text-center md:hidden">
          <button
            class="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            @click="showAllCuisines = !showAllCuisines"
          >
            {{ showAllCuisines ? t('home.cuisines.viewLess') : t('home.cuisines.viewAll') }}
            <i :class="showAllCuisines ? 'pi pi-chevron-up' : 'pi pi-chevron-right'" class="text-xs" />
          </button>
        </div>
      </div>
    </section>

    <!-- Top Restaurants -->
    <section class="bg-muted/50 py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8 flex items-end justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('home.featuredRestaurants.title') }}</h2>
            <p class="mt-1 text-muted-foreground">{{ t('home.topRestaurants.subtitle') }}</p>
          </div>
          <RouterLink
            :to="{ name: 'restaurants', params: { locale } }"
            class="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline no-underline"
          >
            {{ t('home.featuredRestaurants.viewAll') }}
            <i class="pi pi-chevron-right text-xs" />
          </RouterLink>
        </div>

        <!-- Loading skeleton -->
        <div v-if="restaurantsLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="i in 8" :key="i" class="rounded-xl border border-border overflow-hidden bg-white">
            <div class="aspect-[16/10] bg-muted animate-pulse" />
            <div class="p-4 space-y-2">
              <div class="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div class="h-3 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </div>

        <!-- Restaurant grid -->
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RestaurantCard
            v-for="restaurant in topRestaurants"
            :key="restaurant._id ?? restaurant.id"
            :restaurant="restaurant"
            :locale="locale"
          />
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-10 text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-foreground">{{ t('home.howItWorks.title') }}</h2>
          <p class="mt-2 text-muted-foreground">{{ t('home.howItWorks.subtitle') }}</p>
        </div>
        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="(step, index) in howItWorksSteps" :key="index" class="flex flex-col items-center text-center">
            <div class="relative mb-4">
              <div :class="step.color" class="flex h-16 w-16 items-center justify-center rounded-2xl">
                <i :class="step.icon" class="text-2xl" />
              </div>
              <div class="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {{ index + 1 }}
              </div>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-foreground">{{ t(step.titleKey) }}</h3>
            <p class="max-w-xs text-sm text-muted-foreground">{{ t(step.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- App Promotion (Partner / Courier CTA) -->
    <section class="bg-secondary py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <!-- Illustration -->
          <div class="flex flex-1 justify-center">
            <div class="relative">
              <div class="flex h-64 w-40 md:h-80 md:w-48 items-center justify-center rounded-3xl border-4 border-white/20 bg-white/10 shadow-lg">
                <div class="text-center">
                  <span class="text-5xl">📱</span>
                  <p class="mt-2 text-sm font-medium text-white/80">just-eat.ch</p>
                </div>
              </div>
              <div class="absolute -top-3 -right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">NEW</div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="mb-3 text-2xl md:text-3xl font-bold text-white">{{ t('home.appPromotion.title') }}</h2>
            <p class="mb-6 text-white/80">{{ t('home.appPromotion.subtitle') }}</p>
            <ul class="mb-8 space-y-3">
              <li v-for="(feature, i) in appFeatures" :key="i" class="flex items-center gap-3 text-white/90">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <i :class="feature.icon" class="text-primary text-sm" />
                </div>
                <span class="text-sm">{{ t(feature.key) }}</span>
              </li>
            </ul>
            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <RouterLink
                :to="{ name: 'partner', params: { locale } }"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-white/90 transition-colors no-underline"
              >
                <i class="pi pi-building" />
                {{ t('home.partnerCta.cta') }}
              </RouterLink>
              <RouterLink
                :to="{ name: 'become-courier', params: { locale } }"
                class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors no-underline"
              >
                <i class="pi pi-car" />
                {{ t('home.courierCta.cta') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/app/axios';
import { formatPrice } from '@/shared/utils/formatters';
import RestaurantCard from '@/features/restaurants/components/RestaurantCard.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const locale = computed(() => (route.params.locale as string) || 'en');
const heroSearch = ref('');
const orderType = ref<'delivery' | 'pickup'>('delivery');
const showAllCuisines = ref(false);
const INITIAL_CUISINE_COUNT = 12;

// Cuisines API
const { data: cuisinesResponse, isLoading: cuisinesLoading } = useQuery({
  queryKey: ['home-cuisines'],
  queryFn: async () => {
    const { data } = await api.get('/public/cuisines', { params: { limit: 100, is_active: true } });
    return data;
  },
});

// Restaurants API
const { data: restaurantsResponse, isLoading: restaurantsLoading } = useQuery({
  queryKey: ['home-restaurants'],
  queryFn: async () => {
    const { data } = await api.get('/public/restaurants', { params: { limit: 8, sort: '-rating', is_active: true } });
    return data;
  },
});

// Cities for hero pills
const { data: citiesResponse } = useQuery({
  queryKey: ['home-cities'],
  queryFn: async () => {
    const { data } = await api.get('/public/locations/cities', { params: { limit: 10, is_active: true } });
    return data;
  },
});

interface Cuisine {
  id: string;
  name: string;
  image_url?: string;
}

interface RestaurantItem {
  _id?: string;
  id?: string | number;
  name: string;
  slug: string;
  cover_image_url?: string;
  logo_url?: string;
  cuisine_types?: string[];
  cuisines?: Array<{ id: number | string; name: string }>;
  average_rating?: number | string;
  review_count?: number;
  total_reviews?: number;
  delivery_time_min?: number;
  delivery_time_max?: number;
  estimated_delivery_time?: number | string | null;
  delivery_fee?: number | string;
  minimum_order?: number | string;
  is_free_delivery?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
}

interface City {
  id: string;
  name: string;
}

const cuisines = computed<Cuisine[]>(() => cuisinesResponse.value?.data ?? []);
const topRestaurants = computed<RestaurantItem[]>(() => {
  const responseData = restaurantsResponse.value?.data;
  if (Array.isArray(responseData)) return responseData;
  return responseData?.restaurants ?? [];
});
const citiesData = computed<City[]>(() => citiesResponse.value?.data ?? []);

const displayedCuisines = computed(() =>
  showAllCuisines.value ? cuisines.value : cuisines.value.slice(0, INITIAL_CUISINE_COUNT),
);

const howItWorksSteps = [
  { icon: 'pi pi-search', color: 'bg-primary/10 text-primary', titleKey: 'home.howItWorks.step1Title', descKey: 'home.howItWorks.step1Description' },
  { icon: 'pi pi-list', color: 'bg-success/10 text-success', titleKey: 'home.howItWorks.step2Title', descKey: 'home.howItWorks.step2Description' },
  { icon: 'pi pi-car', color: 'bg-info/10 text-info', titleKey: 'home.howItWorks.step3Title', descKey: 'home.howItWorks.step3Description' },
];

const appFeatures = [
  { icon: 'pi pi-mobile', key: 'home.appPromotion.feature1' },
  { icon: 'pi pi-map-marker', key: 'home.appPromotion.feature2' },
  { icon: 'pi pi-heart', key: 'home.appPromotion.feature3' },
];

function handleHeroSearch() {
  const q = heroSearch.value.trim();
  if (!q) return;
  router.push({ name: 'restaurants', params: { locale: locale.value }, query: { q } });
}

function browseCity(city: City) {
  router.push({ name: 'restaurants', params: { locale: locale.value }, query: { city_id: city.id, order_type: orderType.value } });
}
</script>

