import { BaseApiService } from './base';

interface WeeklyDashboardStats {
  totalTasksCompleted: number;
  weeklyGoalProgress: number;
  currentStreak: number;
  studyTimeThisWeek: number;
  starsEarned: number;
  completionRate: number;
}

interface MonthlyDashboardStats {
  totalTasksCompleted: number;
  monthlyGoalProgress: number;
  studyTimeThisMonth: number;
  starsEarned: number;
  badgesEarned: number;
  completionRate: number;
  weeklyProgress: number[];
}

interface BackendResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

export class DashboardService extends BaseApiService {
  private static instance: DashboardService;

  private constructor() {
    super();
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  public async getWeeklyStats(): Promise<BackendResponse<WeeklyDashboardStats>> {
    const response = await this.api.get('/dashboard/weekly');
    return response.data;
  }

  public async getMonthlyStats(): Promise<BackendResponse<MonthlyDashboardStats>> {
    const response = await this.api.get('/dashboard/monthly');
    return response.data;
  }
}

export const dashboardService = DashboardService.getInstance(); 