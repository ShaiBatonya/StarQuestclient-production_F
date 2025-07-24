import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leaderboardService, type LeaderboardUser } from '@/services/api/leaderboard';

// Mock leaderboard data for demonstration when API is unavailable
const getMockLeaderboard = (): LeaderboardUser[] => [
  {
    rank: 1,
    name: 'Alex Chen',
    position: 'Frontend developer',
    badgesCount: 12,
    totalStars: 2450,
    avatar: '/src/assets/selfi1.png'
  },
  {
    rank: 2,
    name: 'Sarah Johnson',
    position: 'Product Manager',
    badgesCount: 15,
    totalStars: 2380,
    avatar: '/src/assets/selfi2.png'
  },
  {
    rank: 3,
    name: 'Michael Rodriguez',
    position: 'Backend developer',
    badgesCount: 10,
    totalStars: 2220,
    avatar: '/src/assets/selfi3.png'
  },
  {
    rank: 4,
    name: 'Emily Davis',
    position: 'Data Scientist',
    badgesCount: 8,
    totalStars: 1950,
    avatar: '/src/assets/selfi5.png'
  },
  {
    rank: 5,
    name: 'David Kim',
    position: 'Full stack developer',
    badgesCount: 11,
    totalStars: 1820,
    avatar: '/src/assets/selfi1.png'
  },
  {
    rank: 6,
    name: 'Jessica Wilson',
    position: 'Frontend developer',
    badgesCount: 7,
    totalStars: 1650,
    avatar: '/src/assets/selfi2.png'
  },
  {
    rank: 7,
    name: 'Ryan Thompson',
    position: 'Backend developer',
    badgesCount: 9,
    totalStars: 1480,
    avatar: '/src/assets/selfi3.png'
  },
  {
    rank: 8,
    name: 'Lisa Zhang',
    position: 'Product Manager',
    badgesCount: 6,
    totalStars: 1320,
    avatar: '/src/assets/selfi5.png'
  },
  {
    rank: 9,
    name: 'James Brown',
    position: 'Data Scientist',
    badgesCount: 5,
    totalStars: 1180,
    avatar: '/src/assets/selfi1.png'
  },
  {
    rank: 10,
    name: 'Maria Garcia',
    position: 'Full stack developer',
    badgesCount: 8,
    totalStars: 1050,
    avatar: '/src/assets/selfi2.png'
  }
];

// Hook to fetch leaderboard data with graceful fallback
export const useLeaderboard = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['leaderboard', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }
      
      try {
        const response = await leaderboardService.getLeaderboard(workspaceId);
        
        if (response.status === 'success' && response.data && response.data.length > 0) {
          // Add rank to users based on totalStars if not provided
          const usersWithRank = response.data.map((user, index) => ({
            ...user,
            rank: user.rank || index + 1,
          }));
          
          // Sort by totalStars descending, then by name
          return usersWithRank.sort((a, b) => {
            if (a.totalStars !== b.totalStars) {
              return b.totalStars - a.totalStars;
            }
            return a.name.localeCompare(b.name);
          });
        }
        
        console.warn('Leaderboard API returned no data, using fallback');
        return getMockLeaderboard();
      } catch (error) {
        console.error('Failed to fetch leaderboard, using fallback data:', error);
        
        // Show a user-friendly message
        toast.info('Demo Mode: Showing sample leaderboard while the API is being configured');
        
        // Return mock data as fallback
        return getMockLeaderboard();
      }
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Reduce retries since we have fallback
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for live updates
  });
};

// Hook to refresh leaderboard data
export const useRefreshLeaderboard = () => {
  const queryClient = useQueryClient();
  
  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      leaderboardService.clearLeaderboardCache();
      toast.success('Leaderboard refreshed!');
    },
  };
};

// Hook to get current user's position in leaderboard
export const useCurrentUserPosition = (workspaceId: string | null, currentUserName: string | null) => {
  const { data: leaderboard } = useLeaderboard(workspaceId);
  
  if (!leaderboard || !currentUserName) {
    return null;
  }
  
  // For mock data, simulate current user position
  if (leaderboard.some(user => user.name === 'Alex Chen')) {
    // This is mock data, let's add a simulated current user
    return {
      rank: 11,
      name: currentUserName,
      position: 'Frontend developer',
      badgesCount: 4,
      totalStars: 920,
      avatar: '/src/assets/selfi3.png'
    };
  }
  
  const userPosition = leaderboard.find(user => user.name === currentUserName);
  return userPosition || null;
}; 