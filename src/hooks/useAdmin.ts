import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { handleApiError, logError } from '@/utils/errorUtils';
import { toast } from 'sonner';
import { 
  adminService, 
  UserUpdateData,
  TaskCreateData,
  TaskUpdateData,
  PositionCreateData,
  TaskStatusChangeData,
  TaskCommentData,
  WorkspaceCreateData,
  WorkspaceInvitationData
} from '@/services/api/admin';
import React from 'react'; // Added for React.useMemo

// ===== USER MANAGEMENT HOOKS =====

/**
 * Hook to fetch all users for admin management
 */
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await adminService.getAllUsers();
      return response.data || [];
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific user by ID
 */
export const useAdminUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await adminService.getUser(userId);
      return response.data || null;
    },
    enabled: !!userId,
    staleTime: 30000,
  });
};

/**
 * Hook to update user data
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: UserUpdateData }) => {
      const response = await adminService.updateUser(userId, userData);
      return response.data;
    },
    onSuccess: (_data, { userId }) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Update User');
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await adminService.deleteUser(userId);
      return userId;
    },
    onSuccess: (userId) => {
      // Remove user from cache and refetch list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.removeQueries({ queryKey: ['admin', 'users', userId] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Delete User');
    },
  });
};

// ===== DASHBOARD ANALYTICS HOOKS =====

/**
 * Hook to fetch weekly dashboard statistics
 */
export const useAdminWeeklyStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'weekly'],
    queryFn: async () => {
      const response = await adminService.getWeeklyDashboardStats();
      return response.data;
    },
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch monthly dashboard statistics
 */
export const useAdminMonthlyStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'monthly'],
    queryFn: async () => {
      const response = await adminService.getMonthlyDashboardStats();
      return response.data || [];
    },
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  });
};

// ===== REPORTS MANAGEMENT HOOKS =====

/**
 * Hook to fetch all general reports for admin management
 */
