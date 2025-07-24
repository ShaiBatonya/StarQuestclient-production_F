import { BaseApiService } from './base';
import { 
  LeaderboardResponseSchema,
  type LeaderboardResponse,
  type LeaderboardUser
} from '@/schemas/leaderboard.schemas';

export type { LeaderboardUser };

export class LeaderboardService extends BaseApiService {
  private static instance: LeaderboardService;

  private constructor() {
    super();
  }

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  public async getLeaderboard(workspaceId: string): Promise<LeaderboardResponse> {
    try {
      const response = await this.api.get(`/workspace/${workspaceId}/leaderboard`);
      
      // Debug: Log the actual response structure
      console.log('Raw API response:', JSON.stringify(response.data, null, 2));
      
      // Validate response with Zod
      const validatedResponse = LeaderboardResponseSchema.parse(response.data);
      return validatedResponse;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  // Clear leaderboard-related cache
  public clearLeaderboardCache(): void {
    // Note: Cache management would be implemented here
    // For now, this is a placeholder method
    console.log('Leaderboard cache cleared');
  }
}

export const leaderboardService = LeaderboardService.getInstance(); 