import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import axiosInstance from '@/config/axiosInstance';
import { paths } from '@/routes/paths';

interface AcceptInvitationState {
  status: 'loading' | 'success' | 'error' | 'needs-auth';
  message: string;
  workspaceName?: string;
}

export const AcceptInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [state, setState] = useState<AcceptInvitationState>({
    status: 'loading',
    message: 'Processing your invitation...'
  });

  const invitationToken = searchParams.get('invitationToken');

  useEffect(() => {
    if (!invitationToken) {
      setState({
        status: 'error',
        message: 'Invalid invitation link. Please check your email for the correct link.'
      });
      return;
    }

    // If user is not authenticated, redirect to register/login
    if (!isAuthenticated) {
      setState({
        status: 'needs-auth',
        message: 'Please register or login to accept this invitation.'
      });
      return;
    }

    // Accept the invitation
    acceptInvitation();
  }, [invitationToken, isAuthenticated]);

  const acceptInvitation = async () => {
    if (!invitationToken) return;

    try {
      setState({
        status: 'loading',
        message: 'Accepting your invitation...'
      });

      const response = await axiosInstance.post(`/workspace/accept-invitation/${invitationToken}`);
      
      if (response.data.status === 'success') {
        setState({
          status: 'success',
          message: response.data.message || 'Successfully joined the workspace!',
          workspaceName: response.data.data?.workspaceName
        });

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate(paths.UserDashboard);
        }, 2000);
      } else {
        setState({
          status: 'error',
          message: response.data.message || 'Failed to accept invitation.'
        });
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setState({
        status: 'error',
        message: error.response?.data?.message || 'An error occurred while accepting the invitation.'
      });
    }
  };

  const handleAuthRedirect = (path: string) => {
    // Store the invitation token in session storage to use after auth
    if (invitationToken) {
      sessionStorage.setItem('pendingInvitationToken', invitationToken);
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {state.status === 'loading' && (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            )}
            {state.status === 'success' && (
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            )}
            {state.status === 'error' && (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
            {state.status === 'needs-auth' && (
              <UserPlus className="w-12 h-12 text-yellow-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {state.status === 'loading' && 'Processing Invitation'}
            {state.status === 'success' && 'Welcome to the Workspace!'}
            {state.status === 'error' && 'Invitation Error'}
            {state.status === 'needs-auth' && 'Authentication Required'}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            {state.message}
          </CardDescription>
          {state.workspaceName && (
            <p className="text-white mt-2">
              You've joined <strong>{state.workspaceName}</strong>
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          {state.status === 'needs-auth' && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm text-center">
                To accept this workspace invitation, you need to have an account.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleAuthRedirect(paths.register)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create New Account
                </Button>
                <Button
                  onClick={() => handleAuthRedirect(paths.login)}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                >
                  Login to Existing Account
                </Button>
              </div>
            </div>
          )}

          {state.status === 'error' && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate(paths.UserDashboard)}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {state.status === 'success' && (
            <p className="text-slate-400 text-sm text-center">
              Redirecting to your dashboard...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 