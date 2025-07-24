import { z } from 'zod';

// Zod schema for leaderboard user
export const LeaderboardUserSchema = z.object({
  rank: z.number().optional(),
  name: z.string(),
  position: z.string(),
  badgesCount: z.number().default(0),
  totalStars: z.number().default(0),
  weeklyStars: z.number().optional(),
  completedCourses: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

// Zod schema for backend API response wrapper
export const BackendResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.string(),
    data: dataSchema.optional(),
    message: z.string().optional(),
  });

// Specific backend response schemas
export const LeaderboardResponseSchema = BackendResponseSchema(z.array(LeaderboardUserSchema));

// Export types from schemas
export type LeaderboardUser = z.infer<typeof LeaderboardUserSchema>;
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>; 