import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Moon, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2,
  Heart,
  Target,
  Activity,
  Star,
  Sparkles,
  Trophy,
  BookOpen,
  Coffee,
  Sunrise
} from 'lucide-react';

import { 
  useSubmitEndOfDayReport, 
  useTodayDailyReport 
} from '@/hooks';
import { EndOfDayUpdateSchema } from '@/schemas/reports.schemas';
import { EndOfDayUpdate } from '@/types';
import { ACTIVITY_CATEGORIES, MOOD_OPTIONS } from '@/utils';



interface EndOfDayReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Enhanced Dependency Block Component
const DailyReportRequiredMessage: React.FC = () => {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Alert Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-bounce">
            <Sunrise className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Required Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            ⏰ Daily Report Required First
          </h1>
          <p className="text-xl text-yellow-400 font-medium">
            You must submit a Daily Report before you can submit the End-of-Day Report.
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-yellow-300">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Why is this required?</span>
          </div>
          
          <div className="text-gray-300 space-y-3 text-left">
            <p>• Your End-of-Day report reflects on the goals set in your Daily Report</p>
            <p>• We need your expected activities to compare with actual activities</p>
            <p>• This ensures proper tracking of your progress and achievements</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <Button
            onClick={() => window.location.href = '/daily-reports'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Coffee className="w-5 h-5 mr-3" />
            Create Daily Report First
            <Sparkles className="w-5 h-5 ml-3" />
          </Button>
          
          <p className="text-gray-400 text-sm">
            Once you've submitted your daily report, you can return here to complete your end-of-day reflection.
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced End-of-Day Completion Status Component
const EndOfDayCompletionStatus: React.FC<{ report: any }> = ({ report }) => {
  const completedGoals = report.dailyGoals?.filter((goal: any) => goal.completed) || [];
  const totalGoals = report.dailyGoals?.length || 0;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Moon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="w-4 h-4 text-yellow-800" />
          </div>
        </div>

        {/* Completion Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            🌙 End-of-Day Complete!
          </h1>
          <p className="text-xl text-purple-400 font-medium">
            Excellent! You've completed your full daily reflection cycle.
          </p>
        </div>

        {/* Day Summary */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Achievement Summary</h3>
          
          {/* Goals Achievement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{completedGoals.length}</div>
              <div className="text-green-300 text-sm">Goals Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{totalGoals}</div>
              <div className="text-blue-300 text-sm">Total Goals</div>
            </div>
            <div className="text-center p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{completionRate}%</div>
              <div className="text-purple-300 text-sm">Success Rate</div>
            </div>
          </div>

          {/* Mood Journey */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
            <div className="text-center">
              <div className="text-2xl mb-1">
                {MOOD_OPTIONS.find(m => m.value === report.mood.startOfDay)?.emoji}
              </div>
              <div className="text-xs text-gray-400">Morning</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                {MOOD_OPTIONS.find(m => m.value === report.mood.endOfDay)?.emoji}
              </div>
              <div className="text-xs text-gray-400">Evening</div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Well done on completing your daily cycle!</span>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-sm">
            Rest well and get ready for another productive day tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};

export const EndOfDayReportForm: React.FC<EndOfDayReportFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check today's daily report status
  const { 
    data: todayReport, 
    exists: reportExists, 
    hasEndOfDay,
    canCreateEndOfDay,
    isLoading: checkingReport,
    error: reportError
  } = useTodayDailyReport();

  // End of day submission mutation
  const submitEndOfDay = useSubmitEndOfDayReport();

  // Form setup with pre-filled data from daily report
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<EndOfDayUpdate>({
    resolver: zodResolver(EndOfDayUpdateSchema),
    defaultValues: {
      mood: { endOfDay: 3 },
      dailyGoals: [],
      actualActivity: [],
      insights: '',
    },
    mode: 'onChange',
  });

  // Field arrays for dynamic fields
  const { 
    fields: actualActivityFields, 
    append: addActualActivity, 
    remove: removeActualActivity 
  } = useFieldArray({
    control,
    name: 'actualActivity',
  });

  // Watch values for real-time updates
  const selectedMood = watch('mood.endOfDay');
  const dailyGoals = watch('dailyGoals');

  // Pre-populate form with daily report data when available
  useEffect(() => {
    if (todayReport && reportExists && canCreateEndOfDay) {
      // Pre-fill daily goals with completion status
      const preFilledGoals = todayReport.dailyGoals?.map((goal: any) => ({
        description: goal.description,
        completed: false,
        completionTime: 15,
      })) || [];
      
      setValue('dailyGoals', preFilledGoals);
      
      // Pre-fill expected activities as actual activities for easy editing
      const preFilledActivities = todayReport.expectedActivity?.map((activity: any) => ({
        duration: activity.duration,
        category: activity.category,
      })) || [];
      
      setValue('actualActivity', preFilledActivities);
    }
  }, [todayReport, reportExists, canCreateEndOfDay, setValue]);

  // Add new actual activity
  const handleAddActualActivity = () => {
    addActualActivity({ duration: 0, category: 'learning' });
  };

  // Calculate completion statistics
  const calculateCompletedGoals = () => {
    return dailyGoals?.filter(goal => goal.completed).length || 0;
  };

  // Form submission handler
  const onSubmit = async (data: EndOfDayUpdate) => {
    if (!todayReport) return;
    
    setIsSubmitting(true);
    try {
      await submitEndOfDay.mutateAsync({
        reportId: todayReport.id,
        data: data
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit end of day report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while checking report
  if (checkingReport) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700/50 rounded-xl">
          <CardContent className="flex items-center justify-center py-12 px-8">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-white font-medium text-lg">Checking daily report status...</h3>
                <p className="text-gray-400 text-sm">Verifying requirements for end-of-day report</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (reportError) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <div>
                <p className="text-red-400 font-medium text-lg">Failed to load daily report</p>
                <p className="text-gray-400 text-sm mt-2">Unable to verify daily report requirements</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No daily report exists - show requirement message
  if (!reportExists || !todayReport) {
    return <DailyReportRequiredMessage />;
  }

  // Already completed end of day - show completion status
  if (hasEndOfDay && !canCreateEndOfDay) {
    return <EndOfDayCompletionStatus report={todayReport} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-blue-900/10">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              End-of-Day Reflection
            </h1>
          </div>
          
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
            <p className="text-purple-300 font-medium text-lg mb-2">
              🌙 Time to reflect on your day!
            </p>
            <p className="text-gray-300">
              Review your goals, track your activities, and reflect on your achievements.
            </p>
          </div>
        </div>

        {/* Daily Report Reference */}
        <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-white text-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span>Your Daily Report Summary</span>
            </CardTitle>
            <p className="text-gray-400 ml-13">Based on your morning planning</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-blue-400">{todayReport.dailyGoals?.length || 0}</div>
                <div className="text-blue-300 text-sm">Goals Set</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-green-400">
                  {todayReport.expectedActivity?.reduce((sum: number, activity: any) => sum + activity.duration, 0) || 0} min
                </div>
                <div className="text-green-300 text-sm">Planned Time</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-purple-400">
                  {MOOD_OPTIONS.find(m => m.value === todayReport.mood.startOfDay)?.emoji}
                </div>
                <div className="text-purple-300 text-sm">Morning Mood</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Evening Mood */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span>How are you feeling now?</span>
              </CardTitle>
              <p className="text-gray-400 ml-13">Reflect on your mood at the end of the day</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-4">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setValue('mood.endOfDay', mood.value)}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedMood === mood.value
                          ? 'border-white bg-gradient-to-br ' + mood.color + ' shadow-lg shadow-purple-500/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/30 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                        {mood.emoji}
                      </div>
                      <div className="text-xs text-gray-300 font-medium">{mood.value}/5</div>
                      <div className="text-xs text-gray-400 mt-1">{mood.label}</div>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                    <span className="text-purple-300 font-medium text-lg">
                      {MOOD_OPTIONS.find(m => m.value === selectedMood)?.description}
                    </span>
                  </div>
                )}
                {errors.mood?.endOfDay && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.mood.endOfDay.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Goals Achievement Review */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl">Goal Achievement</span>
                    <div className="text-sm text-gray-400 font-normal">
                      Mark completed goals and estimated time spent
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-400">
                    {calculateCompletedGoals()}/{dailyGoals?.length || 0}
                  </div>
                  <div className="text-green-300 text-sm">Completed</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyGoals?.map((goal, index) => (
                  <div key={index} className="group">
                    <div className="bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-green-500/50 transition-all p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center pt-1">
                          <input
                            type="checkbox"
                            {...register(`dailyGoals.${index}.completed`)}
                            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500/20"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className={`text-lg font-medium ${goal.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                              {goal.description}
                            </span>
                          </div>
                          
                          <div className="ml-10">
                            <Label className="text-gray-300 text-sm font-medium mb-2 block">
                              Estimated time spent (minutes)
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="480"
                              {...register(`dailyGoals.${index}.completionTime`, {
                                valueAsNumber: true,
                              })}
                              className="h-10 bg-gray-600/50 border-gray-500 text-white rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all"
                              placeholder="15"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-400 italic text-center py-4">No goals found from daily report</p>
                )}
                
                {/* Goal Completion Progress */}
                {dailyGoals && dailyGoals.length > 0 && (
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-medium">Completion Progress</span>
                      <span className="text-green-300 text-sm">
                        {Math.round((calculateCompletedGoals() / dailyGoals.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(calculateCompletedGoals() / dailyGoals.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actual Activities */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl">Actual Activities</span>
                    <div className="text-sm text-gray-400 font-normal">
                      What did you actually spend time on today?
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddActualActivity}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actualActivityFields.map((field, index) => {
                  return (
                    <div key={field.id} className="group">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-blue-500/50 transition-all">
                        <div className="md:col-span-6">
                          <Label className="text-gray-300 text-sm font-medium mb-2 block">Activity Category</Label>
                          <select
                            {...register(`actualActivity.${index}.category` as const)}
                            className="w-full h-12 bg-gray-600/50 border-gray-500 text-white rounded-lg px-3 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          >
                            {ACTIVITY_CATEGORIES.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.icon} {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="md:col-span-4">
                          <Label className="text-gray-300 text-sm font-medium mb-2 block">Actual Duration (minutes)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="720"
                            {...register(`actualActivity.${index}.duration` as const, {
                              valueAsNumber: true,
                            })}
                            className="h-12 bg-gray-600/50 border-gray-500 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            placeholder="60"
                          />
                        </div>
                        
                        <div className="md:col-span-2 flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeActualActivity(index)}
                            className="w-full h-12 border-red-500 text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {actualActivityFields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-xl">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-gray-400 font-medium mb-2">No actual activities recorded yet</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Add activities to track what you actually spent time on today
                    </p>
                    <Button
                      type="button"
                      onClick={handleAddActualActivity}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Activity
                    </Button>
                  </div>
                )}
                
                {actualActivityFields.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300 font-medium">Total Actual Time:</span>
                      <span className="text-blue-400 font-bold text-lg">
                        {actualActivityFields.reduce((sum, _, index) => {
                          const duration = watch(`actualActivity.${index}.duration`) || 0;
                          return sum + duration;
                        }, 0)} minutes
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Insights */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span>Daily Insights & Reflections</span>
              </CardTitle>
              <p className="text-gray-400 ml-13">What did you learn today? Any insights or thoughts to remember?</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  id="insights"
                  {...register('insights')}
                  className="bg-gray-700/50 border-gray-600 text-white min-h-[120px] rounded-xl focus:border-yellow-500 focus:ring-yellow-500/20 transition-all resize-none"
                  placeholder="Reflect on your day: What went well? What could be improved? Any lessons learned or insights gained?"
                />
                {errors.insights && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.insights.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700/50 h-14 px-8 rounded-xl transition-all"
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ml-auto h-14 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Submitting Reflection...
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 mr-3" />
                  Complete End-of-Day
                  <Sparkles className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 