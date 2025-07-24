import { Dispatch, SetStateAction } from 'react';
import { User } from './User';

export interface AuthContextUserProps {
  user: any;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  register: (values: any) => Promise<{ success: boolean; message: string }>;
  forgot: (user_email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmailCode: (code: string, email: string) => Promise<{ success: boolean; message: string }>;
}

export interface AuthContextValueUSER {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  login: (user_email: string, user_password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  register: (values: {
    user_name: string;
    user_email: string;
    user_password: string;
    user_password_confirm: string;
  }) => Promise<{ success: boolean; message: string }>;
  forgot: (user_email: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
  checkSession: () => Promise<void>;
}

export interface AuthStore extends AuthState, AuthActions {}

// Backend response format for all endpoints
export interface BackendResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  data?: T;
  message?: string;
}

// Registration response
export interface RegisterResponse {
  status: string;
  message: string;
}

// Login response - backend sends user data directly
export interface LoginResponse {
  status: string;
  data?: User;
  message?: string;
}

// Email verification response
export interface VerifyEmailResponse {
  status: string;
  message: string;
}

// Forgot password response
export interface ForgotPasswordResponse {
  status: string;
  message?: string;
}

// Reset password response
export interface ResetPasswordResponse {
  status: string;
  message?: string;
}

// Current user response from /users/me
export interface CurrentUserResponse {
  status: string;
  data?: User;
}

export interface ErrorResponse {
  error: string;
}

export interface FormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  user_name: string;
  user_email: string;
  user_password: string;
  user_password_confirm: string;
} 