import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Shield, 
  Settings, 
  RefreshCw, 
  Search,
  Filter,
  Download,
  Activity,
  TrendingUp,
  CheckCircle,
  Menu,
  X,
  Building,
  Target,
  Crown,
  Mail,
  Stethoscope,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCurrentAdmin, useRefreshAdminData } from '@/hooks/useAdmin';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { ReportsManagement } from '@/components/admin/ReportsManagement';
import { TaskManagement } from '@/components/admin/TaskManagement';
import { PositionManagement } from '@/components/admin/PositionManagement';
import { WorkspaceManagement } from '@/components/admin/WorkspaceManagement';
import { QuestOversight } from '@/components/admin/QuestOversight';
import { InvitationDashboard } from '@/components/admin/InvitationDashboard';
import { InvitationStatusChecker } from '@/components/admin/InvitationStatusChecker';
import { InvitationDebugger } from '@/components/admin/InvitationDebugger';
import { EmailSystemAuditor } from '@/components/admin/EmailSystemAuditor';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui';

type AdminTab = 'overview' | 'users' | 'analytics' | 'reports' | 'tasks' | 'positions' | 'workspaces' | 'quests' | 'invitations' | 'status' | 'debug' | 'email' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setAdminSidebarOpen } = useUIStore();

  // Get current admin user info (AdminRoute already verified access)
  const { data: currentAdmin, isLoading: loadingAdmin } = useCurrentAdmin();
  const refreshData = useRefreshAdminData();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768; // Standardized to match main layout (768px)
      setIsMobile(isMobileDevice);
      if (!isMobileDevice) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Coordinate admin sidebar state with global UI store
  useEffect(() => {
    setAdminSidebarOpen(isMobileSidebarOpen);
    // Lock body scroll when admin sidebar is open on mobile
    if (isMobileSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen, isMobile, setAdminSidebarOpen]);

  // Handle tab change and close mobile sidebar
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Loading state for admin info
  if (loadingAdmin) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Admin Panel</h3>
          <p className="text-slate-400">Please wait while we load your admin dashboard...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { id: 'overview', label: 'Overview', icon: Activity, description: 'System overview and quick stats' },
    { id: 'users', label: 'User Management', icon: Users, description: 'Manage users and permissions' },
    { id: 'workspaces', label: 'Workspaces', icon: Building, description: 'Manage workspaces and invitations' },
    { id: 'invitations', label: 'Invitations', icon: Mail, description: 'Monitor and manage invitations' },
    { id: 'status', label: 'System Status', icon: Stethoscope, description: 'Diagnostic tools and system health' },
    { id: 'debug', label: 'API Debug', icon: Bug, description: 'Debug invitation API calls step by step' },
    { id: 'email', label: 'Email Audit', icon: Mail, description: 'Production email system verification & SendGrid testing' },
    { id: 'tasks', label: 'Task Management', icon: Target, description: 'Create and assign tasks' },
    { id: 'positions', label: 'Positions', icon: Crown, description: 'Manage workspace positions' },
    { id: 'quests', label: 'Quest Oversight', icon: TrendingUp, description: 'Monitor user quest progress' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'View detailed analytics and reports' },
    { id: 'reports', label: 'Reports', icon: FileText, description: 'Manage all system reports' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System configuration' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement searchTerm={searchTerm} />;
      case 'workspaces':
        return <WorkspaceManagement searchTerm={searchTerm} />;
      case 'invitations':
        return <InvitationDashboard searchTerm={searchTerm} />;
      case 'status':
        return <InvitationStatusChecker />;
      case 'debug':
        return <InvitationDebugger />;
      case 'email':
        return <EmailSystemAuditor />;
      case 'tasks':
        return <TaskManagement searchTerm={searchTerm} />;
      case 'positions':
        return <PositionManagement searchTerm={searchTerm} />;
      case 'quests':
        return <QuestOversight searchTerm={searchTerm} />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'reports':
        return <ReportsManagement searchTerm={searchTerm} />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close sidebar"
          aria-modal="true"
          tabIndex={0}
          role="dialog"
          onKeyDown={e => { if (e.key === 'Escape') setIsMobileSidebarOpen(false); }}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={cn(
        "flex-shrink-0 bg-gradient-to-b from-slate-800/50 to-slate-800/30 border-r border-slate-700/50 backdrop-blur transition-all duration-300 overflow-hidden z-[101]",
        isMobile 
          ? cn(
              "fixed left-0 top-0 h-full z-[101]",
              isMobileSidebarOpen 
                ? "w-72 translate-x-0 shadow-2xl"
                : "w-0 -translate-x-full"
            )
          : "w-72 md:w-80 relative"
      )}
      id="mobile-sidebar"
      role="navigation"
      aria-label="Admin navigation"
      tabIndex={0}
      >
        {/* Admin Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">Admin Panel</h1>
                <p className="text-slate-400 text-xs sm:text-sm truncate">
                  {loadingAdmin ? 'Loading...' : `Welcome, ${currentAdmin?.firstName || 'Admin'}`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsMobileSidebarOpen(false)}
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2">
          {navigation.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as AdminTab)}
              className={cn(
                "w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-left",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full max-w-full">
        {/* Header */}
        <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/20 backdrop-blur w-full overflow-x-hidden">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                onClick={() => setIsMobileSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="md:hidden border-slate-600/50 text-slate-400 hover:text-white"
                aria-label="Open sidebar"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-1 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate">
                  {navigation.find(tab => tab.id === activeTab)?.label}
                </h1>
              </div>
            </div>
            
            {/* Desktop Search and Actions */}
            {(activeTab === 'users' || activeTab === 'reports' || activeTab === 'tasks' || activeTab === 'positions' || activeTab === 'workspaces' || activeTab === 'quests') && (
              <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400"
                    aria-label={`Search ${activeTab}`}
                    role="searchbox"
                  />
                </div>
                <Button
                  onClick={refreshData}
                  variant="outline"
                  size="sm"
                  className="border-slate-600/50 text-slate-400 hover:text-white"
                  aria-label="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600/50 text-slate-400 hover:text-white px-2 sm:px-3"
                aria-label="Filter results"
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600/50 text-slate-400 hover:text-white px-2 sm:px-3"
                aria-label="Export data"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Search - Show below on mobile */}
          {(activeTab === 'users' || activeTab === 'reports' || activeTab === 'tasks' || activeTab === 'positions' || activeTab === 'workspaces' || activeTab === 'quests') && (
            <div className="mt-3 sm:mt-4 md:hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400"
                  aria-label={`Search ${activeTab}`}
                  role="searchbox"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Overview Component - Enhanced responsive layout with fixed metrics alignment
const AdminOverview: React.FC = () => (
  <div className="p-3 sm:p-4 md:p-6 overflow-x-hidden w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 w-full">
      {/* Quick Stats Cards - Improved responsive layout and metrics alignment */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-2xl p-3 sm:p-4 md:p-6 hover:border-slate-500/40 transition-all duration-200 min-w-0 w-full">
        <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4 gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-blue-400" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
            +12%
          </Badge>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight break-words">
            1,284
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-tight break-words">
            Total Users
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-2xl p-3 sm:p-4 md:p-6 hover:border-slate-500/40 transition-all duration-200 min-w-0 w-full">
        <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4 gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-emerald-400" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
            +8%
          </Badge>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight break-words">
            95.2%
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-tight break-words">
            Active Users
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-2xl p-3 sm:p-4 md:p-6 hover:border-slate-500/40 transition-all duration-200 min-w-0 w-full">
        <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4 gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-purple-400" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
            +23%
          </Badge>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight break-words">
            3,847
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-tight break-words">
            Reports Submitted
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-2xl p-3 sm:p-4 md:p-6 hover:border-slate-500/40 transition-all duration-200 min-w-0 w-full">
        <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4 gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-yellow-400" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
            +15%
          </Badge>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight break-words">
            87.5%
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-tight break-words">
            Completion Rate
          </p>
        </div>
      </div>
    </div>

    {/* Recent Activity - Improved responsive layout */}
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-2xl p-3 sm:p-4 md:p-6 hover:border-slate-500/40 transition-all duration-200 overflow-hidden max-w-full">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4 md:mb-6">Recent System Activity</h3>
      <div className="space-y-2 sm:space-y-3 lg:space-y-4 max-h-[400px] overflow-y-auto">
        {[
          { type: 'user', message: 'New user registered: john.doe@email.com', time: '2 minutes ago', status: 'success' },
          { type: 'report', message: 'Weekly report submitted by Sarah Chen', time: '15 minutes ago', status: 'info' },
          { type: 'admin', message: 'User permissions updated for workspace #47', time: '1 hour ago', status: 'warning' },
          { type: 'system', message: 'Database backup completed successfully', time: '3 hours ago', status: 'success' },
        ].map((activity, index) => (
          <div key={index} className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4 p-2.5 sm:p-3 lg:p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/40 transition-all duration-200 min-w-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${
              activity.status === 'success' ? 'bg-emerald-400' :
              activity.status === 'warning' ? 'bg-yellow-400' :
              activity.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm lg:text-base break-words leading-relaxed">{activity.message}</p>
              <p className="text-slate-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Settings Component - Enhanced responsive layout
const AdminSettings: React.FC = () => (
  <div className="p-3 sm:p-4 lg:p-6">
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-slate-500/40 transition-all duration-200">
      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
        <Settings className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-slate-400" />
      </div>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">System Settings</h3>
      <p className="text-slate-400 mb-4 sm:mb-5 lg:mb-6 max-w-md mx-auto text-sm sm:text-base leading-relaxed">Advanced system configuration options will be available here.</p>
      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 touch-manipulation">
        Configure Settings
      </Button>
    </div>
  </div>
);

export default AdminDashboard;
