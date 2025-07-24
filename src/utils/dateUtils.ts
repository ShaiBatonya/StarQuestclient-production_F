/**
 * Date utility functions for consistent date formatting and manipulation
 */

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' | 'full' = 'short'): string => {
  if (date === null || date === undefined) {
    return 'Invalid Date';
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return dateObj.toLocaleDateString();
  }
};

export const isToday = (date: string | Date): boolean => {
  if (date === null || date === undefined) {
    return false;
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  if (date1 === null || date1 === undefined || date2 === null || date2 === undefined) {
    return false;
  }
  
  const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
    return false;
  }
  
  // Use UTC dates to avoid timezone issues
  const utc1 = new Date(dateObj1.getUTCFullYear(), dateObj1.getUTCMonth(), dateObj1.getUTCDate());
  const utc2 = new Date(dateObj2.getUTCFullYear(), dateObj2.getUTCMonth(), dateObj2.getUTCDate());
  
  return utc1.getTime() === utc2.getTime();
};

export const getRelativeTime = (date: string | Date): string => {
  if (date === null || date === undefined) {
    return 'Invalid Date';
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateObj, 'short');
};

export const getTomorrowDate = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

export const isWeekday = (date: string | Date, allowedDays: string[]): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[dateObj.getDay()];
  
  return allowedDays.includes(currentDay);
}; 