import React from 'react';
import { CheckCircle2, Target, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GoalProgressCardProps {
  goal: number;
  todayTotalCompleted: number;
  className?: string;
  onContinueLearning?: () => void;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goal = 5,
  todayTotalCompleted = 0,
  className = '',
  onContinueLearning,
}) => {
  const isGoalCompleted = todayTotalCompleted >= goal;
  const progressRatio = Math.min(1, todayTotalCompleted / goal);
  const percentage = Math.round(progressRatio * 100);
  const extraLearning = Math.max(0, todayTotalCompleted - goal);

  return (
    <div
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 border ${
        isGoalCompleted
          ? 'border-emerald-300/80 dark:border-emerald-800/80 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20'
          : 'border-slate-200/80 dark:border-slate-800'
      } ${className}`}
    >
      {/* Background glowing gradient */}
      <div
        className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none ${
          isGoalCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${
              isGoalCompleted
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {isGoalCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Daily Goal
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {isGoalCompleted ? `${goal} / ${goal}` : `${todayTotalCompleted} / ${goal}`}
              </span>
              {isGoalCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <Sparkles size={12} /> Goal Completed ✓
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {!isGoalCompleted ? (
            <Link
              to="/daily"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              Learn Today's 5 <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to="/learn"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              Continue Learning <Sparkles size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 relative z-10 mb-4">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isGoalCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-green'
              : 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-glow'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Metrics Row: Today Total and Extra Learning */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-sm relative z-10">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Today's Learning</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {todayTotalCompleted} {todayTotalCompleted === 1 ? 'sentence' : 'sentences'}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Extra Learned</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            +{extraLearning} {extraLearning === 1 ? 'sentence' : 'sentences'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Daily Target: {goal}
          </span>
        </div>
      </div>
    </div>
  );
};
