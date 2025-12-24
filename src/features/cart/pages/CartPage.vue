<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <h1 class="text-2xl font-bold text-secondary mb-6">{{ t('cart.title') }}</h1>

    <!-- Empty cart -->
    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <div class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-shopping-cart text-4xl text-gray-300" />
      </div>
      <h2 class="text-xl font-bold text-secondary mt-2">{{ t('cart.empty.title') }}</h2>
      <p class="text-gray-500 mt-2">{{ t('cart.empty.subtitle') }}</p>
      <Button
        :label="t('cart.empty.cta')"
        class="mt-6 !bg-primary !border-primary"
        @click="router.push({ name: 'restaurants', params: { locale } })"
      />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart items -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-2xl border border-border p-4">
          <h2 class="font-semibold text-secondary mb-1">{{ cartStore.restaurantName }}</h2>
          <p class="text-xs text-gray-400 mb-4">{{ cartStore.items.length }} {{ t('cart.items') }}</p>

          <div class="divide-y divide-border">
            <div
              v-for="item in cartStore.items"
              :key="item.menuItemId"
              class="flex items-center gap-4 py-4"
            >
              <div class="flex-1 min-w-0">
                <p class="font-medium text-secondary">{{ item.name }}</p>
                <p v-if="item.instructions" class="text-xs text-gray-400 mt-0.5">{{ item.instructions }}</p>
                <p class="text-primary font-semibold mt-1">{{ formatPrice(item.price) }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="w-8 h-8 rounded-full border border-border flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-colors"
                  :aria-label="t('cart.decrease')"
                  @click="cartStore.updateQuantity(item.menuItemId, item.quantity - 1)"
                >
                  <i class="pi pi-minus text-xs" />
                </button>
                <span class="w-6 text-center font-semibold">{{ item.quantity }}</span>
                <button
                  class="w-8 h-8 rounded-full border border-border flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-colors"
                  :aria-label="t('cart.increase')"
                  @click="cartStore.updateQuantity(item.menuItemId, item.quantity + 1)"
                >
                  <i class="pi pi-plus text-xs" />
                </button>
              </div>

              <p class="font-semibold text-secondary w-16 text-right">
                {{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-border p-5">
          <h2 class="font-semibold text-secondary mb-4">{{ t('cart.orderSummary') }}</h2>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-500">
              <span>{{ t('cart.subtotal') }}</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between border-t border-border pt-2 font-bold text-secondary">
              <span>{{ t('cart.total') }}</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
          </div>

          <Button
            :label="t('cart.checkout')"
            class="w-full mt-5 !bg-primary !border-primary hover:!bg-primary-hover"
            :disabled="!authStore.isAuthenticated"
            @click="router.push({ name: 'checkout', params: { locale } })"
          />
          <p v-if="!authStore.isAuthenticated" class="text-xs text-center text-gray-400 mt-2">
            <RouterLink :to="{ name: 'login', params: { locale } }" class="text-primary hover:underline no-underline">
              {{ t('cart.loginRequired') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/shared/utils/formatters';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const locale = computed(() => (route.params.locale as string) || 'en');
</script>

