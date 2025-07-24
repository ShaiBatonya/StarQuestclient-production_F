import { BaseApiService } from './base';

import {
  QuestResponse,
  TaskUpdateResponse,
  CommentResponse,
  QuestTask,
  UserQuest,
  ChangeTaskStatusRequest
} from '@/types';

export class QuestService extends BaseApiService {
  private static instance: QuestService;

  private constructor() {
    super();
  }

  public static getInstance(): QuestService {
    if (!QuestService.instance) {
      QuestService.instance = new QuestService();
    }
    return QuestService.instance;
  }

  public async getUserQuest(workspaceId: string): Promise<QuestResponse> {
    try {
      const response = await this.api.get(`/quest/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user quest:', error);
      throw error;
    }
  }

  public async changeTaskStatus(request: ChangeTaskStatusRequest): Promise<TaskUpdateResponse> {
    try {
      const response = await this.api.patch('/quest/move-task-status', request);
      return response.data;
    } catch (error) {
      console.error('Failed to change task status:', error);
      throw error;
    }
  }

  public async addCommentToTask(workspaceId: string, taskId: string, content: string): Promise<CommentResponse> {
    try {
      const response = await this.api.patch('/quest/add-comment', {
        workspaceId,
        taskId,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add comment to task:', error);
      throw error;
    }
  }
}

export const questService = QuestService.getInstance();

// Export types for backward compatibility
export type { QuestTask, UserQuest, QuestResponse }; 