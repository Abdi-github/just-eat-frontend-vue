import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  roles: string[];
  permissions: string[];
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  const isRestaurantOwner = computed(
    () =>
      user.value?.roles.includes('restaurant_owner') ||
      user.value?.roles.includes('restaurant_staff') ||
      false,
  );

  const isCourier = computed(() => user.value?.roles.includes('courier') || false);

  const isCustomer = computed(
    () =>
      isAuthenticated.value && !isRestaurantOwner.value && !isCourier.value,
  );

  function setCredentials(data: {
    access_token: string;
    refresh_token: string;
    user: User;
  }) {
    token.value = data.access_token;
    refreshToken.value = data.refresh_token;
    user.value = data.user;
    localStorage.setItem('just_eat_token', data.access_token);
    localStorage.setItem('just_eat_refresh_token', data.refresh_token);
    localStorage.setItem('just_eat_user', JSON.stringify(data.user));
  }

  function updateUser(partial: Partial<User>) {
    if (!user.value) return;
    user.value = { ...user.value, ...partial };
    localStorage.setItem('just_eat_user', JSON.stringify(user.value));
  }

  function logout() {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    localStorage.removeItem('just_eat_token');
    localStorage.removeItem('just_eat_refresh_token');
    localStorage.removeItem('just_eat_user');
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function hydrateFromStorage() {
    const storedToken = localStorage.getItem('just_eat_token');
    const storedRefresh = localStorage.getItem('just_eat_refresh_token');
    const storedUser = localStorage.getItem('just_eat_user');

    if (storedToken) token.value = storedToken;
    if (storedRefresh) refreshToken.value = storedRefresh;
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('just_eat_user');
      }
    }
  }

  return {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    isRestaurantOwner,
    isCourier,
    isCustomer,
    setCredentials,
    updateUser,
    logout,
    setLoading,
    hydrateFromStorage,
  };
});