export const useAdminReports = () => {
  return useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching admin reports...');
        const response = await adminService.getAllReports();
        console.log('📊 Admin reports raw response:', response);
        console.log('📊 Response type:', typeof response);
        console.log('📊 Response data:', response?.data);
        console.log('📊 Response status:', response?.status);
        
        // Handle different possible response structures
        if (response && response.data) {
          console.log('✅ Using response.data:', response.data);
          return Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          console.log('✅ Using direct response array:', response);
          return response;
        } else {
          console.warn('⚠️ Unexpected response structure, returning empty array');
          return [];
        }
      } catch (error: any) {
        console.error('❌ Error in useAdminReports:', error);
        console.error('❌ Error details:', {
          name: error?.name,
          message: error?.message,
          status: error?.status,
          response: error?.response?.data,
          stack: error?.stack
        });
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook to fetch all daily reports for admin management
 */
export const useAdminDailyReports = () => {
  return useQuery({
    queryKey: ['admin', 'daily-reports'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching admin daily reports...');
        const response = await adminService.getAllDailyReports();
        console.log('📊 Daily reports response:', response);
        
        if (response && response.data) {
          const dailyReports = Array.isArray(response.data) ? response.data : [];
          // Transform daily reports to match admin interface format
          return dailyReports.map(report => ({
            _id: report._id || report.id,
            id: report.id || report._id,
            title: `Daily Report - ${new Date(report.createdAt || report.date).toLocaleDateString()}`,
            description: `Mood: ${report.mood?.startOfDay || 'N/A'}/5, Goals: ${report.dailyGoals?.length || 0}`,
            type: 'daily' as const,
            status: report.mood?.endOfDay ? 'completed' : 'pending' as const,
            submittedBy: report.userId,
            submittedAt: report.createdAt || report.date,
            workspaceId: report.workspaceId || 'N/A',
            originalData: report // Keep original data for details view
          }));
        }
        return [];
      } catch (error: any) {
        console.error('❌ Error in useAdminDailyReports:', error);
        throw error;
      }
    },
    staleTime: 60000,
    gcTime: 300000,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook to fetch all weekly reports for admin management
 */
export const useAdminWeeklyReports = () => {
  return useQuery({
    queryKey: ['admin', 'weekly-reports'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching admin weekly reports...');
        const response = await adminService.getAllWeeklyReports();
        console.log('📊 Weekly reports response:', response);
        
        if (response && response.data) {
          const weeklyReports = Array.isArray(response.data) ? response.data : [];
          // Transform weekly reports to match admin interface format
          return weeklyReports.map(report => ({
            _id: report._id || report.id,
            id: report.id || report._id,
            title: `Weekly Report - Week of ${new Date(report.createdAt).toLocaleDateString()}`,
            description: `Mood: ${report.moodRating || 'N/A'}/5, Goals Achieved: ${report.achievedGoals?.shared ? 'Yes' : 'No'}`,
            type: 'weekly' as const,
            status: 'completed' as const, // Weekly reports are always completed when submitted
            submittedBy: report.userId,
            submittedAt: report.createdAt,
            workspaceId: report.workspaceId || 'N/A',
            originalData: report // Keep original data for details view
          }));
        }
        return [];
      } catch (error: any) {
        console.error('❌ Error in useAdminWeeklyReports:', error);
        throw error;
      }
    },
    staleTime: 60000,
    gcTime: 300000,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Combined hook to fetch all types of reports for admin management
 */
export const useAllAdminReports = () => {
  const { data: generalReports = [], isLoading: loadingGeneral, error: errorGeneral } = useAdminReports();
  const { data: dailyReports = [], isLoading: loadingDaily, error: errorDaily } = useAdminDailyReports();
  const { data: weeklyReports = [], isLoading: loadingWeekly, error: errorWeekly } = useAdminWeeklyReports();

  const combinedData = React.useMemo(() => {
    // Combine all report types
    const allReports = [
      ...generalReports.map(report => ({
        ...report,
        type: report.type || 'general' as const,
        originalData: report
      })),
      ...dailyReports,
      ...weeklyReports
    ];

    // Sort by submission date (newest first)
    return allReports.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [generalReports, dailyReports, weeklyReports]);

  return {
    data: combinedData,
    isLoading: loadingGeneral || loadingDaily || loadingWeekly,
    error: errorGeneral || errorDaily || errorWeekly,
    counts: {
      total: combinedData.length,
      general: generalReports.length,
      daily: dailyReports.length,
      weekly: weeklyReports.length
    }
  };
};

/**
 * Hook to fetch workspace reports for admin management
 */
export const useWorkspaceReports = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'workspace', workspaceId, 'reports'],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      try {
        console.log('🔍 Fetching workspace reports for:', workspaceId);
        const response = await adminService.getWorkspaceReports(workspaceId);
        console.log('📊 Workspace reports response:', response);
        
        // Handle different possible response structures
        if (response && response.data) {
          console.log('✅ Using response.data:', response.data);
          return Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          console.log('✅ Using direct response array:', response);
          return response;
        } else {
          console.warn('⚠️ Unexpected response structure, returning empty array');
          return [];
        }
      } catch (error: any) {
        console.error('❌ Error in useWorkspaceReports:', error);
        console.error('❌ Error details:', {
          name: error?.name,
          message: error?.message,
          status: error?.status,
          response: error?.response?.data,
          stack: error?.stack
        });
        throw error;
      }
    },
    enabled: !!workspaceId,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook to fetch a specific report by ID
 */
export const useAdminReport = (reportId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'reports', reportId],
    queryFn: async () => {
      if (!reportId) return null;
      const response = await adminService.getReport(reportId);
      return response.data || null;
    },
    enabled: !!reportId,
    staleTime: 30000,
  });
};

/**
 * Hook to update report data
 */
export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, reportData }: { reportId: string; reportData: any }) => {
      const response = await adminService.updateReport(reportId, reportData);
      return response.data;
    },
    onSuccess: (_data, { reportId }) => {
      // Invalidate and refetch report queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      toast.success('Report updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Update Report');
    },
  });
};

/**
 * Hook to delete a report
 */
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      await adminService.deleteReport(reportId);
      return reportId;
    },
    onSuccess: (reportId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.removeQueries({ queryKey: ['admin', 'reports', reportId] });
      toast.success('Report deleted successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Delete Report');
    },
  });
};

/**
 * Hook to approve a report
 */
