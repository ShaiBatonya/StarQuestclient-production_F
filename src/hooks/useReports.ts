import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  reportsService, 
  DailyReport, 
  WeeklyReport, 
  DailyReportCreate,
  DailyReportUpdate,
  EndOfDayUpdate,
  WeeklyReportCreate
} from '@/services/api/reports';
import { isToday } from '@/utils';
import { useReportsStore } from '@/store/reports';
import { ReportType, Report } from '@/types/Report';
import { IS_DEVELOPMENT } from '@/config/environment';

// Helper to normalize DailyReport to Report
function normalizeDailyReport(d: any): Report {
  return {
    id: d.id,
    userId: d.userId || '',
    type: ReportType.DAILY,
    content: '', // Not present in DailyReport, can be filled if needed
    mood: d.mood,
    challenges: '',
    achievements: '',
    goals: '',
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// ==================== DAILY REPORTS ====================

// Fetch all daily reports for the user
export const useAllDailyReports = () => {
  const setReports = useReportsStore((s) => s.setReports);
  return useQuery({
    queryKey: ['daily-reports', 'all'],
    queryFn: async () => {
      try {
        const response = await reportsService.getAllDailyReports();
        
        // Debug logging in development
        if (IS_DEVELOPMENT) {
          console.log('Daily Reports API Response:', response);
        }
        
        if (response.status === 'success' && response.data) {
          // Ensure we always return an array
          const data = Array.isArray(response.data) ? response.data : [];
          const normalized = data.map(normalizeDailyReport);
          setReports(normalized); // Sync Zustand
          if (IS_DEVELOPMENT) {
            console.log('[useAllDailyReports] Synced Zustand with backend', normalized);
          }
          
          if (IS_DEVELOPMENT) {
            console.log('Daily Reports Data (processed):', data);
          }
          
          return data;
        }
        
        // If no data or unsuccessful, return empty array
        console.warn('Daily reports API returned no data or failed:', response);
        return [];
      } catch (error) {
        console.error('Failed to fetch daily reports:', error);
        // Return empty array on error to prevent crashes
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Fetch specific daily report
export const useDailyReport = (reportId: string | null) => {
  return useQuery({
    queryKey: ['daily-report', reportId],
    queryFn: async () => {
      if (!reportId) return null;
      const response = await reportsService.getDailyReport(reportId);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch daily report');
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Check if daily report exists for today
export const useTodayDailyReport = () => {
  const { data: allReports, isLoading, error } = useAllDailyReports();
  
  // Ensure allReports is an array before calling find
  const reportsArray = Array.isArray(allReports) ? allReports : [];
  
  const todayReport = reportsArray.find(report => {
    return isToday(report.createdAt);
  });

  return {
    data: todayReport || null,
    exists: !!todayReport,
    hasEndOfDay: !!(todayReport?.mood?.endOfDay),
    isLoading,
    error,
    canCreateNew: !todayReport,
    canCreateEndOfDay: !!(todayReport && !todayReport?.mood?.endOfDay),
  };
};

// Create daily report mutation
export const useCreateDailyReport = () => {
  const addReport = useReportsStore((s) => s.addReport);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DailyReportCreate) => {
      const response = await reportsService.createDailyReport(data);
      if (response.status === 'success' && response.data) {
        addReport(normalizeDailyReport(response.data)); // Sync Zustand
        if (IS_DEVELOPMENT) {
          console.log('[useCreateDailyReport] Added report to Zustand', response.data);
        }
        return response.data;
      }
      throw new Error(response.message || 'Failed to create daily report');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-reports'] });
      toast.success('Daily report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create daily report');
    },
  });
};

// Update daily report mutation
export const useUpdateDailyReport = () => {
  const updateReport = useReportsStore((s) => s.updateReport);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reportId, data }: { reportId: string; data: DailyReportUpdate }) => {
      const response = await reportsService.updateDailyReport(reportId, data);
      if (response.status === 'success' && response.data) {
        updateReport(normalizeDailyReport(response.data)); // Sync Zustand
        if (IS_DEVELOPMENT) {
          console.log('[useUpdateDailyReport] Updated report in Zustand', response.data);
        }
        return response.data; // This is a DailyReport
      }
      throw new Error(response.message || 'Failed to update daily report');
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['daily-reports'] });
      queryClient.invalidateQueries({ queryKey: ['daily-report', variables.reportId] });
      toast.success('Daily report updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update daily report');
    },
  });
};

// Submit end of day report mutation
export const useSubmitEndOfDayReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reportId, data }: { reportId: string; data: EndOfDayUpdate }) => {
      const response = await reportsService.submitEndOfDayReport(reportId, data);
      if (response.status === 'success' && response.data) {
        return response.data; // This is a DailyReport
      }
      throw new Error(response.message || 'Failed to submit end of day report');
    },
    onSuccess: (_data, variables) => {
      // Update specific queries
      queryClient.invalidateQueries({ queryKey: ['daily-reports'] });
      queryClient.invalidateQueries({ queryKey: ['daily-report', variables.reportId] });
      toast.success('End of day report completed successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to submit end of day report');
    },
  });
};

