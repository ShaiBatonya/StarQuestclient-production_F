import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Users, 
  MapPin,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  MessageSquare,
  Edit3,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  useAdminWorkspaces,
  useChangeTaskStatus,
  useAddTaskComment,
  useMentorChangeTaskStatus,
  useAdminUsers
} from '@/hooks/useAdmin';
import { AdminQuest } from '@/services/api/admin';

interface QuestOversightProps {
  searchTerm: string;
}

interface TaskStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  workspaceId: string;
  userId?: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  workspaceId: string;
  userId: string;
}

interface QuestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: AdminQuest | null;
  workspaceId: string;
}

const TaskStatusModal: React.FC<TaskStatusModalProps> = ({ 
  isOpen, 
  onClose, 
  task,
  workspaceId,
  userId 
}) => {
  const [newStatus, setNewStatus] = useState<'todo' | 'in-progress' | 'completed'>('todo');
  const [comment, setComment] = useState('');

  const changeTaskStatusMutation = useChangeTaskStatus();
  const mentorChangeTaskStatusMutation = useMentorChangeTaskStatus();

  React.useEffect(() => {
    if (task && isOpen) {
      setNewStatus(task.status || 'todo');
      setComment('');
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (userId) {
        // User-specific task status change
        await changeTaskStatusMutation.mutateAsync({
          taskId: task.taskId,
          newStatus,
          workspaceId,
          userId
        });
      } else {
        // Mentor/Admin status change
        await mentorChangeTaskStatusMutation.mutateAsync({
          taskId: task.taskId,
          newStatus,
          workspaceId,
          comment: comment || undefined
        });
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = changeTaskStatusMutation.isPending || mentorChangeTaskStatusMutation.isPending;

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Update Task Status</h2>
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
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Task Details</h4>
            <p className="text-slate-300 text-sm mb-2">Task ID: {task.taskId}</p>
            <p className="text-slate-400 text-sm">Current Status: 
              <Badge className={`ml-2 ${
                task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {task.status || 'todo'}
              </Badge>
            </p>
          </div>

          <div>
            <Label htmlFor="status" className="text-slate-300 text-sm font-medium">
              New Status
            </Label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <Label htmlFor="comment" className="text-slate-300 text-sm font-medium">
              Comment (Optional)
            </Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 min-h-[80px]"
              placeholder="Add a comment about this status change..."
              rows={3}
            />
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
              {isLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CommentModal: React.FC<CommentModalProps> = ({ 
  isOpen, 
  onClose, 
  task,
  workspaceId,
  userId 
}) => {
  const [comment, setComment] = useState('');

  const addCommentMutation = useAddTaskComment();

  React.useEffect(() => {
    if (isOpen) {
      setComment('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addCommentMutation.mutateAsync({
        taskId: task.taskId,
        comment,
        workspaceId,
        userId
      });
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = addCommentMutation.isPending;

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Comment</h2>
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
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Task Details</h4>
            <p className="text-slate-300 text-sm mb-2">Task ID: {task.taskId}</p>
            {task.comments && task.comments.length > 0 && (
              <p className="text-slate-400 text-sm">
                Previous comments: {task.comments.length}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="comment" className="text-slate-300 text-sm font-medium">
              Your Comment *
            </Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 min-h-[120px]"
              placeholder="Add your feedback, instructions, or notes about this task..."
              rows={5}
              required
            />
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
              {isLoading ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestDetailsModal: React.FC<QuestDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  quest}) => {
  if (!isOpen || !quest) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Quest Details</h2>
            <p className="text-slate-400 text-sm">User ID: {quest.userId}</p>
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">Total Tasks</span>
                </div>
                <p className="text-2xl font-bold text-white">{quest.tasks.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">Completed</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {quest.tasks.filter(task => task.status === 'completed').length}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {quest.tasks.filter(task => task.status === 'in-progress').length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-700/30 border-slate-600/30">
            <CardHeader>
              <CardTitle className="text-white">Task Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quest.tasks.map((task, index) => (
                  <div key={index} className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {task.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                           task.status === 'in-progress' ? <Clock className="w-4 h-4" /> :
                           <Target className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">Task {task.taskId}</p>
                          <Badge className={`${
                            task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {task.comments && task.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-600/30">
                        <h5 className="text-slate-300 text-sm font-medium mb-2">
                          Comments ({task.comments.length})
                        </h5>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {task.comments.map((comment, commentIndex) => (
                            <div key={commentIndex} className="bg-slate-900/30 rounded p-2">
                              <p className="text-slate-300 text-sm">{comment.text}</p>
                              <p className="text-slate-500 text-xs mt-1">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const QuestCard: React.FC<{ 
  quest: any; // Mock quest data
  workspaceId: string;
  onViewDetails: (quest: any) => void;
  onChangeStatus: (quest: any, task: any) => void;
  onAddComment: (quest: any, task: any) => void;
}> = ({ quest, onViewDetails, onChangeStatus, onAddComment }) => {
  const completedTasks = quest.tasks.filter((task: any) => task.status === 'completed').length;
  const totalTasks = quest.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{quest.userName}</h3>
              <p className="text-slate-400 text-sm">{quest.userEmail}</p>
            </div>
          </div>
          <Button
            onClick={() => onViewDetails(quest)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Progress:</span>
            <span className="text-white font-medium">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          
          <div className="w-full bg-slate-700/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-slate-400 text-xs">To Do</p>
              <p className="text-white font-medium">
                {quest.tasks.filter((task: any) => task.status === 'todo').length}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">In Progress</p>
              <p className="text-white font-medium">
                {quest.tasks.filter((task: any) => task.status === 'in-progress').length}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Completed</p>
              <p className="text-white font-medium">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-slate-300 text-sm font-medium">Recent Tasks:</h4>
          {quest.tasks.slice(0, 2).map((task: any, index: number) => (
            <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${
                  task.status === 'completed' ? 'bg-emerald-500' :
                  task.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-slate-500'
                }`} />
                <span className="text-slate-300 text-sm">Task {task.taskId}</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  onClick={() => onChangeStatus(quest, task)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white h-6 w-6 p-0"
                  title="Change Status"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => onAddComment(quest, task)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-blue-400 h-6 w-6 p-0"
                  title="Add Comment"
                >
                  <MessageSquare className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {quest.tasks.length > 2 && (
            <p className="text-slate-400 text-xs text-center">
              +{quest.tasks.length - 2} more tasks
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const QuestOversight: React.FC<QuestOversightProps> = ({ searchTerm }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'struggling'>('all');

  const { data: workspaces = [], isLoading: loadingWorkspaces } = useAdminWorkspaces();
  const { data: users = [] } = useAdminUsers();

  // Get real quest data from workspace users instead of mock data
  const quests = useMemo(() => {
    if (!selectedWorkspace) return [];
    
    // Find the selected workspace
    const workspace = workspaces.find(ws => ws._id === selectedWorkspace || ws.id === selectedWorkspace);
    if (!workspace || !workspace.users) return [];
    
    // Convert workspace users to quest format for the UI
    return workspace.users
      .filter(workspaceUser => workspaceUser.role === 'mentee') // Only show mentees in quest oversight
      .map(workspaceUser => {
        // Find full user details
        const userDetails = users.find(u => u._id === workspaceUser.userId || u.id === workspaceUser.userId);
        
        return {
          userId: workspaceUser.userId,
          userName: userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Unknown User',
          userEmail: userDetails?.email || 'unknown@example.com',
          workspaceId: selectedWorkspace,
          tasks: workspaceUser.quest || [], // This contains the user's task progress
          lastActivity: workspaceUser.joinedAt || new Date().toISOString(),
          role: workspaceUser.role,
          position: workspaceUser.position,
          planet: workspaceUser.planet,
          stars: workspaceUser.stars || 0
        };
      });
  }, [selectedWorkspace, workspaces, users]);

  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      const matchesSearch = !searchTerm || 
        quest.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'completed') {
        matchesStatus = quest.tasks.every((task: any) => task.status === 'completed');
      } else if (statusFilter === 'active') {
        matchesStatus = quest.tasks.some((task: any) => task.status === 'in-progress');
      } else if (statusFilter === 'struggling') {
        const completedCount = quest.tasks.filter((task: any) => task.status === 'completed').length;
        const progressRate = completedCount / quest.tasks.length;
        matchesStatus = progressRate < 0.5;
      }

      return matchesSearch && matchesStatus;
    });
  }, [quests, searchTerm, statusFilter]);

  const handleChangeStatus = (quest: any, task: any) => {
    setSelectedQuest(quest);
    setSelectedTask(task);
    setIsStatusModalOpen(true);
  };

  const handleAddComment = (quest: any, task: any) => {
    setSelectedQuest(quest);
    setSelectedTask(task);
    setIsCommentModalOpen(true);
  };

  const handleViewDetails = (quest: any) => {
    setSelectedQuest(quest);
    setIsDetailsModalOpen(true);
  };

  // Calculate stats
  const totalQuests = filteredQuests.length;
  const activeQuests = filteredQuests.filter(quest => 
    quest.tasks && quest.tasks.some((task: any) => task.status === 'in-progress')
  ).length;
  const completedQuests = filteredQuests.filter(quest => 
    quest.tasks && quest.tasks.length > 0 && quest.tasks.every((task: any) => task.status === 'completed')
  ).length;
  const averageProgress = totalQuests > 0 ? 
    filteredQuests.reduce((acc, quest) => {
      if (!quest.tasks || quest.tasks.length === 0) return acc;
      const completed = quest.tasks.filter((task: any) => task.status === 'completed').length;
      return acc + (completed / quest.tasks.length) * 100;
    }, 0) / totalQuests : 0;

  if (loadingWorkspaces) {
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
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Quest Oversight</h2>
          <p className="text-slate-400 text-sm">Monitor user quest progress and manage task statuses</p>
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
          <p className="text-slate-400">Choose a workspace to monitor quest progress</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalQuests}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Active Users</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{completedQuests}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Completed Quests</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{activeQuests}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">In Progress</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{averageProgress.toFixed(1)}%</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Avg Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="all">All Users</option>
                <option value="active">Active Progress</option>
                <option value="completed">Completed All</option>
                <option value="struggling">Need Help</option>
              </select>
            </div>

            <Button
              variant="outline"
              className="border-slate-600/50 text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Quests Grid */}
          {filteredQuests.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-8 text-center">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No quests found</h3>
              <p className="text-slate-400">
                {searchTerm 
                  ? 'No user quests match your search criteria.'
                  : 'No active quests in this workspace.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredQuests.map((quest, index) => (
                <QuestCard
                  key={index}
                  quest={quest}
                  workspaceId={selectedWorkspace}
                  onViewDetails={handleViewDetails}
                  onChangeStatus={handleChangeStatus}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <TaskStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        task={selectedTask}
        workspaceId={selectedWorkspace}
        userId={selectedQuest?.userId}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        task={selectedTask}
        workspaceId={selectedWorkspace}
        userId={selectedQuest?.userId || ''}
      />

      <QuestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        quest={selectedQuest}
        workspaceId={selectedWorkspace}
      />
    </div>
  );
}; 