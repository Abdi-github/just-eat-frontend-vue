<template>
  <div class="min-h-screen bg-muted flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <RouterLink :to="`/${locale}`" class="inline-block">
          <span class="text-3xl font-bold text-primary">just-eat</span>
          <span class="text-lg text-muted-foreground">.ch</span>
        </RouterLink>
      </div>
      <div class="rounded-xl border border-border bg-white p-6 shadow-sm">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'en');
</script>