export const useApproveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const response = await adminService.approveReport(reportId);
      return response.data;
    },
    onSuccess: (_data, reportId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      toast.success('Report approved successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Approve Report');
    },
  });
};

/**
 * Hook to reject a report
 */
export const useRejectReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, reason }: { reportId: string; reason?: string }) => {
      const response = await adminService.rejectReport(reportId, reason);
      return response.data;
    },
    onSuccess: (_data, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      toast.success('Report rejected');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Reject Report');
    },
  });
};

/**
 * Hook to update report status
 */
export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status, note }: { reportId: string; status: 'pending' | 'approved' | 'rejected'; note?: string }) => {
      const response = await adminService.updateReportStatus(reportId, status, note);
      return response.data;
    },
    onSuccess: (_data, { reportId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      toast.success(`Report ${status} successfully`);
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Update Report Status');
    },
  });
};

// ===== WORKSPACE MANAGEMENT HOOKS =====

/**
 * Hook to fetch users in a specific workspace
 */
export const useWorkspaceUsers = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'workspace', workspaceId, 'users'],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await adminService.getWorkspaceUsers(workspaceId);
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 60000,
  });
};

/**
 * Hook to fetch workspace submissions
 */
export const useWorkspaceSubmissions = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'workspace', workspaceId, 'submissions'],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await adminService.getWorkspaceSubmissions(workspaceId);
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 60000,
  });
};

// ===== AUTHENTICATION HOOKS =====

/**
 * Hook to verify admin access
 */
export const useAdminAccess = () => {
  return useQuery({
    queryKey: ['admin', 'access'],
    queryFn: () => adminService.verifyAdminAccess(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    retry: false, // Don't retry if access is denied
  });
};

/**
 * Hook to get current admin user
 */
export const useCurrentAdmin = () => {
  return useQuery({
    queryKey: ['admin', 'current'],
    queryFn: async () => {
      const response = await adminService.getCurrentUser();
      return response.data;
    },
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  });
};

// ===== UTILITY HOOKS =====

/**
 * Hook to invalidate all admin queries (useful for refresh all data)
 */
export const useRefreshAdminData = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
    toast.success('Admin data refreshed');
  };
};

// ===== TASK MANAGEMENT HOOKS =====

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, taskData }: { workspaceId: string; taskData: TaskCreateData }) => {
      const response = await adminService.createTask(workspaceId, taskData);
      return response.data;
    },
    onSuccess: (_data, { workspaceId }) => {
      // Invalidate task-related queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Create Task');
    },
  });
};

/**
 * Hook to create a personal task
 */
export const useCreatePersonalTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, taskData }: { workspaceId: string; taskData: TaskCreateData }) => {
      const response = await adminService.createPersonalTask(workspaceId, taskData);
      return response.data;
    },
    onSuccess: (_data, { workspaceId }) => {
      // Invalidate task-related queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      toast.success('Personal task created successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Create Personal Task');
    },
  });
};

/**
 * Hook to assign task to user
 */
export const useAssignTaskToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, taskId, userId }: { workspaceId: string; taskId: string; userId: string }) => {
      const response = await adminService.assignTaskToUser(workspaceId, taskId, userId);
      return response.data;
    },
    onSuccess: (_data, { workspaceId, userId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-progress', workspaceId, userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      toast.success('Task assigned successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Assign Task');
    },
  });
};

/**
 * Hook to get user task progress
 */
export const useUserTaskProgress = (workspaceId: string | null, userId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'user-progress', workspaceId, userId],
    queryFn: async () => {
      if (!workspaceId || !userId) return [];
      const response = await adminService.getUserTaskProgress(workspaceId, userId);
      return response.data || [];
    },
    enabled: !!workspaceId && !!userId,
    staleTime: 30000,
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, taskId, taskData }: { workspaceId: string; taskId: string; taskData: TaskUpdateData }) => {
      const response = await adminService.updateTask(workspaceId, taskId, taskData);
      return response.data;
    },
    onSuccess: (_data, { workspaceId, taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks', workspaceId, taskId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Update Task');
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, taskId }: { workspaceId: string; taskId: string }) => {
      await adminService.deleteTask(workspaceId, taskId);
      return { workspaceId, taskId };
    },
    onSuccess: ({ workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace', workspaceId, 'tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Delete Task');
    },
  });
};

