<template>
  <footer class="bg-secondary text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <RouterLink
            :to="{ name: 'home', params: { locale } }"
            class="flex items-center no-underline"
          >
            <img src="/logo.svg" alt="just-eat.ch" class="h-8" style="filter: brightness(0) invert(1)" />
          </RouterLink>
          <p class="text-gray-400 text-sm mt-3 leading-relaxed">
            {{ t('static.footer.tagline') }}
          </p>
        </div>

        <!-- Discover -->
        <div>
          <h3 class="font-semibold text-sm mb-3 uppercase tracking-wide text-gray-300">
            {{ t('static.footer.discover') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <RouterLink :to="{ name: 'restaurants', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.restaurants') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'about', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.about') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'partner', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.addRestaurant') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'become-courier', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.becomeCourier') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div>
          <h3 class="font-semibold text-sm mb-3 uppercase tracking-wide text-gray-300">
            {{ t('static.footer.account') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <RouterLink :to="{ name: 'orders', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.myOrders') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'favorites', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.favorites') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'profile', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.profile') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="font-semibold text-sm mb-3 uppercase tracking-wide text-gray-300">
            {{ t('static.footer.legal') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <RouterLink :to="{ name: 'terms', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.terms') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'privacy', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.privacy') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'contact', params: { locale } }" class="text-gray-400 hover:text-white text-sm transition-colors no-underline">
                {{ t('common.nav.contact') }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© {{ currentYear }} just-eat.ch — {{ t('static.footer.rights') }}</p>
        <div class="flex gap-3">
          <span v-for="lang in SUPPORTED_LOCALES" :key="lang">
            <button
              class="hover:text-white transition-colors uppercase"
              :class="{ 'text-primary': locale === lang }"
              @click="switchLocale(lang)"
            >{{ lang }}</button>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { SUPPORTED_LOCALES } from '@/shared/utils/constants';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const locale = computed(() => (route.params.locale as string) || 'en');
const currentYear = new Date().getFullYear();

function switchLocale(lang: string) {
  router.push({ name: route.name!, params: { ...route.params, locale: lang } });
}
</script>

