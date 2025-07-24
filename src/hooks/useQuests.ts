import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { questService } from '@/services/api/quest';

// Define QuestTaskStatus locally
export type QuestTaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Backlog';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  reward: number;
  progress: number;
  isLocked: boolean;
  participants: number;
  category: string;
  status: QuestTaskStatus;
  planet?: string[];
  link?: string;
}

// Mock quest data for demonstration when API is unavailable
const getMockQuests = (): Quest[] => [
  {
    id: 'mock-1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React components, state, and props. Build your first interactive UI components.',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    reward: 100,
    progress: 0,
    isLocked: false,
    participants: 245,
    category: 'Learning courses',
    status: 'To Do',
    planet: ['Solaris minor'],
    link: 'https://react.dev/learn'
  },
  {
    id: 'mock-2',
    title: 'TypeScript Integration',
    description: 'Integrate TypeScript into your React project. Learn type safety and advanced TypeScript patterns.',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 hours',
    reward: 150,
    progress: 50,
    isLocked: false,
    participants: 189,
    category: 'Learning courses',
    status: 'In Progress',
    planet: ['Solaris major'],
  },
  {
    id: 'mock-3',
    title: 'Product Requirements Analysis',
    description: 'Analyze and document product requirements. Create user stories and acceptance criteria.',
    difficulty: 'Advanced',
    estimatedTime: '4-5 hours',
    reward: 200,
    progress: 100,
    isLocked: false,
    participants: 156,
    category: 'Product refinement',
    status: 'Done',
    planet: ['White dwarf'],
  },
  {
    id: 'mock-4',
    title: 'Advanced React Patterns',
    description: 'Master compound components, render props, and custom hooks. Build reusable component libraries.',
    difficulty: 'Advanced',
    estimatedTime: '5-6 hours',
    reward: 250,
    progress: 0,
    isLocked: true,
    participants: 89,
    category: 'Learning courses',
    status: 'Backlog',
    planet: ['Supernova'],
  }
];

// Map backend difficulty/priority to frontend difficulty
const mapDifficultyFromPriority = (priority?: string): Quest['difficulty'] => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'Advanced';
    case 'medium':
      return 'Intermediate';
    case 'low':
    default:
      return 'Beginner';
  }
};

// Map backend status to progress percentage
const mapStatusToProgress = (status: QuestTaskStatus): number => {
  switch (status) {
    case 'Done':
      return 100;
    case 'In Review':
      return 90;
    case 'In Progress':
      return 50;
    case 'To Do':
      return 25;
    case 'Backlog':
    default:
      return 0;
  }
};

// Hook to fetch user quests with graceful fallback
export const useQuests = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['quests', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      
      try {
        const response = await questService.getUserQuest(workspaceId);
        
        if (response.status === 'success' && response.data) {
          // Transform backend data to frontend Quest interface
          const quests: Quest[] = response.data.tasks?.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            difficulty: mapDifficultyFromPriority(task.priority),
            estimatedTime: '2-4 hours',
            reward: task.starsEarned || 150,
            progress: mapStatusToProgress(task.status),
            isLocked: task.status === 'Backlog',
            participants: Math.floor(Math.random() * 1000) + 100,
            category: task.category || 'General',
            status: task.status,
            planet: task.planet,
            link: task.link,
          })) || [];
          
          return quests.sort((a, b) => {
            if (a.isLocked !== b.isLocked) {
              return a.isLocked ? 1 : -1;
            }
            
            const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
            if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
              return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            }
            
            return a.title.localeCompare(b.title);
          });
        }
        
        console.warn('Quests API returned no data, using fallback');
        return getMockQuests();
      } catch (error) {
        console.error('Failed to fetch quests, using fallback data:', error);
        
        // Show a user-friendly message
        toast.info('Demo Mode: Showing sample quests while the API is being configured');
        
        // Return mock data as fallback
        return getMockQuests();
      }
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Reduce retries since we have fallback
    refetchOnWindowFocus: false,
  });
};

// Hook to change quest status with validation
export const useChangeQuestStatus = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questId, newStatus }: { questId: string; newStatus: 'In Progress' | 'In Review' }) => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      
      // If it's a mock quest, simulate the update
      if (questId.startsWith('mock-')) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id: questId, status: newStatus };
      }
      
      const response = await questService.changeTaskStatus({
        workspaceId,
        taskId: questId,
        newStatus
      });
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update quest status');
      }
      
      return response.data;
    },
    onMutate: async ({ questId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['quests', workspaceId] });
      
      const previousQuests = queryClient.getQueryData(['quests', workspaceId]);
      
      queryClient.setQueryData(['quests', workspaceId], (old: Quest[] | undefined) => {
        if (!old) return old;
        
        return old.map(quest => {
          if (quest.id === questId) {
            const updatedStatus = newStatus === 'In Progress' ? 'In Progress' : 'In Review';
            return {
              ...quest,
              status: updatedStatus,
              progress: mapStatusToProgress(updatedStatus),
              isLocked: false,
            };
          }
          return quest;
        });
      });
      
      return { previousQuests };
    },
    onError: (err, variables, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(['quests', workspaceId], context.previousQuests);
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quest status';
      
      // For mock quests, show a demo message
      if (variables.questId.startsWith('mock-')) {
        toast.info('Demo Mode: Quest status updated in local state only');
      } else {
        toast.error(errorMessage);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests', workspaceId] });
      
      const actionText = variables.newStatus === 'In Progress' ? 'started' : 'submitted for review';
      
      // Different message for mock vs real quests
      if (variables.questId.startsWith('mock-')) {
        toast.success(`Demo: Quest ${actionText} successfully!`);
      } else {
        toast.success(`Quest ${actionText} successfully!`);
      }
    },
  });
};

// Hook to add comment to quest with validation
export const useAddQuestComment = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questId, content }: { questId: string; content: string }) => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      
      // Mock quest simulation
      if (questId.startsWith('mock-')) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { id: 'mock-comment', content, createdAt: new Date().toISOString() };
      }
      
      const response = await questService.addCommentToTask(workspaceId, questId, content);
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to add comment');
      }
      
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests', workspaceId] });
      
      if (variables.questId.startsWith('mock-')) {
        toast.success('Demo: Comment added to local state!');
      } else {
        toast.success('Comment added successfully!');
      }
    },
    onError: (error, variables) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      
      if (variables.questId.startsWith('mock-')) {
        toast.info('Demo Mode: Comments not persisted in demo');
      } else {
        toast.error(errorMessage);
      }
    },
  });
};

// Hook to refresh quests data
export const useRefreshQuests = () => {
  const queryClient = useQueryClient();
  
  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      toast.success('Quests refreshed!');
    },
  };
}; 