/**
 * Hook to fetch tasks for a specific workspace
 */
export const useWorkspaceTasks = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'workspace', workspaceId, 'tasks'],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await adminService.getWorkspaceTasks(workspaceId);
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 30000,
    gcTime: 300000,
  });
};

// ===== POSITION MANAGEMENT HOOKS =====

/**
 * Hook to fetch positions in a workspace
 */
export const useWorkspacePositions = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'positions', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await adminService.getWorkspacePositions(workspaceId);
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 60000,
  });
};

/**
 * Hook to create a new position
 */
export const useCreatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, positionData }: { workspaceId: string; positionData: PositionCreateData }) => {
      const response = await adminService.createPosition(workspaceId, positionData);
      return response.data;
    },
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace', workspaceId, 'positions'] });
      toast.success('Position created successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Create Position');
    },
  });
};

/**
 * Hook to update a position
 */
export const useUpdatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, positionId, positionData }: { 
      workspaceId: string; 
      positionId: string; 
      positionData: Partial<PositionCreateData> 
    }) => {
      const response = await adminService.updatePosition(workspaceId, positionId, positionData);
      return response.data;
    },
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace', workspaceId, 'positions'] });
      toast.success('Position updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Update Position');
    },
  });
};

/**
 * Hook to delete a position
 */
export const useDeletePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, positionId }: { workspaceId: string; positionId: string }) => {
      await adminService.deletePosition(workspaceId, positionId);
      return { workspaceId, positionId };
    },
    onSuccess: ({ workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace', workspaceId, 'positions'] });
      toast.success('Position deleted successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Delete Position');
    },
  });
};

/**
 * Hook to delete a workspace
 */
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      await adminService.deleteWorkspace(workspaceId);
      return workspaceId;
    },
    onSuccess: (workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspaces'] });
      queryClient.removeQueries({ queryKey: ['admin', 'workspace', workspaceId] });
      toast.success('Workspace deleted successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Delete Workspace');
    },
  });
};

// ===== QUEST MANAGEMENT HOOKS =====

/**
 * Hook to fetch user quest data
 */
export const useUserQuest = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'quests', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const response = await adminService.getUserQuest(workspaceId);
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 30000,
  });
};

/**
 * Hook to change task status
 */
export const useChangeTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (statusData: TaskStatusChangeData) => {
      const response = await adminService.changeTaskStatus(statusData);
      return response.data;
    },
    onSuccess: (_data, statusData) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests', statusData.workspaceId] });
      toast.success('Task status updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Change Task Status');
    },
  });
};

/**
 * Hook to add task comment
 */
export const useAddTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: TaskCommentData) => {
      const response = await adminService.addTaskComment(commentData);
      return response.data;
    },
    onSuccess: (_data, commentData) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests', commentData.workspaceId] });
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Add Task Comment');
    },
  });
};

/**
 * Hook for mentor to change task status
 */
export const useMentorChangeTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (statusData: any) => {
      const response = await adminService.mentorChangeTaskStatus(statusData);
      return response.data;
    },
    onSuccess: (_data, statusData) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      if (statusData.workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'quests', statusData.workspaceId] });
      }
      toast.success('Task status updated by mentor');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Mentor Change Task Status');
    },
  });
};

// ===== WORKSPACE MANAGEMENT HOOKS =====

/**
 * Hook to fetch admin's workspaces
 */
export const useAdminWorkspaces = () => {
  return useQuery({
    queryKey: ['admin', 'workspaces'],
    queryFn: async () => {
      const response = await adminService.getUserWorkspaces();
      const workspaces = response.data || [];
      
      // Transform workspaces to ensure both _id and id fields exist
      const transformedWorkspaces = workspaces.map(workspace => ({
        ...workspace,
        id: workspace.id || workspace._id, // Ensure id field exists
        _id: workspace._id || workspace.id, // Ensure _id field exists
      }));
      
      // Debug: Log workspace data structure
      console.log('🔍 Fetched workspaces:', {
        count: transformedWorkspaces.length,
        sample: transformedWorkspaces[0] ? {
          _id: transformedWorkspaces[0]._id,
          id: transformedWorkspaces[0].id,
          name: transformedWorkspaces[0].name,
          _idType: typeof transformedWorkspaces[0]._id,
          _idLength: transformedWorkspaces[0]._id?.length,
          isValidObjectId: /^[0-9a-fA-F]{24}$/.test(transformedWorkspaces[0]._id || '')
        } : 'No workspaces'
      });
      
      return transformedWorkspaces;
    },
    staleTime: 60000,
  });
};

