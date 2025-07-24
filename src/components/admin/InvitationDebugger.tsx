import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/api/admin';
import axiosInstance from '@/config/axiosInstance';

export const InvitationDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runDebugTests = async () => {
    setIsLoading(true);
    const results: any[] = [];

    // Test 1: Check if we're authenticated
    try {
      results.push({ test: 'Authentication Check', status: 'testing', message: 'Checking auth...' });
      setTestResults([...results]);

      const authResponse = await axiosInstance.get('/users/me');
      results[0] = { 
        test: 'Authentication Check', 
        status: 'success', 
        message: `✅ Authenticated as: ${authResponse.data?.data?.email} (${authResponse.data?.data?.role})`,
        data: authResponse.data
      };
    } catch (error: any) {
      results[0] = { 
        test: 'Authentication Check', 
        status: 'error', 
        message: `❌ Auth failed: ${error.message}`,
        error: error.response?.data || error
      };
    }
    setTestResults([...results]);

    // Test 2: Check admin workspaces
    try {
      results.push({ test: 'Admin Workspaces', status: 'testing', message: 'Fetching workspaces...' });
      setTestResults([...results]);

      const workspacesResponse = await adminService.getUserWorkspaces();
      results[1] = { 
        test: 'Admin Workspaces', 
        status: 'success', 
        message: `✅ Found ${workspacesResponse.data?.length || 0} workspaces`,
        data: workspacesResponse
      };
    } catch (error: any) {
      results[1] = { 
        test: 'Admin Workspaces', 
        status: 'error', 
        message: `❌ Workspaces failed: ${error.message}`,
        error: error.response?.data || error
      };
    }
    setTestResults([...results]);

    // Test 3: Test direct API call to pending invitations
    try {
      results.push({ test: 'Direct API Call', status: 'testing', message: 'Calling /api/invitations/pending...' });
      setTestResults([...results]);

      const directResponse = await axiosInstance.get('/invitations/pending');
      results[2] = { 
        test: 'Direct API Call', 
        status: 'success', 
        message: `✅ Direct API success: ${directResponse.data?.data?.length || 0} invitations`,
        data: directResponse.data
      };
    } catch (error: any) {
      results[2] = { 
        test: 'Direct API Call', 
        status: 'error', 
        message: `❌ Direct API failed: ${error.response?.status} - ${error.message}`,
        error: error.response?.data || error
      };
    }
    setTestResults([...results]);

    // Test 4: Test admin service method
    try {
      results.push({ test: 'Admin Service', status: 'testing', message: 'Using adminService.getAllPendingInvitations()...' });
      setTestResults([...results]);

      const serviceResponse = await adminService.getAllPendingInvitations();
      results[3] = { 
        test: 'Admin Service', 
        status: 'success', 
        message: `✅ Service success: ${serviceResponse.data?.length || 0} invitations`,
        data: serviceResponse
      };
    } catch (error: any) {
      results[3] = { 
        test: 'Admin Service', 
        status: 'error', 
        message: `❌ Service failed: ${error.message}`,
        error: error.response?.data || error
      };
    }
    setTestResults([...results]);

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'testing': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🔍 Invitation API Debugger</h2>
          <p className="text-slate-400 mt-1">Test invitation API endpoints step by step</p>
        </div>
        <Button 
          onClick={runDebugTests}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Running Tests...' : 'Run Debug Tests'}
        </Button>
      </div>

      {testResults.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{result.test}</h4>
                    <span className={`text-sm font-mono ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-sm ${getStatusColor(result.status)} mb-2`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-slate-400 text-sm cursor-pointer">Show Response Data</summary>
                      <pre className="text-xs text-slate-300 mt-2 p-2 bg-slate-800 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                  {result.error && (
                    <details className="mt-2">
                      <summary className="text-red-400 text-sm cursor-pointer">Show Error Details</summary>
                      <pre className="text-xs text-red-300 mt-2 p-2 bg-red-900/20 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 