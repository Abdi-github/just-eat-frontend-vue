<template>
  <div>
    <h2 class="text-2xl font-bold text-secondary text-center mb-1">{{ t('auth.forgotPassword.title') }}</h2>
    <p class="text-center text-gray-500 text-sm mb-6">{{ t('auth.forgotPassword.subtitle') }}</p>

    <div v-if="sent" class="text-center py-4">
      <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-envelope text-3xl text-success" />
      </div>
      <p class="text-secondary font-medium">{{ t('auth.forgotPassword.sentTitle') }}</p>
      <p class="text-gray-500 text-sm mt-2">{{ t('auth.forgotPassword.sentMessage') }}</p>
      <RouterLink :to="{ name: 'login', params: { locale } }" class="inline-block mt-4 text-primary font-semibold hover:underline no-underline">
        ← {{ t('auth.forgotPassword.backToLogin') }}
      </RouterLink>
    </div>

    <form v-else @submit="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.email') }}</label>
        <InputText
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          :class="['w-full', { 'p-invalid': errors.email }]"
          :placeholder="t('auth.placeholders.email')"
        />
        <small v-if="errors.email" class="text-error text-xs mt-1 block">{{ errors.email }}</small>
      </div>

      <Button
        type="submit"
        :label="t('auth.forgotPassword.submit')"
        :loading="isLoading"
        class="w-full !bg-primary !border-primary hover:!bg-primary-hover"
      />

      <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>
    </form>

    <p v-if="!sent" class="text-center text-sm mt-4">
      <RouterLink :to="{ name: 'login', params: { locale } }" class="text-primary hover:underline no-underline">
        ← {{ t('auth.forgotPassword.backToLogin') }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { forgotPasswordSchema } from '@/shared/utils/validators';
import { api } from '@/app/axios';

const { t } = useI18n();
const route = useRoute();

const locale = computed(() => (route.params.locale as string) || 'en');
const isLoading = ref(false);
const apiError = ref('');
const sent = ref(false);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
});
const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  apiError.value = '';
  try {
    await api.post('/public/auth/forgot-password', values);
    sent.value = true;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    apiError.value = e.response?.data?.message || t('common.errors.generic');
  } finally {
    isLoading.value = false;
  }
});
</script>

