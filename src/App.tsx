import '@/App.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import Index from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - good balance for user data
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: (failureCount, error: any) => {
        // Don't retry on certain error types
        if (error?.response?.status === 404 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnMount: false, // Use cached data when available
      refetchOnReconnect: 'always', // Refetch on network reconnect
      // Optimize network usage
      networkMode: 'online',
      // Enable background refetching for fresh data
      refetchInterval: false, // Disable automatic intervals
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      // Optimize mutation performance
      networkMode: 'online',
    },
  },
});

function AppContent() {
  const { checkSession } = useAuthStore();

  // Session validation
  useEffect(() => {
    // Check session on app load
    checkSession();
  }, [checkSession]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gaming-dark text-white">
        <Index />
        <Toaster 
          position="top-right" 
          duration={4000}
          closeButton
          richColors
        />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App; 