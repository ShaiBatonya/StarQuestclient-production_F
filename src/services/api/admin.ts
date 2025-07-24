import { BaseApiService } from './base';

// Backend-compatible User interface (matches server exactly)
export interface AdminUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin'; // Exact backend roles
  photo?: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  active: boolean;
  workspaces: Array<{
    workspaceId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// User update payload (matches backend validation)
export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'user' | 'admin';
  phoneNumber?: string;
  active?: boolean;
}

// Dashboard stats interfaces (matching backend response)
export interface WeeklyDashboardStats {
  dashboardStats: Array<{
    averageMood: number;
    averageWakeupHour: number;
    morningRoutineSuccessRate: number;
    goalsAchievedDays: number;
    totalDays: number;
    averageStudyHoursPerWeek: number;
  }>;
  categoryPercentages: Array<{
    category: string;
    totalHours: number;
    percentage: number;
  }>;
  categoryTimeInvestment: Array<{
    totalMinutesActual: number;
    yearWeek: string;
    category: string;
    totalMinutesExpected: number;
    differenceMinutes: number;
    differenceHours: number;
  }>;
}

export interface MonthlyDashboardStats {
  category: string;
  monthlyStats: Array<{
    yearMonth: Date;
    totalHours: number;
    percentage: number;
  }>;
}

// Report interfaces (matching backend)
export interface AdminReport {
  _id: string;
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'end-of-day';
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  submissions?: any[];
}

// Workspace user interface
export interface WorkspaceUser {
  email: string;
  role: string;
  position?: string;
  planet?: string;
  status: 'confirm' | 'pending';
}

