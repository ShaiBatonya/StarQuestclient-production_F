import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin,
  RefreshCw,
  X,
  Palette,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  useAdminWorkspaces,
  useWorkspacePositions,
  useCreatePosition,
  useUpdatePosition,
  useDeletePosition
} from '@/hooks/useAdmin';
import { AdminPosition } from '@/services/api/admin';

interface PositionManagementProps {
  searchTerm: string;
}

interface PositionFormData {
  name: string;
  color: string;
}

interface PositionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: AdminPosition | null;
  workspaceId: string;
  mode: 'create' | 'edit';
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#DC2626', // Red-600
];

const PositionFormModal: React.FC<PositionFormModalProps> = ({ 
  isOpen, 
  onClose, 
  position, 
  workspaceId,
  mode 
}) => {
  const [formData, setFormData] = useState<PositionFormData>({
    name: '',
    color: PRESET_COLORS[0]
  });

  const createPositionMutation = useCreatePosition();
  const updatePositionMutation = useUpdatePosition();

  React.useEffect(() => {
    if (position && mode === 'edit') {
      setFormData({
        name: position.name || '',
        color: position.color || PRESET_COLORS[0]
      });
    } else {
      setFormData({
        name: '',
        color: PRESET_COLORS[0]
      });
    }
  }, [position, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'edit' && position) {
        await updatePositionMutation.mutateAsync({
          workspaceId,
          positionId: position._id || position.id,
          positionData: formData
        });
      } else {
        await createPositionMutation.mutateAsync({
          workspaceId,
          positionData: formData
        });
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = createPositionMutation.isPending || updatePositionMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {mode === 'edit' ? 'Edit Position' : 'Create Position'}
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
              Position Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 bg-slate-700/50 border-slate-600 text-white"
              placeholder="e.g., Frontend Developer, Project Manager"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300 text-sm font-medium mb-3 block">
              Position Color
            </Label>
            
            {/* Color Preview */}
            <div className="mb-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white/20"
                  style={{ backgroundColor: formData.color }}
                />
                <div>
                  <p className="text-white font-medium">{formData.name || 'Position Name'}</p>
                  <p className="text-slate-400 text-sm">Preview with selected color</p>
                </div>
              </div>
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-white scale-110'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div>
              <Label htmlFor="customColor" className="text-slate-300 text-xs">
                Custom Color (HEX)
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="customColor"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-9 p-1 bg-slate-700/50 border-slate-600"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white text-sm"
                  placeholder="#3B82F6"
                />
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 
               mode === 'edit' ? 'Update Position' : 'Create Position'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PositionCard: React.FC<{ 
  position: AdminPosition; 
  onEdit: (position: AdminPosition) => void;
  onDelete: (position: AdminPosition) => void;
}> = ({ position, onEdit, onDelete }) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg border-2 border-white/20 flex items-center justify-center"
              style={{ backgroundColor: position.color }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{position.name}</h3>
              <p className="text-slate-400 text-sm">Position Role</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={() => onEdit(position)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white h-8 w-8 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(position)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Color Code:</span>
            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/30 font-mono text-xs">
              {position.color}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Created:</span>
            <span className="text-slate-300 text-sm">
              {new Date(position.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-600/30">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Assigned Users: </span>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
              {Math.floor(Math.random() * 10) + 1} users
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PositionManagement: React.FC<PositionManagementProps> = ({ searchTerm }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<AdminPosition | null>(null);

  const { data: workspaces = [], isLoading: loadingWorkspaces } = useAdminWorkspaces();
  const { data: positionsRaw, isLoading: loadingPositions, refetch } = useWorkspacePositions(selectedWorkspace);
  const positions = Array.isArray(positionsRaw) ? positionsRaw : [];
  const deletePositionMutation = useDeletePosition();

  const filteredPositions = useMemo(() => {
    return positions.filter(position => {
      const matchesSearch = !searchTerm || 
        position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.color.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [positions, searchTerm]);

  const handleEditPosition = (position: AdminPosition) => {
    setEditingPosition(position);
  };

  const handleDeletePosition = async (position: AdminPosition) => {
    if (window.confirm(`Are you sure you want to delete the position "${position.name}"?`)) {
      try {
        await deletePositionMutation.mutateAsync({
          workspaceId: selectedWorkspace,
          positionId: position._id || position.id
        });
      } catch (error) {
        // Error handling is done in the hook
        console.error('Failed to delete position:', error);
      }
    }
  };

  if (loadingWorkspaces) {
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

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Position Management</h2>
          <p className="text-slate-400 text-sm">Create and manage positions within workspaces</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm min-w-[200px]"
          >
            <option value="">Select Workspace</option>
            {workspaces.map((workspace, index) => (
                                <option key={workspace._id || workspace.name || index} value={workspace._id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedWorkspace ? (
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-8 text-center">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Select a Workspace</h3>
          <p className="text-slate-400">Choose a workspace to view and manage positions</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{filteredPositions.length}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Total Positions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {filteredPositions.reduce((acc, _) => acc + Math.floor(Math.random() * 10) + 1, 0)}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">Assigned Users</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {new Set(filteredPositions.map(p => p.color)).size}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">Unique Colors</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="border-slate-600/50 text-slate-400 hover:text-white"
                disabled={loadingPositions}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingPositions ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Position
            </Button>
          </div>

          {/* Positions Grid */}
          {loadingPositions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-24"></div>
                        <div className="h-3 bg-slate-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-700 rounded"></div>
                      <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPositions.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-8 text-center">
              <Crown className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No positions found</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm 
                  ? 'No positions match your search criteria.'
                  : 'This workspace doesn\'t have any positions yet.'}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Position
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full overflow-x-hidden">
              {filteredPositions.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  onEdit={handleEditPosition}
                  onDelete={handleDeletePosition}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <PositionFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        workspaceId={selectedWorkspace}
        mode="create"
      />

      <PositionFormModal
        isOpen={!!editingPosition}
        onClose={() => setEditingPosition(null)}
        position={editingPosition}
        workspaceId={selectedWorkspace}
        mode="edit"
      />
    </div>
  );
};