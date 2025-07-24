/**
 * Validation utilities for common validation patterns
 */

export const validateEmail = (email: string): boolean => {
  // Email regex that allows short valid emails while rejecting common invalid formats
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
  
  // Additional checks for edge cases, but allow 'a@b.c' format
  if (!email || email.includes(' ') || email.includes('@@') || email.startsWith('@') || email.endsWith('@')) {
    return false;
  }
  
  // Don't allow consecutive dots except in valid positions
  if (email.includes('..')) {
    return false;
  }
  
  // Don't allow starting or ending with dots in local or domain part
  const [local, domain] = email.split('@');
  if (local?.startsWith('.') || local?.endsWith('.') || domain?.startsWith('.') || domain?.endsWith('.')) {
    return false;
  }
  
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateMoodRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

export const validateGoalsArray = (goals: Array<{ description: string }>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (goals.length < 3) {
    errors.push('At least 3 goals are required');
  }
  
  if (goals.length > 5) {
    errors.push('Maximum 5 goals allowed');
  }
  
  const emptyGoals = goals.filter(goal => !goal.description.trim());
  if (emptyGoals.length > 0) {
    errors.push('All goals must have a description');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDuration = (duration: number): boolean => {
  return duration >= 1 && duration <= 720 && Number.isInteger(duration);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
  return uuidRegex.test(id);
}; 