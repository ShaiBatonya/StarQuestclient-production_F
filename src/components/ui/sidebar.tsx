import { useState, useMemo, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  FileText, 
  Target, 
  Map, 
  Trophy, 
  Settings, 
  LogOut,
  Home,
  Calendar,
  Clock,
  User,
  Shield,
  type LucideIcon
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Import assets
import Logo from '@/assets/Logo.png';
import Avatarpng from '@/assets/Avatarpng.png';
import sidepng from '@/assets/sidepng.png';

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
  group: 'main' | 'reports' | 'admin';
  badge?: string | number;
  adminOnly?: boolean;
}

interface AccountItem {
  name: string;
  icon: LucideIcon;
  action: () => void;
  isDestructive?: boolean;
}

// Memoized Navigation Link Component for better performance
const NavigationLink = memo<{ item: NavigationItem; isSidebarOpen: boolean; isActive: boolean }>(
  ({ item, isSidebarOpen, isActive }) => {
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        className={cn(
          'group flex items-center px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 relative',
          'hover:scale-[1.02] active:scale-[0.98] touch-manipulation',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
          isActive
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        )}
        aria-current={isActive ? 'page' : undefined}
        title={!isSidebarOpen ? item.name : undefined}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full animate-scale-in" />
        )}
        
        <Icon
          size={18}
          className={cn(
            'flex-shrink-0 transition-transform duration-200 min-w-[18px]',
            isSidebarOpen ? 'mr-2 sm:mr-3' : 'mx-auto',
            isActive ? 'scale-110' : 'group-hover:scale-105'
          )}
        />
        
        {isSidebarOpen && (
          <span className="truncate font-medium animate-fade-in text-xs sm:text-sm">{item.name}</span>
        )}
        
        {item.badge && isSidebarOpen && (
          <span className="ml-auto px-1.5 sm:px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-400 rounded-full animate-fade-in">
            {item.badge}
          </span>
        )}
      </Link>
    );
  }
);

NavigationLink.displayName = 'NavigationLink';

// Memoized Account Button Component
const AccountButton = memo<{ 
  item: AccountItem; 
  isSidebarOpen: boolean; 
  isLoading: boolean 
}>(({ item, isSidebarOpen, isLoading }) => {
  const Icon = item.icon;
  const showLoading = isLoading && item.isDestructive;
  
  return (
    <button
      onClick={item.action}
      disabled={isLoading}
      title={!isSidebarOpen ? item.name : undefined}
      className={cn(
        'w-full flex items-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group touch-manipulation',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
        'hover:scale-[1.02] active:scale-[0.98]',
        item.isDestructive 
          ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-300',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
      )}
    >
      <Icon
        size={16}
        className={cn(
          'flex-shrink-0 transition-transform duration-200 min-w-[16px]',
          isSidebarOpen ? 'mr-2 sm:mr-3' : 'mx-auto',
          showLoading && 'animate-spin',
          'group-hover:scale-105'
        )}
      />
      {isSidebarOpen && (
        <span className="truncate animate-fade-in text-xs sm:text-sm">{item.name}</span>
      )}
    </button>
  );
});

AccountButton.displayName = 'AccountButton';

