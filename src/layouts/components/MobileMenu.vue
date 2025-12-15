<template>
  <Drawer
    v-model:visible="uiStore.mobileMenuOpen"
    position="left"
    :header="t('common.nav.menu')"
    class="!w-[280px]"
  >
    <nav class="flex flex-col gap-1">
      <RouterLink
        :to="{ name: 'home', params: { locale } }"
        class="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-muted hover:text-primary transition-colors no-underline font-medium"
        @click="uiStore.closeMobileMenu()"
      >
        <i class="pi pi-home text-base w-5" />
        {{ t('common.nav.home') }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'restaurants', params: { locale } }"
        class="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-muted hover:text-primary transition-colors no-underline font-medium"
        @click="uiStore.closeMobileMenu()"
      >
        <i class="pi pi-building text-base w-5" />
        {{ t('common.nav.restaurants') }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'search', params: { locale } }"
        class="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-muted hover:text-primary transition-colors no-underline font-medium"
        @click="uiStore.closeMobileMenu()"
      >
        <i class="pi pi-search text-base w-5" />
        {{ t('common.nav.search') }}
      </RouterLink>

      <div class="border-t border-border my-2" />

      <template v-if="authStore.isAuthenticated">
        <RouterLink
          :to="{ name: 'orders', params: { locale } }"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-muted hover:text-primary transition-colors no-underline font-medium"
          @click="uiStore.closeMobileMenu()"
        >
          <i class="pi pi-receipt text-base w-5" />
          {{ t('common.nav.myOrders') }}
        </RouterLink>
        <RouterLink
          :to="{ name: 'favorites', params: { locale } }"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-muted hover:text-primary transition-colors no-underline font-medium"
          @click="uiStore.closeMobileMenu()"
        >
          <i class="pi pi-heart text-base w-5" />
          {{ t('common.nav.favorites') }}
        </RouterLink>
        <RouterLink
          :to="{ name: 'profile', params: { locale } }"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-muted hover:text-primary transition-colors no-underline font-medium"
          @click="uiStore.closeMobileMenu()"
        >
          <i class="pi pi-user text-base w-5" />
          {{ t('common.nav.profile') }}
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink
          :to="{ name: 'login', params: { locale } }"
          class="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors no-underline font-semibold"
          @click="uiStore.closeMobileMenu()"
        >
          <i class="pi pi-sign-in text-base w-5" />
          {{ t('common.nav.login') }}
        </RouterLink>
      </template>

      <div class="border-t border-border my-2" />

      <!-- Language switcher -->
      <div class="flex gap-2 px-3 py-2">
        <button
          v-for="lang in SUPPORTED_LOCALES"
          :key="lang"
          class="px-3 py-1 rounded-full text-xs font-semibold uppercase transition-colors"
          :class="locale === lang
            ? 'bg-primary text-white'
            : 'bg-muted text-gray-500 hover:text-secondary'"
          @click="switchLocale(lang)"
        >
          {{ lang }}
        </button>
      </div>
    </nav>
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Drawer from 'primevue/drawer';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import { SUPPORTED_LOCALES } from '@/shared/utils/constants';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const locale = computed(() => (route.params.locale as string) || 'en');

function switchLocale(lang: string) {
  router.push({ name: route.name!, params: { ...route.params, locale: lang } });
  uiStore.closeMobileMenu();
}
</script>

