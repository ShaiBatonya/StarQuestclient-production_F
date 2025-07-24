import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Heart,
  Sun,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  Trophy,
  Star,
  Coffee,
  Sunrise
} from 'lucide-react';

import { 
  useCreateDailyReport, 
  useTodayDailyReport,
  useUpdateDailyReport 
} from '@/hooks';
import { DailyReportCreateSchema } from '@/schemas/reports.schemas';
import { DailyReportCreate, ActivityCategory } from '@/types';
import { ACTIVITY_CATEGORIES, MOOD_OPTIONS } from '@/utils';



interface DailyReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Enhanced Daily Report Completion Status Component
const DailyReportCompletionStatus: React.FC<{ report: any }> = ({ report }) => {
  const submissionTime = new Date(report.createdAt);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const hasEndOfDay = !!report.mood?.endOfDay;

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Star className="w-4 h-4 text-yellow-800" />
          </div>
        </div>

        {/* Completion Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            🎉 Daily Report Complete!
          </h1>
          <p className="text-xl text-green-400 font-medium">
            Great job! You've successfully submitted your daily report.
          </p>
        </div>

        {/* Submission Details */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">
              Submitted on {submissionTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              at {submissionTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* End of Day Status */}
          {hasEndOfDay ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  End-of-day reflection completed!
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">
                  Don't forget to complete your end-of-day reflection!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Next Available Time */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sunrise className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Next Daily Report</span>
          </div>
          <p className="text-gray-300">
            You can submit your next daily report tomorrow morning.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Available after {tomorrow.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })} at 12:00 AM
          </p>
        </div>

        {/* Motivational Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Keep up the great work!</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-sm">
            Consistency is key to achieving your goals. See you tomorrow!
          </p>
        </div>
      </div>
    </div>
  );
};



export const DailyReportForm: React.FC<DailyReportFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if today's report already exists
  const { 
    data: todayReport, 
    exists: reportExists, 
    canCreateNew,
    isLoading: checkingExisting,
    error: checkError
  } = useTodayDailyReport();

  // Mutation hooks
  const createDailyReport = useCreateDailyReport();
  const updateDailyReport = useUpdateDailyReport();

  // Form setup
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<DailyReportCreate>({
    resolver: zodResolver(DailyReportCreateSchema),
    defaultValues: {
      wakeupTime: '',
      mood: { startOfDay: 3 },
      morningRoutine: { routine: '' },
      dailyGoals: [{ description: '' }],
      expectedActivity: [],
    },
    mode: 'onChange',
  });

  // Field arrays for dynamic fields
  const { 
    fields: goalFields, 
    append: addGoal, 
    remove: removeGoal 
  } = useFieldArray({
    control,
    name: 'dailyGoals',
  });

  const { 
    fields: activityFields, 
    append: addActivity, 
    remove: removeActivity 
  } = useFieldArray({
    control,
    name: 'expectedActivity',
  });

  // Watch mood value for real-time updates
  const selectedMood = watch('mood.startOfDay');

  // Pre-populate form if report exists and is being edited
  useEffect(() => {
    if (todayReport && reportExists) {
      setValue('wakeupTime', todayReport.wakeupTime);
      if (todayReport.mood.startOfDay) {
        setValue('mood', { startOfDay: todayReport.mood.startOfDay });
      }
      setValue('morningRoutine', todayReport.morningRoutine);
      setValue('dailyGoals', todayReport.dailyGoals);
      // Map activities to ensure proper typing
      const typedActivities = todayReport.expectedActivity.map(activity => ({
        duration: activity.duration,
        category: activity.category as ActivityCategory
      }));
      setValue('expectedActivity', typedActivities);
    }
  }, [todayReport, reportExists, setValue]);

  // Form submission handler
  const onSubmit = async (data: DailyReportCreate) => {
    setIsSubmitting(true);
    try {
      if (reportExists && todayReport) {
        // Update existing report
        await updateDailyReport.mutateAsync({
          reportId: todayReport.id,
          data: {
            wakeupTime: data.wakeupTime,
            mood: data.mood,
            morningRoutine: data.morningRoutine,
            dailyGoals: data.dailyGoals,
            expectedActivity: data.expectedActivity,
          }
        });
      } else {
        // Create new report
        await createDailyReport.mutateAsync(data);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit daily report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new goal
  const handleAddGoal = () => {
    if (goalFields.length < 5) {
      addGoal({ description: '' });
    }
  };

  // Add new activity
  const handleAddActivity = () => {
    addActivity({ duration: 0, category: 'learning' });
  };

  // Loading state while checking existing report
  if (checkingExisting) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700/50 rounded-xl">
          <CardContent className="flex items-center justify-center py-12 px-8">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-white font-medium text-lg">Checking today's report...</h3>
                <p className="text-gray-400 text-sm">Please wait while we load your daily report status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (checkError) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <div>
                <p className="text-red-400 font-medium text-lg">Failed to load report status</p>
                <p className="text-gray-400 text-sm mt-2">Please try refreshing the page</p>
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

  // If report exists and is complete, show completion status
  if (reportExists && todayReport && !canCreateNew) {
    return <DailyReportCompletionStatus report={todayReport} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 space-y-6 sm:space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              {reportExists ? 'Update Your Daily Report' : 'Plan Your Amazing Day'}
            </h1>
          </div>
          
          {!reportExists && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 sm:p-4">
              <p className="text-blue-300 font-medium text-base sm:text-lg mb-2">
                🌟 Ready to create your Daily Report?
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                Set your daily goals, plan your activities, and track your progress toward success!
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8" role="form" aria-label="Daily report submission form">
          {/* Wake-up Time */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="break-words">When did you wake up today?</span>
              </CardTitle>
              <p className="text-gray-400 text-xs sm:text-sm ml-10 sm:ml-13">Track your sleep schedule for better productivity</p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <fieldset className="flex items-center space-x-2 sm:space-x-4">
                <legend className="sr-only">Wake up time selection</legend>
                <Label htmlFor="wakeupTime" className="sr-only">
                  Wake up time
                </Label>
                <Input
                  id="wakeupTime"
                  type="time"
                  {...register('wakeupTime')}
                  className="h-12 sm:h-14 bg-gray-700/50 border-gray-600 text-white text-base sm:text-lg rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                  placeholder="07:00"
                  aria-describedby={errors.wakeupTime ? "wakeup-error" : "wakeup-description"}
                  aria-invalid={!!errors.wakeupTime}
                />
              </fieldset>
              <div id="wakeup-description" className="sr-only">
                Select the time you woke up today to track your sleep schedule
              </div>
              {errors.wakeupTime && (
                <p className="text-red-400 text-xs sm:text-sm flex items-center mt-2" id="wakeup-error" role="alert">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                  <span className="break-words">{errors.wakeupTime.message}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Morning Mood */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="break-words">How are you feeling today?</span>
              </CardTitle>
              <p className="text-gray-400 text-xs sm:text-sm ml-10 sm:ml-13">Your morning mood sets the tone for the entire day</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4 sm:space-y-6">
                <fieldset>
                  <legend className="sr-only">Select your mood rating for today</legend>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4" role="radiogroup" aria-labelledby="mood-label" aria-describedby="mood-description">
                    <div id="mood-label" className="sr-only">Mood rating</div>
                    <div id="mood-description" className="sr-only">Select a number from 1 to 5 representing how you feel today, where 1 is very poor and 5 is excellent</div>
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setValue('mood.startOfDay', mood.value)}
                        className={`group p-3 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                          selectedMood === mood.value
                            ? 'border-white bg-gradient-to-br ' + mood.color + ' shadow-lg shadow-blue-500/30'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-700/30 hover:bg-gray-700/50'
                        }`}
                        role="radio"
                        aria-checked={selectedMood === mood.value}
                        aria-label={`Mood rating ${mood.value} out of 5: ${mood.label} - ${mood.description}`}
                        tabIndex={selectedMood === mood.value ? 0 : -1}
                      >
                        <div className="text-2xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                          {mood.emoji}
                        </div>
                        <div className="text-xs text-gray-300 font-medium">{mood.value}/5</div>
                        <div className="text-xs text-gray-400 mt-1 break-words">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>
                {selectedMood && (
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20" role="status" aria-live="polite">
                    <span className="text-blue-300 font-medium text-sm sm:text-lg break-words">
                      {MOOD_OPTIONS.find(m => m.value === selectedMood)?.description}
                    </span>
                  </div>
                )}
                {errors.mood?.startOfDay && (
                  <p className="text-red-400 text-xs sm:text-sm flex items-center" role="alert">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="break-words">{errors.mood.startOfDay.message}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Morning Routine */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span>Morning Routine</span>
              </CardTitle>
              <p className="text-gray-400 text-xs sm:text-sm ml-10 sm:ml-13">Describe what energizes you in the morning</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="routine" className="sr-only">
                  Describe your morning routine
                </Label>
                <Textarea
                  id="routine"
                  {...register('morningRoutine.routine')}
                  className="bg-gray-700/50 border-gray-600 text-white min-h-[100px] sm:min-h-[120px] rounded-xl focus:border-yellow-500 focus:ring-yellow-500/20 transition-all resize-none text-sm sm:text-base"
                  placeholder="e.g., Meditation, exercise, healthy breakfast, reading, journaling..."
                  aria-describedby={errors.morningRoutine?.routine ? "routine-error" : "routine-description"}
                  aria-invalid={!!errors.morningRoutine?.routine}
                />
                <div id="routine-description" className="sr-only">
                  Describe your morning routine activities that help energize you for the day
                </div>
                {errors.morningRoutine?.routine && (
                  <p className="text-red-400 text-xs sm:text-sm flex items-center" id="routine-error" role="alert">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="break-words">{errors.morningRoutine.routine.message}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-lg sm:text-xl break-words">Daily Goals</span>
                    <div className="text-xs sm:text-sm text-gray-400 font-normal" id="goals-requirements">
                      ({goalFields.length}/5 goals) • Min: 3, Max: 5
                    </div>
                  </div>
                </div>
                {goalFields.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddGoal}
                    className="border-green-500 text-green-400 hover:bg-green-500/20 rounded-lg transition-all flex-shrink-0 ml-2"
                    aria-label="Add new daily goal"
                    aria-describedby="goals-requirements"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Goal</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <fieldset aria-labelledby="goals-legend" aria-describedby="goals-description">
                <legend id="goals-legend" className="sr-only">Daily goals (3-5 required)</legend>
                <div id="goals-description" className="sr-only">
                  Enter 3 to 5 goals you want to achieve today. Each goal should be specific and actionable.
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {goalFields.map((field, index) => (
                    <div key={field.id} className="group">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs sm:text-sm font-bold" aria-hidden="true">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`goal-${index}`} className="sr-only">
                            Goal {index + 1}
                          </Label>
                          <Input
                            {...register(`dailyGoals.${index}.description`)}
                            id={`goal-${index}`}
                            className="h-12 sm:h-14 bg-gray-700/50 border-gray-600 text-white rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all text-sm sm:text-lg"
                            placeholder={`Goal ${index + 1}: What do you want to achieve today?`}
                            aria-describedby={errors.dailyGoals?.[index]?.description ? `goal-error-${index}` : "goals-description"}
                            aria-invalid={!!errors.dailyGoals?.[index]?.description}
                          />
                        </div>
                        {goalFields.length > 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeGoal(index)}
                            className="border-red-500 text-red-400 hover:bg-red-500/20 w-8 h-8 sm:w-12 sm:h-12 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105 flex-shrink-0"
                            aria-label={`Remove goal ${index + 1}`}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        )}
                      </div>
                      {errors.dailyGoals?.[index]?.description && (
                        <p className="text-red-400 text-xs sm:text-sm flex items-center mt-2 ml-10 sm:ml-14" id={`goal-error-${index}`} role="alert">
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                          <span className="break-words">{errors.dailyGoals[index]?.description?.message}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>
            </CardContent>
          </Card>

          {/* Expected Activities */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-lg sm:text-xl break-words">Expected Activities</span>
                    <div className="text-xs sm:text-sm text-gray-400 font-normal">
                      Plan your time allocation for the day
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddActivity}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all flex-shrink-0 ml-2"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Activity</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {activityFields.map((field, index) => {
                  return (
                    <div key={field.id} className="group">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-blue-500/50 transition-all">
                        <div className="lg:col-span-6">
                          <Label className="text-gray-300 text-xs sm:text-sm font-medium mb-2 block">Activity Category</Label>
                          <select
                            {...register(`expectedActivity.${index}.category` as const)}
                            className="w-full h-10 sm:h-12 bg-gray-600/50 border-gray-500 text-white text-sm sm:text-base rounded-lg px-2 sm:px-3 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          >
                            {ACTIVITY_CATEGORIES.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="lg:col-span-4">
                          <Label className="text-gray-300 text-xs sm:text-sm font-medium mb-2 block">Duration (minutes)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="720"
                            {...register(`expectedActivity.${index}.duration` as const, {
                              valueAsNumber: true,
                            })}
                            className="h-10 sm:h-12 bg-gray-600/50 border-gray-500 text-white text-sm sm:text-base rounded-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            placeholder="60"
                          />
                        </div>
                        
                        <div className="lg:col-span-2 flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeActivity(index)}
                            className="w-full h-10 sm:h-12 border-red-500 text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {activityFields.length === 0 && (
                  <div className="text-center py-8 sm:py-12 border-2 border-dashed border-gray-600 rounded-xl">
                    <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-gray-400 font-medium mb-2 text-sm sm:text-base">No activities planned yet</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 break-words">
                      Add activities to track your expected time allocation
                    </p>
                    <Button
                      type="button"
                      onClick={handleAddActivity}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Add Your First Activity
                    </Button>
                  </div>
                )}
                
                {activityFields.length > 0 && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300 font-medium text-sm sm:text-base">Total Planned Time:</span>
                      <span className="text-blue-400 font-bold text-base sm:text-lg">
                        {activityFields.reduce((sum, _, index) => {
                          const duration = watch(`expectedActivity.${index}.duration`) || 0;
                          return sum + duration;
                        }, 0)} minutes
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.expectedActivity && (
                  <p className="text-red-400 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span className="break-words">{errors.expectedActivity.message}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 pt-4 sm:pt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700/50 h-12 sm:h-14 px-6 sm:px-8 rounded-xl transition-all text-sm sm:text-base"
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white sm:ml-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
                  <span className="break-words">{reportExists ? 'Updating Report...' : 'Creating Report...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  <span className="break-words">{reportExists ? 'Update Report' : 'Submit Report'}</span>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 