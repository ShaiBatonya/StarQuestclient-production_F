import React, { useState } from 'react';
import { Trophy, Star, Medal, Users, RefreshCw, Zap, Info, Crown, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard, useRefreshLeaderboard, useCurrentUserPosition } from '@/hooks/useLeaderboard';
import { useAuthStore } from '@/store/auth';
import { useWorkspaceId } from '@/hooks/useCurrentWorkspace';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { SkeletonList, PulseLoader } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <SkeletonList items={5} showAvatar={true} />
  </div>
);

const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="platform-card animate-pulse">
        <div className="text-center py-6">
          <div className="w-8 h-8 bg-slate-700 rounded-lg mx-auto mb-2"></div>
          <div className="h-8 bg-slate-700 rounded mb-2 w-16 mx-auto"></div>
          <div className="h-4 bg-slate-700 rounded w-24 mx-auto"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function LeaderBoard(): JSX.Element {
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
  const { user } = useAuthStore();
  
  const workspaceId = useWorkspaceId();
  
  const { data: leaderboard = [], isLoading } = useLeaderboard(workspaceId);
  useRefreshLeaderboard();
  const currentUserPosition = useCurrentUserPosition(workspaceId, user?.firstName + ' ' + user?.lastName);


  const isUsingMockData = leaderboard.some(user => user.name === 'Alex Chen');


  if (!workspaceId) {
    return (
      <div className="platform-bg h-full w-full">
        <div className="w-full px-6 lg:px-8 py-12">
          <div className="platform-card text-center py-12">
            <PulseLoader size="lg" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Loading Workspace</h3>
            <p className="text-slate-400">Getting your workspace information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="space-y-8">
          {/* Demo Mode Banner */}
          {isUsingMockData && (
            <Card className="border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl animate-fade-in-up">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-indigo-400 font-medium">Demo Mode Active</p>
                    <p className="text-indigo-300/80 text-sm">
                      Displaying sample performance rankings while your backend environment is being configured.
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-medium">
                    Demo
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                Performance Rankings
              </h1>
              <Trophy className="w-8 h-8 text-amber-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {isUsingMockData 
                ? "Sample competitive rankings demonstrating StarQuest's professional development tracking"
                : "Track your progress against peers and celebrate achievements in your professional growth journey"
              }
            </p>
          </div>

          {/* Current User Position */}
          {currentUserPosition && (
            <Card className="border-amber-500/30 bg-amber-500/5 backdrop-blur-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 text-amber-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span className="text-lg font-semibold">Your Current Standing</span>
                  </div>
                  {isUsingMockData && (
                    <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-medium self-start sm:self-auto">
                      Simulated
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-amber-400 font-bold">#{currentUserPosition.rank}</span>
                    </div>
                    <div>
                      <h3 className="text-slate-100 font-semibold text-lg">{currentUserPosition.name}</h3>
                      <p className="text-slate-400">{currentUserPosition.position}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col sm:text-right space-x-6 sm:space-x-0 sm:space-y-1">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-amber-400" />
                      <span className="text-slate-100 font-semibold text-lg">{currentUserPosition.totalStars}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Medal className="w-4 h-4 text-indigo-400" />
                      <span className="text-slate-300">{currentUserPosition.badgesCount} achievements</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select 
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value as 'all' | 'month' | 'week')}
                      className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    >
                      <option value="all">All Time</option>
                      <option value="month">This Month</option>
                      <option value="week">This Week</option>
                    </select>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rankings */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 text-slate-100 mb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span className="text-xl font-semibold">{isUsingMockData ? 'Sample Rankings' : 'Global Rankings'}</span>
                </div>
                {isUsingMockData && (
                  <Badge variant="outline" className="border-indigo-400/30 text-indigo-400 text-xs self-start sm:self-auto">
                    Demo Data
                  </Badge>
                )}
              </div>
              <div>
                {isLoading ? (
                  <LeaderboardSkeleton />
                ) : (
                  <LeaderboardTable 
                    users={leaderboard} 
                    currentUserName={user?.firstName + ' ' + user?.lastName}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Statistics */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {isLoading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card className="border-purple-500/20 bg-purple-500/5 backdrop-blur-xl hover:scale-105 transition-transform duration-200">
                  <CardContent className="text-center py-6">
                    <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-slate-100">
                      {leaderboard.length > 0 ? Math.max(...leaderboard.map(u => u.totalStars)) : 0}
                    </h3>
                    <p className="text-slate-400">Top Score</p>
                  </CardContent>
                </Card>

                <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl hover:scale-105 transition-transform duration-200">
                  <CardContent className="text-center py-6">
                    <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-slate-100">{leaderboard.length}</h3>
                    <p className="text-slate-400">{isUsingMockData ? 'Sample Members' : 'Active Members'}</p>
                  </CardContent>
                </Card>

                <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-xl hover:scale-105 transition-transform duration-200 sm:col-span-2 lg:col-span-1">
                  <CardContent className="text-center py-6">
                    <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-slate-100">
                      {leaderboard.reduce((sum, user) => sum + user.totalStars, 0)}
                    </h3>
                    <p className="text-slate-400">Total Points Earned</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Professional Call to Action */}
          {isUsingMockData && (
            <Card className="border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-xl rounded-2xl shadow-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <CardContent className="py-12 px-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg">
                  <Info className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="space-y-2 mt-6">
                  <h3 className="text-xl font-semibold text-slate-100">Demo Mode Active</h3>
                  <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    This ranking system demonstrates how StarQuest tracks and celebrates professional development achievements. 
                    Once your learning environment is fully configured, you'll see real-time progress from your cohort.
                  </p>
                </div>
                <Button variant="outline" className="mt-6 px-8 py-3 hover:scale-105 transition-all duration-200">
                  <Info className="w-4 h-4 mr-2" />
                  Setup Learning Environment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 