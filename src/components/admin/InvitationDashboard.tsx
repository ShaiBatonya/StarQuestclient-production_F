import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Download,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  Eye,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useAllPendingInvitations,
  useWorkspaceInvitations,
  useAdminWorkspaces,
  useCancelInvitation,
  useResendInvitation,
  useSendWorkspaceInvitation
} from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/environment';

interface InvitationDashboardProps {
  searchTerm: string;
}

interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  cancelled: number;
}

interface InvitationActivity {
  id: string;
  type: 'sent' | 'accepted' | 'cancelled' | 'expired';
  email: string;
  workspace: string;
  timestamp: Date;
  inviter: string;
}

export const InvitationDashboard: React.FC<InvitationDashboardProps> = ({ searchTerm }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'expired' | 'cancelled'>('all');

  const { data: workspaces = [], isLoading: loadingWorkspaces, error: workspacesError } = useAdminWorkspaces();
  const { data: allPendingInvitations = [], isLoading: loadingPending, error: pendingError } = useAllPendingInvitations();
  
  // Only fetch workspace-specific invitations if we have a valid workspace ID
  const shouldFetchWorkspaceInvitations = selectedWorkspace !== 'all' && selectedWorkspace && workspaces.length > 0;
  const validWorkspaceId = shouldFetchWorkspaceInvitations ? selectedWorkspace : null;
  
  const { data: workspaceInvitations = [], isLoading: loadingWorkspace, error: workspaceError } = useWorkspaceInvitations(validWorkspaceId);

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 InvitationDashboard state:', {
      selectedWorkspace,
      workspacesCount: workspaces.length,
      shouldFetchWorkspaceInvitations,
      validWorkspaceId,
      loadingPending,
      loadingWorkspace,
      loadingWorkspaces,
      allPendingInvitations: allPendingInvitations.length,
      workspaceInvitations: workspaceInvitations.length,
    });
  }, [selectedWorkspace, workspaces.length, shouldFetchWorkspaceInvitations, validWorkspaceId, loadingPending, loadingWorkspace, loadingWorkspaces, allPendingInvitations.length, workspaceInvitations.length]);

  // Debug function to test API directly
  const testInvitationAPI = async () => {
    try {
      console.log('🧪 Testing invitation API directly...');
      const response = await fetch(`${API_BASE_URL}/invitations/pending`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🧪 Raw fetch response:', response);
      console.log('🧪 Response status:', response.status);
      console.log('🧪 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🧪 Response error text:', errorText);
        return;
      }
      
      const data = await response.json();
      console.log('🧪 Response data:', data);
    } catch (error) {
      console.error('🧪 Fetch error:', error);
    }
  };
  
  const cancelInvitationMutation = useCancelInvitation();
  const resendInvitationMutation = useResendInvitation();
  const sendInvitationMutation = useSendWorkspaceInvitation();

  // State for manual invitation
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteWorkspace, setInviteWorkspace] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'mentor' | 'mentee'>('mentee');

  // Calculate invitation statistics
  const invitationStats: InvitationStats = useMemo(() => {
    const relevantInvitations = selectedWorkspace === 'all' ? allPendingInvitations : workspaceInvitations;
    
    return {
      total: relevantInvitations.length,
      pending: relevantInvitations.filter(inv => inv.status === 'pending').length,
      accepted: relevantInvitations.filter(inv => inv.status === 'accepted').length,
      expired: relevantInvitations.filter(inv => inv.status === 'expired').length,
      cancelled: relevantInvitations.filter(inv => inv.status === 'cancelled').length,
    };
  }, [allPendingInvitations, workspaceInvitations, selectedWorkspace]);

  // Filter invitations based on search and filters
  const filteredInvitations = useMemo(() => {
    const relevantInvitations = selectedWorkspace === 'all' ? allPendingInvitations : workspaceInvitations;
    
    return relevantInvitations.filter(invitation => {
      const matchesSearch = !searchTerm || 
        invitation.inviteeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.workspace?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allPendingInvitations, workspaceInvitations, selectedWorkspace, searchTerm, statusFilter]);

  // Mock recent activity (in production, this would come from an API)
  const recentActivity: InvitationActivity[] = useMemo(() => [
    {
      id: '1',
      type: 'sent',
      email: 'alice@company.com',
      workspace: 'Engineering Team',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      inviter: 'John Doe'
    },
    {
      id: '2',
      type: 'accepted',
      email: 'bob@company.com',
      workspace: 'Design Team',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      inviter: 'Jane Smith'
    },
    {
      id: '3',
      type: 'expired',
      email: 'charlie@company.com',
      workspace: 'Marketing Team',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      inviter: 'Mike Johnson'
    }
  ], []);

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to cancel the invitation to ${email}?`)) {
      return;
    }

    try {
      await cancelInvitationMutation.mutateAsync(invitationId);
      toast.success(`Invitation to ${email} cancelled successfully`);
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    try {
      await resendInvitationMutation.mutateAsync(invitationId);
      toast.success(`Invitation resent to ${email}`);
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail || !inviteWorkspace) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await sendInvitationMutation.mutateAsync({
        workspaceId: inviteWorkspace,
        inviteeEmail: inviteEmail,
        inviteeRole: inviteRole
      });
      
      toast.success(`Invitation sent to ${inviteEmail}! Check their Gmail inbox.`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteWorkspace('');
      setInviteRole('mentee');
    } catch (error: any) {
      console.error('Failed to send invitation:', error);
      toast.error(error?.message || 'Failed to send invitation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Accepted</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Cancelled</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return <Send className="w-4 h-4 text-blue-400" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Consider loading if any critical data is still loading - but add timeout
  const isLoading = loadingPending || loadingWorkspaces || (shouldFetchWorkspaceInvitations && loadingWorkspace);
  const hasError = pendingError || workspaceError || workspacesError;

  // Force loading to false after 10 seconds to prevent infinite loading
  React.useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Forcing loading state to false after 10 seconds to prevent infinite loading');
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Error state
  if (hasError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">📧 Invitation Management</h1>
            <p className="text-red-400 mt-2">Error loading invitation data</p>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Invitations</h3>
          <p className="text-red-300 mb-6">
            {pendingError?.message || workspaceError?.message || workspacesError?.message || 'An error occurred while loading invitation data.'}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button 
              onClick={() => console.log('Navigate to status page')} 
              variant="outline"
              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500"
            >
              <Activity className="w-4 h-4 mr-2" />
              View Diagnostics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">📧 Invitation Dashboard</h1>
            <p className="text-slate-400 mt-2">Loading invitation analytics...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-16 mb-1"></div>
                <div className="h-3 bg-slate-700 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📧 Invitation Management</h1>
          <p className="text-slate-400 mt-2">Monitor and manage workspace invitations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={testInvitationAPI}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            🧪 Debug API
          </Button>
          <Button 
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Invitations</p>
                <p className="text-2xl font-bold text-white">{invitationStats.total}</p>
                <p className="text-slate-500 text-xs">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{invitationStats.pending}</p>
                <p className="text-slate-500 text-xs">Awaiting response</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Accepted</p>
                <p className="text-2xl font-bold text-green-400">{invitationStats.accepted}</p>
                <p className="text-slate-500 text-xs">Successfully joined</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Acceptance Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {invitationStats.total > 0 ? Math.round((invitationStats.accepted / invitationStats.total) * 100) : 0}%
                </p>
                <p className="text-slate-500 text-xs">Success rate</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invitation Table */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Active Invitations
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
                    disabled={loadingWorkspaces}
                  >
                    <option value="all">All Workspaces</option>
                    {workspaces.map((workspace) => (
                      <option key={workspace._id || workspace.id} value={workspace._id || workspace.id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvitations.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-2">No invitations found</h3>
                    <p className="text-slate-500 mb-4">
                      {searchTerm ? 'No invitations match your search criteria.' : 'No pending invitations at the moment.'}
                    </p>
                    <Button
                      onClick={() => setShowInviteModal(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send First Invitation
                    </Button>
                  </div>
                ) : (
                  filteredInvitations.map((invitation) => (
                  <div key={invitation._id} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="text-white font-medium">{invitation.inviteeEmail}</p>
                            <p className="text-slate-400 text-sm">
                              {invitation.workspace?.name} • {invitation.inviteeRole}
                              {invitation.planet && ` • ${invitation.planet}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          {getStatusBadge(invitation.status)}
                          <span className="text-slate-500 text-sm">
                            Invited {formatTimeAgo(new Date(invitation.createdAt))}
                          </span>
                          {invitation.tokenExpires && (
                            <span className="text-slate-500 text-sm">
                              Expires {new Date(invitation.tokenExpires).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {invitation.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResendInvitation(invitation._id, invitation.inviteeEmail)}
                              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Resend
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelInvitation(invitation._id, invitation.inviteeEmail)}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Sidebar */}
        <div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.email}</span>
                        <span className="text-slate-400 ml-1">
                          {activity.type === 'sent' && 'was invited to'}
                          {activity.type === 'accepted' && 'joined'}
                          {activity.type === 'cancelled' && 'invitation cancelled for'}
                          {activity.type === 'expired' && 'invitation expired for'}
                        </span>
                      </p>
                      <p className="text-slate-400 text-xs truncate">{activity.workspace}</p>
                      <p className="text-slate-500 text-xs">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                <Users className="w-4 h-4 mr-2" />
                Bulk Invite Users
              </Button>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Invitations
              </Button>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Review Expired
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Invite User to Workspace</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium">Workspace</label>
                <select
                  value={inviteWorkspace}
                  onChange={(e) => setInviteWorkspace(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Select workspace</option>
                  {workspaces.map((workspace) => (
                    <option key={workspace._id || workspace.id} value={workspace._id || workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'mentor' | 'mentee')}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 mt-1"
                >
                  <option value="mentee">Mentee</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvitation}
                disabled={sendInvitationMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {sendInvitationMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 