/**
 * Hook to create a new workspace
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceData: WorkspaceCreateData) => {
      console.log('🔧 useCreateWorkspace: Starting workspace creation with data:', workspaceData);
      const response = await adminService.createWorkspace(workspaceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspaces'] });
      toast.success('Workspace created successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Create Workspace');
    },
  });
};

/**
 * Hook to update workspace
 */
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, workspaceData }: { workspaceId: string; workspaceData: Partial<WorkspaceCreateData> }) => {
      const response = await adminService.updateWorkspace(workspaceId, workspaceData);
      return response.data;
    },
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace', workspaceId] });
      toast.success('Workspace updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Update Workspace');
    },
  });
};

/**
 * Hook to send workspace invitation
 */
export const useSendWorkspaceInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationData: WorkspaceInvitationData) => {
      const response = await adminService.sendWorkspaceInvitation(invitationData);
      return response.data;
    },
    onSuccess: (_data, invitationData) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace', invitationData.workspaceId, 'users'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Send Workspace Invitation');
    },
  });
};

/**
 * Hook to fetch workspace leaderboard
 */
export const useWorkspaceLeaderboard = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'leaderboard', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await adminService.getWorkspaceLeaderboard(workspaceId);
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 60000,
  });
};

/**
 * Hook to fetch general leaderboard
 */
export const useAdminLeaderboard = () => {
  return useQuery({
    queryKey: ['admin', 'leaderboard'],
    queryFn: async () => {
      const response = await adminService.getLeaderboard();
      return response.data || [];
    },
    staleTime: 60000,
  });
}; 

/**
 * Hook for bulk user operations
 */
export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userUpdates: Array<{ userId: string; updates: any }>) => {
      const response = await adminService.bulkUpdateUsers(userUpdates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Users updated successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Bulk Update Users');
    },
  });
};

/**
 * Hook for bulk delete users
 */
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await adminService.bulkDeleteUsers(userIds);
      return response.data;
    },
    onSuccess: (_data, userIds) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      // Remove individual user queries from cache
      userIds.forEach(userId => {
        queryClient.removeQueries({ queryKey: ['admin', 'users', userId] });
      });
      toast.success(`${userIds.length} users deleted successfully`);
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Bulk Delete Users');
    },
  });
};

/**
 * Hook for bulk task assignments
 */
export const useBulkAssignTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignments: Array<{ workspaceId: string; taskId: string; userIds: string[] }>) => {
      const response = await adminService.bulkAssignTasks(assignments);
      return response.data;
    },
    onSuccess: (_data, assignments) => {
      // Invalidate task-related queries for affected workspaces
      const workspaceIds = [...new Set(assignments.map(a => a.workspaceId))];
      workspaceIds.forEach(workspaceId => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'tasks', workspaceId] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'quests', workspaceId] });
      });
      toast.success('Tasks assigned successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Bulk Assign Tasks');
    },
  });
};

/**
 * Hook for bulk task operations
 */
export const useBulkTaskOperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operations: Array<{ taskId: string; operation: 'status' | 'assign' | 'delete'; data: any }>) => {
      const response = await adminService.bulkTaskOperations(operations);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all task-related queries since we don't know which workspaces are affected
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      toast.success('Bulk operations completed successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Bulk Task Operations');
    },
  });
}; 

/**
 * Hook to fetch workspace invitations
 */
