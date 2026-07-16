import { useState, useEffect } from 'react';
import { useData } from '../data/DataContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { 
  ActivitySquare,
  Plus, 
  CheckCircle2, 
  Clock, 
  Activity,
  Pill,
  FileText,
  Calendar,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { formatDate } from '../utils';
import type { CareLoop, CareTask } from '../types';
import toast from 'react-hot-toast';

export function CareLoopsPage() {
  const data = useData();
  const profileId = '1'; 
  const [loops, setLoops] = useState<CareLoop[]>([]);
  const [tasksByLoop, setTasksByLoop] = useState<Record<string, CareTask[]>>({});
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newLoopTitle, setNewLoopTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deleteModalState, setDeleteModalState] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedLoops = await data.getCareLoopsByProfile(profileId);
      // Sort loops so active is first, then paused, then completed
      fetchedLoops.sort((a, b) => {
        const order = { active: 1, paused: 2, completed: 3 };
        return order[a.status] - order[b.status];
      });
      setLoops(fetchedLoops);
      
      const tasksMap: Record<string, CareTask[]> = {};
      for (const loop of fetchedLoops) {
        const tasks = await data.getCareTasksByLoop(loop.id);
        // Sort tasks by due date
        tasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        tasksMap[loop.id] = tasks;
      }
      setTasksByLoop(tasksMap);
    } catch (err) {
      console.error('Failed to load care loops:', err);
      toast.error('Failed to load care loops');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string, loopId: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const completedAt = newStatus === 'completed' ? new Date().toISOString() : undefined;
      
      // Optimistic update
      setTasksByLoop(prev => {
        const loopTasks = prev[loopId] || [];
        const newLoopTasks = loopTasks.map(t => t.id === taskId ? { ...t, status: newStatus as any, completedAt } : t);
        return { ...prev, [loopId]: newLoopTasks };
      });

      await data.updateCareTask(taskId, { status: newStatus as any, completedAt });
      if (newStatus === 'completed') toast.success('Task marked as complete');
    } catch (err) {
      console.error('Failed to update task:', err);
      toast.error('Failed to update task');
      loadData(); // Revert on failure
    }
  };

  const handleCreateLoop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoopTitle.trim()) {
      toast.error('Please enter a journey title');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newLoop = await data.createCareLoop({
        profileId,
        title: newLoopTitle,
        startDate: new Date().toISOString(),
        status: 'active'
      }, []);
      setLoops(prev => [newLoop, ...prev]);
      setTasksByLoop(prev => ({ ...prev, [newLoop.id]: [] }));
      setNewLoopTitle('');
      setIsCreateModalOpen(false);
      toast.success('Care loop created successfully');
    } catch (err) {
      console.error('Failed to create care loop:', err);
      toast.error('Failed to create care loop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalState.id) return;
    setIsDeleting(true);
    try {
      await data.deleteCareLoop(deleteModalState.id);
      setLoops(prev => prev.filter(l => l.id !== deleteModalState.id));
      toast.success('Care loop deleted successfully');
      setDeleteModalState({ isOpen: false, id: null });
    } catch (err) {
      toast.error('Failed to delete care loop');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'sage';
      case 'completed': return 'gray';
      case 'paused': return 'peach';
      default: return 'navy';
    }
  };

  const getTaskIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle2 className="w-6 h-6 text-sage-500" />;
    
    switch (type) {
      case 'medication': return <Pill className="w-5 h-5 text-peach-500" />;
      case 'vital': return <Activity className="w-5 h-5 text-ocean-500" />;
      case 'upload_report': return <FileText className="w-5 h-5 text-lavender-500" />;
      case 'follow_up': return <Calendar className="w-5 h-5 text-navy-500" />;
      case 'symptom_update': return <AlertCircle className="w-5 h-5 text-peach-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-900 flex items-center gap-3">
            <ActivitySquare className="w-8 h-8 text-sage-600" />
            Care Loops
          </h1>
          <p className="text-navy-500 mt-2 text-lg">
            Track your ongoing health journeys and recovery plans.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsCreateModalOpen(true)}>
          New Care Loop
        </Button>
      </div>

      <div className="space-y-8">
        {loops.map(loop => {
          const tasks = tasksByLoop[loop.id] || [];
          const completedTasks = tasks.filter(t => t.status === 'completed').length;
          const totalTasks = tasks.length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <Card key={loop.id} className="p-0 overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 relative group">
              {/* Card Header */}
              <div className="p-6 sm:p-8 border-b border-ivory-200 bg-white">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="pr-12">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-heading font-bold text-navy-900">{loop.title}</h2>
                      <Badge variant={getStatusBadgeVariant(loop.status)} className="uppercase tracking-wider px-3 py-1 text-[10px]">
                        {loop.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500 mt-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Started {formatDate(loop.startDate)}
                      </span>
                      {loop.expectedFollowUpDate && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-ivory-300 hidden sm:block" />
                          <span className="flex items-center gap-1.5 text-peach-600 font-medium">
                            <Clock className="w-4 h-4" />
                            Target: {formatDate(loop.expectedFollowUpDate)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    className="absolute top-6 right-6 p-2 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onClick={() => setDeleteModalState({ isOpen: true, id: loop.id })}
                    aria-label="Delete care loop"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Progress Ring / Info */}
                  <div className="flex items-center gap-4 bg-ivory-50 px-5 py-3 rounded-2xl border border-ivory-200 shrink-0 mt-4 md:mt-0">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-navy-900">{completedTasks} of {totalTasks}</span>
                      <span className="text-xs text-navy-500 uppercase tracking-wider font-semibold">Tasks Done</span>
                    </div>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-ivory-200"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-sage-500 transition-all duration-1000 ease-out"
                          strokeWidth="3"
                          strokeDasharray={`${progress}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-navy-700">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body - Journey Timeline */}
              <div className="p-6 sm:p-8 bg-ivory-50/30">
                {tasks.length > 0 ? (
                  <div className="relative pl-2 sm:pl-4">
                    {/* Vertical line connecting timeline items */}
                    <div className="absolute left-[36px] sm:left-[44px] top-4 bottom-8 w-[2px] bg-ivory-200" />
                    
                    <div className="space-y-8 relative z-10">
                      {tasks.map((task, index) => {
                        const isCompleted = task.status === 'completed';
                        
                        return (
                          <div key={task.id} className="flex gap-4 sm:gap-6 group/task">
                            <button 
                              onClick={() => toggleTask(task.id, task.status, loop.id)}
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 outline-none transition-all duration-200 shadow-sm
                                ${isCompleted 
                                  ? 'bg-sage-50 text-sage-500 border border-sage-200 ring-4 ring-white' 
                                  : 'bg-white text-navy-500 border-2 border-ivory-200 hover:border-sage-300 hover:bg-sage-50 ring-4 ring-white group-hover/task:scale-105'
                                }`}
                              aria-label={isCompleted ? "Mark task incomplete" : "Mark task complete"}
                            >
                              {getTaskIcon(task.taskType, isCompleted)}
                            </button>
                            
                            <div className="flex-1 pt-1 sm:pt-2">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 bg-white p-4 rounded-xl border border-ivory-100 shadow-sm group-hover/task:shadow-md transition-shadow">
                                <div>
                                  <h4 className={`text-base sm:text-lg font-heading font-semibold ${isCompleted ? 'text-navy-400 line-through' : 'text-navy-900'}`}>
                                    {task.title}
                                  </h4>
                                  {task.notes && (
                                    <p className={`mt-1.5 text-sm ${isCompleted ? 'text-navy-300' : 'text-navy-500'}`}>
                                      {task.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">
                                  {task.dueDate && !isCompleted && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-peach-600 bg-peach-50 px-2.5 py-1.5 rounded-md border border-peach-100">
                                      <Clock className="w-3.5 h-3.5" />
                                      Due {formatDate(task.dueDate)}
                                    </div>
                                  )}
                                  {isCompleted && task.completedAt && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-sage-600 bg-sage-50 px-2.5 py-1.5 rounded-md border border-sage-100">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Done {formatDate(task.completedAt)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-navy-400 font-medium">No tasks added to this journey yet.</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {loops.length === 0 && (
          <EmptyState 
            icon={<ActivitySquare className="w-8 h-8" />}
            title="No care loops yet"
            description="Start a new health journey to track tasks, medications, and follow-ups all in one place."
            actionLabel="Create First Loop"
            actionIcon={<Plus className="w-4 h-4" />}
            onAction={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Care Loop"
        size="md"
      >
        <form onSubmit={handleCreateLoop} className="space-y-6 py-4">
          <Input
            label="Journey Title"
            placeholder="e.g. Post-Surgery Recovery"
            value={newLoopTitle}
            onChange={(e) => setNewLoopTitle(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-ivory-100 mt-8">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !newLoopTitle.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Loop'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Care Loop"
        message="Are you sure you want to delete this care loop? All associated tasks will also be removed."
        confirmText="Delete"
        isProcessing={isDeleting}
      />
    </div>
  );
}
