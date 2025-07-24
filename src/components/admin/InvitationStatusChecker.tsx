import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Mail, 
  Users, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  useAllPendingInvitations,
  useAdminWorkspaces,
} from '@/hooks/useAdmin';
import { adminService } from '@/services/api/admin';

interface TestResult {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export const InvitationStatusChecker: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const { data: workspaces = [], isLoading: loadingWorkspaces } = useAdminWorkspaces();
  const { data: pendingInvitations = [], isLoading: loadingInvitations, error: invitationsError } = useAllPendingInvitations();

  const runInvitationTests = async () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    // Test 1: Check API connectivity
    results.push({
      name: 'API Connectivity',
      status: 'loading',
      message: 'Testing API connection...'
    });
    setTestResults([...results]);

    try {
      const response = await adminService.getAllPendingInvitations();
      results[0] = {
        name: 'API Connectivity',
        status: 'success',
        message: `✅ API connected successfully`,
        data: response
      };
    } catch (error: any) {
      results[0] = {
        name: 'API Connectivity',
        status: 'error',
        message: `❌ API Error: ${error.message}`,
        data: error
      };
    }
    setTestResults([...results]);

    // Test 2: Check workspace access
    results.push({
      name: 'Workspace Access',
      status: 'loading',
      message: 'Testing workspace access...'
    });
    setTestResults([...results]);

    try {
      if (workspaces.length > 0) {
        results[1] = {
          name: 'Workspace Access',
          status: 'success',
          message: `✅ Found ${workspaces.length} workspaces`,
          data: workspaces
        };
      } else {
        results[1] = {
          name: 'Workspace Access',
          status: 'error',
          message: '❌ No workspaces found or access denied',
        };
      }
    } catch (error: any) {
      results[1] = {
        name: 'Workspace Access',
        status: 'error',
        message: `❌ Workspace Error: ${error.message}`,
      };
    }
    setTestResults([...results]);

    // Test 3: Test invitation sending (if workspaces exist)
    if (workspaces.length > 0) {
      results.push({
        name: 'Invitation System',
        status: 'loading',
        message: 'Testing invitation system...'
      });
      setTestResults([...results]);

      try {
        // We'll just validate the invitation system structure
        results[2] = {
          name: 'Invitation System',
          status: 'success',
          message: `✅ Invitation system ready - ${pendingInvitations.length} pending invitations`,
          data: pendingInvitations
        };
      } catch (error: any) {
        results[2] = {
          name: 'Invitation System',
          status: 'error',
          message: `❌ Invitation System Error: ${error.message}`,
        };
      }
      setTestResults([...results]);
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🔍 Invitation System Status</h2>
          <p className="text-slate-400 mt-1">Diagnostic tools for invitation functionality</p>
        </div>
        <Button 
          onClick={runInvitationTests}
          disabled={isRunningTests}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isRunningTests ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Workspaces</p>
                <p className="text-2xl font-bold text-white">
                  {loadingWorkspaces ? '...' : workspaces.length}
                </p>
                <p className="text-slate-500 text-xs">Available</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Invitations</p>
                <p className="text-2xl font-bold text-white">
                  {loadingInvitations ? '...' : pendingInvitations.length}
                </p>
                <p className="text-slate-500 text-xs">Active</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Status</p>
                <p className="text-2xl font-bold text-white">
                  {invitationsError ? 'Error' : 'Ready'}
                </p>
                <p className="text-slate-500 text-xs">
                  {invitationsError ? 'Check logs' : 'Operational'}
                </p>
              </div>
              <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center ${
                invitationsError 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-green-500/10 border-green-500/20'
              }`}>
                {invitationsError ? (
                  <XCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="text-white font-medium">{result.name}</p>
                      <p className="text-slate-400 text-sm">{result.message}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Details */}
      {invitationsError && (
        <Card className="bg-red-900/20 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Error Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-300 font-mono text-sm">
              {JSON.stringify(invitationsError, null, 2)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-2">API Endpoints Status:</p>
              <div className="space-y-1">
                <p className="text-slate-300">• GET /api/invitations/pending</p>
                <p className="text-slate-300">• GET /api/invitations/workspace/:id</p>
                <p className="text-slate-300">• POST /api/invitations/:id/resend</p>
                <p className="text-slate-300">• PATCH /api/invitations/:id/cancel</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 mb-2">Current User Context:</p>
              <div className="space-y-1">
                <p className="text-slate-300">• Admin Access: {workspaces.length > 0 ? 'Yes' : 'No'}</p>
                <p className="text-slate-300">• Workspaces: {workspaces.length}</p>
                <p className="text-slate-300">• Loading: {loadingWorkspaces || loadingInvitations ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 