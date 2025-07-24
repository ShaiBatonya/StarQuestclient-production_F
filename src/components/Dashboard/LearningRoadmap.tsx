import React, { useRef, memo, useMemo } from 'react';
import { CheckCircle, Circle, Lock, Star, Clock, Trophy, Target, Award, Brain, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuests } from '@/hooks/useQuests';
import { useCurrentWorkspace } from '@/hooks/useCurrentWorkspace';
import { useAuthStore } from '@/store/auth';

// TODO: Achievement System Integration
// The Achievement System is not yet implemented in the backend.
// When backend endpoints become available, implement the following:
// 
// Endpoints needed:
// - GET /achievements - Get all available achievements
// - GET /users/:userId/achievements - Get user's earned achievements  
// - POST /achievements/:achievementId/award - Award achievement to user
// - GET /achievements/leaderboard - Achievement leaderboard
//
// Achievement types to implement:
// - Task completion milestones (5, 10, 25, 50, 100 tasks)
// - Streak achievements (3, 7, 14, 30 day streaks)
// - Learning achievements (courses completed, skills mastered)
// - Social achievements (mentoring, collaboration)
// - Performance achievements (efficiency, quality ratings)
//
// UI Components needed:
// - Achievement badges with unlock animations
// - Achievement progress indicators
// - Achievement notification system
// - Achievement gallery/collection view
// - Achievement sharing functionality

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  skills: string[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reward: number;
  prerequisite?: string;
  progress?: number;
  category?: string;
  link?: string;
}

// Custom hook to transform quest data into roadmap milestones
const useRoadmapData = (workspaceId: string | null) => {
  const { data: quests, isLoading: questsLoading, error: questsError } = useQuests(workspaceId);
  const { user } = useAuthStore();

  // Transform quests into roadmap milestones
  const transformedMilestones = useMemo(() => {
    if (!quests || quests.length === 0) {
      // Return fallback roadmap when no quests available
      return getFallbackRoadmap(user);
    }

    const learningQuests = quests.filter(quest => 
      quest.category === 'Learning courses' || quest.category === 'General'
    );

    return learningQuests
      .sort((a, b) => {
        // Sort by difficulty (Beginner -> Advanced) and then by progress
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        const aDifficulty = difficultyOrder[a.difficulty] || 2;
        const bDifficulty = difficultyOrder[b.difficulty] || 2;
        
        if (aDifficulty !== bDifficulty) {
          return aDifficulty - bDifficulty;
        }
        
        // Then by completion status
        if (a.progress !== b.progress) {
          return b.progress - a.progress;
        }
        
        return a.title.localeCompare(b.title);
      })
      .map((quest, index, sortedQuests) => {
        let status: 'completed' | 'current' | 'locked';
        
        if (quest.progress === 100) {
          status = 'completed';
        } else if (quest.progress > 0 || quest.status === 'In Progress' || quest.status === 'In Review') {
          status = 'current';
        } else if (quest.isLocked) {
          status = 'locked';
        } else {
          // Check if previous milestone is completed or this is the first available
          const prevQuest = sortedQuests[index - 1];
          status = !prevQuest || prevQuest.progress === 100 ? 'current' : 'locked';
        }

        return {
          id: quest.id,
          title: quest.title,
          description: quest.description,
          status,
          skills: extractSkillsFromDescription(quest.description, quest.category),
          estimatedTime: quest.estimatedTime || calculateEstimatedTime(quest.difficulty),
          difficulty: quest.difficulty,
          reward: quest.reward,
          prerequisite: index > 0 ? sortedQuests[index - 1].id : undefined,
          progress: quest.progress,
          category: quest.category,
          link: quest.link,
        } as Milestone;
      });
  }, [quests, user]);

  return {
    milestones: transformedMilestones,
    isLoading: questsLoading,
    error: questsError,
  };
};

