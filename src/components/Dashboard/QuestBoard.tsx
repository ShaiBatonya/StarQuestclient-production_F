import React, { useState, useMemo, useCallback, useRef, memo } from 'react';
import { Target, RefreshCw, Search, Zap, Sparkles, Info, Filter, SortAsc, TrendingUp, X } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useQuests, useChangeQuestStatus, useRefreshQuests, Quest } from '@/hooks/useQuests';
import { useWorkspaceId } from '@/hooks/useCurrentWorkspace';
import QuestCard from '@/components/QuestBoard/QuestCard';


// Professional Quest skeleton loader
const QuestSkeleton: React.FC = memo(() => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div 
          key={index} 
          className="skeleton rounded-xl p-6 animate-pulse"
          style={{ 
            animationDelay: `${index * 100}ms`,
            minHeight: '320px'
          }}
        >
          <div className="space-y-6 p-6">
            {/* Header skeleton */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-700 rounded w-2/3 gpu-accelerated"></div>
                <div className="h-4 bg-slate-700 rounded w-full gpu-accelerated"></div>
              </div>
              <div className="h-6 bg-slate-700 rounded-full w-20 gpu-accelerated"></div>
            </div>
            
            {/* Progress skeleton */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-700 rounded w-20 gpu-accelerated"></div>
                <div className="h-4 bg-slate-700 rounded w-12 gpu-accelerated"></div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full gpu-accelerated"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg mx-auto gpu-accelerated"></div>
                  <div className="h-3 bg-slate-700 rounded w-12 mx-auto gpu-accelerated"></div>
                </div>
              ))}
            </div>
            
            {/* Category skeleton */}
            <div className="flex justify-center">
              <div className="h-6 bg-slate-700 rounded-full w-24 gpu-accelerated"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="h-12 bg-slate-700 rounded-lg gpu-accelerated"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

QuestSkeleton.displayName = 'QuestSkeleton';

// Optimized Stats Dashboard Component
const StatsDashboard: React.FC<{ stats: any }> = memo(({ stats }) => (
  <Card className="performance-card gpu-accelerated bg-slate-800/60 optimized-backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
    <CardContent className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 overflow-x-hidden max-w-full">
        <div className="text-center group performance-card">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors shadow-lg gpu-accelerated">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">{stats.completed}</div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">Completed</div>
        </div>
        <div className="text-center group performance-card">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors shadow-lg gpu-accelerated">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">{stats.inProgress}</div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">In Progress</div>
        </div>
        <div className="text-center group performance-card">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-amber-500/20 border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors shadow-lg gpu-accelerated">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">{stats.totalStars}</div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">Points Earned</div>
        </div>
        <div className="text-center group performance-card">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-purple-500/20 border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors shadow-lg gpu-accelerated">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">{Math.round(stats.avgProgress)}%</div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">Avg Progress</div>
        </div>
      </div>
    </CardContent>
  </Card>
));

StatsDashboard.displayName = 'StatsDashboard';

