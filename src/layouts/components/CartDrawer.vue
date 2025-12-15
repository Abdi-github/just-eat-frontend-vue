<template>
  <Drawer
    v-model:visible="uiStore.cartDrawerOpen"
    position="right"
    :header="t('cart.title')"
    class="!w-full sm:!w-[400px]"
  >
    <!-- Empty state -->
    <div
      v-if="cartStore.isEmpty"
      class="flex flex-col items-center justify-center h-full gap-4 text-center py-16"
    >
      <i class="pi pi-shopping-cart text-5xl text-gray-200" />
      <p class="text-gray-500 font-medium">{{ t('cart.empty.title') }}</p>
      <p class="text-gray-400 text-sm">{{ t('cart.empty.subtitle') }}</p>
      <Button
        :label="t('cart.empty.cta')"
        outlined
        class="mt-2"
        @click="uiStore.closeCartDrawer(); router.push({ name: 'restaurants', params: { locale } })"
      />
    </div>

    <!-- Cart items -->
    <div v-else class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto space-y-3 pr-1">
        <!-- Restaurant name -->
        <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {{ cartStore.items[0]?.restaurantName }}
        </p>

        <div
          v-for="item in cartStore.items"
          :key="item.menuItemId"
          class="flex items-center gap-3 p-3 rounded-xl border border-border"
        >
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm text-secondary truncate">{{ item.name }}</p>
            <p v-if="item.instructions" class="text-xs text-gray-400 truncate">{{ item.instructions }}</p>
            <p class="text-primary font-semibold text-sm mt-1">{{ formatPrice(item.price) }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 rounded-full border border-border flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-colors"
              @click="cartStore.updateQuantity(item.menuItemId, item.quantity - 1)"
            >
              <i class="pi pi-minus text-xs" />
            </button>
            <span class="w-5 text-center text-sm font-semibold">{{ item.quantity }}</span>
            <button
              class="w-7 h-7 rounded-full border border-border flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-colors"
              @click="cartStore.updateQuantity(item.menuItemId, item.quantity + 1)"
            >
              <i class="pi pi-plus text-xs" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-border pt-4 mt-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">{{ t('cart.subtotal') }}</span>
          <span class="font-semibold text-secondary">{{ formatPrice(cartStore.subtotal) }}</span>
        </div>
        <Button
          :label="t('cart.checkout')"
          class="w-full !bg-primary !border-primary hover:!bg-primary-hover"
          @click="uiStore.closeCartDrawer(); router.push({ name: 'checkout', params: { locale } })"
        />
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { useCartStore } from '@/stores/cart.store';
import { useUiStore } from '@/stores/ui.store';
import { formatPrice } from '@/shared/utils/formatters';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const uiStore = useUiStore();

const locale = computed(() => (route.params.locale as string) || 'en');
</script>

