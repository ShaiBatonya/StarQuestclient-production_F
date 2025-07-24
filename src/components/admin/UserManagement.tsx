import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield,
  RefreshCw,
  AlertTriangle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  useAdminUsers, 
  useUpdateUser, 
  useDeleteUser 
} from '@/hooks/useAdmin';
import { AdminUser, UserUpdateData } from '@/services/api/admin';
import { toast } from 'sonner';


interface UserManagementProps {
  searchTerm: string;
}

interface UserEditModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, userData: UserUpdateData) => void;
  isLoading: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSave,
  isLoading 
}) => {
  const [formData, setFormData] = useState<UserUpdateData>({});

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        active: user.active,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave(user.id, formData);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Edit User</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="firstName" className="text-slate-300 text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white text-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-slate-300 text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 bg-slate-700/50 border-slate-600 text-white text-sm"
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-slate-300 text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="mt-1 bg-slate-700/50 border-slate-600 text-white text-sm"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-slate-300 text-sm font-medium">
              Role
            </Label>
            <select
              id="role"
              value={formData.role || 'user'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
              className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="active"
              type="checkbox"
              checked={formData.active || false}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
            <Label htmlFor="active" className="text-slate-300 text-sm font-medium">
              Active Account
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2 sm:pt-4">
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UserManagement: React.FC<UserManagementProps> = ({ searchTerm }) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // API hooks
  const { data: users = [], isLoading, error, refetch } = useAdminUsers();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && user.active) ||
        (statusFilter === 'inactive' && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (userId: string, userData: UserUpdateData) => {
    try {
      await updateUserMutation.mutateAsync({ userId, userData });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const confirmMessage = `⚠️ CRITICAL ACTION: Delete User\n\n` +
      `This will permanently delete:\n` +
      `• User: ${user.firstName} ${user.lastName} (${user.email})\n` +
      `• All associated data and progress\n` +
      `• All reports and submissions\n` +
      `• Workspace associations\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Type "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === 'DELETE') {
      try {
        await deleteUserMutation.mutateAsync(user._id);
        toast.success(`User ${user.firstName} ${user.lastName} deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Failed to delete user:', error);
      }
    } else {
      toast.info('User deletion cancelled');
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user._id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkStatusUpdate = async (active: boolean) => {
    const action = active ? 'activate' : 'deactivate';
    const confirmMessage = `Are you sure you want to ${action} ${selectedUsers.size} user(s)?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // TODO: Implement bulk status update when backend endpoint is available
        toast.info(`Bulk ${action} functionality will be implemented when backend endpoint is ready`);
        setSelectedUsers(new Set());
        setShowBulkActions(false);
      } catch (error) {
        toast.error(`Failed to ${action} users`);
      }
    }
  };

  const handleBulkDelete = async () => {
    const confirmMessage = `⚠️ CRITICAL ACTION: Bulk Delete\n\n` +
      `This will permanently delete ${selectedUsers.size} user(s) and:\n` +
      `• All their associated data and progress\n` +
      `• All their reports and submissions\n` +
      `• All workspace associations\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Type "DELETE ALL" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === 'DELETE ALL') {
      try {
        // TODO: Implement bulk delete when backend endpoint is available
        toast.info('Bulk delete functionality will be implemented when backend endpoint is ready');
        setSelectedUsers(new Set());
        setShowBulkActions(false);
      } catch (error) {
        toast.error('Failed to delete users');
      }
    } else {
      toast.info('Bulk delete cancelled');
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    const action = user.active ? 'deactivate' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await updateUserMutation.mutateAsync({
          userId: user._id,
          userData: { active: !user.active }
        });
        toast.success(`User ${action}d successfully`);
      } catch (error) {
        toast.error(`Failed to ${action} user`);
        console.error(`Failed to ${action} user:`, error);
      }
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.active).length;
  const adminUsers = users.filter(user => user.role === 'admin').length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
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
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Users</h3>
          <p className="text-slate-400 mb-6">There was an error loading the user data.</p>
          <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full overflow-x-hidden">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalUsers}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Total Users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{activeUsers}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Active Users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{adminUsers}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
              <span className="text-blue-400 text-sm font-medium">
                {selectedUsers.size} selected
              </span>
              <Button
                onClick={() => handleBulkStatusUpdate(true)}
                variant="outline"
                size="sm"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              >
                Activate
              </Button>
              <Button
                onClick={() => handleBulkStatusUpdate(false)}
                variant="outline"
                size="sm"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                Deactivate
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Delete
              </Button>
            </div>
          )}
          
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-slate-600/50 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/30 border border-slate-600/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30 border-b border-slate-600/30">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                  />
                </th>
                <th className="text-left p-4 text-slate-300 font-medium">User</th>
                <th className="text-left p-4 text-slate-300 font-medium">Email</th>
                <th className="text-left p-4 text-slate-300 font-medium">Role</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-slate-600/20 hover:bg-slate-700/20 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 font-medium">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-slate-400 text-sm">ID: {user._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{user.email}</p>
                    <p className="text-slate-400 text-sm">
                      {user.isEmailVerified ? '✓ Verified' : '⚠ Not Verified'}
                    </p>
                  </td>
                  <td className="p-4">
                    <Badge className={`${
                      user.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`${
                      user.active 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleEditUser(user)}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleToggleUserStatus(user)}
                        variant="ghost"
                        size="sm"
                        className={`${
                          user.active 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        isLoading={updateUserMutation.isPending}
      />
    </div>
  );
}; 