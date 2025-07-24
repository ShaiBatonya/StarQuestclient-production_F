import { BaseApiService } from './base';
import { ApiResponse, BackendResponse } from '@/types';
import {
  Report,
  ReportType,
  MoodType,
  DailyReportCreate,
  DailyReportUpdate,
  EndOfDayUpdate,
  WeeklyReportCreate,
  DailyReport,
  WeeklyReport,
  ReportStats
} from '@/types/Report';

// Define ReportFilters type for report filtering
export type ReportFilters = {
  type?: ReportType;
  startDate?: string;
  endDate?: string;
  [key: string]: string | ReportType | undefined;
};

interface CreateReportData {
  type: ReportType;
  content: string;
  mood: MoodType;
  challenges?: string;
  achievements?: string;
  goals?: string;
}

interface UpdateReportData extends Partial<CreateReportData> {}

export class ReportsService extends BaseApiService {
  private static instance: ReportsService;

  private constructor() {
    super();
  }

  public static getInstance(): ReportsService {
    if (!ReportsService.instance) {
      ReportsService.instance = new ReportsService();
    }
    return ReportsService.instance;
  }

  public async getReports(filters?: ReportFilters): Promise<ApiResponse<Report[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<Report[]>(url);
  }

  public async getReport(reportId: string): Promise<ApiResponse<Report>> {
    return this.get<Report>(`/reports/${reportId}`);
  }

  public async createReport(data: CreateReportData): Promise<ApiResponse<Report>> {
    return this.post<Report>('/reports', data);
  }

  public async updateReport(reportId: string, data: UpdateReportData): Promise<ApiResponse<Report>> {
    return this.patch<Report>(`/reports/${reportId}`, data);
  }

  public async deleteReport(reportId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/reports/${reportId}`);
  }

  public async getDailyReports(startDate?: string, endDate?: string): Promise<ApiResponse<Report[]>> {
    const filters: ReportFilters = {
      type: ReportType.DAILY,
      startDate,
      endDate
    };
    return this.getReports(filters);
  }

  public async getWeeklyReports(startDate?: string, endDate?: string): Promise<ApiResponse<Report[]>> {
    const filters: ReportFilters = {
      type: ReportType.WEEKLY,
      startDate,
      endDate
    };
    return this.getReports(filters);
  }

  public async getEndOfDayReports(startDate?: string, endDate?: string): Promise<ApiResponse<Report[]>> {
    const filters: ReportFilters = {
      type: ReportType.END_OF_DAY,
      startDate,
      endDate
    };
    return this.getReports(filters);
  }

  public async getMyReports(): Promise<ApiResponse<Report[]>> {
    return this.get<Report[]>('/reports/me', true); // Using cache for personal reports
  }

  public async getReportStats(type: ReportType, startDate?: string, endDate?: string): Promise<ApiResponse<ReportStats>> {
    const queryParams = new URLSearchParams({
      type,
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    });

    return this.get<ReportStats>(`/reports/stats?${queryParams.toString()}`);
  }

  // Daily Reports
  public async createDailyReport(data: DailyReportCreate): Promise<BackendResponse<DailyReport>> {
    const response = await this.api.post('/daily-reports/', data);
    return response.data;
  }

  public async updateDailyReport(reportId: string, data: DailyReportUpdate): Promise<BackendResponse<DailyReport>> {
    const response = await this.api.patch(`/daily-reports/${reportId}`, data);
    return response.data;
  }

  public async submitEndOfDayReport(reportId: string, data: EndOfDayUpdate): Promise<BackendResponse<DailyReport>> {
    const response = await this.api.patch(`/daily-reports/end-of-day-report/${reportId}`, data);
    return response.data;
  }

  public async getAllDailyReports(): Promise<BackendResponse<DailyReport[]>> {
    const response = await this.api.get('/daily-reports/all');
    return response.data;
  }

  public async getDailyReport(reportId: string): Promise<BackendResponse<DailyReport>> {
    const response = await this.api.get(`/daily-reports/${reportId}`);
    return response.data;
  }

  // Weekly Reports
  public async createWeeklyReport(data: WeeklyReportCreate): Promise<BackendResponse<WeeklyReport>> {
    const response = await this.api.post('/weekly-reports/', data);
    return response.data;
  }

  public async updateWeeklyReport(reportId: string, data: Partial<WeeklyReportCreate>): Promise<BackendResponse<WeeklyReport>> {
    const response = await this.api.patch(`/weekly-reports/${reportId}`, data);
    return response.data;
  }

  public async getAllWeeklyReports(): Promise<BackendResponse<WeeklyReport[]>> {
    const response = await this.api.get('/weekly-reports/all');
    return response.data;
  }

  public async getWeeklyReport(reportId: string): Promise<BackendResponse<WeeklyReport>> {
    const response = await this.api.get(`/weekly-reports/${reportId}`);
    return response.data;
  }

  // Clear report-related cache
  public clearReportCache(): void {
    this.clearCache();
  }
}

export const reportsService = ReportsService.getInstance();

// Export types for backward compatibility
export type {
  DailyReportCreate,
  DailyReportUpdate,
  EndOfDayUpdate,
  WeeklyReportCreate,
  DailyReport,
  WeeklyReport,
}; 