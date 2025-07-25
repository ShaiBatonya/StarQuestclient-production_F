import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '@/types';
import { API_BASE_URL } from '@/config/environment';
import { paths } from '@/routes/paths';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export abstract class BaseApiService {
  protected readonly api: AxiosInstance;
  protected readonly cache: Map<string, { data: any; timestamp: number }>;
  protected readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(baseURL: string = API_BASE_URL) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.cache = new Map();

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('jwt='))
          ?.split('=')[1];
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear auth state and redirect to login (consistent with standalone axiosInstance)
          localStorage.removeItem('starquest-auth');
          document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          // Avoid multiple redirects
          if (window.location.pathname !== paths.login) {
            window.location.href = paths.login;
          }
          return Promise.reject(new ApiError('Session expired', 401));
        }

        if (error.response?.status === 403) {
          return Promise.reject(new ApiError('Access denied', 403));
        }

        if (error.response?.status === 404) {
          return Promise.reject(new ApiError('Resource not found', 404));
        }

        if (error.response?.status === 422) {
          const data = error.response.data as any;
          return Promise.reject(
            new ApiError('Validation error', 422, 'VALIDATION_ERROR', data.errors)
          );
        }

        if (error.response?.status && error.response.status >= 500) {
          return Promise.reject(new ApiError('Server error', error.response.status));
        }

        return Promise.reject(
          new ApiError(error.message || 'An unexpected error occurred')
        );
      }
    );
  }

  protected async get<T>(
    url: string,
    useCache: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      if (useCache) {
        const cached = this.cache.get(url);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
          return cached.data;
        }
      }

      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
      
      if (useCache) {
        this.cache.set(url, {
          data: response.data,
          timestamp: Date.now(),
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError((error as Error).message);
    }
  }

  protected async post<T>(
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError((error as Error).message);
    }
  }

  protected async put<T>(
    url: string,
    data: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError((error as Error).message);
    }
  }

  protected async patch<T>(
    url: string,
    data: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError((error as Error).message);
    }
  }

  protected async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError((error as Error).message);
    }
  }

  protected clearCache(): void {
    this.cache.clear();
  }
} 