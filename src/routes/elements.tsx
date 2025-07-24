import { lazy, Suspense, ReactNode, ComponentType, memo } from 'react';
import { SkeletonCard } from '@/components/ui/skeleton';

// Optimized loading fallback component
const LoadingFallback = memo(() => (
  <div className="min-h-screen w-full bg-gaming-dark p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Optimized Loadable HOC with better error boundary and loading states
const Loadable = <P extends object>(Component: ComponentType<P>) => {
  const LoadableComponent = memo((props: P): ReactNode => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  ));
  
  LoadableComponent.displayName = `Loadable(${Component.displayName || Component.name || 'Component'})`;
  
  return LoadableComponent;
};

// Lazy load components with optimized imports
export const UserDashboard = Loadable(lazy(() => 
  import('@/pages/public/UserDashboard').then(module => ({ default: module.default }))
));

export const AdminDashboard = Loadable(lazy(() => 
  import('@/pages/public/AdminDashboard').then(module => ({ default: module.default }))
));

export const Login = Loadable(lazy(() => 
  import('@/pages/auth/Login').then(module => ({ default: module.default }))
));

export const NotFound = Loadable(lazy(() => 
  import('@/pages/auth/NotFound').then(module => ({ default: module.default }))
));

export const Register = Loadable(lazy(() => 
  import('@/pages/auth/Register').then(module => ({ default: module.default }))
));

export const ForgotPassword = Loadable(lazy(() => 
  import('@/pages/auth/ForgotPassword').then(module => ({ default: module.default }))
));

export const ResetPassword = Loadable(lazy(() => 
  import('@/pages/auth/ResetPassword').then(module => ({ default: module.default }))
));

export const DailyReports = Loadable(lazy(() => 
  import('@/pages/public/DailyReports').then(module => ({ default: module.default }))
));

export const Verification = Loadable(lazy(() => 
  import('@/pages/auth/Verification').then(module => ({ default: module.default }))
));

export const WeeklyReports = Loadable(lazy(() => 
  import('@/pages/public/WeeklyReports').then(module => ({ default: module.default }))
));

export const EndOfDayReports = Loadable(lazy(() => 
  import('@/pages/public/EndOfDayReports').then(module => ({ default: module.default }))
));

export const LeaderBoard = Loadable(lazy(() => 
  import('@/pages/public/LeaderBoard').then(module => ({ default: module.default }))
));

export const Profile = Loadable(lazy(() => 
  import('@/pages/public/Profile').then(module => ({ default: module.default }))
));

export const AcceptInvitation = Loadable(lazy(() => 
  import('@/pages/auth/AcceptInvitation').then(module => ({ default: module.AcceptInvitation }))
));