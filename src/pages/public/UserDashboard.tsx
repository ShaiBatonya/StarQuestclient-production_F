import { useAuthStore } from '@/store/auth';
import { PerformanceDashboard } from '@/components/Dashboard/PerformanceDashboard';
import { Loader2 } from 'lucide-react';

export default function UserDashboard(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden m-0 p-0">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shadow-2xl">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Loading Dashboard</h2>
            <p className="text-gray-400">Preparing your StarQuest experience...</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 relative overflow-hidden m-0 p-0">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-gray-900 to-orange-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 text-center space-y-8 animate-slide-up max-w-lg mx-auto px-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/30 flex items-center justify-center shadow-2xl">
            <Loader2 className="w-12 h-12 text-red-400 animate-spin" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Authentication Required</h2>
            <p className="text-gray-400 text-lg leading-relaxed">You need to be logged in to view your dashboard and access your learning journey.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-medium">Checking authentication status...</span>
            </div>
            <div className="text-sm text-gray-400">
              Please wait while we verify your session or redirect you to login.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden m-0 p-0">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 h-full w-full animate-fade-in">
        <PerformanceDashboard />
      </div>
    </div>
  );
}
