export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  content: string;
  mood: MoodType;
  challenges?: string;
  achievements?: string;
  goals?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  END_OF_DAY = 'end_of_day'
}

export enum MoodType {
  GREAT = 'great',
  GOOD = 'good',
  OKAY = 'okay',
  BAD = 'bad'
}

// Daily Report Types (matching backend validation exactly)
export interface DailyReportCreate {
  wakeupTime: string; // HH:mm format
  mood: {
    startOfDay: number; // 1-5 rating
  };
  morningRoutine: {
    routine: string;
  };
  dailyGoals: Array<{
    description: string;
  }>; // 3-5 goals
  expectedActivity: Array<{
    duration: number;
    category: ActivityCategory;
  }>;
}

export interface DailyReportUpdate {
  mood?: {
    startOfDay?: number;
  };
  wakeupTime?: string;
  morningRoutine?: {
    routine?: string;
  };
  dailyGoals?: Array<{
    description: string;
    completed?: boolean;
  }>;
  expectedActivity?: Array<{
    duration?: number;
    category?: ActivityCategory;
  }>;
}

export interface EndOfDayUpdate {
  mood: {
    endOfDay: number; // 1-5 rating
  };
  dailyGoals: Array<{
    description: string;
    completed: boolean;
    completionTime?: number;
  }>;
  actualActivity: Array<{
    duration: number;
    category: ActivityCategory;
  }>;
  insights?: string;
  morningRoutineCompleted?: boolean;
}

export interface DailyReport {
  id: string;
  wakeupTime: string;
  mood: {
    startOfDay?: number;
    endOfDay?: number;
  };
  morningRoutine: {
    routine: string;
  };
  dailyGoals: Array<{
    description: string;
    completed: boolean;
  }>;
  expectedActivity: Array<{
    duration: number;
    category: string;
  }>;
  actualActivity?: Array<{
    duration: number;
    category: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Weekly Report Types (matching backend validation exactly)
export interface WeeklyReportCreate {
  moodRating: number; // 1-5
  moodExplanation: string;
  significantEvent?: string;
  newInterestingLearning?: string;
  maintainWeeklyRoutine: {
    status: boolean;
    details: string;
  };
  achievedGoals: {
    goals: string[]; // non-empty array
    shared: boolean;
  };
  freeTime: {
    status: boolean;
    details: string;
  };
  productProgress?: string;
  courseChapter?: string;
  learningGoalAchievement: {
    status: boolean;
    details: string;
  };
  mentorInteraction: {
    status: boolean;
    details: string;
  };
  supportInteraction: {
    status: boolean;
    details: string;
  };
  additionalSupport?: string;
  openQuestions?: string;
}

export interface WeeklyReport {
  id: string;
  moodRating: number;
  moodExplanation: string;
  significantEvent?: string;
  newInterestingLearning?: string;
  maintainWeeklyRoutine: {
    status: boolean;
    details: string;
  };
  achievedGoals: {
    goals: string[];
    shared: boolean;
  };
  freeTime: {
    status: boolean;
    details: string;
  };
  productProgress?: string;
  courseChapter?: string;
  learningGoalAchievement: {
    status: boolean;
    details: string;
  };
  mentorInteraction: {
    status: boolean;
    details: string;
  };
  supportInteraction: {
    status: boolean;
    details: string;
  };
  additionalSupport?: string;
  openQuestions?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity Categories
export type ActivityCategory = 
  | 'learning' 
  | 'better me' 
  | 'project' 
  | 'product refinement' 
  | 'technical sessions' 
  | 'networking';

// Report Filters
export interface ReportFilters {
  type?: ReportType;
  startDate?: string;
  endDate?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

// Backend Response Type - using the one from Auth.ts

// Report Statistics
export interface ReportStats {
  totalReports: number;
  moodDistribution: Record<MoodType, number>;
  completionRate: number;
} 