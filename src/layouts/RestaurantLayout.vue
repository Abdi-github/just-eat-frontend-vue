<template>
  <div class="min-h-screen flex flex-col bg-background">
    <RestaurantHeader />
    <div class="flex flex-1">
      <RestaurantSidebar class="hidden lg:block" />
      <main id="main-content" class="flex-1 min-w-0 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import RestaurantHeader from './components/RestaurantHeader.vue';
import RestaurantSidebar from './components/RestaurantSidebar.vue';
</script>
