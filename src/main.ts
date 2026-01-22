import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import 'primeicons/primeicons.css';
import '@/styles/app.css';

import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
import { queryClient } from './app/queryClient';
import JustEatPreset from './styles/theme';
import { useAuthStore } from './stores/auth.store';
import { useCartStore } from './stores/cart.store';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, { queryClient });
app.use(PrimeVue, {
  theme: {
    preset: JustEatPreset,
    options: {
      darkModeSelector: false,
      cssLayer: { name: 'primevue', order: 'tailwind-base, primevue, tailwind-utilities' },
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

// Hydrate stores from localStorage before mounting
const authStore = useAuthStore();
const cartStore = useCartStore();
authStore.hydrateFromStorage();
cartStore.hydrateFromStorage();

app.mount('#app');
