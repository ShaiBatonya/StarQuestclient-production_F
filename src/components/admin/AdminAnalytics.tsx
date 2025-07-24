import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  Target, 
  Clock,
  RefreshCw,
  AlertTriangle,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  useAdminWeeklyStats, 
  useAdminMonthlyStats 
} from '@/hooks/useAdmin';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  iconColor 
}) => (
  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
    <CardContent className="p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        {change && (
          <Badge className={`text-xs font-medium px-2 py-1 flex-shrink-0 ${
            changeType === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            changeType === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            'bg-slate-500/10 text-slate-400 border-slate-500/20'
          }`}>
            {change}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">{value}</h3>
        <p className="text-slate-400 text-xs sm:text-sm break-words">{title}</p>
      </div>
    </CardContent>
  </Card>
);

interface CategoryChartProps {
  categories: Array<{
    category: string;
    totalHours: number;
    percentage: number;
  }>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  const maxHours = Math.max(...categories.map(c => c.totalHours), 1);

  return (
    <div className="space-y-4">
      {categories.map((category, _index) => (
        <div key={category.category} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">{category.category}</span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-sm">{category.totalHours}h</span>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {category.percentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
          <div className="w-full bg-slate-700/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700"
              style={{ width: `${(category.totalHours / maxHours) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

interface MonthlyTrendChartProps {
  monthlyData: Array<{
    category: string;
    monthlyStats: Array<{
      yearMonth: Date;
      totalHours: number;
      percentage: number;
    }>;
  }>;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyData }) => {
  // Get the last 6 months of data
  const last6Months = monthlyData.slice(0, 6);

  return (
    <div className="space-y-6">
      {last6Months.map((category, index) => (
        <div key={category.category} className="space-y-3">
          <h4 className="text-white font-semibold">{category.category}</h4>
          <div className="grid grid-cols-6 gap-2">
            {category.monthlyStats.map((month, monthIndex) => {
              const maxHours = Math.max(...category.monthlyStats.map(m => m.totalHours), 1);
              const heightPercentage = (month.totalHours / maxHours) * 100;
              
              return (
                <div key={monthIndex} className="flex flex-col items-center space-y-2">
                  <div className="w-full bg-slate-700/30 rounded-t-lg h-20 flex items-end">
                    <div 
                      className={`w-full bg-gradient-to-t ${
                        index % 3 === 0 ? 'from-blue-500 to-blue-400' :
                        index % 3 === 1 ? 'from-purple-500 to-purple-400' :
                        'from-emerald-500 to-emerald-400'
                      } rounded-t-lg transition-all duration-500`}
                      style={{ height: `${heightPercentage}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">
                      {new Date(month.yearMonth).toLocaleDateString('en', { month: 'short' })}
                    </p>
                    <p className="text-white text-sm font-medium">{month.totalHours}h</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminAnalytics: React.FC = () => {
  const { data: weeklyStats, isLoading: loadingWeekly, error: weeklyError, refetch: refetchWeekly } = useAdminWeeklyStats();
  const { data: monthlyStats, isLoading: loadingMonthly, error: monthlyError, refetch: refetchMonthly } = useAdminMonthlyStats();

  const handleRefresh = () => {
    refetchWeekly();
    refetchMonthly();
  };

  if (loadingWeekly || loadingMonthly) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-slate-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (weeklyError || monthlyError) {
    return (
      <div className="p-6">
        <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Analytics</h3>
          <p className="text-slate-400 mb-6">There was an error loading the analytics data.</p>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Extract data for display
  const dashboardStats = weeklyStats?.dashboardStats?.[0];
  const categoryPercentages = weeklyStats?.categoryPercentages || [];
  const categoryTimeInvestment = weeklyStats?.categoryTimeInvestment || [];
  const monthlyData = monthlyStats || [];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* Header with Refresh */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-slate-400 text-sm">Comprehensive system performance metrics</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-slate-600/50 text-slate-400 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      {dashboardStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Average Mood Score"
            value={dashboardStats.averageMood.toFixed(1)}
            change="+2.1%"
            changeType="positive"
            icon={Activity}
            iconColor="bg-gradient-to-r from-green-500 to-emerald-600"
          />
          
          <StatCard
            title="Morning Routine Success"
            value={`${(dashboardStats.morningRoutineSuccessRate * 100).toFixed(1)}%`}
            change="+5.3%"
            changeType="positive"
            icon={Target}
            iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          
          <StatCard
            title="Goals Achieved"
            value={`${dashboardStats.goalsAchievedDays}/${dashboardStats.totalDays}`}
            change="+8.2%"
            changeType="positive"
            icon={Zap}
            iconColor="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          
          <StatCard
            title="Weekly Study Hours"
            value={`${dashboardStats.averageStudyHoursPerWeek.toFixed(1)}h`}
            change="+12.4%"
            changeType="positive"
            icon={Clock}
            iconColor="bg-gradient-to-r from-yellow-500 to-orange-600"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Performance */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white flex items-center text-base sm:text-lg">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span>Category Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {categoryPercentages.length > 0 ? (
              <CategoryChart categories={categoryPercentages} />
            ) : (
              <div className="text-center py-6 sm:py-8">
                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-400 text-sm">No category data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Investment Analysis */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white flex items-center text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Time Investment Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {categoryTimeInvestment.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {categoryTimeInvestment.slice(0, 5).map((item, index) => (
                  <div key={index} className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <h4 className="text-white font-medium text-sm sm:text-base break-words min-w-0 flex-1">{item.category}</h4>
                      <Badge className={`text-xs font-medium px-2 py-1 flex-shrink-0 ${
                        item.differenceHours >= 0 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {item.differenceHours >= 0 ? '+' : ''}{item.differenceHours.toFixed(1)}h
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-slate-400">Expected</p>
                        <p className="text-white font-medium">{(item.totalMinutesExpected / 60).toFixed(1)}h</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Actual</p>
                        <p className="text-white font-medium">{(item.totalMinutesActual / 60).toFixed(1)}h</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-400 text-sm">No time investment data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white flex items-center text-base sm:text-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span>6-Month Category Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {monthlyData.length > 0 ? (
            <MonthlyTrendChart monthlyData={monthlyData} />
          ) : (
            <div className="text-center py-8 sm:py-12">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-medium mb-2 text-sm sm:text-base">No Monthly Data</h3>
              <p className="text-slate-400 text-sm">Monthly trend data is not available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white flex items-center text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span>User Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-white font-medium text-sm sm:text-base">Daily Active Users</p>
                  <p className="text-slate-400 text-xs sm:text-sm break-words">Users active in the last 24 hours</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-white">847</p>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                    +15%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-white font-medium text-sm sm:text-base break-words">Report Submission Rate</p>
                  <p className="text-slate-400 text-xs sm:text-sm break-words">Users submitting regular reports</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-white">73.2%</p>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                    +8%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white flex items-center text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-white font-medium text-sm sm:text-base">System Uptime</p>
                  <p className="text-slate-400 text-xs sm:text-sm">Service availability</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">99.9%</p>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                    Excellent
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-white font-medium text-sm sm:text-base">Response Time</p>
                  <p className="text-slate-400 text-xs sm:text-sm break-words">Average API response time</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-blue-400">124ms</p>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                    Fast
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 