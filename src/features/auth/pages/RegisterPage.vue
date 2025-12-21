<template>
  <div>
    <h2 class="text-2xl font-bold text-secondary text-center mb-1">{{ t('auth.register.title') }}</h2>
    <p class="text-center text-gray-500 text-sm mb-6">{{ t('auth.register.subtitle') }}</p>

    <form @submit="onSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.firstName') }}</label>
          <InputText
            v-model="firstName"
            v-bind="firstNameAttrs"
            :class="['w-full', { 'p-invalid': errors.first_name }]"
            :placeholder="t('auth.placeholders.firstName')"
          />
          <small v-if="errors.first_name" class="text-error text-xs mt-1 block">{{ errors.first_name }}</small>
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.lastName') }}</label>
          <InputText
            v-model="lastName"
            v-bind="lastNameAttrs"
            :class="['w-full', { 'p-invalid': errors.last_name }]"
            :placeholder="t('auth.placeholders.lastName')"
          />
          <small v-if="errors.last_name" class="text-error text-xs mt-1 block">{{ errors.last_name }}</small>
        </div>
      </div>

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

      <div>
        <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.phone') }} <span class="text-gray-400">({{ t('common.optional') }})</span></label>
        <InputText
          v-model="phone"
          v-bind="phoneAttrs"
          type="tel"
          :class="['w-full', { 'p-invalid': errors.phone }]"
          placeholder="+41 79 123 45 67"
          autocomplete="tel"
        />
        <small v-if="errors.phone" class="text-error text-xs mt-1 block">{{ errors.phone }}</small>
      </div>

      <div>
        <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.password') }}</label>
        <Password
          v-model="password"
          v-bind="passwordAttrs"
          :class="['w-full', { 'p-invalid': errors.password }]"
          :placeholder="t('auth.placeholders.passwordNew')"
          toggle-mask
          :input-class="'w-full'"
          autocomplete="new-password"
        />
        <small v-if="errors.password" class="text-error text-xs mt-1 block">{{ errors.password }}</small>
      </div>

      <div>
        <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.passwordConfirm') }}</label>
        <Password
          v-model="passwordConfirm"
          v-bind="passwordConfirmAttrs"
          :class="['w-full', { 'p-invalid': errors.password_confirmation }]"
          :placeholder="t('auth.placeholders.passwordConfirm')"
          :feedback="false"
          toggle-mask
          :input-class="'w-full'"
          autocomplete="new-password"
        />
        <small v-if="errors.password_confirmation" class="text-error text-xs mt-1 block">{{ errors.password_confirmation }}</small>
      </div>

      <Button
        type="submit"
        :label="t('auth.register.submit')"
        :loading="isLoading"
        class="w-full !bg-primary !border-primary hover:!bg-primary-hover"
      />

      <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      {{ t('auth.register.hasAccount') }}
      <RouterLink :to="{ name: 'login', params: { locale } }" class="text-primary font-semibold hover:underline no-underline ml-1">
        {{ t('auth.register.loginLink') }}
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
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth.store';
import { registerSchema } from '@/shared/utils/validators';
import { api } from '@/app/axios';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const locale = computed(() => (route.params.locale as string) || 'en');
const isLoading = ref(false);
const apiError = ref('');

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

const [firstName, firstNameAttrs] = defineField('first_name');
const [lastName, lastNameAttrs] = defineField('last_name');
const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');
const [password, passwordAttrs] = defineField('password');
const [passwordConfirm, passwordConfirmAttrs] = defineField('password_confirmation');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  apiError.value = '';
  try {
    const { data } = await api.post('/public/auth/register', values);
    authStore.setCredentials(data.data);
    toast.add({ severity: 'success', summary: t('auth.register.successTitle'), life: 4000 });
    router.push({ name: 'home', params: { locale: locale.value } });
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    apiError.value = e.response?.data?.message || t('common.errors.generic');
  } finally {
    isLoading.value = false;
  }
});
</script>

