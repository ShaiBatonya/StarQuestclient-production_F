import { ActivityCategory } from '@/types';

// Activity categories with colors and icons for consistent UI across report forms
export const ACTIVITY_CATEGORIES = [
  { value: 'learning' as ActivityCategory, label: 'Technical', color: 'bg-red-600', icon: '💻' },
  { value: 'better me' as ActivityCategory, label: 'Baseline', color: 'bg-blue-600', icon: '💪' },
  { value: 'project' as ActivityCategory, label: 'Reading', color: 'bg-purple-600', icon: '📚' },
  { value: 'product refinement' as ActivityCategory, label: 'Product Refinement', color: 'bg-purple-500', icon: '🎯' },
  { value: 'technical sessions' as ActivityCategory, label: 'Technical Sessions', color: 'bg-red-500', icon: '🚀' },
  { value: 'networking' as ActivityCategory, label: 'Networking', color: 'bg-green-500', icon: '🤝' },
] as const;

// Mood options with emoji and styling for mood selection components
export const MOOD_OPTIONS = [
  { 
    value: 1, 
    emoji: '😞', 
    label: 'Very Bad', 
    color: 'from-red-400 to-red-600',
    description: 'Feeling really down today'
  },
  { 
    value: 2, 
    emoji: '😔', 
    label: 'Bad', 
    color: 'from-orange-400 to-red-500',
    description: 'Not feeling great, but managing'
  },
  { 
    value: 3, 
    emoji: '😐', 
    label: 'Okay', 
    color: 'from-yellow-400 to-orange-500',
    description: 'Neutral mood, neither good nor bad'
  },
  { 
    value: 4, 
    emoji: '😊', 
    label: 'Good', 
    color: 'from-green-400 to-blue-500',
    description: 'Feeling positive and ready'
  },
  { 
    value: 5, 
    emoji: '😄', 
    label: 'Excellent', 
    color: 'from-blue-400 to-purple-500',
    description: 'Amazing energy and enthusiasm!'
  },
] as const;

// Type-safe accessors
export const getActivityCategory = (value: ActivityCategory) => {
  return ACTIVITY_CATEGORIES.find(cat => cat.value === value);
};

export const getMoodOption = (value: number) => {
  return MOOD_OPTIONS.find(mood => mood.value === value);
}; 