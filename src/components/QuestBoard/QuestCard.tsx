import React from 'react';
import { Clock, Star, Users, ChevronRight, Play, Trophy, Sparkles } from 'lucide-react';


import type { Quest } from '@/hooks/useQuests';

interface QuestCardProps {
  quest: Quest;
  onStartQuest: (quest: Quest) => void;
  isUpdating: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onStartQuest, isUpdating }) => {
  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': 
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Intermediate': 
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Advanced': 
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };



  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartQuest(quest);
  };

  return (
    <div
      className={`platform-card p-6 transition-all duration-200 cursor-pointer group ${
        quest.isLocked 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:shadow-xl hover:border-indigo-500/30'
      }`}
    >
      {quest.isLocked && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300 font-medium">Quest Locked</p>
            <p className="text-gray-500 text-sm">Complete previous quests to unlock</p>
          </div>
        </div>
      )}

      {/* Gradient background for high-progress quests */}
      {quest.progress > 50 && !quest.isLocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors flex items-center space-x-2">
              <span>{quest.title}</span>
              {quest.progress === 100 && (
                <Trophy className="w-4 h-4 text-emerald-400" />
              )}
            </h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed line-clamp-2">
              {quest.description}
            </p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {/* Professional Progress */}
        {quest.progress > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Completion</span>
              <span className="text-indigo-400 font-medium">{quest.progress}%</span>
            </div>
            <div className="progress-professional">
              <div
                className="progress-fill-professional"
                style={{ width: `${quest.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Professional Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xs text-slate-400 font-medium">{quest.estimatedTime}</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-amber-400 font-medium">{quest.reward} pts</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xs text-slate-400 font-medium">{quest.participants}</div>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-3 h-3 mr-1.5" />
            {quest.category}
          </span>
        </div>

        {/* Professional Action */}
        <button
          onClick={handleClick}
          disabled={quest.isLocked || isUpdating || quest.progress === 100}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            quest.progress === 100
              ? 'bg-emerald-600 text-white cursor-default'
              : quest.progress > 0
                ? 'btn-primary'
                : 'btn-primary'
          }`}
        >
          {quest.progress === 100 ? (
            <>
              <Trophy className="w-4 h-4" />
              Completed
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {isUpdating ? 'Updating...' : quest.progress > 0 ? 'Continue' : 'Begin Quest'}
              {!isUpdating && <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestCard; 