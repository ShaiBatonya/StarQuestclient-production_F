import React from 'react';
import { X, CheckCircle, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ReportSubmissionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  type: 'success' | 'error';
  reportType: 'daily' | 'weekly' | 'end-of-day';
  submissionDate?: string;
  nextGenerationDate?: string;
  errorMessage?: string;
}

const ReportSubmissionResultModal: React.FC<ReportSubmissionResultModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  type,
  reportType,
  submissionDate,
  nextGenerationDate,
  errorMessage
}) => {
  if (!isOpen) return null;

  const getReportTypeInfo = () => {
    switch (reportType) {
      case 'daily':
        return {
          title: 'Daily Report',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'weekly':
        return {
          title: 'Weekly Report',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        };
      case 'end-of-day':
        return {
          title: 'End of Day Report',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
    }
  };

  const getContent = () => {
    
    if (type === 'success') {
      return {
        title: 'Report has been submitted successfully',
        description: reportType === 'weekly' 
          ? `Your weekly report has been submitted successfully and will be regenerated 7 days from now midnight`
          : `Your ${reportType} report has been submitted successfully and will be regenerated at midnight`,
        icon: <CheckCircle className="w-8 h-8" />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        buttonText: 'Close',
        buttonVariant: 'default' as const
      };
    } else {
      return {
        title: 'Error! Something went wrong',
        description: errorMessage || 'There was an error submitting your report. Please try again.',
        icon: <AlertCircle className="w-8 h-8" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        buttonText: 'Try Again',
        buttonVariant: 'destructive' as const
      };
    }
  };

  const content = getContent();

  const handleButtonClick = () => {
    if (type === 'error' && onRetry) {
      onRetry();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800/95 to-slate-700/95 border border-slate-600/30 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${getReportTypeInfo().bgColor} ${getReportTypeInfo().borderColor} border
            `}>
              <span className={getReportTypeInfo().color}>
                <Calendar className="w-5 h-5" />
              </span>
            </div>
            <h2 className="text-white font-semibold text-lg">
              {content.title}
            </h2>
          </div>
          
          {/* Submission date */}
          {submissionDate && (
            <div className="text-right">
              <div className="text-xs text-slate-400">Submitted</div>
              <div className="text-sm text-white font-medium">
                {format(new Date(submissionDate), 'MMM dd, yyyy')}
              </div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
            ${content.bgColor} ${content.color}
          `}>
            {content.icon}
          </div>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {content.description}
          </p>
          
          {/* Next generation info for success */}
          {type === 'success' && nextGenerationDate && (
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">
                  Next report: {format(new Date(nextGenerationDate), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          )}
          
          {/* Error details for error state */}
          {type === 'error' && errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-xs">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {type === 'error' && (
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
            >
              Cancel
            </Button>
          )}
          
          <Button
            onClick={handleButtonClick}
            className={`flex-1 ${
              type === 'error'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {type === 'error' && onRetry && (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {content.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportSubmissionResultModal; 