import React from 'react';
import { Star, Crown, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Avatar mapping for different positions
const avatarImages = {
  1: '/src/assets/selfi1.png',
  2: '/src/assets/selfi2.png',
  3: '/src/assets/selfi3.png',
  4: '/src/assets/selfi5.png',
};

// Trophy images for top positions
const trophyImages = {
  1: '/src/assets/first.png',
  2: '/src/assets/second.png',
  3: '/src/assets/third.png',
};

interface LeaderboardUser {
  name: string;
  position: string;
  totalStars: number;
  badgesCount: number;
  rank?: number;
}

interface LeaderboardRowProps {
  user: LeaderboardUser;
  index: number;
  isCurrentUser: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, index, isCurrentUser }) => {
  const rank = user.rank || index + 1;
  
  const getRankIcon = (rank: number) => {
    if (rank <= 3 && trophyImages[rank as keyof typeof trophyImages]) {
      return (
        <img 
          src={trophyImages[rank as keyof typeof trophyImages]} 
          alt={`Rank ${rank}`} 
          className="w-8 h-8 object-contain"
        />
      );
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center bg-slate-700/50 rounded-lg border border-slate-600/50">
        <span className="text-slate-300 font-semibold text-sm">{rank}</span>
      </div>
    );
  };

  const getPositionColor = (position: string) => {
    const colors = {
      'Product Manager': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Backend developer': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'Frontend developer': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Data Scientist': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Full stack developer': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    };
    return colors[position as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isCurrentUser 
          ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 shadow-lg shadow-amber-500/20' 
          : rank <= 3 
            ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 hover:shadow-amber-500/10' 
            : 'border-slate-700/50 bg-slate-800/50 hover:bg-slate-800/70 hover:border-slate-600/50'
      }`}
    >
      {isCurrentUser && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
            You
          </Badge>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="flex-shrink-0">
            {getRankIcon(rank)}
          </div>

          {/* Avatar & Name */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative">
              <img 
                src={avatarImages[Math.min(rank, 4) as keyof typeof avatarImages] || avatarImages[4]} 
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-600/50"
              />
              {rank <= 3 && (
                <div className="absolute -top-1 -right-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-100 truncate">{user.name}</h3>
              <Badge className={`text-xs ${getPositionColor(user.position)}`}>
                {user.position}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 text-right space-y-1">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-slate-100 font-semibold">{user.totalStars}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300 text-sm">{user.badgesCount}</span>
            </div>
          </div>

          {/* Progress Bar (for top users) */}
          {rank <= 10 && (
            <div className="flex-shrink-0 w-20">
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (user.totalStars / Math.max(user.totalStars, 1)) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  currentUserName?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users, currentUserName }) => {
  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        <LeaderboardRow
          key={user.name}
          user={user}
          index={index}
          isCurrentUser={user.name === currentUserName}
        />
      ))}
    </div>
  );
};

export default LeaderboardTable; 