export const useWorkspaceInvitations = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'workspace', workspaceId, 'invitations'],
    queryFn: async () => {
      if (!workspaceId || workspaceId.trim() === '') {
        console.log('⚠️ useWorkspaceInvitations: No valid workspaceId provided');
        return [];
      }
      
      try {
        console.log('📤 Getting workspace invitations for:', workspaceId);
        const response = await adminService.getWorkspaceInvitations(workspaceId);
        const invitations = response.data || [];
        
        // Transform invitations to ensure consistent ID fields
        const transformedInvitations = invitations.map(invitation => ({
          ...invitation,
          id: invitation.id || invitation._id,
          _id: invitation._id || invitation.id,
          // Ensure workspace has proper ID fields if populated
          workspace: invitation.workspace ? {
            ...invitation.workspace,
            id: invitation.workspace.id || invitation.workspace._id,
            _id: invitation.workspace._id || invitation.workspace.id,
          } : null,
        }));
        
        console.log('🔍 Fetched workspace invitations:', {
          workspaceId,
          count: transformedInvitations.length,
          sample: transformedInvitations[0] ? {
            _id: transformedInvitations[0]._id,
            id: transformedInvitations[0].id,
            inviteeEmail: transformedInvitations[0].inviteeEmail,
            status: transformedInvitations[0].status,
          } : 'No invitations'
        });
        
        return transformedInvitations;
      } catch (error: any) {
        console.error('❌ Error fetching workspace invitations:', error);
        // Return empty array instead of throwing to prevent infinite loading
        return [];
      }
    },
    enabled: !!workspaceId && workspaceId.trim() !== '',
    staleTime: 60000,
    retry: 2, // Reduce retries to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch all pending invitations
 */
export const useAllPendingInvitations = () => {
  return useQuery({
    queryKey: ['admin', 'invitations', 'pending'],
    queryFn: async () => {
      try {
        console.log('🚀 Starting getAllPendingInvitations...');
        
        // First verify admin access
        console.log('🔐 Verifying admin access...');
        const hasAdminAccess = await adminService.verifyAdminAccess();
        console.log('🔐 Admin access verification result:', hasAdminAccess);
        
        if (!hasAdminAccess) {
          console.warn('⚠️ User does not have admin access, returning empty array');
          return [];
        }
        
        console.log('📤 Getting all pending invitations');
        const response = await adminService.getAllPendingInvitations();
        console.log('📨 getAllPendingInvitations response received:', response);
        
        const invitations = response.data || [];
        console.log('📊 Raw invitations data:', invitations);
        
        // Transform invitations to ensure consistent ID fields
        const transformedInvitations = invitations.map(invitation => ({
          ...invitation,
          id: invitation.id || invitation._id,
          _id: invitation._id || invitation.id,
          // Ensure workspace has proper ID fields if populated
          workspace: invitation.workspace ? {
            ...invitation.workspace,
            id: invitation.workspace.id || invitation.workspace._id,
            _id: invitation.workspace._id || invitation.workspace.id,
          } : null,
        }));
        
        console.log('🔍 Fetched invitations:', {
          count: transformedInvitations.length,
          sample: transformedInvitations[0] ? {
            _id: transformedInvitations[0]._id,
            id: transformedInvitations[0].id,
            inviteeEmail: transformedInvitations[0].inviteeEmail,
            status: transformedInvitations[0].status,
            workspace: transformedInvitations[0].workspace ? {
              _id: transformedInvitations[0].workspace._id,
              id: transformedInvitations[0].workspace.id,
              name: transformedInvitations[0].workspace.name,
            } : 'No workspace populated'
          } : 'No invitations'
        });
        
        return transformedInvitations;
      } catch (error: any) {
        console.error('❌ Error in useAllPendingInvitations:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error details:', {
          name: error?.name,
          message: error?.message,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
        });
        // Return empty array instead of throwing to prevent infinite loading
        return [];
      }
    },
    staleTime: 60000,
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for pending invitations:`, error);
      return failureCount < 1; // Reduce retries to prevent long loading
    },
    refetchOnWindowFocus: false,
    // Add timeout to prevent hanging
    gcTime: 300000, // 5 minutes
  });
};

/**
 * Hook to cancel invitation
 */
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await adminService.cancelInvitation(invitationId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'workspace'] });
      toast.success('Invitation cancelled successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Cancel Invitation');
    },
  });
};

/**
 * Hook to resend invitation
 */
export const useResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await adminService.resendInvitation(invitationId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] });
      toast.success('Invitation resent successfully');
    },
    onError: (error: any) => {
      const appError = handleApiError(error);
      logError(appError, 'Resend Invitation');
    },
  });
}; 