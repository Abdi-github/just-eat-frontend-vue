import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useBreakpoints() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

  function update() {
    windowWidth.value = window.innerWidth;
  }

  onMounted(() => window.addEventListener('resize', update));
  onUnmounted(() => window.removeEventListener('resize', update));

  const isMobile = computed(() => windowWidth.value < 768);
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);
  const isDesktop = computed(() => windowWidth.value >= 1024);
  const isLargeDesktop = computed(() => windowWidth.value >= 1280);

  return { windowWidth, isMobile, isTablet, isDesktop, isLargeDesktop };
}
