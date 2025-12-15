<template>
  <div class="min-h-screen flex flex-col bg-background">
    <AppHeader />
    <div class="flex-1 container mx-auto px-4 py-8">
      <div class="flex gap-8">
        <AccountSidebar class="hidden lg:block w-64 shrink-0" />
        <main id="main-content" class="flex-1 min-w-0">
          <RouterView />
        </main>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AccountSidebar from './components/AccountSidebar.vue';
</script>
