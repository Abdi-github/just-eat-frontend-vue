<template>
  <div>
    <h1 class="text-xl font-bold text-secondary mb-6">{{ t('profile.title') }}</h1>

    <div v-if="authStore.user" class="bg-white rounded-2xl border border-border p-6 max-w-lg">
      <!-- Avatar -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <span class="text-2xl font-bold text-primary">
            {{ getInitials(authStore.user.first_name, authStore.user.last_name) }}
          </span>
        </div>
        <div>
          <p class="font-bold text-secondary text-lg">{{ authStore.user.first_name }} {{ authStore.user.last_name }}</p>
          <p class="text-gray-400 text-sm">{{ authStore.user.email }}</p>
        </div>
      </div>

      <!-- Profile form -->
      <form @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.firstName') }}</label>
            <InputText v-model="firstName" v-bind="firstNameAttrs" :class="['w-full', { 'p-invalid': errors.first_name }]" />
            <small v-if="errors.first_name" class="text-error text-xs">{{ errors.first_name }}</small>
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.lastName') }}</label>
            <InputText v-model="lastName" v-bind="lastNameAttrs" :class="['w-full', { 'p-invalid': errors.last_name }]" />
            <small v-if="errors.last_name" class="text-error text-xs">{{ errors.last_name }}</small>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-secondary mb-1">{{ t('auth.fields.phone') }}</label>
          <InputText v-model="phone" v-bind="phoneAttrs" type="tel" :class="['w-full', { 'p-invalid': errors.phone }]" placeholder="+41 79 123 45 67" />
          <small v-if="errors.phone" class="text-error text-xs">{{ errors.phone }}</small>
        </div>

        <Button
          type="submit"
          :label="t('common.save')"
          :loading="isLoading"
          class="!bg-primary !border-primary hover:!bg-primary-hover"
        />
        <Message v-if="successMsg" severity="success" :closable="false">{{ successMsg }}</Message>
        <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useAuthStore } from '@/stores/auth.store';
import { profileSchema } from '@/shared/utils/validators';
import { getInitials } from '@/shared/utils/formatters';
import { api } from '@/app/axios';

const { t } = useI18n();
const authStore = useAuthStore();

const isLoading = ref(false);
const apiError = ref('');
const successMsg = ref('');

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    first_name: authStore.user?.first_name || '',
    last_name: authStore.user?.last_name || '',
    phone: authStore.user?.phone || '',
  },
});

const [firstName, firstNameAttrs] = defineField('first_name');
const [lastName, lastNameAttrs] = defineField('last_name');
const [phone, phoneAttrs] = defineField('phone');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  apiError.value = '';
  successMsg.value = '';
  try {
    const { data } = await api.put('/account/profile', values);
    authStore.updateUser(data.data);
    successMsg.value = t('profile.updateSuccess');
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    apiError.value = e.response?.data?.message || t('common.errors.generic');
  } finally {
    isLoading.value = false;
  }
});
</script>

