import { z } from 'zod';

// Registration schema - matches backend signUpSchema exactly
export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Please tell us your first name!'),
    lastName: z.string().min(2, 'Please tell us your last name!'),
    email: z.string().email('Please provide a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(10, 'Password must be no longer than 10 characters')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one digit'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must contain only 10 digits')
      .optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

// Login schema - matches backend loginSchema exactly
export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(10, 'Password must be no longer than 10 characters')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one digit'),
});

// Email verification schema - matches backend verifyEmailSchema exactly
export const verifyEmailSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  code: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits long')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
});

// Forgot password schema - matches backend forgotPasswordValidationSchena exactly
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email'),
});

// Reset password schema - matches backend resetPasswordValidationSchema exactly
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(10, 'Password must be no longer than 10 characters')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one digit'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

// Change password schema - matches backend changePasswordValidationSchema exactly
export const changePasswordSchema = z
  .object({
    passwordCurrent: z.string(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(10, 'Password must be no longer than 10 characters')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one digit'),
    passwordConfirm: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

// Type exports for the schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>; 