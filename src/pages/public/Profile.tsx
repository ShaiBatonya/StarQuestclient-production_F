import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, CheckCircle, Star, Trophy, Shield, Mail, Sparkles, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { AuthService } from '@/services/api/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import avatar assets
import selfi1 from '@/assets/selfi1.png';
import selfi2 from '@/assets/selfi2.png';
import selfi3 from '@/assets/selfi3.png';
import selfi5 from '@/assets/selfi5.png';
import DefaultAvatar from '@/assets/Avatarpng.png';

// Avatar options for selection
const AVATAR_OPTIONS = [
  { id: 'selfi1', src: selfi1, name: 'Explorer' },
  { id: 'selfi2', src: selfi2, name: 'Adventurer' },
  { id: 'selfi3', src: selfi3, name: 'Warrior' },
  { id: 'selfi5', src: selfi5, name: 'Champion' },
  { id: 'default', src: DefaultAvatar, name: 'Classic' },
];

// Level progression mapping
const LEVEL_STAGES = {
  1: { name: 'Cosmic Rookie', planet: 'Earth Station', color: 'text-green-400' },
  2: { name: 'Solar Explorer', planet: 'Moon Base', color: 'text-blue-400' },
  3: { name: 'Nebulae Navigator', planet: 'Mars Colony', color: 'text-purple-400' },
  4: { name: 'Stellar Pilot', planet: 'Jupiter Station', color: 'text-indigo-400' },
  5: { name: 'Galactic Voyager', planet: 'Saturn Ring', color: 'text-cyan-400' },
  6: { name: 'Cosmic Champion', planet: 'Uranus Outpost', color: 'text-emerald-400' },
  7: { name: 'Solaris Minor', planet: 'Neptune Deep', color: 'text-yellow-400' },
  8: { name: 'Solaris Major', planet: 'Pluto Edge', color: 'text-orange-400' },
  9: { name: 'Universe Master', planet: 'Alpha Centauri', color: 'text-red-400' },
  10: { name: 'Cosmic Legend', planet: 'Beyond Reality', color: 'text-pink-400' },
};

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'default');
  const queryClient = useQueryClient();

  // Get current level info
  const currentStage = useMemo(() => {
    const level = user?.level || 1;
    return LEVEL_STAGES[Math.min(level, 10) as keyof typeof LEVEL_STAGES] || LEVEL_STAGES[1];
  }, [user?.level]);

  // Calculate progress to next level (mock calculation)
  const progressToNext = useMemo(() => {
    const stars = user?.stars || 0;
    return Math.min((stars % 100) / 100 * 100, 100);
  }, [user?.stars, user?.level]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { avatar: string }) => {
      const authService = AuthService.getInstance();
      const response = await authService.updateProfile(data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        setUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });

  const handleAvatarSelect = useCallback((avatarId: string) => {
    setSelectedAvatar(avatarId);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (selectedAvatar !== user?.avatar) {
      await updateProfileMutation.mutateAsync({ avatar: selectedAvatar });
    }
  }, [selectedAvatar, user?.avatar, updateProfileMutation]);

  const hasChanges = selectedAvatar !== user?.avatar;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30">
            <User className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 font-medium">User Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Space Profile
          </h1>
          <p className="text-slate-400 text-lg">Customize your cosmic identity</p>
        </div>

        {/* Main Profile Card */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10" />
            
            <div className="relative p-6 sm:p-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                
                {/* Left Column - User Info */}
                <div className="space-y-6 sm:space-y-8">
                  
                  {/* User Basic Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-400 mb-1">Email Address</p>
                        <p className="text-white font-medium truncate text-sm sm:text-base">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-400 mb-1">Current Stage</p>
                        <p className={cn("font-bold text-sm sm:text-base", currentStage.color)}>
                          {currentStage.name}
                        </p>
                        <p className="text-xs text-slate-500">Located at {currentStage.planet}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-slate-400 text-sm">Total Stars</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{user.stars?.toLocaleString() || 0}</p>
                    </div>

                    <div className="bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Zap className="w-5 h-5 text-indigo-400" />
                        <span className="text-slate-400 text-sm">Level</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-indigo-400">{user.level || 1}</p>
                    </div>

                    <div className="bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Trophy className="w-5 h-5 text-emerald-400" />
                        <span className="text-slate-400 text-sm">Badges</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{user.badges?.length || 0}</p>
                    </div>

                    <div className="bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-700/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <span className="text-slate-400 text-sm">Role</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-purple-400 capitalize">{user.role}</p>
                    </div>
                  </div>

                  {/* Progress to Next Level */}
                  <div className="bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-300 font-medium text-sm sm:text-base">Progress to Next Level</span>
                      <span className="text-indigo-400 font-bold">{Math.round(progressToNext)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {100 - Math.round(progressToNext)} stars to next level
                    </p>
                  </div>
                </div>

                {/* Right Column - Avatar Selection */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Choose Your Avatar</h2>
                    <p className="text-slate-400 text-sm sm:text-base">Select your cosmic identity from the available options</p>
                  </div>

                  {/* Current Avatar Preview */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src={AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.src || DefaultAvatar}
                        alt="Selected Avatar"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-indigo-500 shadow-xl shadow-indigo-500/25"
                      />
                      {hasChanges && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium mt-3 text-sm sm:text-base">
                      {AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.name || 'Classic'}
                    </p>
                  </div>

                  {/* Avatar Options Grid */}
                  <div className="grid grid-cols-5 gap-3 sm:gap-4">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className={cn(
                          "relative group transition-all duration-200 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800",
                          "hover:scale-105 active:scale-95 touch-manipulation",
                          selectedAvatar === avatar.id
                            ? "ring-2 ring-indigo-500 scale-105"
                            : "hover:ring-2 hover:ring-slate-600"
                        )}
                      >
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full aspect-square object-cover"
                          loading="lazy"
                        />
                        
                        {/* Overlay */}
                        <div className={cn(
                          "absolute inset-0 transition-all duration-200",
                          selectedAvatar === avatar.id
                            ? "bg-indigo-500/20"
                            : "bg-black/0 group-hover:bg-black/20"
                        )} />

                        {/* Selected Indicator */}
                        {selectedAvatar === avatar.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white drop-shadow-lg animate-scale-in" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Avatar Names */}
                  <div className="grid grid-cols-5 gap-3 sm:gap-4 text-center">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <p
                        key={`${avatar.id}-name`}
                        className={cn(
                          "text-xs font-medium transition-colors duration-200",
                          selectedAvatar === avatar.id
                            ? "text-indigo-400"
                            : "text-slate-500"
                        )}
                      >
                        {avatar.name}
                      </p>
                    ))}
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSaveProfile}
                    disabled={!hasChanges || updateProfileMutation.isPending}
                    className={cn(
                      "w-full py-3 sm:py-4 text-base font-semibold rounded-xl transition-all duration-200",
                      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800",
                      hasChanges && "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                    )}
                  >
                    {updateProfileMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Profile...</span>
                      </div>
                    ) : hasChanges ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Save Changes</span>
                      </div>
                    ) : (
                      <span>No Changes to Save</span>
                    )}
                  </Button>

                  {updateProfileMutation.isSuccess && (
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm font-medium">✨ Profile updated successfully!</p>
                    </div>
                  )}

                  {updateProfileMutation.isError && (
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm font-medium">Failed to update profile. Please try again.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 