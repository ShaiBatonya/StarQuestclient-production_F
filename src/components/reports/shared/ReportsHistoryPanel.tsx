import React, { useState, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  FileText, 
  AlertCircle,
  ChevronRight,
  Moon,
  Sun,
  BarChart3,
  TrendingUp,
  Star,
  RefreshCw
} from 'lucide-react';

export interface ReportHistoryItem {
  id: string;
  type: 'daily' | 'weekly' | 'end-of-day';
  createdAt: string;
  updatedAt: string;
  status?: 'submitted' | 'pending' | 'completed';
  title?: string;
  hasEndOfDay?: boolean; // For daily reports
}

interface ReportsHistoryPanelProps {
  reports: ReportHistoryItem[];
  selectedReportId?: string;
  onReportSelect: (report: ReportHistoryItem) => void;
  isLoading?: boolean;
  error?: string | null | undefined;
  title: string;
  emptyMessage?: string;
  reportType: 'daily' | 'weekly' | 'end-of-day';
  onRefresh?: () => void; // Add optional refresh callback
}

const getReportIcon = (type: 'daily' | 'weekly' | 'end-of-day') => {
  switch (type) {
    case 'daily':
      return <Sun className="w-4 h-4 text-yellow-400" />;
    case 'weekly':
      return <BarChart3 className="w-4 h-4 text-purple-400" />;
    case 'end-of-day':
      return <Moon className="w-4 h-4 text-indigo-400" />;
  }
};

const getReportGradient = (type: 'daily' | 'weekly' | 'end-of-day') => {
  switch (type) {
    case 'daily':
      return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    case 'weekly':
      return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
    case 'end-of-day':
      return 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30';
  }
};

const getStatusBadge = (report: ReportHistoryItem) => {
  if (report.type === 'daily') {
    return report.hasEndOfDay ? (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-medium px-2 py-0.5 rounded-full">
          Complete
        </Badge>
      </div>
    ) : (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs font-medium px-2 py-0.5 rounded-full">
          Pending
        </Badge>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-medium px-2 py-0.5 rounded-full">
        Submitted
      </Badge>
    </div>
  );
};

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

const HistorySkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
            <div className="space-y-2">
              <div className="w-24 h-3 bg-slate-700 rounded"></div>
              <div className="w-16 h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
          <div className="w-16 h-5 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const ReportsHistoryPanel: React.FC<ReportsHistoryPanelProps> = ({
  reports,
  selectedReportId,
  onReportSelect,
  isLoading = false,
  error = null,
  title,
  emptyMessage = "No reports found",
  reportType,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debug logging to help identify the issue
  React.useEffect(() => {
    console.log(`[ReportsHistoryPanel] ${reportType} reports received:`, {
      count: reports.length,
      reports: reports.map(r => ({
        id: r.id,
        type: r.type,
        createdAt: r.createdAt,
        hasEndOfDay: r.hasEndOfDay,
        idType: typeof r.id,
        idDefined: r.id !== undefined
      }))
    });
  }, [reports, reportType]);

  // Deduplicate reports to prevent duplicate keys and filter reports based on search term
  const filteredReports = useMemo(() => {
    // First, deduplicate reports by ID to prevent key conflicts
    const uniqueReports = reports.reduce((acc, current) => {
      const existing = acc.find(item => item.id === current.id);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as ReportHistoryItem[]);

    if (!searchTerm.trim()) return uniqueReports;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return uniqueReports.filter(report => {
      const dateMatch = formatRelativeDate(report.createdAt).toLowerCase().includes(lowerSearchTerm);
      const typeMatch = report.type.toLowerCase().includes(lowerSearchTerm);
      return dateMatch || typeMatch;
    });
  }, [reports, searchTerm]);

  const handleReportClick = (report: ReportHistoryItem) => {
    onReportSelect(report);
  };

  const completedReports = filteredReports.filter(r => r.hasEndOfDay || r.type !== 'daily').length;
  const totalReports = filteredReports.length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50 backdrop-blur-xl flex flex-col">
      {/* Enhanced Header with Gamification and Refresh Button */}
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getReportGradient(reportType)} border flex items-center justify-center backdrop-blur`}>
              {getReportIcon(reportType)}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{title}</h2>
              <p className="text-slate-400 text-sm">Track your progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {totalReports > 0 && (
              <div className="text-right">
                <div className="text-white font-bold text-sm">{totalReports}</div>
                <div className="text-slate-400 text-xs">Reports</div>
              </div>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh reports"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        {totalReports > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Completion Rate</span>
              <span className="text-emerald-400 font-medium">
                {Math.round((completedReports / totalReports) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(completedReports / totalReports) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Search Bar */}
      {filteredReports.length > 3 && (
        <div className="flex-shrink-0 p-6 border-b border-slate-700/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl backdrop-blur"
            />
          </div>
        </div>
      )}

      {/* Reports List - Internal scrolling area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3">
        {/* Loading State */}
        {isLoading && <HistorySkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-red-400 font-medium mb-2">Failed to load reports</h3>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-white font-medium mb-2">No Reports Yet</h3>
            <p className="text-slate-400 text-sm leading-relaxed px-4">{emptyMessage}</p>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-blue-300 font-medium text-sm">Start Your Journey</span>
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-slate-400 text-xs">Submit your first report to unlock insights and track your growth!</p>
            </div>
          </div>
        )}

        {/* Reports List */}
        {!isLoading && !error && filteredReports.length > 0 && (
          <div className="space-y-3">
            {filteredReports.map((report, index) => (
              <button
                key={`${report.id}-${index}`}
                onClick={() => handleReportClick(report)}
                className={`w-full text-left group transition-all duration-300 ${
                  selectedReportId === report.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50'
                } rounded-xl p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-900/20 hover:scale-[1.02] hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getReportGradient(reportType)} border flex items-center justify-center flex-shrink-0`}>
                      {getReportIcon(reportType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium text-sm mb-1 group-hover:text-blue-300 transition-colors">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-slate-400 text-xs flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatRelativeDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report)}
                    <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                      selectedReportId === report.id 
                        ? 'text-blue-400 rotate-90' 
                        : 'text-slate-500 group-hover:text-slate-400 group-hover:translate-x-0.5'
                    }`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Footer with Stats */}
      {filteredReports.length > 0 && (
        <div className="flex-shrink-0 p-6 border-t border-slate-700/30 bg-gradient-to-r from-slate-800/30 to-slate-800/10 backdrop-blur">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-slate-400">
              <TrendingUp className="w-3 h-3" />
              <span>Keep going!</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-emerald-400">{completedReports}</span>
              </div>
              <div className="text-slate-500">of</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400">{totalReports}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 