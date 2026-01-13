import { z } from 'zod';

const phoneRegex = /^(\+41|0041|0)[1-9]\d{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const loginSchema = z.object({
  email: z.string().email('auth.validation.emailInvalid'),
  password: z.string().min(1, 'auth.validation.passwordRequired'),
  remember_me: z.boolean().optional(),
});

export const registerSchema = z.object({
  first_name: z.string().min(2, 'auth.validation.firstNameMin'),
  last_name: z.string().min(2, 'auth.validation.lastNameMin'),
  email: z.string().email('auth.validation.emailInvalid'),
  phone: z.string().regex(phoneRegex, 'auth.validation.phoneInvalid').optional().or(z.literal('')),
  password: z.string().regex(passwordRegex, 'auth.validation.passwordWeak'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'auth.validation.passwordMismatch',
  path: ['password_confirmation'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('auth.validation.emailInvalid'),
});

export const resetPasswordSchema = z.object({
  password: z.string().regex(passwordRegex, 'auth.validation.passwordWeak'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'auth.validation.passwordMismatch',
  path: ['password_confirmation'],
});

export const addressSchema = z.object({
  label: z.string().min(1, 'addresses.validation.labelRequired'),
  street: z.string().min(3, 'addresses.validation.streetMin'),
  house_number: z.string().min(1, 'addresses.validation.houseNumberRequired'),
  postal_code: z.string().regex(/^\d{4}$/, 'addresses.validation.postalCodeInvalid'),
  city: z.string().min(2, 'addresses.validation.cityMin'),
  canton: z.string().length(2, 'addresses.validation.cantonInvalid'),
  is_default: z.boolean().optional(),
  instructions: z.string().max(200).optional().or(z.literal('')),
});

export const profileSchema = z.object({
  first_name: z.string().min(2, 'profile.validation.firstNameMin'),
  last_name: z.string().min(2, 'profile.validation.lastNameMin'),
  phone: z.string().regex(phoneRegex, 'auth.validation.phoneInvalid').optional().or(z.literal('')),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'reviews.validation.commentMin').max(500, 'reviews.validation.commentMax'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'common.validation.nameMin'),
  email: z.string().email('auth.validation.emailInvalid'),
  subject: z.string().min(5, 'common.validation.subjectMin'),
  message: z.string().min(20, 'common.validation.messageMin').max(1000),
});

export const partnerApplicationSchema = z.object({
  restaurant_name: z.string().min(2),
  owner_first_name: z.string().min(2),
  owner_last_name: z.string().min(2),
  owner_email: z.string().email(),
  owner_phone: z.string().regex(phoneRegex),
  city: z.string().min(2),
  message: z.string().min(20).max(1000).optional().or(z.literal('')),
});

export const courierApplicationSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  vehicle_type: z.enum(['bicycle', 'scooter', 'car', 'foot']),
  message: z.string().min(20).max(1000).optional().or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type PartnerApplicationFormData = z.infer<typeof partnerApplicationSchema>;
export type CourierApplicationFormData = z.infer<typeof courierApplicationSchema>;
