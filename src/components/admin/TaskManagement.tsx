import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  useAdminWorkspaces,
  useWorkspacePositions,
  useCreateTask,
  useCreatePersonalTask,
  useUpdateTask,
  useDeleteTask,
  useWorkspaceUsers,
  useWorkspaceTasks
} from '@/hooks/useAdmin';
import { AdminTask } from '@/services/api/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskManagementProps {
  searchTerm: string;
}

interface TaskFormData {
  title: string;
  description: string;
  category: 'Learning courses' | 'Product refinement' | 'Mandatory sessions';
  starsEarned: number;
  planets: (
    | 'Nebulae'
    | 'Solaris minor'
    | 'Solaris major'
    | 'White dwarf'
    | 'Supernova'
    | 'Space station'
  )[];
  positions: string[];
  isGlobal: boolean;
  userId?: string;
  link?: string;
}

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: AdminTask | null;
  workspaceId: string;
  mode: 'create' | 'edit' | 'create-personal';
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ 
  isOpen, 
  onClose, 
  workspaceId,
  task, 
  mode 
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: 'Learning courses',
    starsEarned: 1,
    planets: [],
    positions: [],
    isGlobal: false,
    userId: '',
    link: ''
  });

  const { data: positions = [] } = useWorkspacePositions(workspaceId);
  const { data: users = [] } = useWorkspaceUsers(workspaceId);
  const createTaskMutation = useCreateTask();
  const createPersonalTaskMutation = useCreatePersonalTask();
  const updateTaskMutation = useUpdateTask();

  const availablePlanets = [
    'Nebulae',
    'Solaris minor',
    'Solaris major',
    'White dwarf',
    'Supernova',
    'Space station'
  ] as const;

  React.useEffect(() => {
    if (isOpen) {
      if (task && mode === 'edit') {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          category: task.category || 'Learning courses',
          starsEarned: task.starsEarned || 1,
          planets: task.planets || [],
          positions: task.positions || [],
          isGlobal: task.isGlobal || false,
          userId: task.userId || '',
          link: task.link || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: 'Learning courses',
          starsEarned: 1,
          planets: [],
          positions: [],
          isGlobal: false,
          userId: '',
          link: ''
        });
      }
    }
  }, [isOpen, task, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate workspaceId is present and valid
    if (!workspaceId || workspaceId.trim() === '') {
      toast.error('Please select a workspace first.');
      return;
    }

    // Validate ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(workspaceId)) {
      toast.error('Invalid workspace ID format. Please try again.');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Task description is required.');
      return;
    }

    if (formData.planets.length === 0) {
      toast.error('Please select at least one planet.');
      return;
    }

    if (formData.starsEarned < 0) {
      toast.error('Stars earned must be non-negative.');
      return;
    }

    // For personal tasks, validate user selection
    if (mode === 'create-personal' && !formData.userId) {
      toast.error('Please select a user for personal task.');
      return;
    }
    
    try {
      console.log('🚀 Submitting task data:', {
        workspaceId,
        mode,
        formData
      });

      if (mode === 'edit' && task) {
        await updateTaskMutation.mutateAsync({
          workspaceId,
          taskId: task.id,
          taskData: formData
        });
      } else if (mode === 'create-personal') {
        // For personal tasks, we need to select a user
        if (!formData.userId) {
          toast.error('Please select a user for personal task');
          return;
        }
        await createPersonalTaskMutation.mutateAsync({
          workspaceId,
          taskData: formData
        });
      } else {
        await createTaskMutation.mutateAsync({
          workspaceId,
          taskData: formData
        });
      }
      onClose();
    } catch (error) {
      console.error('❌ Task submission error:', error);
      // Error handling is done in the hooks
    }
  };

  const handlePositionToggle = (positionId: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(positionId)
        ? prev.positions.filter(id => id !== positionId)
        : [...prev.positions, positionId]
    }));
  };

  const handlePlanetToggle = (planet: typeof availablePlanets[number]) => {
    setFormData(prev => ({
      ...prev,
      planets: prev.planets.includes(planet)
        ? prev.planets.filter(p => p !== planet)
        : [...prev.planets, planet]
    }));
  };

  const isLoading = createTaskMutation.isPending || createPersonalTaskMutation.isPending || updateTaskMutation.isPending;

  // Don't render if no valid workspaceId
  if (!isOpen || !workspaceId || workspaceId.trim() === '') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'edit' ? 'Edit Task' : mode === 'create-personal' ? 'Create Personal Task' : 'Create Task'}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'edit' ? 'Update task details' : 'Add a new task to the workspace'}
            </p>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-slate-300 text-sm font-medium">
                Task Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-slate-300 text-sm font-medium">
                Category *
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2"
              >
                <option value="Learning courses">Learning courses</option>
                <option value="Product refinement">Product refinement</option>
                <option value="Mandatory sessions">Mandatory sessions</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300 text-sm font-medium">
              Description *
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 h-24 resize-none"
              placeholder="Enter task description"
              required
            />
          </div>

          {/* Personal Task User Selection */}
          {mode === 'create-personal' && (
            <div>
              <Label htmlFor="userId" className="text-slate-300 text-sm font-medium">
                Assign to User *
              </Label>
              <select
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Planets Selection */}
          <div>
            <Label className="text-slate-300 text-sm font-medium mb-3 block">
              Planets * (Select at least one)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availablePlanets.map((planet) => (
                <button
                  key={planet}
                  type="button"
                  onClick={() => handlePlanetToggle(planet)}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200 text-sm font-medium",
                    formData.planets.includes(planet)
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                      : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                  )}
                >
                  {planet}
                </button>
              ))}
            </div>
          </div>

          {/* Positions Selection */}
          {positions.length > 0 && (
            <div>
              <Label className="text-slate-300 text-sm font-medium mb-3 block">
                Positions (Optional)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {positions.map((position) => (
                  <button
                    key={position.id}
                    type="button"
                    onClick={() => handlePositionToggle(position.id)}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 text-sm font-medium",
                      formData.positions.includes(position.id)
                        ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                        : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                    )}
                  >
                    {position.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="starsEarned" className="text-slate-300 text-sm font-medium">
                Stars Earned *
              </Label>
              <Input
                id="starsEarned"
                type="number"
                min="0"
                value={formData.starsEarned}
                onChange={(e) => setFormData({ ...formData, starsEarned: parseInt(e.target.value) || 0 })}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="link" className="text-slate-300 text-sm font-medium">
                Link (Optional)
              </Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Global Task Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isGlobal"
              checked={formData.isGlobal}
              onChange={(e) => setFormData({ ...formData, isGlobal: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isGlobal" className="text-slate-300 text-sm">
              Make this a global task (available to all users)
            </Label>
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
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ 
  task: AdminTask; 
  workspaceId: string;
  onEdit: (task: AdminTask) => void;
  onDelete: (task: AdminTask) => void;
}> = ({ task, onEdit, onDelete }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Learning courses':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Product refinement':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Mandatory sessions':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStarsColor = (stars: number) => {
    if (stars >= 5) return 'text-yellow-400';
    if (stars >= 3) return 'text-orange-400';
    return 'text-slate-400';
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1 truncate">{task.title}</h3>
            <p className="text-slate-400 text-sm">{task.category}</p>
          </div>
          <div className="flex items-center space-x-1 ml-3">
            <Badge className={getCategoryColor(task.category)}>
              {task.category}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className="text-slate-300 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getStarsColor(task.starsEarned)}`}>
              ⭐ {task.starsEarned} stars
            </span>
          </div>
          <span className="text-slate-400 text-xs">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>

        {task.planets && task.planets.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-1 mb-2">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-xs">Planets:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {task.planets.slice(0, 3).map((planet, index) => (
                <Badge key={index} className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                  {planet}
                </Badge>
              ))}
              {task.planets.length > 3 && (
                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                  +{task.planets.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {task.positions && task.positions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-1 mb-2">
              <Users className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-xs">Assigned Positions:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {task.positions.slice(0, 3).map((position, index) => (
                <Badge key={index} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  {position}
                </Badge>
              ))}
              {task.positions.length > 3 && (
                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                  +{task.positions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {task.isGlobal && (
          <div className="mb-4">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
              🌍 Global Task
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400 text-xs">
              {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={() => onEdit(task)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white h-8 w-8 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(task)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TaskManagement: React.FC<TaskManagementProps> = ({ searchTerm }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPersonalTaskModalOpen, setIsPersonalTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Learning courses' | 'Product refinement' | 'Mandatory sessions'>('all');
  const [starsFilter, setStarsFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const { data: workspaces = [], isLoading: loadingWorkspaces } = useAdminWorkspaces();
  const deleteTaskMutation = useDeleteTask();

  const { data: tasksRaw, isLoading: loadingTasks, error: tasksError, refetch: refetchTasks } = useWorkspaceTasks(selectedWorkspace);
  
  // Ensure tasks is always an array with proper type safety
  const tasks = React.useMemo(() => {
    // Debug logging to understand API response structure
    console.log('🔍 TaskManagement - tasksRaw:', {
      tasksRaw,
      type: typeof tasksRaw,
      isArray: Array.isArray(tasksRaw),
      hasData: tasksRaw && typeof tasksRaw === 'object' && 'data' in tasksRaw,
      selectedWorkspace
    });
    
    if (!tasksRaw) return [];
    if (Array.isArray(tasksRaw)) return tasksRaw;
    // Handle case where response.data might be wrapped
    if (tasksRaw && typeof tasksRaw === 'object' && 'data' in tasksRaw && Array.isArray((tasksRaw as any).data)) {
      return (tasksRaw as any).data;
    }
    console.warn('❌ Tasks data is not an array:', tasksRaw);
    return [];
  }, [tasksRaw, selectedWorkspace]);

  const filteredTasks = useMemo(() => {
    // Double-check that tasks is an array before filtering
    if (!Array.isArray(tasks)) {
      console.warn('❌ Tasks is not an array in filteredTasks:', tasks);
      return [];
    }
    
    return tasks.filter((task: AdminTask) => {
      // Add safety checks for task properties
      if (!task || typeof task !== 'object') return false;
      
      const matchesSearch = !searchTerm || 
        (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      const matchesStars = starsFilter === 'all' || 
        (starsFilter === 'high' && task.starsEarned >= 5) ||
        (starsFilter === 'medium' && task.starsEarned >= 3 && task.starsEarned < 5) ||
        (starsFilter === 'low' && task.starsEarned < 3);

      return matchesSearch && matchesCategory && matchesStars;
    });
  }, [tasks, searchTerm, categoryFilter, starsFilter]);

  const handleEditTask = (task: AdminTask) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (task: AdminTask) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTaskMutation.mutateAsync({
          workspaceId: selectedWorkspace,
          taskId: task.id
        });
        toast.success('Task deleted successfully');
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete task');
        console.error('Failed to delete task:', error);
      }
    }
  };

  // Calculate stats - ensure we're working with arrays
  const safeFilteredTasks = Array.isArray(filteredTasks) ? filteredTasks : [];
  const totalTasks = safeFilteredTasks.length;
  const highStarTasks = safeFilteredTasks.filter(task => task && task.starsEarned >= 5).length;
  const mediumStarTasks = safeFilteredTasks.filter(task => task && task.starsEarned >= 3 && task.starsEarned < 5).length;
  const lowStarTasks = safeFilteredTasks.filter(task => task && task.starsEarned < 3).length;

  if (loadingWorkspaces || loadingTasks) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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

  if (tasksError) {
    return (
      <div className="p-6">
        <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Tasks</h3>
          <p className="text-slate-400 mb-6">
            {tasksError?.message || 'There was an error loading task data. Please try again.'}
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => refetchTasks()} 
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingTasks}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loadingTasks && "animate-spin")} />
              {loadingTasks ? 'Retrying...' : 'Try Again'}
            </Button>
            {selectedWorkspace && (
              <Button 
                onClick={() => setSelectedWorkspace('')}
                variant="outline"
                className="border-slate-600 text-slate-400 hover:text-white"
              >
                Select Different Workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* Workspace Selection */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Task Management</h2>
          <p className="text-slate-400 text-sm">Create and manage tasks across workspaces</p>
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
          <p className="text-slate-400">Choose a workspace to view and manage tasks</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalTasks}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Total Tasks</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{highStarTasks}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">High Value (5+ stars)</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{mediumStarTasks}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Medium Value (3-4 stars)</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-slate-500/20 to-slate-600/20 border border-slate-500/30 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{lowStarTasks}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Low Value (&lt;3 stars)</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="all">All Categories</option>
                <option value="Learning courses">Learning courses</option>
                <option value="Product refinement">Product refinement</option>
                <option value="Mandatory sessions">Mandatory sessions</option>
              </select>

              <select
                value={starsFilter}
                onChange={(e) => setStarsFilter(e.target.value as any)}
                className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="all">All Star Levels</option>
                <option value="high">High (5+ stars)</option>
                <option value="medium">Medium (3-4 stars)</option>
                <option value="low">Low (&lt;3 stars)</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
              <Button
                onClick={() => setIsPersonalTaskModalOpen(true)}
                variant="outline"
                className="border-slate-600/50 text-slate-400 hover:text-white flex-1 sm:flex-none"
              >
                <Users className="w-4 h-4 mr-2" />
                Personal Task
              </Button>
            </div>
          </div>

          {/* Tasks Grid */}
          {safeFilteredTasks.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-8 text-center">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No tasks found</h3>
              <p className="text-slate-400 mb-4">No tasks match your current filters or the workspace is empty.</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Task
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full overflow-x-hidden">
              {safeFilteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  workspaceId={selectedWorkspace}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        workspaceId={selectedWorkspace}
        mode="create"
      />

      <TaskFormModal
        isOpen={isPersonalTaskModalOpen}
        onClose={() => setIsPersonalTaskModalOpen(false)}
        workspaceId={selectedWorkspace}
        mode="create-personal"
      />

      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        workspaceId={selectedWorkspace}
        mode="edit"
      />
    </div>
  );
}; 