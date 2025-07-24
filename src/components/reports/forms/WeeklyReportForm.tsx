import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  Calendar, 
  Users, 
  BookOpen, 
  Loader2, 
  Lock,
  Heart,
  Target,
  Activity,
  Sparkles,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { WeeklyReportCreateSchema, type WeeklyReportCreateForm } from '@/schemas/reports.schemas';
import { useCreateWeeklyReport } from '@/hooks/useReports';

// Use the schema type for form validation
type WeeklyReportFormData = WeeklyReportCreateForm;

const MOOD_OPTIONS = [
  { value: 1, label: 'Very Poor', emoji: '😞', color: 'from-red-600 to-red-700', description: 'Extremely challenging week' },
  { value: 2, label: 'Poor', emoji: '😔', color: 'from-orange-600 to-red-600', description: 'Difficult week with setbacks' },
  { value: 3, label: 'Average', emoji: '😐', color: 'from-gray-600 to-gray-700', description: 'Steady progress, some ups and downs' },
  { value: 4, label: 'Good', emoji: '😊', color: 'from-green-600 to-blue-600', description: 'Productive week with achievements' },
  { value: 5, label: 'Excellent', emoji: '🎉', color: 'from-emerald-500 to-blue-500', description: 'Outstanding week!' },
];

