import { toast } from 'sonner';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// Error interface for consistent error handling
export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  statusCode?: number;
  errorId?: string;
}

/**
 * Parse error response and return structured error
 */
export const parseError = (error: any): AppError => {
  // Handle axios errors
  if (error?.response) {
    const { status, data } = error.response;
    
    // Authentication errors
    if (status === 401) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Your session has expired. Please log in again.',
        statusCode: status,
        errorId: data?.errorId
      };
    }
    
    // Authorization errors
    if (status === 403) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'You don\'t have permission to perform this action.',
        statusCode: status,
        errorId: data?.errorId
      };
    }
    
    // Not found errors
    if (status === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'The requested resource was not found.',
        statusCode: status,
        errorId: data?.errorId
      };
    }
    
    // Validation errors
    if (status === 400) {
      const message = data?.message || 'Invalid request data. Please check your input.';
      return {
        type: ErrorType.VALIDATION,
        message,
        details: data?.details,
        statusCode: status,
        errorId: data?.errorId
      };
    }
    
    // Server errors
    if (status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'A server error occurred. Please try again later.',
        statusCode: status,
        errorId: data?.errorId
      };
    }
    
    // Other HTTP errors
    return {
      type: ErrorType.UNKNOWN,
      message: data?.message || `Request failed with status ${status}`,
      statusCode: status,
      errorId: data?.errorId
    };
  }
  
  // Handle network errors
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network connection failed. Please check your internet connection.',
      details: error.message
    };
  }
  
  // Handle timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Request timed out. Please try again.',
      details: error.message
    };
  }
  
  // Handle generic errors
  return {
    type: ErrorType.UNKNOWN,
    message: error?.message || 'An unexpected error occurred.',
    details: error?.stack
  };
};

/**
 * Show appropriate toast notification based on error type
 */
export const showErrorToast = (error: AppError, showErrorId = false): void => {
  const { type, message, errorId } = error;
  
  let toastMessage = message;
  
  // Add error ID for debugging in development
  if (showErrorId && errorId && import.meta.env.DEV) {
    toastMessage += ` (Error ID: ${errorId})`;
  }
  
  switch (type) {
    case ErrorType.AUTHENTICATION:
      toast.error(toastMessage, {
        duration: 5000,
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/login'
        }
      });
      break;
      
    case ErrorType.AUTHORIZATION:
      toast.error(toastMessage, {
        duration: 4000
      });
      break;
      
    case ErrorType.VALIDATION:
      toast.error(toastMessage, {
        duration: 4000
      });
      break;
      
    case ErrorType.NETWORK:
      toast.error(toastMessage, {
        duration: 6000,
        action: {
          label: 'Retry',
          onClick: () => window.location.reload()
        }
      });
      break;
      
    case ErrorType.SERVER:
      toast.error(toastMessage, {
        duration: 5000
      });
      break;
      
    default:
      toast.error(toastMessage, {
        duration: 4000
      });
  }
};

/**
 * Handle API errors with automatic toast notification
 */
export const handleApiError = (error: any, showErrorId = false): AppError => {
  const parsedError = parseError(error);
  showErrorToast(parsedError, showErrorId);
  return parsedError;
};

/**
 * Validate ObjectId format
 */
export const validateObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Create user-friendly error message for validation errors
 */
export const createValidationError = (field: string, message: string): AppError => ({
  type: ErrorType.VALIDATION,
  message: `${field}: ${message}`,
  details: `Field: ${field}`
});

/**
 * Handle specific ObjectId validation errors
 */
export const handleObjectIdError = (id: string, fieldName: string): AppError => {
  if (!id || id.trim() === '') {
    return createValidationError(fieldName, 'ID is required');
  }
  
  if (!validateObjectId(id)) {
    return createValidationError(fieldName, `Invalid ID format. Expected 24-character hex string, got: ${id.length} characters`);
  }
  
  return {
    type: ErrorType.VALIDATION,
    message: `Invalid ${fieldName} format`,
    details: `ID: ${id}`
  };
};

/**
 * Handle specific email validation errors
 */
export const handleEmailError = (email: string): AppError => {
  if (!email || email.trim() === '') {
    return createValidationError('Email', 'Email address is required');
  }
  
  if (!validateEmail(email)) {
    return createValidationError('Email', 'Please enter a valid email address');
  }
  
  return {
    type: ErrorType.VALIDATION,
    message: 'Invalid email format',
    details: `Email: ${email}`
  };
};

/**
 * Log error for debugging (only in development)
 */
export const logError = (error: AppError, context?: string): void => {
  if (import.meta.env.DEV) {
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
    console.error('Error Type:', error.type);
    console.error('Message:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Error ID:', error.errorId);
    if (error.details) {
      console.error('Details:', error.details);
    }
    console.groupEnd();
  }
}; 