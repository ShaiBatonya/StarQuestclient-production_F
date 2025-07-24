import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/User';
import { AuthStore } from '@/types/Auth';
import { authService } from '@/services/api';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) =>
        set({ user, isAuthenticated: !!user, error: null }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),

      logout: async () => {
        try {
          // Call backend logout endpoint to clear JWT cookie
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        // Clear client-side state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      // Check if current user is admin
      isAdmin: () => {
        const state = get();
        return state.user?.role === 'admin';
      },

      // Session validation with backend
      checkSession: async () => {
        const state = get();
        
        // If already loading or no stored user, skip
        if (state.isLoading) return;
        
        set({ isLoading: true, error: null });
        
        try {
          // Validate session with backend
          const response = await authService.getCurrentUser();
          
          if (response.status === 'success' && response.data) {
            // Session is valid, update user data
            set({ 
              user: response.data, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
          } else {
            // Session invalid, clear state
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false,
              error: null 
            });
          }
        } catch (error: any) {
          // Session invalid (401, 403, etc.), clear state
          console.log('Session validation failed:', error.response?.status);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        }
      },
    }),
    {
      name: 'starquest-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist loading and error states
      }),
    }
  )
); 