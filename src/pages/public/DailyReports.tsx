import React, { useState, useCallback, useRef, memo } from 'react';
import { Sun, CheckCircle, Clock, FileText, Moon, Trophy, Star, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { ReportsHistoryPanel, ReportHistoryItem } from '@/components/reports/shared/ReportsHistoryPanel';
import { ReportsContentPanel, StatusCard } from '@/components/reports/shared/ReportsContentPanel';
import { DailyReportForm } from '@/components/reports/forms/DailyReportForm';
import { 
  useAllDailyReports, 
  useDailyReport, 
  useTodayDailyReport 
} from '@/hooks/useReports';
import { DailyReport } from '@/services/api/reports';
import { Button } from '@/components/ui/button';


// Optimized DailyReportViewer with React.memo and responsive improvements
const DailyReportViewer: React.FC<{ report: DailyReport }> = memo(({ report }) => {
  const hasEndOfDay = !!report.mood?.endOfDay;
  
  return (
    <div className="space-y-6 sm:space-y-8 scroll-optimized content-visibility-auto">
      {/* Enhanced Status Card with improved mobile layout */}
      <div className="performance-card gpu-accelerated">
        <StatusCard
          status={hasEndOfDay ? 'completed' : 'pending'}
          title={hasEndOfDay ? 'Daily Report Completed' : 'End of Day Pending'}
          description={hasEndOfDay 
            ? 'This daily report has been completed with end-of-day reflection'
            : 'Complete your end-of-day reflection to finish this report'
          }
          icon={hasEndOfDay ? <Trophy className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          variant={hasEndOfDay ? 'success' : 'warning'}
        />
      </div>

      {/* Report Content with improved responsive grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 performance-animation overflow-x-auto min-w-0">
        {/* Basic Info - Full width on mobile/tablet, half on desktop */}
        <div className="performance-card gpu-accelerated bg-gradient-to-br from-slate-800/50 to-slate-700/30 optimized-backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300 overflow-x-hidden max-w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center mr-2 sm:mr-3 gpu-accelerated flex-shrink-0">
              <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            </div>
            <span className="truncate">Daily Planning</span>
          </h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 performance-card">
              <label className="text-slate-400 text-sm font-medium mb-2 block">Wake-up Time</label>
              <p className="text-white font-semibold text-base sm:text-lg">{report.wakeupTime}</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 performance-card">
              <label className="text-slate-400 text-sm font-medium mb-3 block">Morning Mood</label>
              <div className="flex items-center space-x-3">
                <span className="text-2xl sm:text-3xl">
                  {report.mood.startOfDay === 1 ? '😢' : 
                   report.mood.startOfDay === 2 ? '😞' : 
                   report.mood.startOfDay === 3 ? '😐' : 
                   report.mood.startOfDay === 4 ? '😊' : '😄'}
                </span>
                <div>
                  <span className="text-white font-semibold text-base sm:text-lg">{report.mood.startOfDay}/5</span>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 gpu-accelerated ${star <= report.mood.startOfDay! ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {hasEndOfDay && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-3 sm:p-4 performance-card">
                <label className="text-emerald-300 text-sm font-medium mb-3 block">End of Day Mood</label>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-3xl">
                    {report.mood.endOfDay === 1 ? '😢' : 
                     report.mood.endOfDay === 2 ? '😞' : 
                     report.mood.endOfDay === 3 ? '😐' : 
                     report.mood.endOfDay === 4 ? '😊' : '😄'}
                  </span>
                  <div>
                    <span className="text-white font-semibold text-base sm:text-lg">{report.mood.endOfDay}/5</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full performance-card ${
                        report.mood.endOfDay! > report.mood.startOfDay! 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : report.mood.endOfDay! < report.mood.startOfDay! 
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-slate-500/20 text-slate-300'
                      }`}>
                        {report.mood.endOfDay! > report.mood.startOfDay! ? '+' : ''}{report.mood.endOfDay! - report.mood.startOfDay!}
                        {report.mood.endOfDay! > report.mood.startOfDay! ? ' 📈' : 
                         report.mood.endOfDay! < report.mood.startOfDay! ? ' 📉' : ' ➡️'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Morning Routine - Full width on mobile/tablet, half on desktop */}
        <div className="performance-card gpu-accelerated bg-gradient-to-br from-slate-800/50 to-slate-700/30 optimized-backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mr-2 sm:mr-3 gpu-accelerated flex-shrink-0">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            </div>
            <span className="truncate">Morning Routine</span>
          </h3>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 performance-card">
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{report.morningRoutine.routine}</p>
          </div>
        </div>
      </div>

      {/* Goals Section with improved mobile layout */}
      <div className="performance-card gpu-accelerated bg-gradient-to-br from-slate-800/50 to-slate-700/30 optimized-backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mr-2 sm:mr-3 gpu-accelerated flex-shrink-0">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <span className="truncate">Daily Goals</span>
        </h3>
        <div className="grid gap-3 sm:gap-4 content-visibility-auto">
          {report.dailyGoals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-3 sm:space-x-4 performance-card bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 hover:bg-slate-700/40 transition-all duration-200 touch-manipulation">
              <div className="flex-shrink-0">
                {goal.completed ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center gpu-accelerated">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-slate-500 rounded-full bg-slate-700/50 performance-card"></div>
                )}
              </div>
              <span className={`flex-1 text-sm sm:text-base ${goal.completed ? 'text-slate-300 line-through' : 'text-white'} font-medium break-words`}>
                {goal.description}
              </span>
              {goal.completed && (
                <div className="flex-shrink-0">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-medium px-2 py-1 rounded-full performance-card">
                    Done
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {hasEndOfDay && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600/30">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 sm:p-4 performance-card">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-emerald-400 mb-1">
                  {report.dailyGoals.filter(g => g.completed).length}
                </div>
                <div className="text-emerald-300 text-xs sm:text-sm">Completed</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 sm:p-4 performance-card">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-red-400 mb-1">
                  {report.dailyGoals.filter(g => !g.completed).length}
                </div>
                <div className="text-red-300 text-xs sm:text-sm">Pending</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 sm:p-4 performance-card">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-blue-400 mb-1">
                  {Math.round((report.dailyGoals.filter(g => g.completed).length / report.dailyGoals.length) * 100)}%
                </div>
                <div className="text-blue-300 text-xs sm:text-sm">Success</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activities with improved responsive grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 performance-animation content-visibility-auto overflow-x-hidden min-w-0 max-w-full">
        {/* Expected Activities */}
        <div className="performance-card gpu-accelerated bg-gradient-to-br from-slate-800/50 to-slate-700/30 optimized-backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mr-2 sm:mr-3 gpu-accelerated flex-shrink-0">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            </div>
            <span className="truncate">Expected Activities</span>
          </h3>
          <div className="space-y-2 sm:space-y-3 content-visibility-auto">
            {report.expectedActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between performance-card bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 hover:bg-slate-700/40 transition-all duration-200 touch-manipulation overflow-x-hidden max-w-full">
                <span className="text-slate-300 capitalize font-medium text-sm sm:text-base truncate flex-1 mr-2">{activity.category}</span>
                <span className="text-blue-400 font-semibold bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm performance-card flex-shrink-0">
                  {activity.duration} min
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600/30">
            <div className="flex items-center justify-between performance-card bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
              <span className="text-blue-300 font-medium text-sm sm:text-base">Total planned:</span>
              <span className="text-blue-400 font-bold text-base sm:text-lg">
                {report.expectedActivity.reduce((sum, a) => sum + a.duration, 0)} min
              </span>
            </div>
          </div>
        </div>

        {/* Actual Activities */}
        {hasEndOfDay && report.actualActivity && (
          <div className="performance-card gpu-accelerated bg-gradient-to-br from-slate-800/50 to-slate-700/30 optimized-backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mr-2 sm:mr-3 gpu-accelerated flex-shrink-0">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
              </div>
              <span className="truncate">Actual Activities</span>
            </h3>
            <div className="space-y-2 sm:space-y-3 content-visibility-auto">
              {report.actualActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between performance-card bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 hover:bg-slate-700/40 transition-all duration-200 touch-manipulation">
                  <span className="text-slate-300 capitalize font-medium text-sm sm:text-base truncate flex-1 mr-2">{activity.category}</span>
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm performance-card flex-shrink-0">
                    {activity.duration} min
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600/30">
              <div className="flex items-center justify-between performance-card bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 sm:p-4">
                <span className="text-emerald-300 font-medium text-sm sm:text-base">Total actual:</span>
                <span className="text-emerald-400 font-bold text-base sm:text-lg">
                  {report.actualActivity.reduce((sum, a) => sum + a.duration, 0)} min
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Creation Date - Improved mobile layout */}
      <div className="text-center performance-card bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 sm:p-4">
        <p className="text-slate-400 text-xs sm:text-sm break-words">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
          Submitted on {new Date(report.createdAt).toLocaleDateString('en-US', {
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
});

DailyReportViewer.displayName = 'DailyReportViewer';

// Optimized main component with improved responsive layout
export default function DailyReports(): JSX.Element {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  // Fetch all daily reports for history
  const { 
    data: allReports = [], 
    isLoading: historyLoading, 
    error: historyError,
    refetch: refetchReports // Add refetch to the hook
  } = useAllDailyReports();

  // Fetch selected report details
  const { 
    data: selectedReport, 
    isLoading: reportLoading, 
    error: reportError 
  } = useDailyReport(selectedReportId);

  // Check today's report status for new submissions
  const { 
    exists: todayExists, 
    canCreateNew,
    isLoading: todayLoading 
  } = useTodayDailyReport();



  // Convert reports to history items with memoization
  const historyItems: ReportHistoryItem[] = React.useMemo(() => 
    Array.isArray(allReports) 
      ? allReports.map(report => ({
          id: report.id || (report as any)._id || `${report.createdAt}-${Math.random()}`, // Handle both id and _id fields with fallback
          type: 'daily' as const,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
          hasEndOfDay: !!report.mood?.endOfDay,
          title: `Daily Report - ${new Date(report.createdAt).toLocaleDateString()}`
        }))
      : [], 
    [allReports]
  );

  const handleReportSelect = useCallback((report: ReportHistoryItem) => {
    setSelectedReportId(report.id);
  }, []);

  const handleBackToForm = useCallback(() => {
    setSelectedReportId(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setSelectedReportId(null);
    // The queries will automatically refetch due to React Query invalidation
  }, []);

  // Optimized render logic with memoization
  const renderRightContent = useCallback(() => {
    if (selectedReportId && selectedReport) {
      return (
        <ReportsContentPanel
          title="Daily Report Details"
          isLoading={reportLoading}
          error={reportError?.message}
          onBack={handleBackToForm}
          showBackButton={true}
        >
          <DailyReportViewer report={selectedReport} />
        </ReportsContentPanel>
      );
    }

    // Show form for new submission or today's update
    return (
      <ReportsContentPanel
        title={todayExists ? "Update Today's Daily Report" : "Submit Daily Report"}
        isLoading={todayLoading}
        error={null}
      >
        {canCreateNew || todayExists ? (
          <DailyReportForm 
            onSuccess={handleFormSuccess}
            onCancel={historyItems.length > 0 ? handleBackToForm : undefined}
          />
        ) : (
          <div className="space-y-6 sm:space-y-8 scroll-optimized content-visibility-auto">
            <div className="performance-card gpu-accelerated">
              <StatusCard
                status="completed"
                title="Today's Report Complete"
                description="You have already completed your daily report for today. Thank you for staying consistent!"
                icon={<Trophy className="w-5 h-5" />}
                variant="success"
              />
            </div>

            <div className="performance-card gpu-accelerated bg-gradient-to-br from-slate-800/50 to-slate-700/30 optimized-backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto gpu-accelerated">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-6 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse gpu-accelerated">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Great Job!</h3>
              <p className="text-slate-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                You've successfully submitted your daily report for today. Keep up the excellent habit!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="performance-card bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 sm:p-6 hover:bg-slate-700/40 transition-all duration-200">
                  <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center justify-center sm:justify-start">
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" />
                    Next Daily Report
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-center sm:text-left">
                    {(() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return `Available tomorrow (${tomorrow.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}) at 12:00 AM`;
                    })()}
                  </p>
                </div>
                
                <div className="performance-card bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 sm:p-6 hover:bg-slate-700/40 transition-all duration-200">
                  <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center justify-center sm:justify-start">
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mr-2" />
                    Don't Forget
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-center sm:text-left">
                    Complete your end-of-day reflection later today to close the loop
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4">
                <Button
                  onClick={() => window.location.href = '/end-of-day-reports'}
                  className="performance-card bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 touch-manipulation"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Complete End of Day  
                </Button>
                
                {historyItems.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => handleReportSelect(historyItems[0])}
                    className="performance-card border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 rounded-xl px-6 sm:px-8 py-3 transition-all duration-200 touch-manipulation"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Recent Reports
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </ReportsContentPanel>
    );
  }, [selectedReportId, selectedReport, reportLoading, reportError, handleBackToForm, todayExists, todayLoading, canCreateNew, handleFormSuccess, historyItems, handleReportSelect]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col md:flex-row overflow-hidden scroll-container page-container"
    >
      {/* Left History Panel - Improved mobile stacking */}
      <div className="w-full md:w-80 flex-shrink-0 order-2 md:order-1 h-[40vh] md:h-screen overflow-y-auto performance-card border-b md:border-b-0 md:border-r border-slate-700/50 min-w-0">
        <ReportsHistoryPanel
          reports={historyItems}
          selectedReportId={selectedReportId || undefined}
          onReportSelect={handleReportSelect}
          isLoading={historyLoading}
          error={historyError?.message || undefined}
          title="Daily Reports History"
          emptyMessage="No daily reports submitted yet. Submit your first report to see it here."
          reportType="daily"
          onRefresh={() => refetchReports()} // Pass refetch to the panel
        />
      </div>

      {/* Right Content Panel - Improved mobile stacking */}
      <div className="flex-1 order-1 md:order-2 h-[60vh] md:h-screen overflow-hidden performance-card">
        {renderRightContent()}
      </div>
    </div>
  );
}
