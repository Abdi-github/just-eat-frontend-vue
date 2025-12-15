<template>
  <div class="min-h-screen flex flex-col bg-background">
    <CourierHeader />
    <div class="flex flex-1">
      <CourierSidebar class="hidden lg:block" />
      <main id="main-content" class="flex-1 min-w-0 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import CourierHeader from './components/CourierHeader.vue';
import CourierSidebar from './components/CourierSidebar.vue';
</script>
