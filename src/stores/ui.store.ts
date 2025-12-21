import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const mobileMenuOpen = ref(false);
  const cartDrawerOpen = ref(false);
  const isGlobalLoading = ref(false);

  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  }
  function closeMobileMenu() {
    mobileMenuOpen.value = false;
  }
  function toggleCartDrawer() {
    cartDrawerOpen.value = !cartDrawerOpen.value;
  }
  function closeCartDrawer() {
    cartDrawerOpen.value = false;
  }
  function setGlobalLoading(value: boolean) {
    isGlobalLoading.value = value;
  }

  return {
    mobileMenuOpen,
    cartDrawerOpen,
    isGlobalLoading,
    toggleMobileMenu,
    closeMobileMenu,
    toggleCartDrawer,
    closeCartDrawer,
    setGlobalLoading,
  };
});
