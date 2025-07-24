import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Building,
  Target,
  Activity,
  Brain,
  Heart,
  Coffee,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  useAllAdminReports,
  useWorkspaceReports,
  useCurrentAdmin,
  useAdminWorkspaces,
  useDeleteReport,
  useApproveReport,
  useRejectReport} from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';

interface ReportsManagementProps {
  searchTerm: string;
}

// Updated report interface to handle all report types
interface Report {
  _id: string;
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'end-of-day' | 'general';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedBy: string;
  submittedAt: string;
  workspaceId: string;
  originalData?: any; // For storing the original report data
}

// Detailed Report Viewers
const DailyReportDetails: React.FC<{ report: any }> = ({ report }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-400" />
            Daily Report Details
          </h3>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {new Date(report.date || report.createdAt).toLocaleDateString()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Wake Up Time</label>
              <p className="text-white text-lg">{report.wakeupTime || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-400">Morning Mood</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= (report.mood?.startOfDay || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-slate-600'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-white font-medium">
                  {report.mood?.startOfDay || 0}/5
                </span>
              </div>
            </div>

            {report.mood?.endOfDay && (
              <div>
                <label className="text-sm font-medium text-slate-400">Evening Mood</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${
                          star <= (report.mood?.endOfDay || 0) 
                            ? 'text-green-400 fill-current' 
                            : 'text-slate-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-white font-medium">
                    {report.mood?.endOfDay || 0}/5
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400">Morning Routine</label>
            <div className="mt-2 p-4 bg-slate-700/30 rounded-lg">
              <p className="text-white mb-2">{report.morningRoutine?.routine || 'Not specified'}</p>
              <Badge className={`${
                report.morningRoutine?.completed 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {report.morningRoutine?.completed ? 'Completed' : 'Not Completed'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => toggleSection('goals')}
        >
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Daily Goals ({report.dailyGoals?.length || 0})
          </h3>
          {expandedSections.includes('goals') ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {expandedSections.includes('goals') && (
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {report.dailyGoals?.map((goal: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-slate-700/30 rounded-lg">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    goal.completed 
                      ? 'border-green-400 bg-green-400/20' 
                      : 'border-slate-500'
                  }`}>
                    {goal.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{goal.description}</p>
                    <Badge className={`mt-2 ${
                      goal.completed 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {goal.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              )) || <p className="text-slate-400">No goals specified</p>}
            </div>
          </div>
        )}
      </div>

      {/* Activities */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => toggleSection('activities')}
        >
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Activities Tracking
          </h3>
          {expandedSections.includes('activities') ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {expandedSections.includes('activities') && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expected Activities */}
              <div>
                <h4 className="text-md font-medium text-slate-300 mb-3">Expected Activities</h4>
                <div className="space-y-3">
                  {report.expectedActivity?.map((activity: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{activity.category}</span>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {activity.duration}h
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-slate-400">No expected activities</p>}
                </div>
              </div>

              {/* Actual Activities */}
              <div>
                <h4 className="text-md font-medium text-slate-300 mb-3">Actual Activities</h4>
                <div className="space-y-3">
                  {report.actualActivity?.map((activity: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{activity.category}</span>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          {activity.duration}h
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-slate-400">No actual activities recorded</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WeeklyReportDetails: React.FC<{ report: any }> = ({ report }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-400" />
            Weekly Report Details
          </h3>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Week of {new Date(report.createdAt).toLocaleDateString()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-400">Weekly Mood Rating</label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${
                      star <= (report.moodRating || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-slate-600'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-white font-medium">{report.moodRating || 0}/5</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400">Goals Achievement</label>
            <Badge className={`mt-2 ${
              report.achievedGoals?.shared 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {report.achievedGoals?.shared ? 'Goals Achieved' : 'Goals Not Achieved'}
            </Badge>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-slate-400">Mood Explanation</label>
          <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
            {report.moodExplanation || 'No explanation provided'}
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-4">
        {/* Weekly Routine */}
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleSection('routine')}
          >
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Coffee className="w-5 h-5 mr-2 text-orange-400" />
              Weekly Routine Maintenance
            </h3>
            {expandedSections.includes('routine') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>

          {expandedSections.includes('routine') && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Badge className={`${
                    report.maintainWeeklyRoutine?.status 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {report.maintainWeeklyRoutine?.status ? 'Maintained' : 'Not Maintained'}
                  </Badge>
                </div>
                <p className="text-white p-4 bg-slate-700/30 rounded-lg">
                  {report.maintainWeeklyRoutine?.details || 'No details provided'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleSection('learning')}
          >
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-400" />
              Learning & Development
            </h3>
            {expandedSections.includes('learning') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>

          {expandedSections.includes('learning') && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400">New Interesting Learning</label>
                <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
                  {report.newInterestingLearning || 'No new learning mentioned'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Course Chapter Progress</label>
                <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
                  {report.courseChapter || 'No course progress mentioned'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Learning Goal Achievement</label>
                <div className="mt-2">
                  <Badge className={`mb-2 ${
                    report.learningGoalAchievement?.status 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {report.learningGoalAchievement?.status ? 'Achieved' : 'Not Achieved'}
                  </Badge>
                  <p className="text-white p-4 bg-slate-700/30 rounded-lg">
                    {report.learningGoalAchievement?.details || 'No details provided'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support & Interactions */}
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleSection('support')}
          >
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-400" />
              Support & Interactions
            </h3>
            {expandedSections.includes('support') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>

          {expandedSections.includes('support') && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Mentor Interaction</label>
                <div className="mt-2">
                  <Badge className={`mb-2 ${
                    report.mentorInteraction?.status 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {report.mentorInteraction?.status ? 'Had Interaction' : 'No Interaction'}
                  </Badge>
                  <p className="text-white p-4 bg-slate-700/30 rounded-lg">
                    {report.mentorInteraction?.details || 'No details provided'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Support Interaction</label>
                <div className="mt-2">
                  <Badge className={`mb-2 ${
                    report.supportInteraction?.status 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {report.supportInteraction?.status ? 'Had Support' : 'No Support'}
                  </Badge>
                  <p className="text-white p-4 bg-slate-700/30 rounded-lg">
                    {report.supportInteraction?.details || 'No details provided'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Additional Support Needed</label>
                <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
                  {report.additionalSupport || 'No additional support mentioned'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleSection('additional')}
          >
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-400" />
              Additional Information
            </h3>
            {expandedSections.includes('additional') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>

          {expandedSections.includes('additional') && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Significant Event</label>
                <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
                  {report.significantEvent || 'No significant events mentioned'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Product Progress</label>
                <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
                  {report.productProgress || 'No product progress mentioned'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Free Time Usage</label>
                <div className="mt-2">
                  <Badge className={`mb-2 ${
                    report.freeTime?.status 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {report.freeTime?.status ? 'Used Well' : 'Not Used Well'}
                  </Badge>
                  <p className="text-white p-4 bg-slate-700/30 rounded-lg">
                    {report.freeTime?.details || 'No details provided'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Open Questions</label>
                <p className="text-white mt-2 p-4 bg-slate-700/30 rounded-lg">
                  {report.openQuestions || 'No open questions'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GeneralReportDetails: React.FC<{ report: any }> = ({ report }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          General Report Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">Report Name</label>
            <p className="text-white text-lg">{report.reportName || 'Unnamed Report'}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-400">Description</label>
            <p className="text-white p-4 bg-slate-700/30 rounded-lg">
              {report.description || 'No description provided'}
            </p>
          </div>

          {report.fields && report.fields.length > 0 && (
            <div>
              <label className="text-sm font-medium text-slate-400">Report Fields</label>
              <div className="space-y-3 mt-2">
                {report.fields.map((field: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-medium">{field.fieldName}</span>
                    </div>
                    {field.expected && (
                      <div className="mb-2">
                        <span className="text-xs text-slate-400">Expected:</span>
                        <p className="text-slate-300">{field.expected}</p>
                      </div>
                    )}
                    {field.actual && (
                      <div>
                        <span className="text-xs text-slate-400">Actual:</span>
                        <p className="text-white">{field.actual}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.submissions && report.submissions.length > 0 && (
            <div>
              <label className="text-sm font-medium text-slate-400">Submissions ({report.submissions.length})</label>
              <div className="space-y-3 mt-2">
                {report.submissions.map((submission: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Submission #{index + 1}</span>
                      <span className="text-slate-400 text-sm">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {submission.fields && submission.fields.map((field: any, fieldIndex: number) => (
                      <div key={fieldIndex} className="mt-2">
                        <span className="text-xs text-slate-400">{field.fieldName}:</span>
                        <p className="text-slate-300">{field.actual || 'No data'}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ReportsManagement: React.FC<ReportsManagementProps> = ({ searchTerm }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'daily' | 'weekly' | 'end-of-day' | 'general'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');

  // Get current admin user info
  const { data: currentAdmin } = useCurrentAdmin();
  const { data: workspaces = [] } = useAdminWorkspaces();
  const deleteReportMutation = useDeleteReport();
  const approveReportMutation = useApproveReport();
  const rejectReportMutation = useRejectReport();
  
  // Use combined reports hook for all report types
  const { 
    data: allReports = [], 
    isLoading: loadingAllReports, 
    error: errorAllReports,
    counts
  } = useAllAdminReports();
  
  // Still support workspace-specific filtering for general reports
  const { data: workspaceReports = [], isLoading: loadingWorkspaceReports, error: workspaceError, refetch: refetchWorkspaceReports } = useWorkspaceReports(selectedWorkspace);
  
  // Determine which reports to show
  const reports = selectedWorkspace ? workspaceReports : allReports;
  const isLoading = selectedWorkspace ? loadingWorkspaceReports : loadingAllReports;
  const reportsError = selectedWorkspace ? workspaceError : errorAllReports;

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = !searchTerm || 
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || report.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, searchTerm, typeFilter, statusFilter]);

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
    // Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsDetailsModalOpen(false);
    // Restore body scroll when modal closes
    document.body.style.overflow = '';
  };

  const handleDeleteReport = async (report: Report) => {
    if (window.confirm(`Are you sure you want to delete the report "${report.title}"?`)) {
      try {
        await deleteReportMutation.mutateAsync(report._id || report.id);
      } catch (error) {
        // Error handling is done in the hook
        console.error('Failed to delete report:', error);
      }
    }
  };

  const handleApproveReport = async (report: Report) => {
    if (window.confirm(`Are you sure you want to approve the report "${report.title}"?`)) {
      try {
        await approveReportMutation.mutateAsync(report._id || report.id);
      } catch (error) {
        console.error('Failed to approve report:', error);
      }
    }
  };

  const handleRejectReport = async (report: Report) => {
    if (window.confirm(`Are you sure you want to reject the report "${report.title}"?`)) {
      try {
        await rejectReportMutation.mutateAsync({ reportId: report._id || report.id });
      } catch (error) {
        console.error('Failed to reject report:', error);
      }
    }
  };

  // Calculate stats
  const totalReports = filteredReports.length;
  const pendingReports = filteredReports.filter(r => r.status === 'pending').length;
  const approvedReports = filteredReports.filter(r => r.status === 'approved').length;
  const rejectedReports = filteredReports.filter(r => r.status === 'rejected').length;
  const endOfDayReports = filteredReports.filter(r => r.type === 'end-of-day').length;

  // Clean up effect for modal
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="p-6">
        <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Reports</h3>
          <p className="text-slate-400 mb-6">
            {reportsError?.message || 'There was an error loading reports data. Please try again.'}
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => refetchWorkspaceReports()} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              {isLoading ? 'Retrying...' : 'Try Again'}
            </Button>
            {selectedWorkspace && (
              <Button 
                onClick={() => setSelectedWorkspace('')}
                variant="outline"
                className="border-slate-600 text-slate-400 hover:text-white"
              >
                View All Reports
              </Button>
            )}
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
          <h2 className="text-xl font-bold text-white mb-2">Reports Management</h2>
          <p className="text-slate-400 text-sm">
            {selectedWorkspace 
              ? `Managing reports for selected workspace` 
              : `Managing reports for ${currentAdmin?.firstName} ${currentAdmin?.lastName}`}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => refetchWorkspaceReports()}
            variant="outline"
            className="border-slate-600/50 text-slate-400 hover:text-white hover:border-slate-500/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Workspace Selection */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <Building className="w-5 h-5 text-slate-400" />
          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm min-w-[200px] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          >
            <option value="">All Workspaces</option>
            {workspaces.map((workspace, index) => (
              <option key={workspace._id || workspace.name || index} value={workspace._id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-colors">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{totalReports}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Total Reports</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-colors">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{counts?.daily || 0}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Daily Reports</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-colors">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{counts?.weekly || 0}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Weekly Reports</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-slate-500/50 transition-colors">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{counts?.general || 0}</h3>
            <p className="text-slate-400 text-xs sm:text-sm">General Reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-slate-800/30 border-slate-600/20 hover:border-slate-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{pendingReports}</h3>
                <p className="text-slate-400 text-sm">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600/20 hover:border-slate-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{approvedReports}</h3>
                <p className="text-slate-400 text-sm">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600/20 hover:border-slate-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{rejectedReports}</h3>
                <p className="text-slate-400 text-sm">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600/20 hover:border-slate-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{endOfDayReports}</h3>
                <p className="text-slate-400 text-sm">End of Day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="daily">Daily Reports</option>
            <option value="weekly">Weekly Reports</option>
            <option value="end-of-day">End of Day Reports</option>
            <option value="general">General Reports</option>
          </select>
        </div>
        <div className="flex-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-slate-800/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-8 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No reports found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm 
              ? 'No reports match your search criteria.'
              : 'No reports have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredReports.map((report, index) => (
            <ReportCard
              key={report._id || report.id || index}
              report={report}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteReport}
              onApprove={handleApproveReport}
              onReject={handleRejectReport}
            />
          ))}
        </div>
      )}

      {/* Enhanced Report Details Modal */}
      {isDetailsModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 border border-slate-600/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600/30 bg-slate-800/50">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedReport.type === 'daily' ? 'bg-blue-500/10 border border-blue-500/20' :
                  selectedReport.type === 'weekly' ? 'bg-purple-500/10 border border-purple-500/20' :
                  selectedReport.type === 'general' ? 'bg-green-500/10 border border-green-500/20' :
                  'bg-orange-500/10 border border-orange-500/20'
                }`}>
                  {selectedReport.type === 'daily' && <Calendar className="w-5 h-5 text-blue-400" />}
                  {selectedReport.type === 'weekly' && <Clock className="w-5 h-5 text-purple-400" />}
                  {selectedReport.type === 'general' && <FileText className="w-5 h-5 text-green-400" />}
                  {selectedReport.type === 'end-of-day' && <ClockIcon className="w-5 h-5 text-orange-400" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge className={
                      selectedReport.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      selectedReport.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      selectedReport.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }>
                      {selectedReport.status}
                    </Badge>
                    <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                      {selectedReport.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleCloseModal}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-700/30 [&::-webkit-scrollbar-thumb]:bg-slate-500/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-slate-500/80">
              {selectedReport.type === 'daily' && <DailyReportDetails report={selectedReport.originalData} />}
              {selectedReport.type === 'weekly' && <WeeklyReportDetails report={selectedReport.originalData} />}
              {selectedReport.type === 'general' && <GeneralReportDetails report={selectedReport.originalData} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Report Card Component
const ReportCard: React.FC<{
  report: Report;
  onViewDetails: (report: Report) => void;
  onDelete: (report: Report) => void;
  onApprove: (report: Report) => void;
  onReject: (report: Report) => void;
}> = ({ report, onViewDetails, onDelete, onApprove, onReject }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return Calendar;
      case 'weekly': return Clock;
      case 'end-of-day': return ClockIcon;
      case 'general': return FileText;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'weekly': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'end-of-day': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'general': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const TypeIcon = getTypeIcon(report.type);

  return (
    <Card className="bg-slate-800/50 border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(report.type)}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-blue-300 transition-colors">
                {report.title}
              </h3>
                             <p className="text-slate-400 text-xs sm:text-sm mt-1 overflow-hidden text-ellipsis" style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 2,
                 WebkitBoxOrient: 'vertical'
               }}>
                 {report.description}
               </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getStatusColor(report.status)}>
            {report.status}
          </Badge>
          <Badge className={getTypeColor(report.type)}>
            {report.type}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-4">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(report.submittedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {report.submittedBy?.slice(0, 8)}...
          </span>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => onViewDetails(report)}
            variant="outline"
            size="sm"
            className="flex-1 border-slate-600/50 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {report.status === 'pending' && (
            <>
              <Button
                onClick={() => onApprove(report)}
                variant="outline"
                size="sm"
                className="border-emerald-500/50 text-emerald-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => onReject(report)}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {report.status === 'approved' && (
            <Button
              onClick={() => onDelete(report)}
              variant="outline"
              size="sm"
              className="border-slate-500/50 text-slate-400 hover:text-white hover:border-slate-500/50 hover:bg-slate-500/10 transition-all"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Archive
            </Button>
          )}
          <Button
            onClick={() => onDelete(report)}
            variant="outline"
            size="sm"
            className="border-slate-600/50 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 