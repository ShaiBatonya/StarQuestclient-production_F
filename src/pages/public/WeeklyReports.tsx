import React, { useState } from 'react';
import { BarChart3, CheckCircle, Clock, AlertCircle, Calendar, Trophy, Star, Sparkles, TrendingUp, Award, Target, Users, BookOpen, Zap } from 'lucide-react';
import { ReportsHistoryPanel, ReportHistoryItem } from '@/components/reports/shared/ReportsHistoryPanel';
import { ReportsContentPanel, EmptyReportState, StatusCard } from '@/components/reports/shared/ReportsContentPanel';
import { WeeklyReportForm } from '@/components/reports/forms/WeeklyReportForm';
import { 
  useAllWeeklyReports, 
  useWeeklyReport, 
  useWeeklyReportEligibility 
} from '@/hooks/useReports';
import { WeeklyReport } from '@/services/api/reports';

const WeeklyReportViewer: React.FC<{ report: WeeklyReport }> = ({ report }) => {
  return (
    <div className="space-y-8">
      {/* Enhanced Status Card */}
      <StatusCard
        status="completed"
        title="Weekly Report Submitted"
        description="This weekly report has been successfully submitted"
        icon={<Trophy className="w-5 h-5" />}
        variant="success"
      />

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood & Overview */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mr-3">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            Weekly Overview
          </h3>
          <div className="space-y-6">
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
              <label className="text-slate-400 text-sm font-medium mb-3 block">Overall Mood Rating</label>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">
                  {report.moodRating === 1 ? '😢' : 
                   report.moodRating === 2 ? '😞' : 
                   report.moodRating === 3 ? '😐' : 
                   report.moodRating === 4 ? '😊' : '😄'}
                </span>
                <div>
                  <span className="text-white font-semibold text-lg">{report.moodRating}/5</span>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 ${star <= report.moodRating ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
              <label className="text-slate-400 text-sm font-medium mb-3 block">Mood Explanation</label>
              <p className="text-slate-300 leading-relaxed">{report.moodExplanation}</p>
            </div>
          </div>
        </div>

        {/* Learning & Growth */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mr-3">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            Learning & Growth
          </h3>
          <div className="space-y-6">
            {report.newInterestingLearning && (
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <label className="text-slate-400 text-sm font-medium mb-3 block">New Interesting Learning</label>
                <p className="text-slate-300 leading-relaxed">{report.newInterestingLearning}</p>
              </div>
            )}
            {report.courseChapter && (
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                <label className="text-slate-400 text-sm font-medium mb-3 block">Course Chapter Progress</label>
                <p className="text-slate-300 leading-relaxed">{report.courseChapter}</p>
              </div>
            )}
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
              <label className="text-slate-400 text-sm font-medium mb-3 block">Learning Goal Achievement</label>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  report.learningGoalAchievement.status 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500'
                }`}>
                  {report.learningGoalAchievement.status ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Clock className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={`font-semibold ${
                  report.learningGoalAchievement.status ? 'text-emerald-300' : 'text-amber-300'
                }`}>
                  {report.learningGoalAchievement.status ? 'Achieved' : 'In Progress'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{report.learningGoalAchievement.details}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Significant Event */}
      {report.significantEvent && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            Significant Event
          </h3>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
            <p className="text-slate-300 leading-relaxed">{report.significantEvent}</p>
          </div>
        </div>
      )}

      {/* Weekly Routine */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mr-3">
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          Weekly Routine
        </h3>
        <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              report.maintainWeeklyRoutine.status 
                ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}>
              {report.maintainWeeklyRoutine.status ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <AlertCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className={`font-semibold text-lg ${
              report.maintainWeeklyRoutine.status ? 'text-emerald-300' : 'text-red-300'
            }`}>
              {report.maintainWeeklyRoutine.status ? 'Routine Maintained' : 'Routine Not Maintained'}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">{report.maintainWeeklyRoutine.details}</p>
        </div>
      </div>

      {/* Achieved Goals */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mr-3">
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          Achieved Goals
        </h3>
        <div className="space-y-4 mb-6">
          {report.achievedGoals.goals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-3 bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-200">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-300 font-medium">{goal}</span>
            </div>
          ))}
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              report.achievedGoals.shared 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                : 'bg-slate-600'
            }`}>
              {report.achievedGoals.shared ? (
                <CheckCircle className="w-3 h-3 text-white" />
              ) : (
                <Clock className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <span className={`font-medium ${
              report.achievedGoals.shared ? 'text-blue-300' : 'text-slate-400'
            }`}>
              {report.achievedGoals.shared ? 'Shared with others' : 'Not shared yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Free Time & Well-being */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mr-3">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
            Free Time
          </h3>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                report.freeTime.status 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                {report.freeTime.status ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <span className={`font-semibold ${
                report.freeTime.status ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {report.freeTime.status ? 'Had Free Time' : 'Limited Free Time'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{report.freeTime.details}</p>
          </div>
        </div>

        {report.productProgress && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              Product Progress
            </h3>
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
              <p className="text-slate-300 leading-relaxed">{report.productProgress}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            Mentor Interaction
          </h3>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                report.mentorInteraction.status 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                {report.mentorInteraction.status ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <span className={`font-semibold ${
                report.mentorInteraction.status ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {report.mentorInteraction.status ? 'Had Interaction' : 'No Interaction'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{report.mentorInteraction.details}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mr-3">
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            Support Interaction
          </h3>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                report.supportInteraction.status 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                {report.supportInteraction.status ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <span className={`font-semibold ${
                report.supportInteraction.status ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {report.supportInteraction.status ? 'Had Support' : 'No Support'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{report.supportInteraction.details}</p>
          </div>
        </div>
      </div>

      {/* Additional Support & Questions */}  
      {(report.additionalSupport || report.openQuestions) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 overflow-x-hidden max-w-full">
          {report.additionalSupport && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300 overflow-x-hidden max-w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Additional Support Needed</h3>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 overflow-x-hidden">
                <p className="text-slate-300 leading-relaxed break-words">{report.additionalSupport}</p>
              </div>
            </div>
          )}

          {report.openQuestions && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-4 sm:p-6 hover:border-slate-500/40 transition-all duration-300 overflow-x-hidden max-w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Open Questions</h3>
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 sm:p-4 overflow-x-hidden">
                <p className="text-slate-300 leading-relaxed break-words">{report.openQuestions}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Creation Date */}
      <div className="text-center bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          <Calendar className="w-4 h-4 inline mr-2" />
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
};

export default function WeeklyReports(): JSX.Element {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Fetch all weekly reports for history
  const { 
    data: allReports = [], 
    isLoading: historyLoading, 
    error: historyError,
    refetch: refetchReports // Add refetch function
  } = useAllWeeklyReports();

  // Fetch selected report details
  const { 
    data: selectedReport, 
    isLoading: reportLoading, 
    error: reportError,
  } = useWeeklyReport(selectedReportId);

  // Check weekly report eligibility
  const { 
    canCreate,
    eligibilityMessage,
    exists: weeklyExists,
    isLoading: eligibilityLoading 
  } = useWeeklyReportEligibility();

  // Convert reports to history items - ensure allReports is an array
  const historyItems: ReportHistoryItem[] = Array.isArray(allReports) 
    ? allReports.map(report => ({
        id: report.id || (report as any)._id || `${report.createdAt}-${Math.random()}`, // Handle both id and _id fields with fallback
        type: 'weekly' as const,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        title: `Weekly Report - Week of ${new Date(report.createdAt).toLocaleDateString()}`
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
  };

  // Determine what to show in the right panel
  const renderRightContent = () => {
    if (selectedReportId && selectedReport) {
      return (
        <ReportsContentPanel
          title="Weekly Report Details"
          isLoading={reportLoading}
          error={reportError?.message || undefined}
          onBack={handleBackToForm}
          showBackButton={true}
        >
          <WeeklyReportViewer report={selectedReport} />
        </ReportsContentPanel>
      );
    }

    // Show form for new submission
    return (
      <ReportsContentPanel
        title="Submit Weekly Report"
        isLoading={eligibilityLoading}
        error={null}
      >
        {canCreate ? (
          <WeeklyReportForm 
            onSuccess={handleFormSuccess}
            onCancel={historyItems.length > 0 ? handleBackToForm : undefined}
          />
        ) : (
          <div className="space-y-8">
            <StatusCard
              status={weeklyExists ? 'completed' : 'blocked'}
              title={weeklyExists ? 'Weekly Report Already Submitted' : 'Weekly Report Not Available'}
              description={eligibilityMessage || 'Weekly reports can only be submitted on Wednesday or Thursday'}
              icon={weeklyExists ? <Trophy className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              variant={weeklyExists ? 'success' : 'warning'}
            />
            
            {!weeklyExists && (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur border border-slate-600/30 rounded-2xl p-8 text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto">
                    <Calendar className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="absolute -top-2 -right-6 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Weekly Report Schedule</h3>
                <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                  Weekly reports are available for submission on Wednesdays and Thursdays only.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/40 transition-all duration-200">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                      Current Day
                    </h4>
                    <p className="text-slate-300 text-sm">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/40 transition-all duration-200">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Clock className="w-5 h-5 text-emerald-400 mr-2" />
                      Next Available
                    </h4>
                    <p className="text-slate-300 text-sm">
                      {(() => {
                        const today = new Date();
                        const dayOfWeek = today.getDay(); // 0 = Sunday, 3 = Wednesday, 4 = Thursday
                        
                        if (dayOfWeek < 3) {
                          // Before Wednesday
                          const nextWednesday = new Date(today);
                          nextWednesday.setDate(today.getDate() + (3 - dayOfWeek));
                          return nextWednesday.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          });
                        } else if (dayOfWeek === 3 || dayOfWeek === 4) {
                          // Wednesday or Thursday
                          return 'Available now!';
                        } else {
                          // Friday, Saturday, Sunday
                          const nextWednesday = new Date(today);
                          nextWednesday.setDate(today.getDate() + (7 - dayOfWeek + 3));
                          return nextWednesday.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          });
                        }
                      })()}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-blue-300 font-semibold mb-3 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    💡 Why Wednesday & Thursday?
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Weekly reports are scheduled mid-week to give you time to reflect on your progress 
                    and plan for the remainder of the week.
                  </p>
                </div>
              </div>
            )}

            {historyItems.length > 0 && (
              <EmptyReportState
                title="View Previous Reports"
                description="Check out your previous weekly reports while you wait for the next submission window."
                icon={<BarChart3 className="w-16 h-16" />}
                actionText="View Recent Reports"
                onAction={() => handleReportSelect(historyItems[0])}
              />
            )}
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
          title="Weekly Reports History"
          emptyMessage="No weekly reports submitted yet. Submit your first report to see it here."
          reportType="weekly"
          onRefresh={() => refetchReports()}
        />
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 order-1 md:order-2 h-[60vh] md:h-screen overflow-hidden">
        {renderRightContent()}
      </div>
    </div>
  );
} 