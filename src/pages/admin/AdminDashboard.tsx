import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/apiServices';
import { AdminNav } from './AdminNav';
import {
  Users,
  BookOpen,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  Award,
  Shield,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error('Failed to load admin analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading administrator analytics...</div>;
  }

  if (!data) return null;

  const { overview, engagement, categoryDistribution } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminNav
        title="Platform Analytics & Operations"
        subtitle="Real-time metrics on learners, daily sentences, lessons, and category engagements."
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
            <Users size={16} /> Total Registered Users
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {overview.totalUsers}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">{overview.activeUsers} active accounts</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
            <Activity size={16} /> Today's Active Learners
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {engagement.dau}
          </div>
          <span className="text-[11px] text-slate-400">Daily Active Users (DAU)</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
            <BookOpen size={16} /> Total Sentence Pool
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {overview.totalSentences}
          </div>
          <span className="text-[11px] text-slate-400">{overview.totalLessons} total lessons</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 text-xs font-bold mb-1">
            <TrendingUp size={16} /> Total Sentences Learned
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {overview.totalSentencesLearned}
          </div>
          <span className="text-[11px] text-slate-400">Lifetime completed</span>
        </div>
      </div>

      {/* Engagement Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold">Weekly Active Users (WAU)</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{engagement.wau}</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold">Monthly Active Users (MAU)</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{engagement.mau}</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold">Goal Completion Rate</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{engagement.goalCompletionRate}%</span>
        </div>
      </div>

      {/* Category Sentence Distribution */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Category Sentence Inventory Distribution
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categoryDistribution.map((c: any) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{c.name}</span>
                <span className="text-[11px] font-malayalam text-indigo-600 dark:text-indigo-400">{c.malayalamName}</span>
              </div>
              <span className="text-xs font-extrabold px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {c.sentenceCount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
