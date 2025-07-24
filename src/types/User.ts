export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  photo?: string;
  phoneNumber: string;
  workspaces: UserWorkspace[];
  isEmailVerified: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Added for Profile and dashboard compatibility
  level?: number;
  avatar?: string;
  stars?: number;
  badges?: Badge[];
}

export interface UserWorkspace {
  workspaceId: string;
  role?: string; // Added to match usage in useCurrentWorkspace
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  password: string;
  passwordConfirm: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockedAt?: string;
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  tasks: Task[];
  isLocked: boolean;
  imageUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  priority: TaskPriority;
  points: number;
  planetId: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
} 