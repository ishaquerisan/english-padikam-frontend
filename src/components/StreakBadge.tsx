import React from 'react';
import { Flame, Award, Calendar } from 'lucide-react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  currentStreak,
  longestStreak,
  size = 'md',
  showDetails = false,
}) => {
  const isFireActive = currentStreak > 0;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3.5 py-1.5 text-sm gap-1.5',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`inline-flex items-center font-bold rounded-full transition-all duration-300 border ${
          isFireActive
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 border-orange-300 dark:border-orange-700/60 text-orange-600 dark:text-orange-400 shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
        } ${sizeClasses[size]}`}
      >
        <Flame
          size={iconSizes[size]}
          className={isFireActive ? 'text-orange-500 fill-orange-500 animate-wiggle' : 'text-slate-400'}
        />
        <span>
          {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak
        </span>
      </div>

      {showDetails && longestStreak !== undefined && (
        <div className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Award size={14} className="text-amber-500" />
          <span>Best: {longestStreak} days</span>
        </div>
      )}
    </div>
  );
};
