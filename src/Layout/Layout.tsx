import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import SideBar from '@/components/ui/sidebar.tsx';
import { useUIStore } from '@/store/ui';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen, isMobile, setMobile } = useUIStore();

  // Mobile detection and responsive handling
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768; // md breakpoint
      setMobile(isMobileDevice);
      
      // Don't auto-collapse sidebar on mobile - keep it accessible
      // Users can manually toggle if they prefer
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setMobile]);

  // Close sidebar on mobile when clicking outside (only if it's expanded)
  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full max-w-full bg-slate-950 overflow-hidden overflow-x-hidden m-0 p-0">
      {/* Mobile Overlay - only show when sidebar is expanded on mobile */}
      {isAuthenticated && isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={handleOverlayClick}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar - Always visible and responsive */}
      {isAuthenticated && (
        <div className={cn(
          "flex-shrink-0 h-full transition-all duration-300 ease-in-out border-r border-slate-700/50",
          "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20",
          // Responsive width behavior - always visible but adjusts size
          isMobile 
            ? cn(
                "fixed left-0 top-0 z-50 md:relative",
                // On mobile: narrow when collapsed, wider when expanded
                isSidebarOpen 
                  ? "w-64" 
                  : "w-16"
              )
            : cn(
                "relative",
                // On desktop: responsive widths
                isSidebarOpen 
                  ? "w-64 sm:w-72 lg:w-80" 
                  : "w-16 sm:w-18 lg:w-20"
              )
        )}>
          <SideBar />
        </div>
      )}

      {/* Main content area */}
      <div className={cn(
        "flex-1 flex flex-col w-full max-w-full overflow-hidden overflow-x-hidden transition-all duration-300 h-full",
        // Remove mobile margin that causes overflow - use padding instead if needed
        isMobile && isAuthenticated ? "pl-16" : ""
      )}>
        {/* Content with professional gradient background */}
        <main className={cn(
          "flex-1 w-full max-w-full overflow-auto overflow-x-hidden scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/50",
          "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
          "relative h-full m-0 p-0"
        )}>
          {/* Subtle animated background effects - constrained to prevent overflow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse pointer-events-none max-w-full" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse pointer-events-none max-w-full" style={{ animationDelay: '2s' }} />
          
          <div className="relative z-10 h-full w-full max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
