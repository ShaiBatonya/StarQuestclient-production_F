import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Calendar,
  Flame,
  Award,
  Clock
} from 'lucide-react';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/api';

interface UserStatsProps {
  user?: User;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => (
  <Card className="relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gaming-primary/10 group">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color.replace('from-', 'bg-').replace('to-', '').split(' ')[0]}/10`}>
          {icon}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
          {value}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">{subtitle}</p>
          {trend && (
            <div className={`flex items-center space-x-1 text-xs ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  const { user: authUser } = useAuthStore();
  const currentUser = user || authUser;

  // Fetch real dashboard data from backend
  const { data: weeklyStats, isLoading: weeklyLoading } = useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: async () => {
      const response = await dashboardService.getWeeklyStats();
      return response.status === 'success' ? response.data : null;
    },
    enabled: !!currentUser,
  });

  const { data: monthlyStats, isLoading: monthlyLoading } = useQuery({
    queryKey: ['dashboard', 'monthly'],
    queryFn: async () => {
      const response = await dashboardService.getMonthlyStats();
      return response.status === 'success' ? response.data : null;
    },
    enabled: !!currentUser,
  });

  const isLoading = weeklyLoading || monthlyLoading;

  if (!currentUser) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-700 rounded w-20"></div>
                <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use real data from backend or fallback to defaults
  const completionRate = weeklyStats?.completionRate || 0;
  const currentStreak = weeklyStats?.currentStreak || 0;
  const weeklyGoal = 5; // This could come from user preferences
  const tasksCompleted = weeklyStats?.totalTasksCompleted || 0;

  const monthlyStudyTime = monthlyStats?.studyTimeThisMonth || 0;

  const stats = [
    {
      title: 'Current Level',
      value: currentUser.level || 1,
      subtitle: 'Nebula Prime',
      icon: <Trophy className="w-5 h-5 text-gaming-gold" />,
      color: 'from-gaming-gold to-yellow-500',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Total Stars',
      value: isLoading ? '...' : (weeklyStats?.starsEarned || currentUser.stars || 0),
      subtitle: 'Keep collecting!',
      icon: <Star className="w-5 h-5 text-gaming-accent" />,
      color: 'from-gaming-accent to-blue-400',
      trend: { value: 23, isPositive: true }
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      subtitle: 'This week',
      icon: <Target className="w-5 h-5 text-green-400" />,
      color: 'from-green-400 to-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Current Streak',
      value: `${currentStreak}d`,
      subtitle: 'Daily learning',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-400 to-red-500',
      trend: { value: 12, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary/5 to-gaming-secondary/5" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Weekly Goal</CardTitle>
              <Calendar className="w-5 h-5 text-gaming-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{tasksCompleted}/{weeklyGoal}</span>
                <span className="text-sm text-gaming-accent font-medium">240% Complete</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gaming-primary to-gaming-accent h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((tasksCompleted / weeklyGoal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">Tasks completed this week</p>
            </div>
          </CardContent>
        </Card>

        {/* Badges Preview */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gaming-gold/5 to-yellow-500/5" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Recent Badges</CardTitle>
              <Award className="w-5 h-5 text-gaming-gold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">{currentUser.badges?.length || 0}</div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((badge) => (
                  <div
                    key={badge}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-500 border-2 border-slate-800 flex items-center justify-center"
                  >
                    <span className="text-xs">🏆</span>
                  </div>
                ))}
                {currentUser.badges && currentUser.badges.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center">
                    <span className="text-xs text-slate-400">+{currentUser.badges.length - 3}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">Achievements unlocked</p>
            </div>
          </CardContent>
        </Card>

        {/* Study Time */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gaming-secondary/5 to-blue-500/5" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Study Time</CardTitle>
              <Clock className="w-5 h-5 text-gaming-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">
                {isLoading ? '...' : `${Math.round(monthlyStudyTime * 10) / 10}h`}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-gaming-secondary to-blue-400 h-2 rounded-full w-3/4" />
                </div>
                <span className="text-xs text-gaming-secondary font-medium">75%</span>
              </div>
              <p className="text-xs text-slate-400">This month's target: 32h</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 