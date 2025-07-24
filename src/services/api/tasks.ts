import { BaseApiService } from './base';
import { Task, TaskStatus, ApiResponse } from '@/types';

interface TaskFilters {
  status?: TaskStatus;
  planetId?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  priority: string;
  points: number;
  planetId: string;
}

interface UpdateTaskData extends Partial<CreateTaskData> {}

export class TaskService extends BaseApiService {
  private static instance: TaskService;

  private constructor() {
    super();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<Task[]>(url, true); // Using cache for task list
  }

  public async getTask(taskId: string): Promise<ApiResponse<Task>> {
    return this.get<Task>(`/tasks/${taskId}`);
  }

  public async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    return this.post<Task>('/tasks', data);
  }

  public async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiResponse<Task>> {
    return this.patch<Task>(`/tasks/${taskId}`, data);
  }

  public async deleteTask(taskId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/tasks/${taskId}`);
  }

  public async updateTaskStatus(taskId: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    return this.patch<Task>(`/tasks/${taskId}/status`, { status });
  }

  public async assignTask(taskId: string, userId: string): Promise<ApiResponse<Task>> {
    return this.patch<Task>(`/tasks/${taskId}/assign`, { assignedTo: userId });
  }

  public async unassignTask(taskId: string): Promise<ApiResponse<Task>> {
    return this.patch<Task>(`/tasks/${taskId}/unassign`, {});
  }

  public async getTasksByPlanet(planetId: string): Promise<ApiResponse<Task[]>> {
    return this.get<Task[]>(`/tasks/planet/${planetId}`, true);
  }

  public async getMyTasks(): Promise<ApiResponse<Task[]>> {
    return this.get<Task[]>('/tasks/me', true);
  }

  // Clear task-related cache
  public clearTaskCache(): void {
    this.clearCache();
  }
} 