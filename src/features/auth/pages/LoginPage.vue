<template>
  <div>
    <h2 class="text-2xl font-bold text-secondary text-center mb-1">{{ t('auth.login.title') }}</h2>
    <p class="text-center text-gray-500 text-sm mb-6">{{ t('auth.login.subtitle') }}</p>

    <form @submit="onSubmit" class="space-y-4">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.email') }}</label>
        <InputText
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          :class="['w-full', { 'p-invalid': errors.email }]"
          :placeholder="t('auth.placeholders.email')"
          autocomplete="email"
        />
        <small v-if="errors.email" class="text-error text-xs mt-1 block">{{ errors.email }}</small>
      </div>

      <!-- Password -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="block text-sm font-medium text-secondary">{{ t('auth.fields.password') }}</label>
          <RouterLink
            :to="{ name: 'forgot-password', params: { locale } }"
            class="text-primary text-sm hover:underline no-underline"
          >
            {{ t('auth.login.forgotPassword') }}
          </RouterLink>
        </div>
        <Password
          v-model="password"
          v-bind="passwordAttrs"
          :class="['w-full', { 'p-invalid': errors.password }]"
          :placeholder="t('auth.placeholders.password')"
          :feedback="false"
          toggle-mask
          :input-class="'w-full'"
          autocomplete="current-password"
        />
        <small v-if="errors.password" class="text-error text-xs mt-1 block">{{ errors.password }}</small>
      </div>

      <!-- Remember me checkbox -->
      <div class="flex items-center gap-2">
        <Checkbox v-model="rememberMe" :binary="true" inputId="remember-me" />
        <label for="remember-me" class="text-sm text-gray-600 cursor-pointer">{{ t('auth.login.remember_me') }}</label>
      </div>

      <!-- Submit -->
      <Button
        type="submit"
        :label="t('auth.login.submit')"
        :loading="isLoading"
        class="w-full !bg-primary !border-primary hover:!bg-primary-hover"
      />

      <!-- API error -->
      <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      {{ t('auth.login.noAccount') }}
      <RouterLink :to="{ name: 'register', params: { locale } }" class="text-primary font-semibold hover:underline no-underline ml-1">
        {{ t('auth.login.registerLink') }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth.store';
import { loginSchema } from '@/shared/utils/validators';
import { api } from '@/app/axios';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const locale = computed(() => (route.params.locale as string) || 'en');
const isLoading = ref(false);
const apiError = ref('');
const rememberMe = ref(false);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  apiError.value = '';
  try {
    const { data } = await api.post('/public/auth/login', values);
    authStore.setCredentials(data.data);
    toast.add({ severity: 'success', summary: t('auth.login.successTitle'), life: 3000 });
    const redirect = route.query.redirect as string;
    router.push(redirect || { name: 'home', params: { locale: locale.value } });
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    apiError.value = e.response?.data?.message || t('common.errors.generic');
  } finally {
    isLoading.value = false;
  }
});
</script>

