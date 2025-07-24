export type Planet = 
  | 'Nebulae'
  | 'Solaris minor'
  | 'Solaris major'
  | 'White dwarf'
  | 'Supernova'
  | 'Space station';

export type TaskCategory = 
  | 'Learning courses'
  | 'Product refinement'
  | 'Mandatory sessions';

export type QuestTaskStatus = 
  | 'Backlog'
  | 'To Do'
  | 'In Progress'
  | 'In Review'
  | 'Done';

export interface QuestComment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface QuestTask {
  id: string;
  title: string;
  description: string;
  status: QuestTaskStatus;
  priority?: string;
  category?: string;
  planet?: string[];
  starsEarned: number;
  link?: string;
  workspaceId: string;
  comments?: QuestComment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserQuest {
  workspaceId: string;
  tasks: QuestTask[];
  totalStars: number;
  completedTasks: number;
  inProgressTasks: number;
}

export interface QuestResponse {
  status: string;
  data?: UserQuest;
  message?: string;
}

export interface TaskUpdateResponse {
  status: string;
  data?: QuestTask;
  message?: string;
}

export interface CommentResponse {
  status: string;
  data?: QuestComment;
  message?: string;
}

// Request types
export interface ChangeTaskStatusRequest {
  workspaceId: string;
  taskId: string;
  newStatus: 'In Progress' | 'In Review';
}

export interface AddCommentToTaskRequest {
  workspaceId: string;
  taskId: string;
  content: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  category: TaskCategory;
  positions?: string[];
  planet: Planet[];
  isGlobal: boolean;
  starsEarned: number;
  link?: string;
}

export interface CreatePersonalTaskRequest {
  title: string;
  description: string;
  category: TaskCategory;
  planet: Planet[];
  positions?: string[];
  userId: string;
  starsEarned: number;
  link?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: TaskCategory;
  newPositions?: string[];
  newPlanets?: Planet[];
  positionsToRemove?: string[];
  planetsToRemove?: Planet[];
  isGlobal?: boolean;
  starsEarned?: number;
  link?: string;
}

export interface MentorChangeTaskStatusRequest {
  workspaceId: string;
  menteeId: string;
  taskId: string;
  status: QuestTaskStatus;
} 