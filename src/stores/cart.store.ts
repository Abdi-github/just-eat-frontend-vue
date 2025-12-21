import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  imageUrl?: string;
  instructions?: string;
}

const CART_KEY = 'just_eat_cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const restaurantId = ref<string | null>(null);
  const restaurantName = ref<string | null>(null);

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0));
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0),
  );
  const isEmpty = computed(() => items.value.length === 0);

  function persist() {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items: items.value,
        restaurantId: restaurantId.value,
        restaurantName: restaurantName.value,
      }),
    );
  }

  function addItem(newItem: CartItem): 'added' | 'needs-confirm' {
    // Different restaurant check
    if (restaurantId.value && restaurantId.value !== newItem.restaurantId) {
      return 'needs-confirm';
    }

    restaurantId.value = newItem.restaurantId;
    restaurantName.value = newItem.restaurantName;

    const existing = items.value.find((i) => i.menuItemId === newItem.menuItemId);
    if (existing) {
      existing.quantity += newItem.quantity;
    } else {
      items.value.push({ ...newItem });
    }

    persist();
    return 'added';
  }

  function clearAndAdd(newItem: CartItem) {
    items.value = [];
    restaurantId.value = null;
    restaurantName.value = null;
    addItem(newItem);
  }

  function removeItem(menuItemId: string) {
    const beforeCount = items.value.length;
    items.value = items.value.filter((i) => i.menuItemId !== menuItemId);
    if (items.value.length === 0) {
      restaurantId.value = null;
      restaurantName.value = null;
    }
    persist();
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    const item = items.value.find((i) => i.menuItemId === menuItemId);
    if (item) {
      item.quantity = quantity;
      persist();
    }
  }

  function clearCart() {
    items.value = [];
    restaurantId.value = null;
    restaurantName.value = null;
    localStorage.removeItem(CART_KEY);
  }

  function hydrateFromStorage() {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      items.value = parsed.items || [];
      restaurantId.value = parsed.restaurantId || null;
      restaurantName.value = parsed.restaurantName || null;
    } catch (error) {
      localStorage.removeItem(CART_KEY);
    }
  }

  return {
    items,
    restaurantId,
    restaurantName,
    itemCount,
    subtotal,
    isEmpty,
    addItem,
    clearAndAdd,
    removeItem,
    updateQuantity,
    clearCart,
    persist,
    hydrateFromStorage,
  };
});
