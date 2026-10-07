import React, { useEffect, useState } from 'react';
import { progressService } from '../services/apiServices';
import { UserStatisticsResponse, MonthlyProgressResponse, WeeklyProgressResponse } from '../types';
import { WeeklyProgressChart } from '../components/WeeklyProgressChart';
import { ActivityCalendar } from '../components/ActivityCalendar';
import { Award, Flame, Calendar, BookOpen, Clock, Target, TrendingUp, Sparkles } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const [stats, setStats] = useState<UserStatisticsResponse | null>(null);
  const [monthly, setMonthly] = useState<MonthlyProgressResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([progressService.getOverall(), progressService.getMonthly()])
      .then(([statsRes, monthlyRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (monthlyRes.success) setMonthly(monthlyRes.data);
      })
      .catch((err) => console.error('Failed to load progress:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-400">Loading progress analytics...</div>;
  }

  const milestones = [
    { title: 'First Learning Day', desc: 'Completed your first 5 sentences', achieved: (stats?.totalLearningDays || 0) >= 1 },
    { title: '3 Day Streak', desc: 'Consistent 3-day active streak', achieved: (stats?.longestStreak || 0) >= 3 },
    { title: '7 Day Streak', desc: 'One full continuous week', achieved: (stats?.longestStreak || 0) >= 7 },
    { title: '14 Day Streak', desc: 'Two weeks continuous learning', achieved: (stats?.longestStreak || 0) >= 14 },
    { title: '30 Day Streak', desc: 'One full month habit formed', achieved: (stats?.longestStreak || 0) >= 30 },
    { title: '50 Sentences Mastered', desc: 'Learned 50 practical sentences', achieved: (stats?.totalSentencesLearned || 0) >= 50 },
    { title: '100 Sentences Mastered', desc: 'Learned 100 practical sentences', achieved: (stats?.totalSentencesLearned || 0) >= 100 },
    { title: '500 Sentences Milestone', desc: 'Major conversational fluency', achieved: (stats?.totalSentencesLearned || 0) >= 500 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          Analytics & Achievements
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Learning Progress & Milestones
        </h1>
        <p className="font-malayalam text-sm font-semibold text-slate-500 dark:text-slate-400">
          നിങ്ങളുടെ ഇംഗ്ലീഷ് പഠന പുരോഗതിയും നേട്ടങ്ങളും
        </p>
      </div>

      {/* Monthly Highlights Card */}
      {monthly && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Monthly Sentences</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {monthly.totalSentences}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Active Days</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {monthly.activeDays}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Best Day Record</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {monthly.bestLearningDay.sentences} <span className="text-xs font-normal">sentences</span>
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Quiz Average</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-500">
              {monthly.quizAverage !== null ? `${monthly.quizAverage}%` : 'N/A'}
            </span>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeeklyProgressChart />
        <ActivityCalendar />
      </div>

      {/* Achievements and Milestones Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award size={20} className="text-amber-500" />
          Learning Badges & Milestones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                m.achieved
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    m.achieved ? 'bg-amber-500 text-white shadow-glow' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Award size={18} />
                </div>
                {m.achieved && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    Unlocked ✓
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
