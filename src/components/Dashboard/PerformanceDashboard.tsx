import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, Activity, Award, Flame, Settings, Download, ArrowUpRight, TrendingDown,
  BookOpen, AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService } from '@/services/api/dashboard';
import { toast } from 'sonner';

// Enhanced Data Interfaces
interface FocusAreaData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  plannedHours: number;
  actualHours: number;
  weeklyTarget: number;
  monthlyData: number[];
  breakdown: {
    category: string;
    hours: number;
    percentage: number;
  }[];
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  efficiency: number;
  streak: number;
  badge?: string;
}

interface DashboardData {
  focusAreas: FocusAreaData[];
  totalPlanned: number;
  totalActual: number;
  overallEfficiency: number;
  completedGoals: number;
  activeStreak: number;
}

// Custom hooks for dashboard data
const useDashboardWeeklyStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: async () => {
      try {
        const response = await dashboardService.getWeeklyStats();
        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch weekly stats');
      } catch (error) {
        console.error('Failed to fetch weekly dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

const useDashboardMonthlyStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'monthly'],
    queryFn: async () => {
      try {
        const response = await dashboardService.getMonthlyStats();
        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch monthly stats');
      } catch (error) {
        console.error('Failed to fetch monthly dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Transform API data to dashboard format
const transformToDashboardData = (weeklyStats: any, monthlyStats: any): DashboardData => {
  // If API data is available, transform it
  if (weeklyStats && monthlyStats) {
    const learningHours = weeklyStats.studyTimeThisWeek || 0;
    const weeklyProgress = monthlyStats.weeklyProgress || [0, 0, 0, 0, 0, 0];
    
    return {
      focusAreas: [
        {
          id: 'learning',
          title: 'Learning',
          icon: <BookOpen className="w-6 h-6" />,
          color: 'from-blue-500 to-blue-600',
          plannedHours: 25,
          actualHours: learningHours,
          weeklyTarget: 30,
          monthlyData: weeklyProgress,
          breakdown: [
            { category: 'Technical Skills', hours: learningHours * 0.6, percentage: 60 },
            { category: 'Soft Skills', hours: learningHours * 0.25, percentage: 25 },
            { category: 'Industry Knowledge', hours: learningHours * 0.15, percentage: 15 }
          ],
          trend: learningHours > 20 ? 'up' : learningHours > 15 ? 'stable' : 'down',
          trendPercentage: Math.min(Math.max((learningHours / 25) * 100 - 100, -50), 50),
          efficiency: Math.round((learningHours / 25) * 100),
          streak: weeklyStats.currentStreak || 0,
          badge: learningHours > 25 ? 'Learning Champion' : learningHours > 15 ? 'Learning Warrior' : 'Getting Started'
        },
        {
          id: 'tasks',
          title: 'Task Completion',
          icon: <Activity className="w-6 h-6" />,
          color: 'from-emerald-500 to-emerald-600',
          plannedHours: weeklyStats.weeklyGoalProgress || 0,
          actualHours: weeklyStats.totalTasksCompleted || 0,
          weeklyTarget: 10,
          monthlyData: weeklyProgress.map((w: number) => w * 1.2),
          breakdown: [
            { category: 'High Priority', hours: (weeklyStats.totalTasksCompleted || 0) * 0.4, percentage: 40 },
            { category: 'Medium Priority', hours: (weeklyStats.totalTasksCompleted || 0) * 0.35, percentage: 35 },
            { category: 'Low Priority', hours: (weeklyStats.totalTasksCompleted || 0) * 0.25, percentage: 25 }
          ],
          trend: weeklyStats.completionRate > 80 ? 'up' : weeklyStats.completionRate > 60 ? 'stable' : 'down',
          trendPercentage: weeklyStats.completionRate - 70,
          efficiency: weeklyStats.completionRate || 0,
          streak: weeklyStats.currentStreak || 0,
          badge: weeklyStats.completionRate > 90 ? 'Task Master' : weeklyStats.completionRate > 70 ? 'Consistent Achiever' : 'Building Momentum'
        },
        {
          id: 'growth',
          title: 'Personal Growth',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'from-purple-500 to-purple-600',
          plannedHours: 15,
          actualHours: monthlyStats.studyTimeThisMonth / 4 || 10, // Weekly average
          weeklyTarget: 20,
          monthlyData: weeklyProgress.map((w: number) => w * 0.8),
          breakdown: [
            { category: 'Skill Development', hours: 8, percentage: 50 },
            { category: 'Knowledge Expansion', hours: 5, percentage: 30 },
            { category: 'Network Building', hours: 3, percentage: 20 }
          ],
          trend: 'up',
          trendPercentage: 15,
          efficiency: 125,
          streak: weeklyStats.currentStreak || 0,
          badge: 'Growth Mindset'
        },
        {
          id: 'performance',
          title: 'Overall Performance',
          icon: <Award className="w-6 h-6" />,
          color: 'from-amber-500 to-amber-600',
          plannedHours: 40,
          actualHours: 42,
          weeklyTarget: 45,
          monthlyData: weeklyProgress,
          breakdown: [
            { category: 'Productivity', hours: 18, percentage: 43 },
            { category: 'Quality', hours: 15, percentage: 36 },
            { category: 'Innovation', hours: 9, percentage: 21 }
          ],
          trend: 'up',
          trendPercentage: 8,
          efficiency: 105,
          streak: weeklyStats.currentStreak || 0,
          badge: 'High Performer'
        }
      ],
      totalPlanned: 100,
      totalActual: learningHours + (weeklyStats.totalTasksCompleted || 0) + 25,
      overallEfficiency: weeklyStats.completionRate || 75,
      completedGoals: weeklyStats.totalTasksCompleted || 0,
      activeStreak: weeklyStats.currentStreak || 0
    };
  }
  
  // Fallback data for loading/error states
  return {
    focusAreas: [],
    totalPlanned: 0,
    totalActual: 0,
    overallEfficiency: 0,
    completedGoals: 0,
    activeStreak: 0
  };
};

// Error boundary component for dashboard sections
const DashboardErrorBoundary: React.FC<{ children: React.ReactNode; onRetry: () => void }> = ({ children, onRetry }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Unable to Load Dashboard Data</h3>
          <p className="text-red-300/80 mb-4">
            We're having trouble connecting to the server. Please check your connection and try again.
          </p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
      {children}
    </div>
  );
};

// Enhanced Components
const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-8 bg-slate-700 rounded w-1/3"></div>
      <div className="h-10 bg-slate-700 rounded w-32"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-800 rounded-xl"></div>
      ))}
    </div>
  </div>
);

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable'; percentage: number }> = ({ trend, percentage }) => {
  const getIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-3 h-3 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <Activity className="w-3 h-3 text-slate-400" />;
    }
  };

  const getColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {getIcon()}
      <span className={`text-xs font-medium ${getColor()}`}>
        {percentage}%
      </span>
    </div>
  );
};

