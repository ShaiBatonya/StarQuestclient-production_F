import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Task, TaskStatus, TaskPriority } from '@/types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskMove }) => {
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { id: 'todo', title: 'To Do', status: TaskStatus.TODO },
    { id: 'in_progress', title: 'In Progress', status: TaskStatus.IN_PROGRESS },
    { id: 'done', title: 'Done', status: TaskStatus.DONE },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return 'border-l-red-500';
      case TaskPriority.MEDIUM: return 'border-l-yellow-500';
      case TaskPriority.LOW: return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    setIsLoading(true);
    try {
      await onTaskMove(taskId, newStatus);
    } catch (error) {
      console.error('Failed to move task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <Card key={column.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{column.title}</span>
                <span className="bg-gaming-primary/20 text-gaming-primary px-2 py-1 rounded-full text-sm">
                  {columnTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnTasks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No tasks</p>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 bg-gaming-dark rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}
                  >
                    <h4 className="font-medium text-white mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === TaskPriority.HIGH ? 'bg-red-500/20 text-red-400' :
                        task.priority === TaskPriority.MEDIUM ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                      
                      {column.status !== TaskStatus.DONE && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleTaskMove(
                            task.id, 
                            column.status === TaskStatus.TODO ? TaskStatus.IN_PROGRESS : TaskStatus.DONE
                          )}
                          className="text-xs"
                        >
                          {column.status === TaskStatus.TODO ? 'Start' : 'Complete'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 