// Memoized User Profile Section
const UserProfile = memo<{ 
  user: any; 
  isSidebarOpen: boolean 
}>(({ user, isSidebarOpen }) => {
  // Lazy load avatar with fallback
  const [avatarSrc, setAvatarSrc] = useState(user.avatar || Avatarpng);
  const [avatarError, setAvatarError] = useState(false);

  const handleAvatarError = useCallback(() => {
    if (!avatarError) {
      setAvatarError(true);
      setAvatarSrc(Avatarpng);
    }
  }, [avatarError]);

  const handleAvatarLoad = useCallback(() => {
    setAvatarError(false);
  }, []);

  return (
    <div className={cn(
      "border-b border-slate-700/50 transition-all duration-300",
      isSidebarOpen ? "px-2 sm:px-4 py-4 sm:py-6" : "px-1 sm:px-2 py-3 sm:py-4"
    )}>
      <div className={cn(
        "flex items-center transition-all duration-300",
        isSidebarOpen ? "space-x-2 sm:space-x-4" : "flex-col space-y-1 sm:space-y-2"
      )}>
        <div className="relative group flex-shrink-0">
          <img
            src={avatarSrc}
            alt="User Avatar"
            className={cn(
              "rounded-xl object-cover ring-2 ring-indigo-500/30 transition-all duration-200 group-hover:ring-indigo-500/50 group-hover:scale-105",
              isSidebarOpen ? "w-10 sm:w-12 h-10 sm:h-12" : "w-8 sm:w-10 h-8 sm:h-10"
            )}
            onError={handleAvatarError}
            onLoad={handleAvatarLoad}
            loading="lazy"
          />
          {/* Online indicator */}
          <div className={cn(
            "absolute bg-green-500 rounded-full border-2 border-slate-900 animate-pulse",
            isSidebarOpen ? "-bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-3 sm:w-4 h-3 sm:h-4" : "-bottom-0.5 -right-0.5 w-2.5 sm:w-3 h-2.5 sm:h-3"
          )} />
        </div>
        {isSidebarOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base truncate animate-fade-in">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-slate-400 text-xs sm:text-sm truncate capitalize flex items-center space-x-1 animate-fade-in">
              <span>Level {user.level || 1}</span>
              <span>•</span>
              <span className="capitalize">{user.role}</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Quick stats - only show when expanded and on larger screens */}
      {isSidebarOpen && (
        <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2 animate-fade-in">
          <div className="text-center p-1.5 sm:p-2 bg-slate-800/50 rounded-lg">
            <div className="text-indigo-400 font-semibold text-xs sm:text-sm">{user.stars || 0}</div>
            <div className="text-slate-400 text-xs">Points</div>
          </div>
          <div className="text-center p-1.5 sm:p-2 bg-slate-800/50 rounded-lg">
            <div className="text-emerald-400 font-semibold text-xs sm:text-sm">{user.badges?.length || 0}</div>
            <div className="text-slate-400 text-xs">Badges</div>
          </div>
          <div className="text-center p-1.5 sm:p-2 bg-slate-800/50 rounded-lg">
            <div className="text-purple-400 font-semibold text-xs sm:text-sm">{user.level || 1}</div>
            <div className="text-slate-400 text-xs">Level</div>
          </div>
        </div>
      )}
    </div>
  );
});

UserProfile.displayName = 'UserProfile';

