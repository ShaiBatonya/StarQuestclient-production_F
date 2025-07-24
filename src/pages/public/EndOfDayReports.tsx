import React, { useState } from 'react';
import { Moon, CheckCircle, Clock, AlertCircle, Sun, Trophy, Star, Calendar, TrendingUp, BarChart, Target } from 'lucide-react';
import { ReportsHistoryPanel, ReportHistoryItem } from '@/components/reports/shared/ReportsHistoryPanel';
import { ReportsContentPanel, EmptyReportState, StatusCard } from '@/components/reports/shared/ReportsContentPanel';
import { EndOfDayReportForm } from '@/components/reports/forms/EndOfDayReportForm';
import { 
  useAllDailyReports, 
  useDailyReport, 
  useTodayDailyReport 
} from '@/hooks/useReports';
import { DailyReport } from '@/services/api/reports';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

const EndOfDayReportViewer: React.FC<{ report: DailyReport }> = ({ report }) => {
  const hasEndOfDay = !!report.mood?.endOfDay;
  
  if (!hasEndOfDay) {
    return (
      <EmptyReportState
        title="End of Day Not Completed"
        description="This daily report doesn't have an end-of-day completion yet."
        icon={<Clock className="w-16 h-16" />}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Status Card */}
      <StatusCard
        status="completed"
        title="End of Day Report Completed"
        description="This end-of-day reflection has been successfully completed"
        icon={<Trophy className="w-5 h-5" />}
        variant="success"
      />

      {/* Mood Comparison */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mr-3">
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          Mood Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/40 transition-all duration-200">
            <label className="text-slate-400 text-sm font-medium mb-3 block">Morning Mood</label>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-4xl">
                {report.mood.startOfDay === 1 ? '😢' : 
                 report.mood.startOfDay === 2 ? '😞' : 
                 report.mood.startOfDay === 3 ? '😐' : 
                 report.mood.startOfDay === 4 ? '😊' : '😄'}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white font-semibold text-lg">{report.mood.startOfDay}/5</span>
            </div>
            <div className="flex justify-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-3 h-3 ${star <= report.mood.startOfDay! ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="text-center bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/40 transition-all duration-200">
            <label className="text-slate-400 text-sm font-medium mb-3 block">Evening Mood</label>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-4xl">
                {report.mood.endOfDay === 1 ? '😢' : 
                 report.mood.endOfDay === 2 ? '😞' : 
                 report.mood.endOfDay === 3 ? '😐' : 
                 report.mood.endOfDay === 4 ? '😊' : '😄'}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white font-semibold text-lg">{report.mood.endOfDay}/5</span>
            </div>
            <div className="flex justify-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-3 h-3 ${star <= report.mood.endOfDay! ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} 
                />
              ))}
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <label className="text-blue-300 text-sm font-medium mb-3 block">Mood Change</label>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className={`text-3xl font-bold ${
                report.mood.endOfDay! > report.mood.startOfDay! ? 'text-emerald-400' : 
                report.mood.endOfDay! < report.mood.startOfDay! ? 'text-red-400' : 'text-blue-400'
              }`}>
                {report.mood.endOfDay! > report.mood.startOfDay! ? '+' : ''}
                {report.mood.endOfDay! - report.mood.startOfDay!}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-2xl ${
                report.mood.endOfDay! > report.mood.startOfDay! ? 'text-emerald-400' : 
                report.mood.endOfDay! < report.mood.startOfDay! ? 'text-red-400' : 'text-blue-400'
              }`}>
                {report.mood.endOfDay! > report.mood.startOfDay! ? '📈' : 
                 report.mood.endOfDay! < report.mood.startOfDay! ? '📉' : '➡️'}
              </span>
            </div>
            <div className="mt-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                report.mood.endOfDay! > report.mood.startOfDay! 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : report.mood.endOfDay! < report.mood.startOfDay! 
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {report.mood.endOfDay! > report.mood.startOfDay! ? 'Improved' : 
                 report.mood.endOfDay! < report.mood.startOfDay! ? 'Declined' : 'Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Achievement */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mr-3">
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          Goals Achievement
        </h3>
        <div className="grid gap-4 mb-6">
          {report.dailyGoals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-4 bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-200">
              <div className="flex-shrink-0">
                {goal.completed ? (
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-slate-500 rounded-full bg-slate-700/50"></div>
                )}
              </div>
              <span className={`flex-1 ${goal.completed ? 'text-slate-300 line-through' : 'text-white'} font-medium`}>
                {goal.description}
              </span>
              {goal.completed && (
                <div className="flex-shrink-0">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-medium px-2 py-1 rounded-full">
                    ✓ Done
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Achievement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-600/30">
          <div className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {report.dailyGoals.filter(g => g.completed).length}
            </div>
            <div className="text-emerald-300 text-sm">Completed</div>
          </div>
          <div className="text-center bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">
              {report.dailyGoals.filter(g => !g.completed).length}
            </div>
            <div className="text-red-300 text-sm">Incomplete</div>
          </div>
          <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {Math.round((report.dailyGoals.filter(g => g.completed).length / report.dailyGoals.length) * 100)}%
            </div>
            <div className="text-blue-300 text-sm">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Time Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expected vs Actual */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mr-3">
              <BarChart className="w-4 h-4 text-blue-400" />
            </div>
            Time Planned vs Actual
          </h3>
          <div className="space-y-6">
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-400 text-sm font-medium">Expected Time</span>
                <span className="text-blue-400 font-semibold text-lg">
                  {report.expectedActivity.reduce((sum, a) => sum + a.duration, 0)} min
                </span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            
            {report.actualActivity && (
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400 text-sm font-medium">Actual Time</span>
                  <span className="text-emerald-400 font-semibold text-lg">
                    {report.actualActivity.reduce((sum, a) => sum + a.duration, 0)} min
                  </span>
                </div>
                <div className="w-full bg-slate-600/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full transition-all duration-700 ease-out" 
                    style={{ 
                      width: `${Math.min(100, (report.actualActivity.reduce((sum, a) => sum + a.duration, 0) / report.expectedActivity.reduce((sum, a) => sum + a.duration, 0)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {report.actualActivity && (
            <div className="mt-6 pt-6 border-t border-slate-600/30 text-center">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                report.actualActivity.reduce((sum, a) => sum + a.duration, 0) > report.expectedActivity.reduce((sum, a) => sum + a.duration, 0) 
                  ? 'bg-orange-500/10 border border-orange-500/20' 
                  : report.actualActivity.reduce((sum, a) => sum + a.duration, 0) < report.expectedActivity.reduce((sum, a) => sum + a.duration, 0)
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-emerald-500/10 border border-emerald-500/20'
              }`}>
                <span className={`text-lg font-bold ${
                  report.actualActivity.reduce((sum, a) => sum + a.duration, 0) > report.expectedActivity.reduce((sum, a) => sum + a.duration, 0) 
                    ? 'text-orange-400' 
                    : report.actualActivity.reduce((sum, a) => sum + a.duration, 0) < report.expectedActivity.reduce((sum, a) => sum + a.duration, 0)
                      ? 'text-red-400'
                      : 'text-emerald-400'
                }`}>
                  {report.actualActivity.reduce((sum, a) => sum + a.duration, 0) > report.expectedActivity.reduce((sum, a) => sum + a.duration, 0) 
                    ? '+' 
                    : ''
                  }
                  {report.actualActivity.reduce((sum, a) => sum + a.duration, 0) - report.expectedActivity.reduce((sum, a) => sum + a.duration, 0)} min
                </span>
                <span className="text-slate-400 text-sm">vs. planned</span>
              </div>
            </div>
          )}
        </div>

        {/* Activity Breakdown */}
        {report.actualActivity && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              Activity Breakdown
            </h3>
            <div className="space-y-3">
              {report.actualActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-200">
                  <span className="text-slate-300 capitalize font-medium">{activity.category}</span>
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                    {activity.duration} min
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-600/30">
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <span className="text-emerald-300 font-medium">Total time spent:</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {report.actualActivity.reduce((sum, a) => sum + a.duration, 0)} minutes
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Creation Date */}
      <div className="text-center bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          <Calendar className="w-4 h-4 inline mr-2" />
          Completed on {new Date(report.updatedAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default function EndOfDayReports(): JSX.Element {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all daily reports for history (end of day reports are part of daily reports)
  const { 
    data: allReports = [], 
    isLoading: historyLoading, 
    error: historyError,
    refetch: refetchAllReports 
  } = useAllDailyReports();

  // Fetch selected report details
  const { 
    data: selectedReport, 
    isLoading: reportLoading, 
    error: reportError,
  } = useDailyReport(selectedReportId);

  // Check today's report status
  const { 
    exists: todayExists, 
    hasEndOfDay,
    canCreateEndOfDay,
    isLoading: todayLoading 
  } = useTodayDailyReport();

  // Filter to only show reports that have end-of-day completions
  const endOfDayReports = Array.isArray(allReports) 
    ? allReports.filter(report => !!report.mood?.endOfDay)
    : [];

  // Convert reports to history items
  const historyItems: ReportHistoryItem[] = Array.isArray(endOfDayReports) 
    ? endOfDayReports.map(report => ({
        id: report.id || (report as any)._id || `${report.createdAt}-${Math.random()}`, // Handle both id and _id fields with fallback
        type: 'end-of-day' as const,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        hasEndOfDay: true,
        title: `End of Day - ${new Date(report.createdAt).toLocaleDateString()}`
      }))
    : [];

  const handleReportSelect = (report: ReportHistoryItem) => {
    setSelectedReportId(report.id);
  };

  const handleBackToForm = () => {
    setSelectedReportId(null);
  };

  const handleFormSuccess = () => {
    setSelectedReportId(null);
    queryClient.invalidateQueries({ queryKey: ['dailyReports'] });
    queryClient.invalidateQueries({ queryKey: ['todayDailyReport'] });
  };

  // Determine what to show in the right panel
  const renderRightContent = () => {
    if (selectedReportId && selectedReport) {
      return (
        <ReportsContentPanel
          title="End of Day Report Details"
          isLoading={reportLoading}
          error={reportError?.message || undefined}
          onBack={handleBackToForm}
          showBackButton={true}
        >
          <EndOfDayReportViewer report={selectedReport} />
        </ReportsContentPanel>
      );
    }

    // Show form for new submission
    return (
      <ReportsContentPanel
        title="Complete End of Day Report"
        isLoading={todayLoading}
        error={null}
      >
        {!todayExists ? (
          <div className="space-y-8">
            <StatusCard
              status="blocked"
              title="Daily Report Required First"
              description="You must submit your daily report before you can complete an end-of-day reflection for today."
              icon={<AlertCircle className="w-5 h-5" />}
              variant="error"
            />
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto">
                  <Sun className="w-10 h-10 text-yellow-400" />
                </div>
                <div className="absolute -top-2 -right-6 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Complete Your Daily Report First</h3>
              <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                End-of-day reports are reflections on your daily planning. You need to have submitted 
                a daily report earlier today before you can complete your end-of-day reflection.
              </p>
              
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 mb-8">
                <h4 className="text-white font-semibold mb-4 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400 mr-2" />
                  What you need to do:
                </h4>
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex items-center space-x-3 p-3 bg-slate-600/30 rounded-lg">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span className="text-slate-300 text-sm">Submit your daily report (morning planning)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-600/30 rounded-lg">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span className="text-slate-300 text-sm">Complete your planned activities throughout the day</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-600/30 rounded-lg">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span className="text-slate-300 text-sm">Return here to complete your end-of-day reflection</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => window.location.href = '/daily-reports'}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
              >
                <Sun className="w-4 h-4 mr-2" />
                Go to Daily Reports
              </Button>
            </div>
          </div>
        ) : hasEndOfDay ? (
          <div className="space-y-8">
            <StatusCard
              status="completed"
              title="End of Day Already Completed"
              description="You have already completed your end-of-day report for today."
              icon={<Trophy className="w-5 h-5" />}
              variant="success"
            />

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                  <Trophy className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-6 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Well Done!</h3>
              <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                You've completed your end-of-day reflection. Thank you for being consistent with your daily practice!
              </p>
              
              {historyItems.length > 0 && (
                <Button
                  onClick={() => handleReportSelect(historyItems[0])}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  View Previous Reflections
                </Button>
              )}
            </div>

            {historyItems.length === 0 && (
              <EmptyReportState
                title="View Previous End of Day Reports"
                description="Check out your previous end-of-day completions and track your daily progress."
                icon={<Moon className="w-16 h-16" />}
                actionText="Start Building Your History"
                onAction={() => window.location.href = '/daily-reports'}
              />
            )}
          </div>
        ) : canCreateEndOfDay ? (
          <EndOfDayReportForm 
            onSuccess={handleFormSuccess}
            onCancel={historyItems.length > 0 ? handleBackToForm : undefined}
          />
        ) : (
          <div className="space-y-8">
            <StatusCard
              status="blocked"
              title="End of Day Not Available"
              description="Complete your daily report first to enable end-of-day completion."
              icon={<Clock className="w-5 h-5" />}
              variant="warning"
            />
          </div>
        )}
      </ReportsContentPanel>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* Left History Panel */}
      <div className="w-full md:w-80 flex-shrink-0 order-2 md:order-1 h-[40vh] md:h-screen overflow-hidden border-b md:border-b-0 md:border-r border-slate-700/50">
        <ReportsHistoryPanel
          reports={historyItems}
          selectedReportId={selectedReportId || undefined}
          onReportSelect={handleReportSelect}
          isLoading={historyLoading}
          error={historyError?.message || undefined}
          title="End of Day Reports History"
          emptyMessage="No end-of-day reports submitted yet. Submit your first report to see it here."
          reportType="end-of-day"
          onRefresh={() => refetchAllReports()}
        />
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 order-1 md:order-2 h-[60vh] md:h-screen overflow-hidden">
        {renderRightContent()}
      </div>
    </div>
  );
} 