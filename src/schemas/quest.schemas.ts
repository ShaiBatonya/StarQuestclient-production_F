import { z } from 'zod';
import { TaskStatus } from '@/types';

// Valid planets from backend validation
const ValidPlanets = z.enum([
  'Nebulae',
  'Solaris minor',
  'Solaris major',
  'White dwarf',
  'Supernova',
  'Space station',
]);

// Valid task categories from backend validation
const TaskCategories = z.enum([
  'Learning courses',
  'Product refinement',
  'Mandatory sessions',
]);

// Valid task statuses from backend validation
const TaskStatuses = z.enum([
  'Backlog',
  'To Do',
  'In Progress',
  'In Review',
  'Done',
]);

// ObjectId validation pattern
const ObjectIdPattern = /^[0-9a-fA-F]{24}$/;
const UUIDPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

// Change Task Status Schema (for mentees)
export const ChangeTaskStatusSchema = z.object({
  workspaceId: z.string().regex(UUIDPattern, 'Invalid workspace ID format'),
  taskId: z.string().regex(UUIDPattern, 'Invalid task ID format'),
  newStatus: z.enum(['In Progress', 'In Review'], {
    errorMap: () => ({ message: 'Status must be either "In Progress" or "In Review"' }),
  }),
});

// Add Comment to Task Schema
export const AddCommentToTaskSchema = z.object({
  workspaceId: z.string().regex(UUIDPattern, 'Invalid workspace ID format'),
  taskId: z.string().regex(UUIDPattern, 'Invalid task ID format'),
  content: z.string().min(1, 'Comment content cannot be empty'),
});

// Create Task Schema (for mentors/admins)
export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  category: TaskCategories,
  positions: z
    .array(z.string().regex(ObjectIdPattern, 'Invalid position ID'))
    .min(1, 'At least one position must be selected')
    .optional(),
  planet: z
    .array(ValidPlanets)
    .min(1, 'At least one planet must be selected'),
  isGlobal: z.boolean().default(false),
  starsEarned: z
    .number()
    .min(0, 'Stars earned must be non-negative')
    .int('Stars earned must be a whole number'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Create Personal Task Schema (for mentors/admins)
export const CreatePersonalTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  category: TaskCategories,
  planet: z
    .array(ValidPlanets)
    .min(1, 'At least one planet must be selected'),
  positions: z
    .array(z.string().regex(ObjectIdPattern, 'Invalid position ID'))
    .min(1, 'Exactly one position must be selected for personal tasks')
    .max(1, 'Personal tasks can only be assigned to one position')
    .optional(),
  userId: z.string().regex(ObjectIdPattern, 'Invalid user ID'),
  starsEarned: z
    .number()
    .min(0, 'Stars earned must be non-negative')
    .int('Stars earned must be a whole number'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Update Task Schema (for mentors/admins)
export const UpdateTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().min(1, 'Description cannot be empty').optional(),
  category: TaskCategories.optional(),
  newPositions: z
    .array(z.string().regex(ObjectIdPattern, 'Invalid position ID'))
    .optional(),
  newPlanets: z.array(ValidPlanets).optional(),
  positionsToRemove: z
    .array(z.string().regex(ObjectIdPattern, 'Invalid position ID'))
    .optional(),
  planetsToRemove: z.array(ValidPlanets).optional(),
  isGlobal: z.boolean().optional(),
  starsEarned: z
    .number()
    .min(0, 'Stars earned must be non-negative')
    .int('Stars earned must be a whole number')
    .optional(),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Mentor Change Task Status Schema (for mentors/admins)
export const MentorChangeTaskStatusSchema = z.object({
  workspaceId: z.string().regex(ObjectIdPattern, 'Invalid workspace ID'),
  menteeId: z.string().regex(ObjectIdPattern, 'Invalid mentee ID'),
  taskId: z.string().regex(ObjectIdPattern, 'Invalid task ID'),
  status: TaskStatuses,
});

// Workspace ID Params Schema
export const WorkspaceIdParamsSchema = z.object({
  workspaceId: z.string().regex(ObjectIdPattern, 'Invalid workspace ID'),
});

// Form validation helper types
export type ChangeTaskStatusForm = z.infer<typeof ChangeTaskStatusSchema>;
export type AddCommentToTaskForm = z.infer<typeof AddCommentToTaskSchema>;
export type CreateTaskForm = z.infer<typeof CreateTaskSchema>;
export type CreatePersonalTaskForm = z.infer<typeof CreatePersonalTaskSchema>;
export type UpdateTaskForm = z.infer<typeof UpdateTaskSchema>;
export type MentorChangeTaskStatusForm = z.infer<typeof MentorChangeTaskStatusSchema>;

// Validation helper functions
export const validateChangeTaskStatus = (data: unknown) => {
  try {
    return { success: true, data: ChangeTaskStatusSchema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return { success: false, data: null, errors: { general: 'Validation failed' } };
  }
};

export const validateAddCommentToTask = (data: unknown) => {
  try {
    return { success: true, data: AddCommentToTaskSchema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return { success: false, data: null, errors: { general: 'Validation failed' } };
  }
};

export const validateCreateTask = (data: unknown) => {
  try {
    return { success: true, data: CreateTaskSchema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return { success: false, data: null, errors: { general: 'Validation failed' } };
  }
};

// Export constants for use in components
export { ValidPlanets, TaskCategories, TaskStatuses };

// Zod schema for task status enum
export const TaskStatusSchema = z.enum([
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE
]);

// Zod schema for quest comment
export const QuestCommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

// Zod schema for quest task from backend
export const QuestTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: TaskStatusSchema,
  priority: z.string().optional(),
  category: z.string().optional(),
  planet: z.array(z.string()).optional(),
  starsEarned: z.number().default(0),
  link: z.string().optional(),
  workspaceId: z.string(),
  comments: z.array(QuestCommentSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Zod schema for user quest response from backend
export const UserQuestSchema = z.object({
  workspaceId: z.string(),
  tasks: z.array(QuestTaskSchema).default([]),
  totalStars: z.number().default(0),
  completedTasks: z.number().default(0),
  inProgressTasks: z.number().default(0),
});

// Zod schema for backend API response wrapper
export const BackendResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.string(),
    data: dataSchema.optional(),
    message: z.string().optional(),
  });

// Specific backend response schemas
export const QuestResponseSchema = BackendResponseSchema(UserQuestSchema);
export const TaskUpdateResponseSchema = BackendResponseSchema(QuestTaskSchema);
export const CommentResponseSchema = BackendResponseSchema(QuestCommentSchema);

// Export types from schemas
export type QuestComment = z.infer<typeof QuestCommentSchema>;
export type QuestTask = z.infer<typeof QuestTaskSchema>;
export type UserQuest = z.infer<typeof UserQuestSchema>;
export type QuestResponse = z.infer<typeof QuestResponseSchema>;
export type TaskUpdateResponse = z.infer<typeof TaskUpdateResponseSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>; 