// Helper function to extract skills from quest description and category
const extractSkillsFromDescription = (description: string, category?: string): string[] => {
  const commonSkills = {
    'Learning courses': ['Problem Solving', 'Critical Thinking', 'Technical Skills'],
    'Product refinement': ['Product Strategy', 'User Research', 'Market Analysis'],
    'General': ['Communication', 'Collaboration', 'Time Management'],
  };

  // Extract skills mentioned in description
  const skillKeywords = [
    'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Python', 'Java',
    'API', 'Database', 'Testing', 'Docker', 'CI/CD', 'Git', 'Agile', 'Scrum',
    'UI/UX', 'Design', 'Analytics', 'Machine Learning', 'DevOps', 'Security'
  ];

  const extractedSkills = skillKeywords.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );

  const categorySkills = commonSkills[category as keyof typeof commonSkills] || commonSkills['General'];
  
  return [...new Set([...extractedSkills, ...categorySkills])].slice(0, 4);
};

// Helper function to calculate estimated time based on difficulty
const calculateEstimatedTime = (difficulty: string): string => {
  switch (difficulty) {
    case 'Beginner': return '2-4 hours';
    case 'Intermediate': return '4-8 hours';
    case 'Advanced': return '8-12 hours';
    default: return '4-6 hours';
  }
};

// Fallback roadmap when no API data is available
const getFallbackRoadmap = (user: any): Milestone[] => [
  {
    id: 'fallback-1',
    title: 'Getting Started',
    description: 'Complete your profile setup and learn the basics of the platform',
    status: user ? 'completed' : 'current',
    skills: ['Platform Navigation', 'Profile Management', 'Basic Setup'],
    estimatedTime: '1-2 hours',
    difficulty: 'Beginner',
    reward: 100
  },
  {
    id: 'fallback-2',
    title: 'Foundation Skills',
    description: 'Build essential skills and complete your first learning modules',
    status: user ? 'current' : 'locked',
    skills: ['Core Concepts', 'Best Practices', 'Methodology'],
    estimatedTime: '4-6 hours',
    difficulty: 'Beginner',
    reward: 250,
    prerequisite: 'fallback-1'
  },
  {
    id: 'fallback-3',
    title: 'Intermediate Challenges',
    description: 'Take on more complex projects and expand your skill set',
    status: 'locked',
    skills: ['Advanced Techniques', 'Project Management', 'Problem Solving'],
    estimatedTime: '8-10 hours',
    difficulty: 'Intermediate',
    reward: 500,
    prerequisite: 'fallback-2'
  },
  {
    id: 'fallback-4',
    title: 'Expert Level',
    description: 'Master advanced concepts and lead complex initiatives',
    status: 'locked',
    skills: ['Leadership', 'Strategic Thinking', 'Innovation'],
    estimatedTime: '12-16 hours',
    difficulty: 'Advanced',
    reward: 1000,
    prerequisite: 'fallback-3'
  }
];

// Error boundary component for roadmap
const RoadmapErrorBoundary: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Card className="bg-red-500/10 border-red-500/20">
    <CardContent className="p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-400 mb-2">Unable to Load Learning Path</h3>
      <p className="text-red-300/80 mb-4">
        We're having trouble loading your learning roadmap. Using offline data for now.
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
);

// Loading skeleton for roadmap
const RoadmapSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>
      ))}
    </div>
    <div className="space-y-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-slate-700 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Optimized Milestone Card Component
