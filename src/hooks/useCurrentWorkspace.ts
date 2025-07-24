import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/api';

export interface CurrentWorkspace {
  workspaceId: string;
  role?: string;
}

export const useCurrentWorkspace = () => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentWorkspace', user?._id], // or user?.email
    queryFn: async (): Promise<CurrentWorkspace | null> => {
      if (!isAuthenticated || !user) {
        return null;
      }

      // If user already has workspace data, use the first one
      if (user.workspaces && user.workspaces.length > 0) {
        return {
          workspaceId: user.workspaces[0].workspaceId,
          role: user.workspaces[0].role,
        };
      }

      // Otherwise, fetch fresh user data to get workspace info
      try {
        const response = await authService.getCurrentUser();
        if (response.data && response.data.workspaces && response.data.workspaces.length > 0) {
          return {
            workspaceId: response.data.workspaces[0].workspaceId,
            role: response.data.workspaces[0].role,
          };
        }
      } catch (error) {
        console.error('Failed to fetch user workspace:', error);
      }

      return null;
    },
    enabled: !!isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

export const useWorkspaceId = (): string | null => {
  const { data: workspace } = useCurrentWorkspace();
  return workspace?.workspaceId || null;
}; 