const SideBar = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems: NavigationItem[] = useMemo(() => [
    { name: 'Dashboard', path: '/', icon: Home, group: 'main' },
    { name: 'Quest Board', path: '/quest', icon: Target, group: 'main' },
    { name: 'Learning Roadmap', path: '/learning-roadmap', icon: Map, group: 'main' },  
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, group: 'main' },
    { name: 'Daily Reports', path: '/daily-reports', icon: Calendar, group: 'reports' },
    { name: 'Weekly Reports', path: '/weekly-reports', icon: FileText, group: 'reports' },
    { name: 'End of Day Reports', path: '/end-of-day-reports', icon: Clock, group: 'reports' },
    { name: 'Admin Panel', path: '/admin', icon: Shield, group: 'admin', adminOnly: true },
  ], []);

  // Memoize account items
  const accountItems: AccountItem[] = useMemo(() => [
    { 
      name: 'Profile', 
      icon: User, 
      action: () => navigate('/profile'),
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      action: () => console.log('Settings'),
    },
    { 
      name: 'Log Out', 
      icon: LogOut, 
      action: handleLogout,
      isDestructive: true
    },
  ], [handleLogout, navigate]);

  // Memoize filtered navigation items
  const filteredNavigationItems = useMemo(() => 
    navigationItems.filter(item => {
      if (item.adminOnly) {
        return isAdmin();
      }
      return true;
    }),
    [navigationItems, isAdmin]
  );

  // Memoize grouped navigation items
  const groupedNavItems = useMemo(() => ({
    main: filteredNavigationItems.filter(item => item.group === 'main'),
    reports: filteredNavigationItems.filter(item => item.group === 'reports'),
    admin: filteredNavigationItems.filter(item => item.group === 'admin'),
  }), [filteredNavigationItems]);

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header with gradient overlay */}
      <div 
        className={cn(
          "relative flex items-center justify-between overflow-hidden transition-all duration-300",
          isSidebarOpen ? "h-16 sm:h-20 px-2 sm:px-4" : "h-14 sm:h-16 px-1 sm:px-2"
        )}
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%), url(${sidepng})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
        
        {/* Logo and Title */}
        <div className="relative z-10 flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <img 
            src={Logo} 
            alt="StarQuest Logo" 
            className={cn(
              "drop-shadow-lg hover:scale-105 transition-transform duration-200 flex-shrink-0",
              isSidebarOpen ? "h-8 sm:h-10 w-auto" : "h-6 sm:h-8 w-auto"
            )}
            loading="eager"
          /> 
       {/*    {isSidebarOpen && (
            <span className="text-white font-bold text-sm sm:text-lg tracking-wide truncate animate-fade-in">
              StarQuest
            </span>
          )} */}
        </div>
        
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "relative z-10 text-white hover:bg-white/20 hover:text-white transition-all duration-200 rounded-lg backdrop-blur-sm flex-shrink-0",
            isSidebarOpen ? "w-8 sm:w-10 h-8 sm:h-10" : "w-6 sm:w-8 h-6 sm:h-8"
          )}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft size={isSidebarOpen ? 16 : 14} /> : <ChevronRight size={isSidebarOpen ? 16 : 14} />}
        </Button>
      </div>

      {/* User Profile */}
      {user && (
        <UserProfile user={user} isSidebarOpen={isSidebarOpen} />
      )}

      {/* Navigation */}
      <div className={cn(
        "flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/50 space-y-4 sm:space-y-6",
        isSidebarOpen ? "py-3 sm:py-4 px-2 sm:px-3" : "py-3 sm:py-4 px-1 sm:px-2"
      )}>
        {/* Main Navigation */}
        <div>
          {isSidebarOpen && (
            <h3 className="px-2 sm:px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 animate-fade-in">
              Main Menu
            </h3>
          )}
          <nav className="space-y-0.5 sm:space-y-1" role="navigation" aria-label="Main navigation">
            {groupedNavItems.main.map((item) => (
              <NavigationLink 
                key={item.name} 
                item={item} 
                isSidebarOpen={isSidebarOpen}
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>
        </div>

        {/* Reports Section */}
        <div>
          {isSidebarOpen && (
            <h3 className="px-2 sm:px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 animate-fade-in">
              Reports & Analytics
            </h3>
          )}
          <nav className="space-y-0.5 sm:space-y-1" role="navigation" aria-label="Reports navigation">
            {groupedNavItems.reports.map((item) => (
              <NavigationLink 
                key={item.name} 
                item={item} 
                isSidebarOpen={isSidebarOpen}
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>
        </div>

        {/* Admin Section - Only show for admins */}
        {groupedNavItems.admin.length > 0 && (
          <div>
            {isSidebarOpen && (
              <h3 className="px-2 sm:px-3 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2 sm:mb-3 animate-fade-in">
                Administration
              </h3>
            )}
            <nav className="space-y-0.5 sm:space-y-1" role="navigation" aria-label="Admin navigation">
              {groupedNavItems.admin.map((item) => (
                <NavigationLink 
                  key={item.name} 
                  item={item} 
                  isSidebarOpen={isSidebarOpen}
                  isActive={location.pathname === item.path}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Account Section */}
      <div className={cn(
        "border-t border-slate-700/50 transition-all duration-300",
        isSidebarOpen ? "p-2 sm:p-3" : "p-1.5 sm:p-2"
      )}>
        {isSidebarOpen && (
          <h3 className="px-2 sm:px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 animate-fade-in">
            Account
          </h3>
        )}
        <nav className="space-y-0.5 sm:space-y-1" role="navigation" aria-label="Account navigation">
          {accountItems.map((item) => (
            <AccountButton 
              key={item.name} 
              item={item} 
              isSidebarOpen={isSidebarOpen}
              isLoading={isLoading}
            />
          ))}
        </nav>
      </div>
    </div>
  );
});

SideBar.displayName = 'SideBar';

export default SideBar; 