// ==================== WEEKLY REPORTS ====================

// Fetch all weekly reports for the user
export const useAllWeeklyReports = () => {
  return useQuery({
    queryKey: ['weekly-reports', 'all'],
    queryFn: async () => {
      try {
        const response = await reportsService.getAllWeeklyReports();
        
        if (response.status === 'success' && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        
        return [];
      } catch (error) {
        console.error('Failed to fetch weekly reports:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Fetch specific weekly report
export const useWeeklyReport = (reportId: string | null) => {
  return useQuery({
    queryKey: ['weekly-report', reportId],
    queryFn: async () => {
      if (!reportId) return null;
      const response = await reportsService.getWeeklyReport(reportId);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch weekly report');
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Check weekly report eligibility (Wednesday or Thursday)
export const useWeeklyReportEligibility = () => {
  const { data: allReports, isLoading } = useAllWeeklyReports();
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 3 = Wednesday, 4 = Thursday
  const isEligibleDay = dayOfWeek === 3 || dayOfWeek === 4; // Wednesday or Thursday
  
  // Check if weekly report already exists for this week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const reportsArray = Array.isArray(allReports) ? allReports : [];
  const thisWeekReport = reportsArray.find(report => {
    const reportDate = new Date(report.createdAt);
    return reportDate >= startOfWeek;
  });

  return {
    canCreate: isEligibleDay && !thisWeekReport,
    isEligibleDay,
    exists: !!thisWeekReport,
    eligibilityMessage: !isEligibleDay 
      ? 'Weekly reports can only be submitted on Wednesday or Thursday'
      : thisWeekReport 
        ? 'Weekly report already submitted for this week'
        : 'You can submit your weekly report',
    isLoading,
  };
};

// Create weekly report mutation
export const useCreateWeeklyReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WeeklyReportCreate) => {
      const response = await reportsService.createWeeklyReport(data);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create weekly report');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-reports'] });
      toast.success('Weekly report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create weekly report');
    },
  });
};

// ==================== COMBINED QUERIES ====================

// Combined reports for the sidebar
export const useCombinedReports = () => {
  const { data: dailyReports, isLoading: dailyLoading, error: dailyError } = useAllDailyReports();
  const { data: weeklyReports, isLoading: weeklyLoading, error: weeklyError } = useAllWeeklyReports();

  const combinedReports = React.useMemo(() => {
    const reports: CombinedReport[] = [];
    
    // Ensure data is array before processing
    const dailyArray = Array.isArray(dailyReports) ? dailyReports : [];
    const weeklyArray = Array.isArray(weeklyReports) ? weeklyReports : [];
    
    // Add daily reports
    if (dailyArray.length > 0) {
      reports.push(...dailyArray.map(report => ({ ...report, type: 'daily' as const })));
    }
    
    // Add weekly reports
    if (weeklyArray.length > 0) {
      reports.push(...weeklyArray.map(report => ({ ...report, type: 'weekly' as const })));
    }
    
    // Sort by creation date (newest first)
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [dailyReports, weeklyReports]);

  return {
    data: combinedReports,
    isLoading: dailyLoading || weeklyLoading,
    error: dailyError || weeklyError,
    dailyCount: Array.isArray(dailyReports) ? dailyReports.length : 0,
    weeklyCount: Array.isArray(weeklyReports) ? weeklyReports.length : 0,
  };
};

// ==================== TYPES ====================

// Types for combined report data
export type ReportItem = {
  id: string;
  type: 'daily' | 'weekly' | 'end-of-day';
  createdAt: string;
  updatedAt: string;
  status: 'submitted' | 'pending';
};

export type CombinedReport = (DailyReport | WeeklyReport) & {
  type: 'daily' | 'weekly';
}; 