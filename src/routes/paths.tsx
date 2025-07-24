export const paths = {
  UserDashboard: '/',
  DailyReports: '/daily-reports',
  WeeklyReports: '/weekly-reports',
  EndOfDayReports: '/end-of-day-reports',
  LeaderBoard: '/leaderboard',
  Quest: '/quest',
  LearningRoadmap: '/learning-roadmap',
  Profile: '/profile',
  AdminDashboard: '/admin',
  register: '/register',
  login: '/login',
  verification: '/verification',
  forgotpassword: '/forgot-password',
  resetpassword: '/reset-password/:token',
  acceptInvitation: '/workspace/accept-invitation',
  unauthorized: '/unauthorized',
  notFound: '*'
} as const;

export type Paths = typeof paths;