// Task interfaces (matching backend exactly)
export interface AdminTask {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: 'Learning courses' | 'Product refinement' | 'Mandatory sessions';
  starsEarned: number;
  planets: (
    | 'Nebulae'
    | 'Solaris minor'
    | 'Solaris major'
    | 'White dwarf'
    | 'Supernova'
    | 'Space station'
  )[];
  positions?: string[];
  isGlobal?: boolean;
  userId?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

// Task creation payload (matches backend validation exactly)
export interface TaskCreateData {
  title: string;
  description: string;
  category: 'Learning courses' | 'Product refinement' | 'Mandatory sessions';
  starsEarned: number;
  planets: (
    | 'Nebulae'
    | 'Solaris minor'
    | 'Solaris major'
    | 'White dwarf'
    | 'Supernova'
    | 'Space station'
  )[];
  positions?: string[];
  isGlobal?: boolean;
  userId?: string; // Required for personal tasks
  link?: string;
}

// Task update payload (matches backend validation)
export interface TaskUpdateData {
  title?: string;
  description?: string;
  category?: 'Learning courses' | 'Product refinement' | 'Mandatory sessions';
  starsEarned?: number;
  newPositions?: string[];
  newPlanets?: (
    | 'Nebulae'
    | 'Solaris minor'
    | 'Solaris major'
    | 'White dwarf'
    | 'Supernova'
    | 'Space station'
  )[];
  positionsToRemove?: string[];
  planetsToRemove?: (
    | 'Nebulae'
    | 'Solaris minor'
    | 'Solaris major'
    | 'White dwarf'
    | 'Supernova'
    | 'Space station'
  )[];
  isGlobal?: boolean;
  link?: string;
}

// Position interfaces (matching backend)
export interface AdminPosition {
  _id: string;
  id: string;
  name: string;
  color: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositionCreateData {
  name: string;
  color: string;
}

// Quest interfaces (matching backend)
export interface AdminQuest {
  _id: string;
  id: string;
  userId: string;
  workspaceId: string;
  tasks: Array<{
    taskId: string;
    status: 'todo' | 'in-progress' | 'completed';
    comments?: Array<{
      text: string;
      createdAt: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatusChangeData {
  taskId: string;
  newStatus: 'todo' | 'in-progress' | 'completed';
  userId?: string;
  workspaceId: string;
}

export interface TaskCommentData {
  taskId: string;
  comment: string;
  userId: string;
  workspaceId: string;
}

// Workspace interfaces (matching backend)
export interface AdminWorkspace {
  _id: string;
  id: string;
  name: string;
  description?: string;
  rules?: string;
  createdBy: string;
  users: Array<{
    userId: string;
    role: 'admin' | 'mentor' | 'mentee'; // Fixed to match backend enum
    position?: string;
    planet?: string;
    isVerified: boolean;
    joinedAt: string;
    quest?: Array<{
      taskId: string;
      status: 'todo' | 'in-progress' | 'completed';
      comments?: Array<{
        text: string;
        createdAt: string;
        author?: string;
      }>;
      createdAt?: string;
      updatedAt?: string;
    }>;
    stars?: number;
  }>;
  positions?: Array<{
    _id: string;
    name: string;
    color: string;
  }>;
  planets?: string[];
  backlog?: AdminTask[]; // Tasks stored in workspace backlog
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceCreateData {
  name: string;
  description: string;
  rules: string; // Required field
}

export interface WorkspaceInvitationData {
  workspaceId: string;
  inviteeEmail: string; // Changed from email to inviteeEmail to match backend
  inviteeRole?: 'admin' | 'mentor' | 'mentee'; // Optional role field
}

// Leaderboard interfaces
export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  score: number;
  completedTasks: number;
  position?: string;
  rank: number;
}

interface BackendResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Task Progress interface
export interface TaskProgress {
  taskId: string;
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done';
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    text: string;
    createdAt: string;
    author: string;
  }>;
  taskTitle: string;
  taskDescription: string;
  taskCategory: 'Learning courses' | 'Product refinement' | 'Mandatory sessions';
  starsEarned: number;
}

export class AdminService extends BaseApiService {
  private static instance: AdminService;

  private constructor() {
    super();
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // ===== USER MANAGEMENT =====
  
  /**
   * Get all users - uses existing GET /users endpoint
   */
  public async getAllUsers(): Promise<BackendResponse<AdminUser[]>> {
    const response = await this.api.get('/users');
    return response.data;
  }

  /**
   * Get specific user by ID - uses existing GET /users/:id endpoint
   */
  public async getUser(userId: string): Promise<BackendResponse<AdminUser>> {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  /**
   * Update user - uses existing PATCH /users/:id endpoint
   */
  public async updateUser(userId: string, userData: UserUpdateData): Promise<BackendResponse<AdminUser>> {
    const response = await this.api.patch(`/users/${userId}`, userData);
    return response.data;
  }

  /**
   * Delete user - uses existing DELETE /users/:id endpoint
   */
  public async deleteUser(userId: string): Promise<BackendResponse<null>> {
    const response = await this.api.delete(`/users/${userId}`);
    return response.data;
  }

  /**
   * Bulk update users - for bulk role changes, status updates, etc.
   */
  public async bulkUpdateUsers(userUpdates: Array<{ userId: string; updates: UserUpdateData }>): Promise<BackendResponse<any>> {
    console.log('📤 Bulk updating users:', userUpdates);
    const response = await this.api.patch('/users/bulk-update', { updates: userUpdates });
    return response.data;
  }

  /**
   * Bulk delete users 
   */
  public async bulkDeleteUsers(userIds: string[]): Promise<BackendResponse<any>> {
    console.log('📤 Bulk deleting users:', userIds);
    const response = await this.api.delete('/users/bulk-delete', { data: { userIds } });
    return response.data;
  }

  // ===== DASHBOARD ANALYTICS =====

  /**
   * Get weekly dashboard statistics for admin overview
   */
  public async getWeeklyDashboardStats(): Promise<BackendResponse<WeeklyDashboardStats>> {
    const response = await this.api.get('/dashboard/weekly');
    return response.data;
  }

  /**
   * Get monthly dashboard statistics for admin overview
   */
  public async getMonthlyDashboardStats(): Promise<BackendResponse<MonthlyDashboardStats[]>> {
    const response = await this.api.get('/dashboard/monthly');
    return response.data;
  }

  // ===== REPORTS MANAGEMENT =====

  /**
   * Get all reports in the system - uses existing GET /reports endpoint
   */
  public async getAllReports(): Promise<BackendResponse<AdminReport[]>> {
    try {
      console.log('🚀 AdminService: Calling GET /reports...');
      const response = await this.api.get('/reports');
      console.log('📡 AdminService: Raw axios response:', response);
      console.log('📡 AdminService: Response status:', response.status);
      console.log('📡 AdminService: Response headers:', response.headers);
      console.log('📡 AdminService: Response data:', response.data);
      console.log('📡 AdminService: Response data type:', typeof response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ AdminService: Error fetching reports:', error);
      console.error('❌ AdminService: Error response:', error?.response?.data);
      console.error('❌ AdminService: Error status:', error?.response?.status);
      throw error;
    }
  }

  /**
   * Get all daily reports in the system - uses GET /daily-reports/all endpoint
   */
  public async getAllDailyReports(): Promise<BackendResponse<any[]>> {
    try {
      console.log('🚀 AdminService: Calling GET /daily-reports/all...');
      const response = await this.api.get('/daily-reports/all');
      console.log('📡 AdminService: Daily reports response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ AdminService: Error fetching daily reports:', error);
      console.error('❌ AdminService: Error response:', error?.response?.data);
      console.error('❌ AdminService: Error status:', error?.response?.status);
      throw error;
    }
  }

  /**
   * Get all weekly reports in the system - uses GET /weekly-reports/all endpoint
   */
  public async getAllWeeklyReports(): Promise<BackendResponse<any[]>> {
    try {
      console.log('🚀 AdminService: Calling GET /weekly-reports/all...');
      const response = await this.api.get('/weekly-reports/all');
      console.log('📡 AdminService: Weekly reports response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ AdminService: Error fetching weekly reports:', error);
      console.error('❌ AdminService: Error response:', error?.response?.data);
      console.error('❌ AdminService: Error status:', error?.response?.status);
      throw error;
    }
  }

  /**
   * Get all reports for a specific workspace - uses GET /reports/workspace/:workspaceId
   */
  public async getWorkspaceReports(workspaceId: string): Promise<BackendResponse<AdminReport[]>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    try {
      console.log('🚀 AdminService: Calling GET /reports/workspace/' + workspaceId);
      const response = await this.api.get(`/reports/workspace/${workspaceId}`);
      console.log('📡 AdminService: Workspace reports response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ AdminService: Error fetching workspace reports:', error);
      console.error('❌ AdminService: Error response:', error?.response?.data);
      console.error('❌ AdminService: Error status:', error?.response?.status);
      throw error;
    }
  }

  /**
   * Get specific report by ID - uses existing GET /reports/:id endpoint
   */
  public async getReport(reportId: string): Promise<BackendResponse<AdminReport>> {
    const response = await this.api.get(`/reports/${reportId}`);
    return response.data;
  }

  /**
   * Delete report - uses existing DELETE /reports/:id endpoint
   */
  public async deleteReport(reportId: string): Promise<BackendResponse<void>> {
    const response = await this.api.delete(`/reports/${reportId}`);
    return response.data;
  }

  /**
   * Update report - uses existing PATCH /reports/:id endpoint
   */
  public async updateReport(reportId: string, reportData: any): Promise<BackendResponse<AdminReport>> {
    const response = await this.api.patch(`/reports/${reportId}`, reportData);
    return response.data;
  }

  /**
   * Get workspace submissions - uses existing workspace submissions endpoint
   */
  public async getWorkspaceSubmissions(workspaceId: string): Promise<BackendResponse<any[]>> {
    const response = await this.api.post('/reports/submissions', { workspaceId });
    return response.data;
  }

  /**
   * Approve a report
   */
  public async approveReport(reportId: string): Promise<BackendResponse<any>> {
    console.log('📤 Approving report:', { reportId });
    const response = await this.api.patch(`/reports/${reportId}/approve`);
    return response.data;
  }

  /**
   * Reject a report
   */
  public async rejectReport(reportId: string, reason?: string): Promise<BackendResponse<any>> {
    console.log('📤 Rejecting report:', { reportId, reason });
    const response = await this.api.patch(`/reports/${reportId}/reject`, { reason });
    return response.data;
  }

  /**
   * Update report status
   */
  public async updateReportStatus(reportId: string, status: 'pending' | 'approved' | 'rejected', note?: string): Promise<BackendResponse<any>> {
    console.log('📤 Updating report status:', { reportId, status, note });
    const response = await this.api.patch(`/reports/${reportId}/status`, { status, note });
    return response.data;
  }

  // ===== WORKSPACE MANAGEMENT =====

  /**
   * Get users in a workspace - uses existing workspace users endpoint
   */
  public async getWorkspaceUsers(workspaceId: string): Promise<BackendResponse<WorkspaceUser[]>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Getting workspace users:', { workspaceId });
    const response = await this.api.get(`/workspace/${workspaceId}/users`);
    return response.data;
  }

  /**
   * Get all pending invitations for a workspace
   */
  public async getWorkspaceInvitations(workspaceId: string): Promise<BackendResponse<any[]>> {
    // Return empty array if workspaceId is null, undefined, or empty
    if (!workspaceId || workspaceId.trim() === '') {
      console.log('⚠️ getWorkspaceInvitations: No workspaceId provided, returning empty array');
      return { status: 'success', data: [], message: 'No workspace ID provided' };
    }

    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      console.error(`❌ Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
      return { status: 'success', data: [], message: 'Invalid workspace ID format' };
    }

    console.log('📤 Getting workspace invitations:', { workspaceId });
    const response = await this.api.get(`/invitations/workspace/${workspaceId}`);
    return response.data;
  }

  /**
   * Cancel a pending invitation
   */
  public async cancelInvitation(invitationId: string): Promise<BackendResponse<any>> {
    console.log('📤 Canceling invitation:', { invitationId });
    const response = await this.api.patch(`/invitations/${invitationId}/cancel`);
    return response.data;
  }

  /**
   * Resend a pending invitation
   */
  public async resendInvitation(invitationId: string): Promise<BackendResponse<any>> {
    console.log('📤 Resending invitation:', { invitationId });
    const response = await this.api.post(`/invitations/${invitationId}/resend`);
    return response.data;
  }

  /**
   * Get all pending invitations across all workspaces (admin only)
   */
  public async getAllPendingInvitations(): Promise<BackendResponse<any[]>> {
    try {
      console.log('📤 Getting all pending invitations');
      const response = await this.api.get('/invitations/pending');
      console.log('✅ Pending invitations response:', response);
      console.log('📊 Response data:', response.data);
      console.log('📊 Response status:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching pending invitations:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.message);
      throw error;
    }
  }

  // ===== AUTHENTICATION UTILITIES =====

  /**
   * Verify current user has admin privileges
   */
  public async verifyAdminAccess(): Promise<boolean> {
    try {
      console.log('🔐 Checking admin access...');
      const response = await this.api.get('/users/me');
      console.log('👤 Current user response:', response);
      console.log('👤 User data:', response.data);
      const user = response.data?.data;
      console.log('👤 Extracted user:', user);
      console.log('🔑 User role:', user?.role);
      const isAdmin = user?.role === 'admin';
      console.log('✅ Is admin?', isAdmin);
      return isAdmin;
    } catch (error: any) {
      console.error('❌ Error verifying admin access:', error);
      console.error('❌ Error response:', error.response?.data);
      return false;
    }
  }

  /**
   * Get current admin user info
   */
  public async getCurrentUser(): Promise<BackendResponse<AdminUser>> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  // ===== TASK MANAGEMENT =====

  /**
   * Create a new task in workspace - uses POST /workspace/:workspaceId/tasks
   */
  public async createTask(workspaceId: string, taskData: TaskCreateData): Promise<BackendResponse<AdminTask>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Creating task in workspace:', { workspaceId, taskData });
    const response = await this.api.post(`/workspace/${workspaceId}/tasks`, taskData);
    return response.data;
  }

  /**
   * Create a personal task for specific user - uses POST /workspace/:workspaceId/personal-tasks
   */
  public async createPersonalTask(workspaceId: string, taskData: TaskCreateData): Promise<BackendResponse<AdminTask>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Creating personal task in workspace:', { workspaceId, taskData });
    const response = await this.api.post(`/workspace/${workspaceId}/personal-tasks`, taskData);
    return response.data;
  }

  /**
   * Assign existing task to specific user - uses POST /workspace/:workspaceId/tasks/:taskId/assign/:userId
   */
  public async assignTaskToUser(workspaceId: string, taskId: string, userId: string): Promise<BackendResponse<any>> {
    // Validate ObjectId formats
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}`);
    }
    if (!objectIdRegex.test(taskId)) {
      throw new Error(`Invalid taskId format: ${taskId}`);
    }
    if (!objectIdRegex.test(userId)) {
      throw new Error(`Invalid userId format: ${userId}`);
    }

    console.log('📤 Assigning task to user:', { workspaceId, taskId, userId });
    const response = await this.api.post(`/workspace/${workspaceId}/tasks/${taskId}/assign/${userId}`);
    return response.data;
  }

  /**
   * Get user task progress - uses GET /workspace/:workspaceId/users/:userId/progress
   */
  public async getUserTaskProgress(workspaceId: string, userId: string): Promise<BackendResponse<any[]>> { // Assuming TaskProgress is an array of objects
    // Validate ObjectId formats
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}`);
    }
    if (!objectIdRegex.test(userId)) {
      throw new Error(`Invalid userId format: ${userId}`);
    }

    console.log('📤 Getting user task progress:', { workspaceId, userId });
    const response = await this.api.get(`/workspace/${workspaceId}/users/${userId}/progress`);
    return response.data;
  }

  /**
   * Update task - uses PATCH /workspace/:workspaceId/tasks/:taskId
   */
  public async updateTask(workspaceId: string, taskId: string, taskData: TaskUpdateData): Promise<BackendResponse<AdminTask>> {
    // Validate ObjectId formats
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}`);
    }
    if (!objectIdRegex.test(taskId)) {
      throw new Error(`Invalid taskId format: ${taskId}`);
    }

