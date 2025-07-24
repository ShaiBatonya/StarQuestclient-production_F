import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  Trophy,
  Target
} from 'lucide-react';

interface ReportsContentPanelProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null | undefined;
  onBack?: () => void;
  showBackButton?: boolean;
  headerActions?: React.ReactNode;
  className?: string;
}

export const ReportsContentPanel: React.FC<ReportsContentPanelProps> = ({
  title,
  children,
  isLoading = false,
  error = null,
  onBack,
  showBackButton = false,
  headerActions,
  className = '',
}) => {
  // Loading state - Improved responsive design
  if (isLoading) {
    return (
      <div className={`flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 ${className}`}>
        <div className="flex items-center justify-center h-full min-h-[400px] sm:min-h-[500px] p-4 sm:p-6">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 sm:p-8 lg:p-12 text-center max-w-sm sm:max-w-md mx-auto w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 animate-spin" />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Loading your content...</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Please wait while we fetch your latest data and prepare everything for you.</p>
            </div>
            <div className="mt-4 sm:mt-6 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Improved responsive design
  if (error) {
    return (
      <div className={`flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 ${className}`}>
        <div className="flex items-center justify-center h-full min-h-[400px] sm:min-h-[500px] p-4 sm:p-6">
          <div className="bg-slate-800/50 backdrop-blur border border-red-500/20 rounded-2xl p-6 sm:p-8 lg:p-12 text-center max-w-sm sm:max-w-md mx-auto w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Oops! Something went wrong</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base break-words">{error}</p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4">
                <p className="text-red-300 text-xs sm:text-sm">
                  Don't worry, this is usually temporary. Try refreshing the page or check your connection.
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 sm:mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl px-4 sm:px-6 py-2.5 font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 touch-manipulation w-full sm:w-auto"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col ${className}`}>
      {/* Enhanced Header - Improved mobile layout */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur">
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-slate-600/50 text-slate-400 hover:text-white hover:border-slate-500/50 hover:bg-slate-700/50 rounded-xl px-3 sm:px-4 py-2 transition-all duration-200 backdrop-blur group touch-manipulation flex-shrink-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="hidden sm:inline">Back</span>
                <span className="sm:hidden">‹</span>
              </Button>
            )}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-1 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate">
                {title}
              </h1>
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      {/* Content - Internal scrolling area with improved mobile padding */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced Empty state component - Improved responsive design
export const EmptyReportState: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, icon, actionText, onAction }) => (
  <div className="flex items-center justify-center h-full min-h-[400px] sm:min-h-[500px] p-4 sm:p-6">
    <div className="text-center max-w-sm sm:max-w-lg mx-auto w-full">
      <div className="relative mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-600/50 rounded-2xl flex items-center justify-center mx-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400">
            {icon}
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm sm:text-base lg:text-lg">{description}</p>
      </div>

      {actionText && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 touch-manipulation w-full sm:w-auto"
        >
          <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  </div>
);

// Enhanced Status card component - Improved responsive design
export const StatusCard: React.FC<{
  status: 'pending' | 'submitted' | 'completed' | 'blocked';
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  actions?: React.ReactNode;
}> = ({ 
  status, 
  title, 
  description, 
  icon, 
  variant = 'info',
  actions 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30';
      case 'error':
        return 'bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30';
      default:
        return 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30';
    }
  };



  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
      default:
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
    }
  };

  return (
    <Card className={`${getVariantClasses()} mb-4 sm:mb-6 rounded-xl backdrop-blur border`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${getVariantClasses()} border flex items-center justify-center flex-shrink-0`}>
              {icon || getStatusIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1 break-words">{title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base break-words">{description}</p>
            </div>
          </div>
          {actions && (
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 