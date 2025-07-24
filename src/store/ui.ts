import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isAdminSidebarOpen: boolean; // NEW: admin sidebar state
  isMobile: boolean;
  theme: 'light' | 'dark';
  isLoading: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAdminSidebarOpen: (open: boolean) => void; // NEW: admin sidebar action
  setMobile: (mobile: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // State - Sidebar collapsed by default
      isSidebarOpen: false,
      isAdminSidebarOpen: false, // NEW: admin sidebar state
      isMobile: false,
      theme: 'dark',
      isLoading: false,
      notifications: [],

      // Actions
      toggleSidebar: () => {
        const newState = !get().isSidebarOpen;
        set({ isSidebarOpen: newState });
        // Persist immediately to localStorage
        localStorage.setItem('starquest-sidebar', JSON.stringify({ isSidebarOpen: newState }));
      },

      setSidebarOpen: (isSidebarOpen: boolean) => {
        set({ isSidebarOpen });
        // Persist immediately to localStorage
        localStorage.setItem('starquest-sidebar', JSON.stringify({ isSidebarOpen }));
      },

      setAdminSidebarOpen: (isAdminSidebarOpen: boolean) => {
        set({ isAdminSidebarOpen });
      },

      setMobile: (isMobile: boolean) => set({ isMobile }),

      setTheme: (theme: 'light' | 'dark') => set({ theme }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      addNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto remove after duration
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },

      removeNotification: (id: string) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'starquest-ui',
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        theme: state.theme,
      }),
    }
  )
); 