// Optimized Demo Banner Component
const DemoBanner: React.FC<{ isVisible: boolean }> = memo(({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="performance-card border-blue-500/30 bg-blue-500/5 optimized-backdrop-blur animate-slide-down">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 gpu-accelerated" />
          <div className="flex-1 space-y-1">
            <p className="text-blue-400 font-medium">Development Environment</p>
            <p className="text-blue-300/80 text-sm">
              You're viewing sample quest data while the API is being configured. All interactions are simulated for demonstration purposes.
            </p>
          </div>
          <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium performance-card">
            Demo Mode
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

DemoBanner.displayName = 'DemoBanner';

// Types for filtering and sorting
type FilterType = 'all' | 'available' | 'in-progress' | 'completed';
type SortType = 'newest' | 'difficulty' | 'reward' | 'progress';

export const QuestBoard: React.FC = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const questGridRef = useRef<HTMLDivElement>(null);

  
  // Get workspace ID dynamically
  const workspaceId = useWorkspaceId();

  // Fetch quests from backend
  const { data: quests = [], isLoading } = useQuests(workspaceId);
  const changeQuestStatus = useChangeQuestStatus(workspaceId || '');
  const { refresh } = useRefreshQuests();



  // Check if we're in demo mode (using mock data)
  const isUsingMockData = useMemo(() => 
    quests.some(quest => quest.id.startsWith('mock-')), [quests]
  );

  // Enhanced filtering and sorting with memoization
  const filteredAndSortedQuests = useMemo(() => {
    let filtered = quests.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = (() => {
        switch (filterType) {
          case 'available': return quest.progress === 0 && !quest.isLocked;
          case 'in-progress': return quest.progress > 0 && quest.progress < 100;
          case 'completed': return quest.progress === 100;
          default: return true;
        }
      })();

      return matchesSearch && matchesFilter;
    });

    // Sort quests
    return filtered.sort((a, b) => {
      switch (sortType) {
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
        case 'reward':
          return b.reward - a.reward;
        case 'progress':
          return b.progress - a.progress;
        case 'newest':
        default:
          return new Date(b.id).getTime() - new Date(a.id).getTime(); // Assuming ID contains timestamp
      }
    });
  }, [quests, searchTerm, filterType, sortType]);

  const handleStartQuest = useCallback((quest: Quest) => {
    if (quest.isLocked || changeQuestStatus.isPending || quest.progress === 100 || !workspaceId) return;
    
    setIsAnimating(true);
    const newStatus = quest.progress > 0 ? 'In Review' : 'In Progress';
    changeQuestStatus.mutate({ questId: quest.id, newStatus }, {
      onSettled: () => setIsAnimating(false)
    });
  }, [changeQuestStatus, workspaceId]);

  const handleRefresh = useCallback(() => {
    setIsAnimating(true);
    refresh();
    // Reset animation state after a short delay
    setTimeout(() => setIsAnimating(false), 1000);
  }, [refresh]);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Calculate stats with enhanced data and memoization
  const stats = useMemo(() => {
    const completed = quests.filter(q => q.progress === 100).length;
    const inProgress = quests.filter(q => q.progress > 0 && q.progress < 100).length;
    const available = quests.filter(q => q.progress === 0 && !q.isLocked).length;
    const totalStars = quests.reduce((sum, q) => sum + (q.progress === 100 ? q.reward : 0), 0);
    const avgProgress = quests.length > 0 ? 
      quests.reduce((sum, q) => sum + q.progress, 0) / quests.length : 0;

    return { completed, inProgress, available, totalStars, avgProgress };
  }, [quests]);

  // Show loading state while workspace is being determined
  if (!workspaceId) {
    return (
      <div className="h-full w-full p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden space-y-6 animate-fade-in scroll-optimized page-container">
        <Card variant="glass" className="performance-card border-gaming-primary/20">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gaming-primary/20 animate-pulse-subtle flex items-center justify-center gpu-accelerated">
              <Target className="w-8 h-8 text-gaming-primary animate-spin-slow" />
            </div>
            <CardTitle className="text-xl mb-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Loading Workspace
            </CardTitle>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
              Getting your workspace information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden scroll-container page-container"
    >
      <div className="w-full max-w-full space-y-6 sm:space-y-8 scroll-optimized overflow-x-hidden">
        {/* Demo Mode Banner */}
        <DemoBanner isVisible={isUsingMockData} />

        {/* Professional Header */}
        <div className="text-center animate-slide-down performance-card">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight gpu-accelerated">
              Learning Quests
            </h1>
            <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-4">
              Build your skills through structured challenges. Track progress, earn achievements, and advance your professional development.
            </p>
          </div>
        </div>

        {/* Professional Stats Dashboard */}
        <StatsDashboard stats={stats} />

        {/* Professional Controls */}
        <Card className="performance-card gpu-accelerated bg-slate-800/60 optimized-backdrop-blur border border-slate-700/50 rounded-2xl shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 sm:p-6">
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5 gpu-accelerated" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search learning quests..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 performance-card bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm sm:text-base"
                />
                {searchTerm && (
                  <button
                    onClick={handleSearchClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors gpu-accelerated"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 gpu-accelerated" />
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="performance-card bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-w-[120px] flex-1 sm:flex-none"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-slate-400 gpu-accelerated" />
                  <select 
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value as SortType)}
                    className="performance-card bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-w-[120px] flex-1 sm:flex-none"
                  >
                    <option value="newest">Latest</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="reward">Points</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>

                <Button 
                  onClick={handleRefresh} 
                  disabled={isAnimating}
                  variant="outline"
                  size="sm"
                  className="performance-card px-4 py-2 flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 gpu-accelerated ${isAnimating ? 'animate-spin' : ''}`} />
                  <span className="sm:inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-slate-100 font-medium text-sm sm:text-base">
                    {isLoading ? 'Loading quests...' : `${filteredAndSortedQuests.length} quest${filteredAndSortedQuests.length !== 1 ? 's' : ''}`}
                  </span>
                  {filterType !== 'all' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mt-1 sm:mt-0 performance-card">
                      {filterType.replace('-', ' ')}
                    </span>
                  )}
                </div>
              </div>
              {stats.avgProgress > 0 && (
                <div className="text-xs sm:text-sm text-slate-400">
                  Average completion: {Math.round(stats.avgProgress)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Quest Grid */}
        {isLoading ? (
          <QuestSkeleton />
        ) : filteredAndSortedQuests.length === 0 ? (
          <Card className="performance-card gpu-accelerated bg-slate-800/60 optimized-backdrop-blur border border-slate-700/50 rounded-2xl shadow-xl animate-fade-in">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-xl bg-slate-700/50 flex items-center justify-center gpu-accelerated">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-3">No learning quests found</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                {searchTerm.trim() 
                  ? 'Try adjusting your search terms or filters to discover relevant learning paths.' 
                  : 'New learning opportunities will appear here as they become available.'
                }
              </p>
              {searchTerm.trim() && (
                <Button 
                  onClick={handleSearchClear} 
                  className="performance-card px-6 py-2 hover:scale-105 transition-all duration-200"
                >
                  Clear search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div 
            ref={questGridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 content-visibility-auto overflow-x-hidden max-w-full"
            style={{ minHeight: '640px' }} // Prevent layout shift
          >
            {filteredAndSortedQuests.map((quest, index) => (
              <div
                key={quest.id}
                className="animate-fade-in-up performance-card"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  minHeight: '320px', // Explicit height for each quest card
                  containIntrinsicSize: '1fr 320px'
                }}
              >
                <QuestCard
                  quest={quest}
                  onStartQuest={handleStartQuest}
                  isUpdating={changeQuestStatus.isPending || isAnimating}
                />
              </div>
            ))}
          </div>
        )}

        {/* Professional Call-to-Action */}
        <Card className="performance-card gpu-accelerated border-dashed border-slate-600/50 bg-slate-800/30 optimized-backdrop-blur rounded-2xl shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg gpu-accelerated">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-3">Expand Your Learning Journey</h3>
            <p className="text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              {isUsingMockData 
                ? "Additional learning paths and specialized tracks will become available once your learning environment is fully configured. Continue building your skills with the current quests."
                : "We regularly add new learning paths, advanced challenges, and specialized tracks. Stay tuned for opportunities to deepen your expertise and advance your professional development."
              }
            </p>
            <Button variant="outline" className="performance-card px-6 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-200">
              <Sparkles className="w-4 h-4 mr-2 gpu-accelerated" />
              <span className="text-sm sm:text-base">{isUsingMockData ? 'Setup Learning Environment' : 'Join Waitlist'}</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

QuestBoard.displayName = 'QuestBoard'; 