const MilestoneCard: React.FC<{ 
  milestone: Milestone; 
  index: number;
  getStatusIcon: (status: Milestone['status']) => React.ReactNode;
  getStatusColor: (status: Milestone['status']) => string;
  getDifficultyColor: (difficulty: Milestone['difficulty']) => string;
}> = memo(({ milestone, index, getStatusIcon, getStatusColor, getDifficultyColor }) => (
  <div 
    className="relative flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up hover:bg-slate-800/30 p-3 sm:p-4 rounded-xl transition-all duration-300 group performance-card content-visibility-auto" 
    style={{ 
      animationDelay: `${0.3 + index * 0.1}s`,
      minHeight: '280px', // Explicit height to prevent layout shift
      containIntrinsicSize: '1fr 280px'
    } as React.CSSProperties}
  >
    {/* Timeline Node */}
    <div className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto sm:mx-0 gpu-accelerated ${getStatusColor(milestone.status)}`}>
      {getStatusIcon(milestone.status)}
      {milestone.status === 'current' && (
        <div className="absolute inset-0 rounded-xl bg-indigo-400/20 animate-ping gpu-accelerated" />
      )}
      {milestone.status === 'completed' && (
        <div className="absolute inset-0 rounded-xl bg-emerald-400/10 animate-pulse gpu-accelerated" />
      )}
    </div>

    {/* Milestone Card */}
    <div className="flex-1 min-w-0 w-full sm:w-auto">
      <Card className={`performance-card gpu-accelerated transition-all duration-300 hover:shadow-lg ${
        milestone.status === 'current' 
          ? 'border-indigo-500/50 bg-indigo-500/5 shadow-indigo-500/20' 
          : milestone.status === 'completed'
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-slate-700/50 bg-slate-800/30'
      }`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                  {milestone.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  {milestone.description}
                </p>
              </div>
              
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-center sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all performance-card ${getDifficultyColor(milestone.difficulty)}`}>
                  {milestone.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 gpu-accelerated" />
                  <span className="text-xs sm:text-sm font-medium">{milestone.reward} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Duration */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-slate-300 mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 content-visibility-auto">
                {milestone.skills.slice(0, 3).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 performance-card bg-slate-700/50 text-slate-300 rounded-md text-xs font-medium border border-slate-600/50"
                  >
                    {skill}
                  </span>
                ))}
                {milestone.skills.length > 3 && (
                  <span className="px-2 py-1 performance-card bg-slate-700/50 text-slate-400 rounded-md text-xs">
                    +{milestone.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400 gpu-accelerated" />
                <span className="text-xs sm:text-sm text-slate-400">{milestone.estimatedTime}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center sm:justify-end">
            <Button
              variant={milestone.status === 'current' ? 'default' : 'outline'}
              size="sm"
              disabled={milestone.status === 'locked'}
              className={cn(
                "performance-card transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto",
                milestone.status === 'current' && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg",
                milestone.status === 'completed' && "border-emerald-500 text-emerald-400 hover:bg-emerald-500/20",
                milestone.status === 'locked' && "opacity-50 cursor-not-allowed"
              )}
            >
              {milestone.status === 'current' && (
                <>
                  <Target className="w-4 h-4 mr-2 gpu-accelerated" />
                  <span className="hidden sm:inline">Continue Learning</span>
                  <span className="sm:hidden">Continue</span>
                </>
              )}
              {milestone.status === 'completed' && (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 gpu-accelerated" />
                  Completed
                </>
              )}
              {milestone.status === 'locked' && (
                <>
                  <Lock className="w-4 h-4 mr-2 gpu-accelerated" />
                  Locked
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
));

MilestoneCard.displayName = 'MilestoneCard';

// Optimized Progress Overview Component
const ProgressOverview: React.FC<{ 
  completedMilestones: number; 
  totalMilestones: number; 
  progress: number; 
  roadmapData: Milestone[] 
}> = memo(({ completedMilestones, totalMilestones, progress, roadmapData }) => (
  <Card className="performance-card gpu-accelerated bg-slate-800/60 optimized-backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
    <CardContent className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg gpu-accelerated">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-100">Learning Progress</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Track your advancement through the roadmap</p>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end space-x-4 sm:space-x-6">
          <div className="text-center lg:text-right">
            <div className="text-xl sm:text-2xl font-bold text-slate-100">
              {completedMilestones}/{totalMilestones}
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">Milestones</p>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-xl sm:text-2xl font-bold text-indigo-400">
              {Math.round(progress)}%
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">Complete</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700/50 rounded-full h-2 sm:h-3 mb-4 sm:mb-6 overflow-hidden performance-card">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-1000 relative gpu-accelerated"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer gpu-accelerated"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="text-center p-3 sm:p-4 rounded-xl performance-card bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200">
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">
            {roadmapData.reduce((sum, m) => m.status === 'completed' ? sum + m.reward : sum, 0)}
          </div>
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Points Earned</div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-xl performance-card bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200">
          <div className="text-xl sm:text-2xl font-bold text-indigo-400 mb-1">
            {roadmapData.find(m => m.status === 'current')?.estimatedTime || 'N/A'}
          </div>
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Current Phase</div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-xl performance-card bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200">
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">
            {roadmapData.filter(m => m.status === 'locked').length}
          </div>
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Upcoming</div>
        </div>
      </div>
    </CardContent>
  </Card>
));

ProgressOverview.displayName = 'ProgressOverview';

export const LearningRoadmap: React.FC = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { data: workspace } = useCurrentWorkspace();
  const { milestones, isLoading, error } = useRoadmapData(workspace?.workspaceId || null);

  // Memoized helper functions
  const getStatusIcon = useMemo(() => (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-emerald-400 gpu-accelerated" />;
      case 'current':
        return <Circle className="w-6 h-6 text-indigo-400 animate-pulse gpu-accelerated" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-slate-500 gpu-accelerated" />;
    }
  }, []);

  const getStatusColor = useMemo(() => (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/20';
      case 'current':
        return 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/20';
      case 'locked':
        return 'border-slate-600/50 bg-slate-800/50';
    }
  }, []);

  const getDifficultyColor = useMemo(() => (difficulty: Milestone['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'Intermediate': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'Advanced': return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
    }
  }, []);

  // Memoized calculations
  const { completedMilestones, totalMilestones, progress } = useMemo(() => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    const total = milestones.length;
    const progressPercent = (completed / total) * 100;
    return {
      completedMilestones: completed,
      totalMilestones: total,
      progress: progressPercent
    };
  }, [milestones]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-6 lg:p-8 scroll-container page-container"
    >
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 scroll-optimized">
        {/* Header */}
        <div className="text-center animate-fade-in-up performance-card">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 animate-pulse gpu-accelerated" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight gpu-accelerated">
              Professional Development Roadmap
            </h1>
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 animate-pulse gpu-accelerated" style={{ animationDelay: '0.5s' } as React.CSSProperties} />
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Structured learning path designed to accelerate your professional growth. Master essential skills, 
            track your progress, and advance your career with confidence.
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview 
          completedMilestones={completedMilestones}
          totalMilestones={totalMilestones}
          progress={progress}
          roadmapData={milestones}
        />

        {/* Roadmap Timeline */}
        <Card className="performance-card gpu-accelerated bg-slate-800/60 optimized-backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl">
          <CardContent className="p-4 sm:p-6 lg:p-8 relative">
            {/* Connecting Line - Hidden on mobile */}
            <div className="hidden sm:block absolute left-6 lg:left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-slate-600/50 rounded-full gpu-accelerated" />
            
            <div 
              ref={timelineRef}
              className="space-y-4 sm:space-y-6 content-visibility-auto"
            >
              {isLoading ? (
                <RoadmapSkeleton />
              ) : error ? (
                <RoadmapErrorBoundary onRetry={() => {}} />
              ) : (
                milestones.map((milestone, index) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                    getDifficultyColor={getDifficultyColor}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Specializations */}
        <Card className="performance-card gpu-accelerated border-dashed border-slate-600/50 bg-slate-800/30 optimized-backdrop-blur rounded-2xl shadow-xl animate-fade-in-up" style={{ animationDelay: '0.8s' } as React.CSSProperties}>
          <CardContent className="py-8 sm:py-12 px-4 sm:px-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg gpu-accelerated">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4">Advanced Specializations</h3>
            <p className="text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base px-4">
              Upon completing the core roadmap, unlock specialized career tracks including Mobile Development, 
              DevOps Engineering, and AI/ML. Continue your journey toward senior-level expertise.
            </p>
            <Button variant="outline" className="performance-card px-6 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-200">
              <Star className="w-4 h-4 mr-2 gpu-accelerated" />
              <span className="text-sm sm:text-base">Explore Specializations</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

LearningRoadmap.displayName = 'LearningRoadmap'; 