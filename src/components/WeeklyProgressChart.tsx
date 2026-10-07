import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { WeeklyProgressResponse } from '../types';
import { progressService } from '../services/apiServices';

export const WeeklyProgressChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [data, setData] = useState<WeeklyProgressResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    progressService
      .getWeekly()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error('Failed to load weekly progress:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={`glass-panel rounded-3xl p-6 text-center text-slate-400 ${className}`}>Loading weekly progress...</div>;
  }

  if (!data) return null;

  const maxSentences = Math.max(10, ...data.breakdown.map((d) => d.sentences));

  return (
    <div className={`glass-panel rounded-3xl p-6 sm:p-7 relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Weekly Learning Progress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monday to Sunday performance overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
          <TrendingUp size={14} />
          <span>Avg: {data.averagePerDay}/day</span>
        </div>
      </div>

      {/* Bar Chart Visualizer */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-6 pb-2">
        {data.breakdown.map((item) => {
          const heightPercent = Math.max(8, (item.sentences / maxSentences) * 100);
          const isToday = item.date === new Date().toISOString().split('T')[0];

          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Sentences Count Tooltip/Label */}
              <span
                className={`text-xs font-bold transition-all duration-200 ${
                  item.sentences > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 opacity-60'
                }`}
              >
                {item.sentences}
              </span>

              {/* Bar */}
              <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-hidden h-full flex items-end p-1">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    item.sentences > 0
                      ? isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-glow-green'
                        : 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-glow'
                      : 'bg-transparent'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-xs font-semibold ${
                  isToday
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.day.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
        <div>
          <span className="text-slate-400 block">Total Sentences</span>
          <span className="text-base font-bold text-slate-800 dark:text-slate-200">{data.totalSentences}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Active Days</span>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{data.activeDays} / 7</span>
        </div>
        <div>
          <span className="text-slate-400 block">Daily Average</span>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{data.averagePerDay}</span>
        </div>
      </div>
    </div>
  );
};
