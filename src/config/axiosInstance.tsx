import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { paths } from '@/routes/paths';
import { API_BASE_URL } from '@/config/environment';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Performance optimizations
  timeout: 10000, // 10 second timeout
  // Enable gzip compression
  decompress: true,
});

// Cache for token to avoid repeated cookie parsing
let cachedToken: string | null = null;
let tokenCacheTime: number = 0;
const TOKEN_CACHE_DURATION = 5000; // 5 seconds cache

const getToken = (): string | null => {
  const now = Date.now();
  if (cachedToken && (now - tokenCacheTime) < TOKEN_CACHE_DURATION) {
    return cachedToken;
  }
  
  // Parse token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
    ?.split('=')[1];
  
  cachedToken = token || null;
  tokenCacheTime = now;
  return cachedToken;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Remove console.error in production - handle silently
    if (import.meta.env.DEV) {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest) {
      // Clear auth state and redirect to login
      localStorage.removeItem('starquest-auth');
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Clear token cache
      cachedToken = null;
      tokenCacheTime = 0;
      
      // Avoid multiple redirects
      if (window.location.pathname !== paths.login) {
        window.location.href = paths.login;
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      // Access forbidden - redirect to dashboard
      if (window.location.pathname !== paths.UserDashboard) {
        window.location.href = paths.UserDashboard;
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
