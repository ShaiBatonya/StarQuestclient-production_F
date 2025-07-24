import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Send,
  RefreshCw,
  X,
  Building,
  UserPlus,
  Shield,
  Eye,
  Mail,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  useAdminWorkspaces,
  useWorkspaceUsers,
  useWorkspaceInvitations,
  useCreateWorkspace,
  useUpdateWorkspace,
  useSendWorkspaceInvitation,
  useCancelInvitation,
  useResendInvitation,
  useWorkspaceLeaderboard,
  useWorkspacePositions,
  useDeleteWorkspace
} from '@/hooks/useAdmin';
import { AdminWorkspace } from '@/services/api/admin';
import { cn } from '@/lib/utils';

interface WorkspaceManagementProps {
  searchTerm: string;
}

interface WorkspaceFormData {
  name: string;
  description: string;
  rules: string;
}

interface InvitationFormData {
  email: string;
  role: 'admin' | 'mentor' | 'mentee'; // Fixed to match backend enum
  position: string;
}

interface WorkspaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace?: AdminWorkspace | null;
  mode: 'create' | 'edit';
}

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

interface WorkspaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: AdminWorkspace | null;
}

const WorkspaceFormModal: React.FC<WorkspaceFormModalProps> = ({ 
  isOpen, 
  onClose, 
  workspace, 
  mode 
}) => {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: '',
    description: '',
    rules: ''
  });

  const createWorkspaceMutation = useCreateWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();

  React.useEffect(() => {
    if (workspace && mode === 'edit') {
      setFormData({
        name: workspace.name || '',
        description: workspace.description || '',
        rules: workspace.rules || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        rules: ''
      });
    }
  }, [workspace, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Workspace description is required');
      return;
    }
    
    if (!formData.rules.trim()) {
      toast.error('Workspace rules are required');
      return;
    }
    
    // Log the payload for debugging
    console.log('🚀 Submitting workspace data:', {
      name: formData.name.trim(),
      description: formData.description.trim(),
      rules: formData.rules.trim()
    });
    
    try {
      if (mode === 'edit' && workspace) {
        await updateWorkspaceMutation.mutateAsync({
          workspaceId: workspace._id,
          workspaceData: formData
        });
      } else {
        await createWorkspaceMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
      console.error('❌ Workspace submission error:', error);
    }
  };

  const isLoading = createWorkspaceMutation.isPending || updateWorkspaceMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {mode === 'edit' ? 'Edit Workspace' : 'Create Workspace'}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-slate-300 text-sm font-medium">
              Workspace Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`mt-1 bg-slate-700/50 border-slate-600 text-white ${
                formData.name.trim() === '' ? 'border-red-500/50' : ''
              }`}
              placeholder="e.g., Development Team, Marketing Department"
              required
            />
            {formData.name.trim() === '' && (
              <p className="text-red-400 text-xs mt-1">Workspace name is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300 text-sm font-medium">
              Description *
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 min-h-[100px] ${
                formData.description.trim() === '' ? 'border-red-500/50' : ''
              }`}
              placeholder="Describe the workspace purpose, goals, and team structure"
              rows={4}
              required
            />
            {formData.description.trim() === '' && (
              <p className="text-red-400 text-xs mt-1">Description is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="rules" className="text-slate-300 text-sm font-medium">
              Workspace Rules *
            </Label>
            <textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className={`mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 min-h-[100px] ${
                formData.rules.trim() === '' ? 'border-red-500/50' : ''
              }`}
              placeholder="Define workspace rules, guidelines, and policies for team members"
              rows={4}
              required
            />
            {formData.rules.trim() === '' && (
              <p className="text-red-400 text-xs mt-1">Rules are required</p>
            )}
            <p className="text-slate-400 text-xs mt-1">
              Rules help establish guidelines and expectations for workspace members
            </p>
            
            {/* Quick Rules Templates */}
            <div className="mt-3 space-y-2">
              <p className="text-slate-400 text-xs font-medium">Quick Templates:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Respect deadlines and communicate early if delays occur',
                  'Be respectful and professional in all communications',
                  'Complete daily reports and weekly summaries on time',
                  'Ask questions when unsure and help team members when possible',
                  'Follow the established coding standards and review processes'
                ].map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, rules: template })}
                    className="text-xs px-2 py-1 bg-slate-700/50 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded transition-colors"
                  >
                    {template.length > 40 ? template.substring(0, 40) + '...' : template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-400 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.name.trim() || !formData.description.trim() || !formData.rules.trim()}
            >
              {isLoading ? 'Creating...' : 
               mode === 'edit' ? 'Update Workspace' : 'Create Workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InvitationModal: React.FC<InvitationModalProps> = ({ 
  isOpen, 
  onClose, 
  workspaceId,
  workspaceName 
}) => {
  const [formData, setFormData] = useState<InvitationFormData>({
    email: '',
    role: 'mentee', // Default to mentee instead of user
    position: ''
  });

  const { data: positions = [] } = useWorkspacePositions(workspaceId);
  const sendInvitationMutation = useSendWorkspaceInvitation();

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        role: 'mentee',
        position: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation with detailed logging
    console.log('🔍 Invitation form validation:', {
      workspaceId,
      workspaceIdType: typeof workspaceId,
      workspaceIdLength: workspaceId?.length,
      email: formData.email,
      role: formData.role
    });

    // Validate workspaceId is present and valid
    if (!workspaceId || workspaceId.trim() === '') {
      console.error('❌ WorkspaceId is empty or invalid:', workspaceId);
      toast.error('Invalid workspace. Please try again.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error('❌ Email format invalid:', formData.email);
      toast.error('Please enter a valid email address.');
      return;
    }

    // Validate ObjectId format (24 character hex string)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      console.error('❌ WorkspaceId format invalid:', {
        workspaceId,
        length: workspaceId.length,
        pattern: objectIdRegex.toString(),
        testResult: objectIdRegex.test(workspaceId)
      });
      toast.error(`Invalid workspace ID format. Expected 24-character hex string, got: ${workspaceId.length} characters`);
      return;
    }
    
    try {
      console.log('🚀 Sending invitation with data:', {
        workspaceId,
        inviteeEmail: formData.email,
        inviteeRole: formData.role
      });

      await sendInvitationMutation.mutateAsync({
        workspaceId,
        inviteeEmail: formData.email,
        inviteeRole: formData.role
      });
      onClose();
    } catch (error) {
      console.error('❌ Invitation error:', error);
      // Error handling is done in the hooks
    }
  };

  const isLoading = sendInvitationMutation.isPending;

  // Don't render if no valid workspaceId
  if (!isOpen || !workspaceId || workspaceId.trim() === '') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Send Invitation</h2>
            <p className="text-slate-400 text-sm">Invite user to {workspaceName}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 bg-slate-700/50 border-slate-600 text-white"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-slate-300 text-sm font-medium">
              Role *
            </Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2"
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {positions.length > 0 && (
            <div>
              <Label htmlFor="position" className="text-slate-300 text-sm font-medium">
                Position (Optional)
              </Label>
              <select
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2"
              >
                <option value="">No specific position</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Invitation Preview
            </h4>
            <p className="text-slate-300 text-sm">
              <strong>{formData.email}</strong> will be invited to join <strong>{workspaceName}</strong> as a <strong>{formData.role}</strong>
              {formData.position && positions.find(p => p.id === formData.position) && (
                <> in the <strong>{positions.find(p => p.id === formData.position)?.name}</strong> position</>
              )}.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-400 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const WorkspaceDetailsModal: React.FC<WorkspaceDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  workspace 
}) => {
  const { data: usersRaw } = useWorkspaceUsers(workspace?._id || null);
  const users = Array.isArray(usersRaw) ? usersRaw : [];
  const { data: leaderboardRaw } = useWorkspaceLeaderboard(workspace?._id || null);
  const leaderboard = Array.isArray(leaderboardRaw) ? leaderboardRaw : [];
  const [activeTab, setActiveTab] = React.useState<'overview' | 'users' | 'invitations' | 'leaderboard'>('overview');

  if (!isOpen || !workspace) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{workspace.name}</h2>
            <p className="text-slate-400 text-sm">{workspace.description || 'No description'}</p>
            {workspace.rules && (
              <p className="text-slate-500 text-sm mt-2">
                <strong>Rules:</strong> {workspace.rules}
              </p>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-slate-700/30 rounded-lg p-1">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeTab === 'overview' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeTab === 'users' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Users ({users.length})
          </Button>
          <Button
            onClick={() => setActiveTab('invitations')}
            variant={activeTab === 'invitations' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeTab === 'invitations' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Invitations
          </Button>
          <Button
            onClick={() => setActiveTab('leaderboard')}
            variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeTab === 'leaderboard' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Leaderboard ({leaderboard.length})
          </Button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workspace Info */}
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Workspace Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-400">Created By</Label>
                    <p className="text-white">{workspace.createdBy}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Total Members</Label>
                    <p className="text-white">{workspace.users.length}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Positions Available</Label>
                    <p className="text-white">{workspace.positions?.length || 0}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Planets</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workspace.planets?.map((planet, index) => (
                        <Badge key={index} variant="outline" className="text-slate-300 border-slate-600">
                          {planet}
                        </Badge>
                      )) || <span className="text-slate-500">No planets configured</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-slate-400 text-sm">Created</p>
                      <p className="text-white font-medium">
                        {new Date(workspace.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Users</p>
                      <p className="text-white font-medium">{workspace.users.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Active Users</p>
                      <p className="text-white font-medium">
                        {users.filter(u => u.status === 'confirm').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Pending</p>
                      <p className="text-white font-medium">
                        {users.filter(u => u.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Workspace Members</h3>
              {users.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No users in this workspace</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  user.status === 'confirm' 
                                    ? 'text-emerald-400 border-emerald-500/30' 
                                    : 'text-yellow-400 border-yellow-500/30'
                                }`}
                              >
                                {user.status}
                              </Badge>
                            </div>
                            {user.position && (
                              <p className="text-slate-400 text-sm mt-1">{user.position}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'invitations' && (
            <PendingInvitationsPanel workspaceId={workspace._id} />
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No leaderboard data available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry: any, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <div>
                              <p className="text-white font-medium">{entry.name}</p>
                              <p className="text-slate-400 text-sm">{entry.position}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-yellow-400 font-semibold">{entry.totalStars} ⭐</p>
                            <p className="text-slate-400 text-sm">{entry.badgesCount} badges</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pending Invitations Panel Component
const PendingInvitationsPanel: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { data: invitations = [], isLoading } = useWorkspaceInvitations(workspaceId);
  const cancelInvitationMutation = useCancelInvitation();
  const resendInvitationMutation = useResendInvitation();

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (window.confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      try {
        await cancelInvitationMutation.mutateAsync(invitationId);
      } catch (error) {
        console.error('Failed to cancel invitation:', error);
      }
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    if (window.confirm(`Resend invitation to ${email}?`)) {
      try {
        await resendInvitationMutation.mutateAsync(invitationId);
      } catch (error) {
        console.error('Failed to resend invitation:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Pending Invitations</h4>
        <Badge variant="outline" className="text-slate-400 border-slate-600">
          {invitations.length} pending
        </Badge>
      </div>
      
      {invitations.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pending invitations</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {invitations.map((invitation: any) => (
            <div key={invitation._id || invitation.id} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium">{invitation.inviteeEmail}</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    >
                      {invitation.inviteeRole || 'mentee'}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Invited {new Date(invitation.createdAt).toLocaleDateString()} • 
                    {invitation.expiresAt && (
                      <> Expires {new Date(invitation.expiresAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleResendInvitation(invitation._id || invitation.id, invitation.inviteeEmail)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    disabled={resendInvitationMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleCancelInvitation(invitation._id || invitation.id, invitation.inviteeEmail)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    disabled={cancelInvitationMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WorkspaceCard: React.FC<{ 
  workspace: AdminWorkspace; 
  onEdit: (workspace: AdminWorkspace) => void;
  onDelete: (workspace: AdminWorkspace) => void;
  onViewDetails: (workspace: AdminWorkspace) => void;
  onSendInvitation: (workspace: AdminWorkspace) => void;
}> = ({ workspace, onEdit, onDelete, onViewDetails, onSendInvitation }) => {
  const activeUsers = workspace.users.length; // All users in workspace
  const adminUsers = workspace.users.filter(user => user.role === 'admin').length;

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 w-full max-w-full">
      <CardContent className="p-4 w-full">
        <div className="flex items-start justify-between mb-4 w-full">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold truncate">{workspace.name}</h3>
              <p className="text-slate-400 text-sm line-clamp-1 break-words">
                {workspace.description || 'No description'}
              </p>
              {workspace.rules && (
                <p className="text-slate-500 text-xs line-clamp-1 mt-1 break-words">
                  Rules: {workspace.rules}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total Members:</span>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              {workspace.users.length}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Active Users:</span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              {activeUsers}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Administrators:</span>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {adminUsers}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Created:</span>
            <span className="text-slate-300 text-sm">
              {new Date(workspace.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
          <div className="flex space-x-1">
            <Button
              onClick={() => onViewDetails(workspace)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white h-8 w-8 p-0"
              title="View Details"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onSendInvitation(workspace)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-blue-400 h-8 w-8 p-0"
              title="Send Invitation"
            >
              <UserPlus className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onEdit(workspace)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white h-8 w-8 p-0"
              title="Edit"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(workspace)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
              title="Delete (Admin Only)"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Updated {new Date(workspace.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const WorkspaceManagement: React.FC<WorkspaceManagementProps> = ({ searchTerm }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<AdminWorkspace | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<AdminWorkspace | null>(null);

  const { data: workspaces = [], isLoading, error, refetch } = useAdminWorkspaces();
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter(workspace => {
      const matchesSearch = !searchTerm || 
        workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workspace.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [workspaces, searchTerm]);

  const handleEditWorkspace = (workspace: AdminWorkspace) => {
    setEditingWorkspace(workspace);
  };

  const handleDeleteWorkspace = async (workspace: AdminWorkspace) => {
    const confirmMessage = `⚠️ DANGER: This will permanently delete the workspace "${workspace.name}" and all associated data including:\n\n` +
      `• All tasks and user progress\n` +
      `• All reports and submissions\n` +
      `• All positions and settings\n` +
      `• All user associations\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Type "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === 'DELETE') {
      try {
        await deleteWorkspaceMutation.mutateAsync(workspace._id);
      } catch (error) {
        // Error handling is done in the hook
        console.error('Failed to delete workspace:', error);
      }
    } else {
      toast.info('Workspace deletion cancelled');
    }
  };

  const handleViewDetails = (workspace: AdminWorkspace) => {
    setSelectedWorkspace(workspace);
    setIsDetailsModalOpen(true);
  };

  const handleSendInvitation = (workspace: AdminWorkspace) => {
    console.log('🔍 Selected workspace for invitation:', {
      _id: workspace._id,
      id: workspace.id,
      name: workspace.name,
      _idType: typeof workspace._id,
      _idLength: workspace._id?.length,
      isValidObjectId: /^[0-9a-fA-F]{24}$/.test(workspace._id || '')
    });
    setSelectedWorkspace(workspace);
    setIsInvitationModalOpen(true);
  };

  // Calculate stats
  const totalWorkspaces = filteredWorkspaces.length;
  const totalUsers = filteredWorkspaces.reduce((acc, ws) => acc + ws.users.length, 0);
  const totalAdmins = filteredWorkspaces.reduce((acc, ws) => 
    acc + ws.users.filter(user => user.role === 'admin').length, 0);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Workspaces</h3>
          <p className="text-slate-400 mb-6">
            {error?.message || 'There was an error loading workspace data. Please try again.'}
          </p>
          <Button 
            onClick={() => refetch()} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            {isLoading ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Workspace Management</h2>
          <p className="text-slate-400 text-sm">Create and manage workspaces across the organization</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-slate-600/50 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workspace
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalWorkspaces}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Total Workspaces</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalUsers}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Total Users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalAdmins}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Total Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-8 text-center">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No workspaces found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm 
              ? 'No workspaces match your search criteria.'
              : 'Create your first workspace to get started.'}
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full overflow-x-hidden">
          {filteredWorkspaces.map((workspace, index) => (
            <WorkspaceCard
              key={workspace._id || workspace.name || index}
              workspace={workspace}
              onEdit={handleEditWorkspace}
              onDelete={handleDeleteWorkspace}
              onViewDetails={handleViewDetails}
              onSendInvitation={handleSendInvitation}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <WorkspaceFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />

      <WorkspaceFormModal
        isOpen={!!editingWorkspace}
        onClose={() => setEditingWorkspace(null)}
        workspace={editingWorkspace}
        mode="edit"
      />

      <InvitationModal
        isOpen={isInvitationModalOpen}
        onClose={() => {
          console.log('🔄 Closing invitation modal, resetting selectedWorkspace');
          setIsInvitationModalOpen(false);
          setSelectedWorkspace(null);
        }}
        workspaceId={selectedWorkspace?._id || selectedWorkspace?.id || ''}
        workspaceName={selectedWorkspace?.name || ''}
      />

      <WorkspaceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        workspace={selectedWorkspace}
      />
    </div>
  );
}; 