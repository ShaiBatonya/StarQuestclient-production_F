import { z } from 'zod';

// Activity categories that match backend validation exactly
const ActivityCategory = z.enum([
  'learning',
  'better me',
  'project',
  'product refinement',
  'technical sessions',
  'networking',
]);

// Daily Report Schemas (exactly matching backend validation)
export const DailyReportCreateSchema = z.object({
  wakeupTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:mm format'),
  mood: z.object({
    startOfDay: z
      .number()
      .min(1, 'Mood rating must be between 1 and 5')
      .max(5, 'Mood rating must be between 1 and 5'),
  }),
  morningRoutine: z.object({
    routine: z.string().min(1, 'Please describe your morning routine'),
  }),
  dailyGoals: z
    .array(
      z.object({
        description: z.string().min(1, 'Goal description cannot be empty'),
      }),
    )
    .min(3, 'Please provide between 3 to 5 daily goals')
    .max(5, 'Please provide between 3 to 5 daily goals'),
  expectedActivity: z
    .array(
      z.object({
        duration: z
          .number()
          .min(1, 'Duration must be at least 1 minute')
          .max(720, 'Duration cannot exceed 720 minutes (12 hours)'),
        category: ActivityCategory,
      }),
    )
    .min(1, 'Please add at least one expected activity'),
});

export const DailyReportUpdateSchema = z.object({
  mood: z
    .object({
      startOfDay: z
        .number()
        .min(1, 'Mood rating must be between 1 and 5')
        .max(5, 'Mood rating must be between 1 and 5')
        .optional(),
    })
    .optional(),
  wakeupTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:mm format')
    .optional(),
  morningRoutine: z
    .object({
      routine: z.string().min(1, 'Please describe your morning routine').optional(),
    })
    .optional(),
  dailyGoals: z
    .array(
      z.object({
        description: z.string().min(1, 'Goal description cannot be empty'),
        completed: z.boolean().optional(),
      }),
    )
    .min(3, 'Please provide between 3 to 5 daily goals')
    .max(5, 'Please provide between 3 to 5 daily goals')
    .optional(),
  expectedActivity: z
    .array(
      z.object({
        duration: z
          .number()
          .min(1, 'Duration must be at least 1 minute')
          .max(720, 'Duration cannot exceed 720 minutes')
          .optional(),
        category: ActivityCategory.optional(),
      }),
    )
    .optional(),
});

// End of Day Update Schema (exactly matching backend)
export const EndOfDayUpdateSchema = z.object({
  mood: z.object({
    endOfDay: z
      .number()
      .min(1, 'End of day mood rating must be between 1 and 5')
      .max(5, 'End of day mood rating must be between 1 and 5'),
  }),
  dailyGoals: z
    .array(
      z.object({
        description: z.string().min(1, 'Goal description cannot be empty'),
        completed: z.boolean(),
        completionTime: z.number().optional(),
      }),
    )
    .min(1, 'At least one goal must be provided'),
  actualActivity: z
    .array(
      z.object({
        duration: z
          .number()
          .min(1, 'Duration must be at least 1 minute')
          .max(720, 'Duration cannot exceed 720 minutes'),
        category: ActivityCategory,
      }),
    )
    .min(1, 'Please add at least one actual activity'),
  insights: z.string().optional(),
  morningRoutineCompleted: z.boolean().optional(),
});

// Weekly Report Schema (exactly matching backend validation)
export const WeeklyReportCreateSchema = z.object({
  moodRating: z
    .number()
    .min(1, 'Mood rating must be between 1 and 5')
    .max(5, 'Mood rating must be between 1 and 5'),
  moodExplanation: z.string().min(1, 'Please explain your mood rating'),
  significantEvent: z.string().optional(),
  newInterestingLearning: z.string().optional(),
  maintainWeeklyRoutine: z.object({
    status: z.boolean(),
    details: z.string().min(1, 'Please provide details about your weekly routine'),
  }),
  achievedGoals: z.object({
    goals: z
      .array(z.string().min(1, 'Goal cannot be empty'))
      .min(1, 'Please provide at least one achieved goal'),
    shared: z.boolean(),
  }),
  freeTime: z.object({
    status: z.boolean(),
    details: z.string().min(1, 'Please provide details about your free time'),
  }),
  productProgress: z.string().optional(),
  courseChapter: z.string().optional(),
  learningGoalAchievement: z.object({
    status: z.boolean(),
    details: z.string().min(1, 'Please provide details about your learning goal achievement'),
  }),
  mentorInteraction: z.object({
    status: z.boolean(),
    details: z.string().min(1, 'Please provide details about mentor interaction'),
  }),
  supportInteraction: z.object({
    status: z.boolean(),
    details: z.string().min(1, 'Please provide details about support interaction'),
  }),
  additionalSupport: z.string().optional(),
  openQuestions: z.string().optional(),
});

export const WeeklyReportUpdateSchema = WeeklyReportCreateSchema.partial();

// Form validation helper types
export type DailyReportCreateForm = z.infer<typeof DailyReportCreateSchema>;
export type DailyReportUpdateForm = z.infer<typeof DailyReportUpdateSchema>;
export type EndOfDayUpdateForm = z.infer<typeof EndOfDayUpdateSchema>;
export type WeeklyReportCreateForm = z.infer<typeof WeeklyReportCreateSchema>;
export type WeeklyReportUpdateForm = z.infer<typeof WeeklyReportUpdateSchema>;

// Activity category options for forms
export const ACTIVITY_CATEGORIES = [
  { value: 'learning', label: 'Learning', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'better me', label: 'Better Me', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'project', label: 'Project', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'product refinement', label: 'Product Refinement', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'technical sessions', label: 'Technical Sessions', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'networking', label: 'Networking', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
] as const;

// Validation helper functions with detailed error handling
export const validateDailyReportCreate = (data: unknown) => {
  try {
    return { success: true, data: DailyReportCreateSchema.parse(data), errors: null };
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

export const validateDailyReportUpdate = (data: unknown) => {
  try {
    return { success: true, data: DailyReportUpdateSchema.parse(data), errors: null };
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

export const validateEndOfDayUpdate = (data: unknown) => {
  try {
    return { success: true, data: EndOfDayUpdateSchema.parse(data), errors: null };
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

export const validateWeeklyReportCreate = (data: unknown) => {
  try {
    return { success: true, data: WeeklyReportCreateSchema.parse(data), errors: null };
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

export const validateWeeklyReportUpdate = (data: unknown) => {
  try {
    return { success: true, data: WeeklyReportUpdateSchema.parse(data), errors: null };
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