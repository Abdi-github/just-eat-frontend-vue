<template>
  <header class="bg-secondary text-white px-6 py-3 flex items-center justify-between shadow">
    <RouterLink :to="{ name: 'home', params: { locale } }" class="flex items-center gap-2 no-underline">
      <div class="bg-primary text-white w-7 h-7 rounded-md flex items-center justify-center">
        <i class="pi pi-shopping-cart text-xs" />
      </div>
      <span class="font-bold text-sm"><span class="text-primary">just</span>-eat.ch</span>
      <span class="ml-2 text-xs text-gray-400">Courier Dashboard</span>
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
