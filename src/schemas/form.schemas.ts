import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .nonempty('Password is required'),
});

// Registration form schema
export const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .nonempty('First name is required'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .nonempty('Last name is required'),
  email: z.string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .nonempty('Password is required'),
  passwordConfirm: z.string()
    .nonempty('Please confirm your password'),
  whatsappNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid WhatsApp number')
    .nonempty('WhatsApp number is required'),
  acceptWhatsApp: z.boolean()
    .refine((val: boolean) => val === true, 'You must accept WhatsApp communications'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

// Daily report schema
export const dailyReportSchema = z.object({
  content: z.string()
    .min(10, 'Report content must be at least 10 characters')
    .nonempty('Report content is required'),
  mood: z.enum(['GREAT', 'GOOD', 'OKAY', 'BAD'], {
    required_error: 'Please select your mood',
  }),
  challenges: z.string()
    .min(5, 'Please describe your challenges')
    .nonempty('Challenges are required'),
  achievements: z.string()
    .min(5, 'Please describe your achievements')
    .nonempty('Achievements are required'),
  goals: z.string()
    .min(5, 'Please describe your goals')
    .nonempty('Goals are required'),
  timestamp: z.string()
    .min(1, 'Timestamp is required')
    .refine((val: string) => !isNaN(Date.parse(val)), 'Invalid timestamp'),
});

// Task creation schema
export const taskSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .nonempty('Title is required'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .nonempty('Description is required'),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'], {
    required_error: 'Please select a status',
  }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Please select a priority',
  }),
  points: z.number()
    .min(1, 'Points must be at least 1')
    .max(10, 'Points cannot exceed 10'),
  dueDate: z.string()
    .min(1, 'Due date is required')
    .refine((val: string) => !isNaN(Date.parse(val)), 'Invalid due date'),
  assignedTo: z.string().optional(),
  planetId: z.string().nonempty('Planet is required'),
  isLocked: z.boolean(),
  unlockRequirements: z.array(z.string()).optional(),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  avatar: z.string().optional(),
  whatsappNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid WhatsApp number')
    .optional(),
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().nonempty('Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .nonempty('Password is required'),
  passwordConfirm: z.string()
    .nonempty('Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

// Email verification schema
export const verifyEmailSchema = z.object({
  code: z.string()
    .length(6, 'Verification code must be 6 characters')
    .nonempty('Verification code is required'),
  email: z.string()
    .email('Invalid email address')
    .nonempty('Email is required'),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type DailyReportFormData = z.infer<typeof dailyReportSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>; 