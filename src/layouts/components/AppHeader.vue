<template>
  <header class="sticky top-0 z-50 bg-white border-b border-b-border shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 h-16">
      <!-- Mobile menu toggle -->
      <button
        class="lg:hidden text-secondary hover:text-primary p-1 transition-colors"
        :aria-label="t('common.nav.menu')"
        @click="uiStore.toggleMobileMenu()"
      >
        <i class="pi pi-bars text-xl" />
      </button>

      <!-- Logo -->
      <RouterLink
        :to="{ name: 'home', params: { locale } }"
        class="flex items-center gap-2 shrink-0 no-underline"
        :aria-label="t('common.appName')"
      >
        <div class="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
          <i class="pi pi-shopping-cart text-base" />
        </div>
        <span class="font-extrabold text-secondary text-lg leading-tight hidden sm:block">
          <span class="text-primary">just</span>-eat.ch
        </span>
      </RouterLink>

      <!-- Search bar (desktop) -->
      <form
        class="flex-1 max-w-xl mx-4 hidden md:flex"
        @submit.prevent="handleSearch"
      >
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search.placeholder')"
            class="w-full rounded-full pl-5 pr-12 py-2 text-sm border border-border focus:outline-none focus:border-primary bg-white text-secondary placeholder:text-gray-400"
          />
          <button
            type="submit"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            :aria-label="t('common.search')"
          >
            <i class="pi pi-search text-sm" />
          </button>
        </div>
      </form>

      <!-- Right actions -->
      <div class="flex items-center gap-1 ml-auto shrink-0">
        <!-- Language switcher (desktop) -->
        <div class="hidden md:flex items-center gap-0.5">
          <button
            v-for="lang in SUPPORTED_LOCALES"
            :key="lang"
            class="px-1.5 py-0.5 text-xs font-semibold uppercase rounded transition-colors"
            :class="locale === lang ? 'text-primary' : 'text-gray-400 hover:text-secondary'"
            @click="switchLocale(lang)"
          >
            {{ lang }}
          </button>
        </div>

        <!-- Favorites -->
        <RouterLink
          :to="authStore.isAuthenticated
            ? { name: 'favorites', params: { locale } }
            : { name: 'login', params: { locale } }"
          class="text-secondary hover:text-primary p-2 transition-colors no-underline"
          :aria-label="t('common.nav.favorites')"
        >
          <i class="pi pi-heart text-lg" />
        </RouterLink>

        <!-- Cart button -->
        <button
          class="relative text-secondary hover:text-primary p-2 transition-colors"
          :aria-label="t('common.nav.cart')"
          @click="uiStore.toggleCartDrawer()"
        >
          <i class="pi pi-shopping-cart text-lg" />
          <Badge
            v-if="cartStore.itemCount > 0"
            :value="cartStore.itemCount"
            severity="danger"
            class="absolute -top-1 -right-1 !min-w-[18px] !h-[18px] !text-[10px]"
          />
        </button>

        <!-- User menu (desktop) -->
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            :to="{ name: 'orders', params: { locale } }"
            class="hidden md:flex items-center gap-1.5 text-secondary hover:text-primary px-3 py-1.5 text-sm font-medium transition-colors no-underline"
          >
            <i class="pi pi-user text-base" />
            <span>{{ authStore.user?.first_name }}</span>
          </RouterLink>
          <button
            class="hidden md:flex items-center gap-1 text-sm text-gray-500 hover:text-primary px-2 py-1.5 transition-colors"
            @click="handleLogout"
          >
            <i class="pi pi-sign-out text-sm" />
          </button>
        </template>
        <template v-else>
          <RouterLink
            :to="{ name: 'login', params: { locale } }"
            class="hidden md:flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-hover transition-colors no-underline"
          >
            {{ t('common.nav.login') }}
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- Mobile search bar -->
    <div class="md:hidden px-4 pb-3">
      <form @submit.prevent="handleSearch">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search.placeholder')"
            class="w-full rounded-full pl-5 pr-12 py-2 text-sm border border-border focus:outline-none focus:border-primary bg-white text-secondary placeholder:text-gray-400"
          />
          <button
            type="submit"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
          >
            <i class="pi pi-search text-sm" />
          </button>
        </div>
      </form>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Badge from 'primevue/badge';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useUiStore } from '@/stores/ui.store';
import { SUPPORTED_LOCALES } from '@/shared/utils/constants';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();
const uiStore = useUiStore();

const searchQuery = ref('');
const locale = computed(() => (route.params.locale as string) || 'en');

function handleSearch() {
  const q = searchQuery.value.trim();
  if (!q) return;
  router.push({ name: 'search', params: { locale: locale.value }, query: { q } });
  searchQuery.value = '';
}

function switchLocale(lang: string) {
  router.push({ name: route.name!, params: { ...route.params, locale: lang } });
}

function handleLogout() {
  authStore.logout();
  router.push({ name: 'home', params: { locale: locale.value } });
}
</script>