interface WeeklyReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const WeeklyReportForm: React.FC<WeeklyReportFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goals, setGoals] = useState<string[]>(['']);
  const [weeklyRoutineStatus, setWeeklyRoutineStatus] = useState<'yes' | 'no' | 'other'>('yes');
  const [weeklyGoalsStatus, setWeeklyGoalsStatus] = useState<'yes' | 'no' | 'other'>('yes');
  const [weeklyRoutineOther, setWeeklyRoutineOther] = useState('');
  const [weeklyGoalsOther, setWeeklyGoalsOther] = useState('');

  // Mutation for creating weekly report
  const createWeeklyReport = useCreateWeeklyReport();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<WeeklyReportFormData>({
    resolver: zodResolver(WeeklyReportCreateSchema),
    defaultValues: {
      moodRating: 3,
      moodExplanation: '',
      significantEvent: '',
      newInterestingLearning: '',
      maintainWeeklyRoutine: {
        status: true,
        details: '',
      },
      achievedGoals: {
        goals: [''],
        shared: false,
      },
      freeTime: {
        status: false,
        details: '',
      },
      productProgress: '',
      courseChapter: '',
      learningGoalAchievement: {
        status: false,
        details: '',
      },
      mentorInteraction: {
        status: false,
        details: '',
      },
      supportInteraction: {
        status: false,
        details: '',
      },
      additionalSupport: '',
      openQuestions: '',
    },
  });

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
    setValue('moodRating', moodValue);
  };

  const handleAddGoal = () => {
    const newGoals = [...goals, ''];
    setGoals(newGoals);
    setValue('achievedGoals.goals', newGoals);
  };

  const handleRemoveGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      setGoals(newGoals);
      setValue('achievedGoals.goals', newGoals);
    }
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
    setValue('achievedGoals.goals', newGoals);
  };

  // Form submission handler
  const onSubmit = async (data: WeeklyReportFormData) => {
    setIsSubmitting(true);
    try {
      // Process the form data
      const formData = {
        ...data,
        maintainWeeklyRoutine: {
          status: weeklyRoutineStatus === 'yes',
          details: weeklyRoutineStatus === 'other' ? weeklyRoutineOther : data.maintainWeeklyRoutine.details,
        },
        achievedGoals: {
          ...data.achievedGoals,
          status: weeklyGoalsStatus === 'yes',
          otherDetails: weeklyGoalsStatus === 'other' ? weeklyGoalsOther : '',
        },
      };
      
      await createWeeklyReport.mutateAsync(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit weekly report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMoodOption = MOOD_OPTIONS.find(m => m.value === selectedMood);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Weekly Overview
            </h1>
          </div>
          
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-indigo-300 font-medium text-lg mb-2">
              📊 Time to reflect on your week!
            </p>
            <p className="text-slate-300">
              Share your progress, achievements, and insights from this week's journey.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Weekly Mood */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span>How was your week overall?</span>
              </CardTitle>
              <p className="text-slate-400 ml-13">Rate your overall experience and mood for this week</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-4">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedMood === mood.value
                          ? 'border-white bg-gradient-to-br ' + mood.color + ' shadow-lg shadow-indigo-500/30'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                        {mood.emoji}
                      </div>
                      <div className="text-xs text-slate-300 font-medium">{mood.value}/5</div>
                      <div className="text-xs text-slate-400 mt-1">{mood.label}</div>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
                    <span className="text-indigo-300 font-medium text-lg">
                      {selectedMoodOption?.description}
                    </span>
                  </div>
                )}
                
                {/* Mood Explanation */}
                <div className="space-y-3">
                  <Label className="text-slate-300 text-sm font-medium">Explain your mood rating</Label>
                  <Textarea
                    {...register('moodExplanation')}
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px] rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="What made this week feel this way? Share your thoughts about your overall experience..."
                  />
                  {errors.moodExplanation && (
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.moodExplanation.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning & Growth */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span>Learning & Professional Growth</span>
              </CardTitle>
              <p className="text-slate-400 ml-13">Share your professional learning and development this week</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* New Interesting Learning */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-lg font-medium">What new and interesting things did you learn?</Label>
                <Textarea
                  {...register('newInterestingLearning')}
                  className="bg-blue-500/10 border-2 border-blue-500/50 text-white min-h-[100px] rounded-xl focus:border-blue-400 focus:ring-blue-400/20 transition-all resize-none backdrop-blur-sm"
                  placeholder="Share your key learnings, insights, skills acquired, or knowledge gained this week..."
                />
                {errors.newInterestingLearning && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.newInterestingLearning.message}
                  </p>
                )}
              </div>

              {/* Significant Event */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-lg font-medium">Any significant events or milestones?</Label>
                <Textarea
                  {...register('significantEvent')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Major achievements, breakthroughs, challenges overcome, or important events..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Routine and Goals */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>Routine & Goal Achievement</span>
              </CardTitle>
              <p className="text-slate-400 ml-13">Review your weekly routine and goal accomplishments</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Routine Question */}
                <div className="space-y-6">
                  <h3 className="text-white text-lg font-medium">Did you maintain your weekly routine?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="routine-yes"
                        name="weeklyRoutine"
                        checked={weeklyRoutineStatus === 'yes'}
                        onChange={() => setWeeklyRoutineStatus('yes')}
                        className="w-4 h-4 text-green-500 border-slate-600 bg-slate-700 focus:ring-green-500/20"
                      />
                      <Label htmlFor="routine-yes" className="text-white">Yes</Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="routine-no"
                        name="weeklyRoutine"
                        checked={weeklyRoutineStatus === 'no'}
                        onChange={() => setWeeklyRoutineStatus('no')}
                        className="w-4 h-4 text-red-500 border-slate-600 bg-slate-700 focus:ring-red-500/20"
                      />
                      <Label htmlFor="routine-no" className="text-white">No</Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="routine-other"
                        name="weeklyRoutine"
                        checked={weeklyRoutineStatus === 'other'}
                        onChange={() => setWeeklyRoutineStatus('other')}
                        className="w-4 h-4 text-blue-500 border-slate-600 bg-slate-700 focus:ring-blue-500/20"
                      />
                      <Label htmlFor="routine-other" className="text-white">Partially / Other</Label>
                    </div>
                  </div>

                  {weeklyRoutineStatus === 'other' && (
                    <Textarea
                      value={weeklyRoutineOther}
                      onChange={(e) => setWeeklyRoutineOther(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder="Please explain your routine situation this week..."
                    />
                  )}
                  
                  {weeklyRoutineStatus !== 'other' && (
                    <Textarea
                      {...register('maintainWeeklyRoutine.details')}
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all resize-none"
                      placeholder="Share details about your weekly routine..."
                    />
                  )}
                </div>

                {/* Weekly Goals Question */}
                <div className="space-y-6">
                  <h3 className="text-white text-lg font-medium">Did you achieve your weekly goals?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="goals-yes"
                        name="weeklyGoals"
                        checked={weeklyGoalsStatus === 'yes'}
                        onChange={() => setWeeklyGoalsStatus('yes')}
                        className="w-4 h-4 text-green-500 border-slate-600 bg-slate-700 focus:ring-green-500/20"
                      />
                      <Label htmlFor="goals-yes" className="text-white">Yes</Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="goals-no"
                        name="weeklyGoals"
                        checked={weeklyGoalsStatus === 'no'}
                        onChange={() => setWeeklyGoalsStatus('no')}
                        className="w-4 h-4 text-red-500 border-slate-600 bg-slate-700 focus:ring-red-500/20"
                      />
                      <Label htmlFor="goals-no" className="text-white">No</Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="goals-other"
                        name="weeklyGoals"
                        checked={weeklyGoalsStatus === 'other'}
                        onChange={() => setWeeklyGoalsStatus('other')}
                        className="w-4 h-4 text-blue-500 border-slate-600 bg-slate-700 focus:ring-blue-500/20"
                      />
                      <Label htmlFor="goals-other" className="text-white">Partially / Other</Label>
                    </div>
                  </div>

                  {weeklyGoalsStatus === 'other' && (
                    <Textarea
                      value={weeklyGoalsOther}
                      onChange={(e) => setWeeklyGoalsOther(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder="Please explain your goal achievement this week..."
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achieved Goals */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl">Goals Achieved This Week</span>
                    <div className="text-sm text-slate-400 font-normal">
                      List your accomplishments and achievements
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGoal}
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <Input
                          value={goal}
                          onChange={(e) => handleGoalChange(index, e.target.value)}
                          className="h-14 bg-slate-700/50 border-slate-600 text-white rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all text-lg"
                          placeholder={`Achievement ${index + 1}: What did you accomplish this week?`}
                        />
                      </div>
                      {goals.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveGoal(index)}
                          className="border-red-500 text-red-400 hover:bg-red-500/20 w-12 h-12 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Goal Sharing */}
                <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      {...register('achievedGoals.shared')}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <Label className="text-emerald-300 font-medium">
                      I'm comfortable sharing these achievements with my mentor/team
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Management */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span>Time Management & Balance</span>
              </CardTitle>
              <p className="text-slate-400 ml-13">How did you manage your time and achieve work-life balance?</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Free Time */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Did you have enough free time this week?</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('freeTime.status')}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500/20"
                  />
                  <Label className="text-white">Yes, I had adequate free time</Label>
                </div>
                <Textarea
                  {...register('freeTime.details')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-purple-500 focus:ring-purple-500/20 transition-all resize-none"
                  placeholder="Describe how you spent your free time or what prevented you from having enough..."
                />
              </div>

              {/* Learning Goal Achievement */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Did you achieve your learning goals?</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('learningGoalAchievement.status')}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
                  />
                  <Label className="text-white">Yes, I achieved my learning goals</Label>
                </div>
                <Textarea
                  {...register('learningGoalAchievement.details')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Details about your learning progress and achievements..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Support and Interactions */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span>Support & Mentorship</span>
              </CardTitle>
              <p className="text-slate-400 ml-13">Your interactions with mentors and support team</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mentor Interaction */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Did you interact with your mentor this week?</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('mentorInteraction.status')}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500/20"
                  />
                  <Label className="text-white">Yes, I had mentor interaction</Label>
                </div>
                <Textarea
                  {...register('mentorInteraction.details')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-orange-500 focus:ring-orange-500/20 transition-all resize-none"
                  placeholder="Describe your mentor interactions, guidance received, or topics discussed..."
                />
              </div>

              {/* Support Interaction */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Did you interact with the support team?</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('supportInteraction.status')}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500/20"
                  />
                  <Label className="text-white">Yes, I had support team interaction</Label>
                </div>
                <Textarea
                  {...register('supportInteraction.details')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all resize-none"
                  placeholder="Describe your support team interactions and any assistance received..."
                />
              </div>

              {/* Additional Support */}
              <div className="space-y-3">
                <Label className="text-white text-lg font-medium">What additional support do you need?</Label>
                <Textarea
                  {...register('additionalSupport')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-yellow-500 focus:ring-yellow-500/20 transition-all resize-none"
                  placeholder="Any support, resources, or assistance you need going forward..."
                />
              </div>

              {/* Open Questions */}
              <div className="space-y-3">
                <Label className="text-white text-lg font-medium">Any open questions or concerns?</Label>
                <Textarea
                  {...register('openQuestions')}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px] rounded-xl focus:border-red-500 focus:ring-red-500/20 transition-all resize-none"
                  placeholder="Questions, concerns, or topics you'd like to discuss..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Progress - Currently Locked */}
          <Card className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-xl opacity-60">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-white text-lg font-medium">Project Progress</h3>
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm">
                  Share with us your weekly progress on your personal project
                </p>
                
                <div className="flex items-center justify-center py-8">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
                <p className="text-center text-slate-500 text-sm">
                  This section will be available in future updates
                </p>
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
                className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700/50 h-14 px-8 rounded-xl transition-all hover:scale-105"
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white ml-auto h-14 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Submitting Weekly Report...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Submit Weekly Report
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