const CircularProgress: React.FC<{ 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  gradient: string;
}> = ({ value, size = 60, strokeWidth = 6, gradient }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gradient-${value}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.split(' ')[0]} />
            <stop offset="100%" stopColor={gradient.split(' ')[2]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(55, 65, 81)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${value})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-100">{value}%</span>
      </div>
    </div>
  );
};

const FocusAreaTile: React.FC<{
  data: FocusAreaData;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}> = ({ data, isHovered, onHover, onClick }) => {

  const progressPercentage = Math.round((data.actualHours / data.weeklyTarget) * 100);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
    >
      <Card className={`
        relative overflow-hidden transition-all duration-500 ease-out border-2
        ${isHovered 
          ? 'border-slate-600 shadow-2xl transform scale-[1.02] bg-slate-800/90' 
          : 'border-slate-700/50 bg-slate-800/60 hover:border-slate-600/50'
        }
      `}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-5 transition-opacity duration-500 ${
          isHovered ? 'opacity-10' : ''
        }`} />
        
        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${data.color} bg-opacity-20 backdrop-blur-sm`}>
              {React.cloneElement(data.icon as React.ReactElement, { 
                className: "w-6 h-6 text-slate-100" 
              })}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-100">{data.actualHours}h</div>
              <div className="text-xs text-slate-400">of {data.plannedHours}h planned</div>
              <TrendIndicator trend={data.trend} percentage={data.trendPercentage} />
            </div>
          </div>

          {/* Title and Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">{data.title}</h3>
              <CircularProgress 
                value={data.efficiency} 
                size={48} 
                gradient={data.color}
              />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Weekly Progress</span>
                <span>{progressPercentage}% of target</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${data.color} transition-all duration-1000 ease-out shadow-lg`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Badge and Streak */}
            <div className="flex items-center justify-between pt-2">
              {data.badge && (
                <div className="flex items-center space-x-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">{data.badge}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-400 font-medium">{data.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm p-6 flex flex-col justify-center opacity-100 transition-opacity duration-300">
              <h4 className="text-lg font-bold text-slate-100 mb-4">Time Breakdown</h4>
              <div className="space-y-3">
                {data.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-100">{item.hours}h</span>
                      <div className="w-12 bg-slate-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full bg-gradient-to-r ${data.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 text-center">Click for detailed analysis</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const WeeklyView: React.FC<{ data: DashboardData }> = ({ data }) => {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [expandedTile, setExpandedTile] = useState<string | null>(null);

  const handleTileClick = (tileId: string) => {
    setExpandedTile(expandedTile === tileId ? null : tileId);
  };

  return (
    <div className="space-y-8">
      {/* Weekly Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 overflow-x-hidden max-w-full">
        <Card className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 border-indigo-500/30 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{data.totalActual}h</div>
            <div className="text-xs text-slate-400">Total This Week</div>
            <div className="text-xs text-indigo-400 mt-1">+{data.totalActual - data.totalPlanned}h over plan</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-500/30 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{data.overallEfficiency}%</div>
            <div className="text-xs text-slate-400">Efficiency Score</div>
            <div className="text-xs text-emerald-400 mt-1">Excellent performance</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{data.completedGoals}</div>
            <div className="text-xs text-slate-400">Goals Completed</div>
            <div className="text-xs text-purple-400 mt-1">This week</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-500/30 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{data.activeStreak}</div>
            <div className="text-xs text-slate-400">Day Streak</div>
            <div className="text-xs text-amber-400 mt-1">Personal best!</div>
          </CardContent>
        </Card>
      </div>

      {/* Focus Area Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-hidden max-w-full">
        {data.focusAreas.map((area) => (
          <FocusAreaTile
            key={area.id}
            data={area}
            isHovered={hoveredTile === area.id}
            onHover={(hovered) => setHoveredTile(hovered ? area.id : null)}
            onClick={() => handleTileClick(area.id)}
          />
        ))}
      </div>

      {/* Expanded Tile View */}
      {expandedTile && (
        <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-xl rounded-2xl shadow-2xl">
          <CardContent className="p-8">
            {(() => {
              const area = data.focusAreas.find(a => a.id === expandedTile);
              if (!area) return null;
              
              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-100">{area.title} - Detailed Analysis</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setExpandedTile(null)}
                      className="border-slate-600 text-slate-400 hover:text-slate-100"
                    >
                      Close
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 overflow-x-hidden max-w-full">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-100">Planned vs Actual</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Planned:</span>
                          <span className="text-slate-100 font-medium">{area.plannedHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Actual:</span>
                          <span className="text-slate-100 font-medium">{area.actualHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difference:</span>
                          <span className={`font-medium ${
                            area.actualHours >= area.plannedHours ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {area.actualHours >= area.plannedHours ? '+' : ''}{(area.actualHours - area.plannedHours).toFixed(1)}h
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-100">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Efficiency:</span>
                          <span className="text-slate-100 font-medium">{area.efficiency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Streak:</span>
                          <span className="text-slate-100 font-medium">{area.streak} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Trend:</span>
                          <TrendIndicator trend={area.trend} percentage={area.trendPercentage} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-100">Achievement</h4>
                      <div className="text-center">
                        <CircularProgress 
                          value={area.efficiency} 
                          size={80} 
                          gradient={area.color}
                        />
                        {area.badge && (
                          <div className="mt-4 flex items-center justify-center space-x-2">
                            <Award className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-medium">{area.badge}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MonthlyView: React.FC<{ data: DashboardData }> = ({ data }) => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.focusAreas.map((area) => (
          <Card key={area.id} className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${area.color} bg-opacity-20`}>
                    {React.cloneElement(area.icon as React.ReactElement, { 
                      className: "w-5 h-5 text-slate-100" 
                    })}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{area.title}</h3>
                </div>
                <TrendIndicator trend={area.trend} percentage={area.trendPercentage} />
              </div>
              
              {/* Simple Chart Visualization */}
              <div className="space-y-4">
                <div className="h-32 flex items-end justify-between space-x-2">
                  {area.monthlyData.map((hours, index) => {
                    const maxHours = Math.max(...area.monthlyData);
                    const height = (hours / maxHours) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                        <div 
                          className={`w-full bg-gradient-to-t ${area.color} rounded-t transition-all duration-1000 ease-out`}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-slate-400">{months[index]}</span>
                        <span className="text-xs text-slate-100 font-medium">{hours}h</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">6-Month Trend</span>
                  <span className="text-slate-100 font-medium">
                    Total: {area.monthlyData.reduce((sum, hours) => sum + hours, 0)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const PerformanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [error, setError] = useState<string | null>(null);

  const { data: weeklyStats, isLoading: isLoadingWeekly, error: weeklyError, refetch: refetchWeekly } = useDashboardWeeklyStats();
  const { data: monthlyStats, isLoading: isLoadingMonthly, error: monthlyError, refetch: refetchMonthly } = useDashboardMonthlyStats();

  const dashboardData = transformToDashboardData(weeklyStats, monthlyStats);
  const isLoading = isLoadingWeekly || isLoadingMonthly;
  const hasError = weeklyError || monthlyError;

  useEffect(() => {
    if (hasError) {
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Unable to fetch dashboard statistics');
    } else {
      setError(null);
    }
  }, [hasError]);

  const handleRetry = () => {
    setError(null);
    refetchWeekly();
    refetchMonthly();
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-full overflow-x-hidden">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (hasError || error) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-full overflow-x-hidden">
          <DashboardErrorBoundary onRetry={handleRetry}>
            <LoadingSkeleton />
          </DashboardErrorBoundary>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-full space-y-6 sm:space-y-8 overflow-x-hidden">
        {/* Header */}
        <Card className="performance-card bg-slate-800/60 optimized-backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 animate-slide-up">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-4 tracking-tight gpu-accelerated">
                  Performance Dashboard
                </h1>
                <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                  Track your learning progress across different focus areas and monitor your growth over time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex bg-slate-700/50 rounded-xl p-1">
                  <Button
                    variant={activeTab === 'weekly' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('weekly')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === 'weekly'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-600/50'
                    }`}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={activeTab === 'monthly' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('monthly')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === 'monthly'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-600/50'
                    }`}
                  >
                    Monthly
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-slate-100 hover:scale-105 transition-all duration-200">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-slate-100 hover:scale-105 transition-all duration-200">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {activeTab === 'weekly' ? (
            <WeeklyView data={dashboardData} />
          ) : (
            <MonthlyView data={dashboardData} />
          )}
        </div>
      </div>
    </div>
  );
}; 