// Import necessary components and libraries.
import { UserDashboard, AdminDashboard, Login, Register, ForgotPassword, ResetPassword, NotFound, DailyReports, WeeklyReports, EndOfDayReports, Verification, LeaderBoard, Profile, AcceptInvitation } from './elements';
import Layout from '@/Layout/Layout';
import { PrivateRoute, AdminRoute } from '@/components/auth';
import { useRoutes } from 'react-router-dom';
import { paths } from '@/routes/paths';
import Quest from '@/pages/public/Quest';
import { LearningRoadmap } from '@/components/Dashboard/LearningRoadmap';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Router component responsible for rendering different components based on the user's authentication status.
const Router: React.FC = (): JSX.Element => {
  // Define the routes and their corresponding components.
  const routes = [
    {
      path: paths.UserDashboard,
      element: <Layout />,
      children: [
        {
          path: paths.UserDashboard,
          element: (
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: paths.DailyReports,
          element: (
            <PrivateRoute>
              <DailyReports />
            </PrivateRoute>
          ),
        },
        {
          path: paths.WeeklyReports,
          element: (
            <PrivateRoute>
              <WeeklyReports />
            </PrivateRoute>
          ),
        },
        {
          path: paths.EndOfDayReports,
          element: (
            <PrivateRoute>
              <EndOfDayReports />
            </PrivateRoute>
          ),
        },
        {
          path: paths.LeaderBoard,
          element: (
            <PrivateRoute>
              <LeaderBoard />
            </PrivateRoute>
          ),
        },
        {
          path: paths.Quest,
          element: (
            <PrivateRoute>
              <Quest />
            </PrivateRoute>
          ),
        },
        {
          path: paths.LearningRoadmap,
          element: (
            <PrivateRoute>
              <LearningRoadmap />
            </PrivateRoute>
          ),
        },
        {
          path: paths.Profile,
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: paths.AdminDashboard,
          element: (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          ),
        },
        {
          path: paths.register,
          element: <Register />,
        },
        {
          path: paths.login,
          element: <Login />,
        },
        {
          path: paths.verification,
          element: <Verification />,
        },
        {
          path: paths.forgotpassword,
          element: <ForgotPassword />,
        },
        {
          path: paths.resetpassword,
          element: <ResetPassword />,
        },
        {
          path: paths.acceptInvitation,
          element: <AcceptInvitation />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ];

  // Render the defined routes using useRoutes with error boundary.
  return (
    <ErrorBoundary>
      {useRoutes(routes) || <NotFound />}
    </ErrorBoundary>
  );
};

// Export the Router component as the default export.
export default Router;
