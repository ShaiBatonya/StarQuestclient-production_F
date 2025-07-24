import { create } from 'zustand';
import { Report, ReportType } from '@/types';

interface ReportsState {
  reports: Report[];
  currentReport: Report | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type: ReportType | 'all';
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
  };
}

interface ReportsActions {
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  setCurrentReport: (report: Report | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<ReportsState['filters']>) => void;
  clearError: () => void;
  getReportsByType: (type: ReportType) => Report[];
  getRecentReports: (limit?: number) => Report[];
}

export const useReportsStore = create<ReportsState & ReportsActions>()(
  (set, get) => ({
    // State
    reports: [],
    currentReport: null,
    isLoading: false,
    error: null,
    filters: {
      type: 'all',
      dateRange: {
        start: null,
        end: null,
      },
    },

    // Actions
    setReports: (reports: Report[]) => {
      console.log('[Zustand] setReports', reports);
      set({ reports });
    },

    addReport: (report: Report) => {
      console.log('[Zustand] addReport', report);
      set((state) => ({ reports: [report, ...state.reports] }));
    },

    updateReport: (updatedReport: Report) => {
      console.log('[Zustand] updateReport', updatedReport);
      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === updatedReport.id ? updatedReport : report
        ),
      }));
    },

    deleteReport: (id: string) => {
      console.log('[Zustand] deleteReport', id);
      set((state) => ({ reports: state.reports.filter((report) => report.id !== id) }));
    },

    setCurrentReport: (currentReport: Report | null) => {
      console.log('[Zustand] setCurrentReport', currentReport);
      set({ currentReport });
    },

    setLoading: (isLoading: boolean) => {
      console.log('[Zustand] setLoading', isLoading);
      set({ isLoading });
    },

    setError: (error: string | null) => {
      console.log('[Zustand] setError', error);
      set({ error });
    },

    setFilters: (newFilters: Partial<ReportsState['filters']>) => {
      console.log('[Zustand] setFilters', newFilters);
      set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    },

    clearError: () => {
      console.log('[Zustand] clearError');
      set({ error: null });
    },

    getReportsByType: (type: ReportType) => {
      const { reports } = get();
      return reports.filter((report) => report.type === type);
    },

    getRecentReports: (limit = 10) => {
      const { reports } = get();
      return reports
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    },
  })
); 