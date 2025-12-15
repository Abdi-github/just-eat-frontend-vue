<template>
  <div class="min-h-screen flex flex-col bg-background">
    <AppHeader />
    <main id="main-content" class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <CartDrawer />
    <MobileMenu />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import CartDrawer from './components/CartDrawer.vue';
import MobileMenu from './components/MobileMenu.vue';
</script>
