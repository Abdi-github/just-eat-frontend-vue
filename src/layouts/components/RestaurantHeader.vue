<template>
  <header class="bg-secondary text-white px-6 py-3 flex items-center justify-between shadow">
    <RouterLink :to="{ name: 'home', params: { locale } }" class="flex items-center gap-2 no-underline">
      <img src="/logo.svg" alt="just-eat.ch" class="h-6" style="filter: brightness(0) invert(1)" />
      <span class="ml-2 text-xs text-gray-400">Restaurant Dashboard</span>
    </RouterLink>
    <button class="text-gray-400 hover:text-white text-sm" @click="handleLogout">
      <i class="pi pi-sign-out" /> {{ t('common.nav.logout') }}
    </button>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const locale = computed(() => (route.params.locale as string) || 'en');

function handleLogout() {
  authStore.logout();
  router.push({ name: 'home', params: { locale: locale.value } });
}
</script>
