import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { paths } from '@/routes/paths';

interface PrivateRouteProps {
  children: ReactNode;
}

interface AdminRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gaming-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Verifying Admin Access</h3>
          <p className="text-slate-400">Please wait while we check your permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    // Redirect to dashboard if not admin
    return <Navigate to={paths.UserDashboard} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 