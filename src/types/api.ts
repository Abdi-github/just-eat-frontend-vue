// ─── API response shapes ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: number;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
}

// ─── Common types ─────────────────────────────────────────────────────────────

export type SupportedLocale = 'en' | 'fr' | 'de' | 'it';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'stripe_card' | 'twint' | 'postfinance' | 'cash';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'REFUNDED' | 'FAILED';

export type TranslatedField = {
  en: string;
  fr: string;
  de: string;
  it: string;
};
