<template>
  <main class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="text-center max-w-md">
      <p class="text-8xl font-black text-primary leading-none">404</p>
      <h1 class="text-2xl font-bold text-secondary mt-4">{{ t('common.errors.notFoundTitle') }}</h1>
      <p class="text-gray-500 mt-2">{{ t('common.errors.notFoundMessage') }}</p>
      <Button
        :label="t('common.errors.goHome')"
        class="mt-6 !bg-primary !border-primary"
        @click="router.push({ name: 'home', params: { locale } })"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const locale = computed(() => (route.params.locale as string) || 'en');
</script>

