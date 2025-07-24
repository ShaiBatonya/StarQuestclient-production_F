import React from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ReportSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: 'daily' | 'weekly' | 'end-of-day';
  state: 'first-time' | 'not-submitted' | 'already-submitted';
  submissionDate?: string;
  nextGenerationDate?: string;
}

const ReportSubmissionModal: React.FC<ReportSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  state,
  submissionDate,
  nextGenerationDate
}) => {
  if (!isOpen) return null;

  const getTypeInfo = () => {
    switch (type) {
      case 'daily':
        return {
          title: 'Daily Report',
          icon: <Calendar className="w-6 h-6" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'weekly':
        return {
          title: 'Weekly Report',
          icon: <Calendar className="w-6 h-6" />,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        };
      case 'end-of-day':
        return {
          title: 'End of Day Report',
          icon: <Clock className="w-6 h-6" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
    }
  };

  const getStateContent = () => {
    const typeInfo = getTypeInfo();
    
    switch (state) {
      case 'first-time':
        return {
          title: `Fill out new ${typeInfo.title}`,
          description: `Welcome! Let's start your journey by creating your first ${typeInfo.title.toLowerCase()}.`,
          buttonText: 'Fill New Report',
          icon: <Calendar className="w-8 h-8" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10'
        };
      
      case 'not-submitted':
        return {
          title: `Fill out new ${typeInfo.title}`,
          description: `Ready to document your ${type === 'daily' ? 'day' : type === 'weekly' ? 'week' : 'end of day'}?`,
          buttonText: 'Fill New Report',
          icon: <Calendar className="w-8 h-8" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10'
        };
      
      case 'already-submitted':
        return {
          title: type === 'daily' ? 'Next Report Loading Soon' : 'Next Report Loading Soon',
          description: type === 'daily' 
            ? 'Good work planning out your day, we\'ll see you for the next report tomorrow morning'
            : type === 'weekly'
            ? 'Your weekly report has been submitted successfully and will be regenerated 7 days from now midnight'
            : 'Good work planning out your day, we\'ll see you for the next report tomorrow morning',
          buttonText: 'Close',
          icon: <CheckCircle className="w-8 h-8" />,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10'
        };
    }
  };

  const stateContent = getStateContent();
  const typeInfo = getTypeInfo();

  const handleSubmit = () => {
    if (state === 'already-submitted') {
      onClose();
    } else {
      onSubmit();
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
              ${typeInfo.bgColor} ${typeInfo.borderColor} border
            `}>
              <span className={typeInfo.color}>
                {typeInfo.icon}
              </span>
            </div>
            <h2 className="text-white font-semibold text-lg">
              {stateContent.title}
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
            ${stateContent.bgColor} ${stateContent.color}
          `}>
            {stateContent.icon}
          </div>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {stateContent.description}
          </p>
          
          {/* Next generation info for already submitted */}
          {state === 'already-submitted' && nextGenerationDate && (
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">
                  Next report: {format(new Date(nextGenerationDate), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            className={`flex-1 ${
              state === 'already-submitted'
                ? 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {stateContent.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportSubmissionModal; 