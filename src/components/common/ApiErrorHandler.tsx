import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';

interface ApiError {
  status?: number;
  message?: string;
  code?: string;
  details?: any;
}

interface ApiErrorHandlerProps {
  error: ApiError | Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  showDetails?: boolean;
  level?: 'inline' | 'page' | 'modal';
  className?: string;
}

export const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({
  error,
  onRetry,
  isRetrying = false,
  showDetails = false,
  level = 'inline',
  className = '',
}) => {
  if (!error) return null;

  // Determine error type and appropriate message
  const getErrorInfo = (error: ApiError | Error) => {
    // Network/Connection errors
    if ('status' in error) {
      switch (error.status) {
        case 0:
        case undefined:
          return {
            type: 'network',
            title: 'Connection Error',
            message: 'Unable to connect to the server. Please check your internet connection.',
            icon: <WifiOff className="w-5 h-5" />,
            color: 'red',
            canRetry: true,
          };
        case 400:
          return {
            type: 'validation',
            title: 'Invalid Request',
            message: error.message || 'Please check your input and try again.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'yellow',
            canRetry: false,
          };
        case 401:
          return {
            type: 'auth',
            title: 'Authentication Required',
            message: 'Please log in to continue.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'orange',
            canRetry: false,
          };
        case 403:
          return {
            type: 'permission',
            title: 'Access Denied',
            message: 'You do not have permission to perform this action.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'red',
            canRetry: false,
          };
        case 404:
          return {
            type: 'notfound',
            title: 'Not Found',
            message: 'The requested resource was not found.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'yellow',
            canRetry: false,
          };
        case 429:
          return {
            type: 'ratelimit',
            title: 'Rate Limit Exceeded',
            message: 'Too many requests. Please wait a moment and try again.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'orange',
            canRetry: true,
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: 'server',
            title: 'Server Error',
            message: 'The server is experiencing issues. Please try again later.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'red',
            canRetry: true,
          };
        default:
          return {
            type: 'unknown',
            title: 'Unexpected Error',
            message: error.message || 'An unexpected error occurred.',
            icon: <AlertCircle className="w-5 h-5" />,
            color: 'red',
            canRetry: true,
          };
      }
    }

    // JavaScript/Runtime errors
    return {
      type: 'runtime',
      title: 'Application Error',
      message: error.message || 'An unexpected error occurred in the application.',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'red',
      canRetry: true,
    };
  };

  const errorInfo = getErrorInfo(error);
  const isOnline = navigator.onLine;

  // Inline error display (for components)
  if (level === 'inline') {
    return (
      <div className={`p-4 rounded-lg border border-${errorInfo.color}-500/20 bg-${errorInfo.color}-500/10 ${className}`}>
        <div className="flex items-start space-x-3">
          <div className={`text-${errorInfo.color}-400 mt-0.5`}>
            {errorInfo.icon}
          </div>
          <div className="flex-1">
            <h4 className={`font-medium text-${errorInfo.color}-300`}>
              {errorInfo.title}
            </h4>
            <p className="text-sm text-slate-400 mt-1">
              {errorInfo.message}
            </p>
            
            {!isOnline && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-slate-500">
                <WifiOff className="w-4 h-4" />
                <span>You appear to be offline</span>
              </div>
            )}

            {showDetails && 'status' in error && error.details && (
              <details className="mt-2">
                <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                  Error Details
                </summary>
                <pre className="mt-1 text-xs text-slate-500 font-mono">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </details>
            )}

            {errorInfo.canRetry && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                disabled={isRetrying}
                className={`mt-3 border-${errorInfo.color}-500/30 hover:border-${errorInfo.color}-400`}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Page-level error display
  if (level === 'page') {
    return (
      <div className={`min-h-[400px] flex items-center justify-center p-6 ${className}`}>
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className={`mx-auto w-16 h-16 rounded-full bg-${errorInfo.color}-500/10 flex items-center justify-center mb-6`}>
              <div className={`text-${errorInfo.color}-400 scale-150`}>
                {errorInfo.icon}
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              {errorInfo.title}
            </h2>
            <p className="text-slate-400 mb-6">
              {errorInfo.message}
            </p>

            {!isOnline && (
              <div className="flex items-center justify-center space-x-2 mb-4 text-slate-500">
                <WifiOff className="w-5 h-5" />
                <span>No internet connection</span>
              </div>
            )}

            {errorInfo.canRetry && onRetry && (
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                className="w-full bg-gaming-primary hover:bg-gaming-primary/80"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}

            {showDetails && 'status' in error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-slate-800/50 rounded text-xs font-mono text-slate-400">
                  <div>Status: {'status' in error ? error.status : 'Unknown'}</div>
                  <div>Message: {error.message || 'No message'}</div>
                  {'code' in error && error.code && <div>Code: {error.code}</div>}
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Modal-level error display
  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${className}`}>
      <Card className="max-w-md w-full">
        <CardContent className="text-center py-8">
          <div className={`mx-auto w-16 h-16 rounded-full bg-${errorInfo.color}-500/10 flex items-center justify-center mb-6`}>
            <div className={`text-${errorInfo.color}-400 scale-150`}>
              {errorInfo.icon}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">
            {errorInfo.title}
          </h2>
          <p className="text-slate-400 mb-6">
            {errorInfo.message}
          </p>

          {errorInfo.canRetry && onRetry && (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="w-full bg-gaming-primary hover:bg-gaming-primary/80"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for handling API errors in components
export const useApiErrorHandler = () => {
  const handleApiError = (error: any): ApiError => {
    if (error?.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        code: error.response.data?.code,
        details: error.response.data,
      };
    }

    if (error?.request) {
      return {
        status: 0,
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
      };
    }

    return {
      message: error?.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  };

  return { handleApiError };
}; 