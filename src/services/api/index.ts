import { AuthService } from './auth';
import { TaskService } from './tasks';
import { ReportsService } from './reports';
import { DashboardService } from './dashboard';
import { QuestService } from './quest';
import { LeaderboardService } from './leaderboard';
import { AdminService } from './admin';

export { ApiError } from './base';

// Export service instances
export const authService = AuthService.getInstance();
export const taskService = TaskService.getInstance();
export const reportsService = ReportsService.getInstance();
export const dashboardService = DashboardService.getInstance();
export const questService = QuestService.getInstance();
export const leaderboardService = LeaderboardService.getInstance();
export const adminService = AdminService.getInstance();

// Export the service classes as well
export { AuthService, TaskService, ReportsService, DashboardService, QuestService, LeaderboardService, AdminService }; 