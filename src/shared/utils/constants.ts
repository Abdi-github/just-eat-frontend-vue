import type { OrderStatus, PaymentMethod } from '@/types/api';

export const APP_NAME = 'just-eat.ch';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005/api/v1';
export const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'it'] as const;
export const DEFAULT_LOCALE = 'en';
export const CURRENCY = 'CHF';
export const DEFAULT_PAGE_SIZE = 20;

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PLACED: 'blue',
  ACCEPTED: 'green',
  REJECTED: 'red',
  PREPARING: 'orange',
  READY: 'teal',
  PICKED_UP: 'purple',
  IN_TRANSIT: 'indigo',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

export const ORDER_STATUS_SEVERITY: Record<OrderStatus, 'info' | 'success' | 'danger' | 'warn' | 'secondary' | 'contrast'> = {
  PLACED: 'info',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  PREPARING: 'warn',
  READY: 'success',
  PICKED_UP: 'info',
  IN_TRANSIT: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurant_owner',
  RESTAURANT_STAFF: 'restaurant_staff',
  COURIER: 'courier',
  SUPER_ADMIN: 'super_admin',
  PLATFORM_ADMIN: 'platform_admin',
} as const;

export const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; icon?: string }> = [
  { value: 'stripe_card', label: 'Credit / Debit Card', icon: 'pi pi-credit-card' },
  { value: 'twint', label: 'TWINT', icon: 'pi pi-mobile' },
  { value: 'postfinance', label: 'PostFinance', icon: 'pi pi-building' },
  { value: 'cash', label: 'Cash on Delivery', icon: 'pi pi-dollar' },
];

export const SORT_OPTIONS = [
  { value: '-rating', label: 'Top Rated' },
  { value: '-created_at', label: 'Newest' },
  { value: 'delivery_time_max', label: 'Fastest Delivery' },
  { value: 'delivery_fee', label: 'Lowest Delivery Fee' },
];

export const DELIVERY_TIME_OPTIONS = [
  { value: 15, label: 'Under 15 min' },
  { value: 30, label: 'Under 30 min' },
  { value: 45, label: 'Under 45 min' },
  { value: 60, label: 'Under 60 min' },
];

export const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+' },
  { value: 4.0, label: '4.0+' },
  { value: 3.5, label: '3.5+' },
];