    console.log('📤 Updating task:', { workspaceId, taskId, taskData });
    const response = await this.api.patch(`/workspace/${workspaceId}/tasks/${taskId}`, taskData);
    return response.data;
  }

  /**
   * Delete task - uses DELETE /workspace/:workspaceId/tasks/:taskId
   */
  public async deleteTask(workspaceId: string, taskId: string): Promise<BackendResponse<void>> {
    // Validate ObjectId formats
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}`);
    }
    if (!objectIdRegex.test(taskId)) {
      throw new Error(`Invalid taskId format: ${taskId}`);
    }

    console.log('📤 Deleting task:', { workspaceId, taskId });
    const response = await this.api.delete(`/workspace/${workspaceId}/tasks/${taskId}`);
    return response.data;
  }

  /**
   * Bulk assign tasks to users
   */
  public async bulkAssignTasks(assignments: Array<{ workspaceId: string; taskId: string; userIds: string[] }>): Promise<BackendResponse<any>> {
    console.log('📤 Bulk assigning tasks:', assignments);
    const response = await this.api.post('/tasks/bulk-assign', { assignments });
    return response.data;
  }

  /**
   * Bulk task operations (update status, assign, etc.)
   */
  public async bulkTaskOperations(operations: Array<{ taskId: string; operation: 'status' | 'assign' | 'delete'; data: any }>): Promise<BackendResponse<any>> {
    console.log('📤 Bulk task operations:', operations);
    const response = await this.api.patch('/tasks/bulk-operations', { operations });
    return response.data;
  }

  /**
   * Get all tasks for a specific workspace - uses GET /workspace/:workspaceId/tasks
   */
  public async getWorkspaceTasks(workspaceId: string): Promise<BackendResponse<AdminTask[]>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Getting workspace tasks:', { workspaceId });
    const response = await this.api.get(`/workspace/${workspaceId}/tasks`);
    return response.data;
  }

  // ===== POSITION MANAGEMENT =====

  /**
   * Create position - uses POST /position/:workspaceId/positions
   */
  public async createPosition(workspaceId: string, positionData: PositionCreateData): Promise<BackendResponse<AdminPosition>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Creating position in workspace:', { workspaceId, positionData });
    const response = await this.api.post(`/position/${workspaceId}/positions`, positionData);
    return response.data;
  }

  /**
   * Update position - uses PATCH /position/:workspaceId/positions/:positionId
   */
  public async updatePosition(workspaceId: string, positionId: string, positionData: Partial<PositionCreateData>): Promise<BackendResponse<AdminPosition>> {
    // Validate ObjectId formats
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}`);
    }
    if (!objectIdRegex.test(positionId)) {
      throw new Error(`Invalid positionId format: ${positionId}`);
    }

    console.log('📤 Updating position:', { workspaceId, positionId, positionData });
    const response = await this.api.patch(`/position/${workspaceId}/positions/${positionId}`, positionData);
    return response.data;
  }

  /**
   * Delete position - uses DELETE /position/:workspaceId/positions/:positionId
   */
  public async deletePosition(workspaceId: string, positionId: string): Promise<BackendResponse<void>> {
    // Validate ObjectId formats
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}`);
    }
    if (!objectIdRegex.test(positionId)) {
      throw new Error(`Invalid positionId format: ${positionId}`);
    }

    console.log('📤 Deleting position:', { workspaceId, positionId });
    const response = await this.api.delete(`/position/${workspaceId}/positions/${positionId}`);
    return response.data;
  }

  /**
   * Get workspace positions - uses GET /position/:workspaceId/positions
   */
  public async getWorkspacePositions(workspaceId: string): Promise<BackendResponse<AdminPosition[]>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Getting workspace positions:', { workspaceId });
    const response = await this.api.get(`/position/${workspaceId}/positions`);
    return response.data;
  }

  // ===== QUEST MANAGEMENT =====

  /**
   * Get user quest data - uses GET /quest/:workspaceId
   */
  public async getUserQuest(workspaceId: string): Promise<BackendResponse<AdminQuest>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Getting user quest:', { workspaceId });
    const response = await this.api.get(`/quest/${workspaceId}`);
    return response.data;
  }

  /**
   * Change task status for a user - uses PATCH /quest/move-task-status
   */
  public async changeTaskStatus(statusData: TaskStatusChangeData): Promise<BackendResponse<any>> {
    const response = await this.api.patch('/quest/move-task-status', statusData);
    return response.data;
  }

  /**
   * Add comment to task - uses PATCH /quest/add-comment
   */
  public async addTaskComment(commentData: TaskCommentData): Promise<BackendResponse<any>> {
    const response = await this.api.patch('/quest/add-comment', commentData);
    return response.data;
  }

  /**
   * Mentor change task status - uses PATCH /quest/mentor-change-task-status
   */
  public async mentorChangeTaskStatus(statusData: any): Promise<BackendResponse<any>> {
    const response = await this.api.patch('/quest/mentor-change-task-status', statusData);
    return response.data;
  }

  // ===== WORKSPACE ADMINISTRATION =====

  /**
   * Create a new workspace - uses POST /workspace/
   */
  public async createWorkspace(workspaceData: WorkspaceCreateData): Promise<BackendResponse<AdminWorkspace>> {
    // Log the exact payload being sent to the server
    console.log('📤 Sending workspace creation payload:', workspaceData);
    
    try {
      const response = await this.api.post('/workspace/', workspaceData);
      console.log('✅ Workspace creation successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Workspace creation failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user's workspaces - uses GET /workspace/my-workspaces
   */
  public async getUserWorkspaces(): Promise<BackendResponse<AdminWorkspace[]>> {
    const response = await this.api.get('/workspace/my-workspaces');
    return response.data;
  }

  /**
   * Update workspace - uses PATCH /workspace/:id
   */
  public async updateWorkspace(workspaceId: string, workspaceData: Partial<WorkspaceCreateData>): Promise<BackendResponse<AdminWorkspace>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Updating workspace:', { workspaceId, workspaceData });
    const response = await this.api.patch(`/workspace/${workspaceId}`, workspaceData);
    return response.data;
  }

  /**
   * Delete workspace - uses DELETE /workspace/:id
   */
  public async deleteWorkspace(workspaceId: string): Promise<BackendResponse<void>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Deleting workspace:', { workspaceId });
    const response = await this.api.delete(`/workspace/${workspaceId}`);
    return response.data;
  }

  /**
   * Send workspace invitation - uses POST /workspace/send-invitation
   */
  public async sendWorkspaceInvitation(invitationData: WorkspaceInvitationData): Promise<BackendResponse<any>> {
    // Use _id instead of id for MongoDB ObjectId
    const workspaceId = invitationData.workspaceId;
    
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invitationData.inviteeEmail)) {
      throw new Error(`Invalid email format: ${invitationData.inviteeEmail}`);
    }

    console.log('📤 Sending workspace invitation with validated data:', {
      ...invitationData,
      workspaceId
    });
    
    const response = await this.api.post('/workspace/send-invitation', {
      ...invitationData,
      workspaceId
    });
    return response.data;
  }

  /**
   * Get workspace leaderboard - uses GET /workspace/:id/leaderboard
   */
  public async getWorkspaceLeaderboard(workspaceId: string): Promise<BackendResponse<LeaderboardEntry[]>> {
    // Validate workspaceId format before sending
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      throw new Error(`Invalid workspaceId format: ${workspaceId}. Expected 24-character hex string.`);
    }

    console.log('📤 Getting workspace leaderboard:', { workspaceId });
    const response = await this.api.get(`/workspace/${workspaceId}/leaderboard`);
    return response.data;
  }

  // ===== LEADERBOARD MANAGEMENT =====

  /**
   * Get general leaderboard - uses existing leaderboard endpoint
   */
  public async getLeaderboard(): Promise<BackendResponse<LeaderboardEntry[]>> {
    const response = await this.api.get('/leaderboard');
    return response.data;
  }
}

export const adminService = AdminService.getInstance(); 