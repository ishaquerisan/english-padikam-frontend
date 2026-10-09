import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dailyService, progressService, learningService } from '../services/apiServices';
import { DailyLessonResponse, UserStatisticsResponse } from '../types';
import { StreakBadge } from '../components/StreakBadge';
import { GoalProgressCard } from '../components/GoalProgressCard';
import { ActivityCalendar } from '../components/ActivityCalendar';
import { WeeklyProgressChart } from '../components/WeeklyProgressChart';
import { SentenceCard } from '../components/SentenceCard';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Flame,
  ArrowRight,
  Layers,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, currentStreak, longestStreak } = useAuth();
  const [dailyData, setDailyData] = useState<DailyLessonResponse | null>(null);
  const [stats, setStats] = useState<UserStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [dailyRes, statsRes] = await Promise.all([
        dailyService.getToday(),
        progressService.getOverall(),
      ]);

      if (dailyRes.success) setDailyData(dailyRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSentenceComplete = async (sentenceId: number) => {
    try {
      await learningService.completeSentence(sentenceId);
      // Refresh dashboard state
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to complete sentence from dashboard:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
          <Sparkles size={24} />
        </div>
        <p className="text-slate-400 font-bold text-sm">ഡാഷ്‌ബോർഡ് ലോഡ് ചെയ്യുന്നു...</p>
      </div>
    );
  }

  const isGoalFinished = dailyData ? dailyData.completedInLesson >= dailyData.goal : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-8">
      {/* Top Greeting & Streak Header (Mobile App Style) */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {getGreeting()}, {user?.name.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-malayalam mt-0.5">
            ഇന്നത്തെ ഇംഗ്ലീഷ് വാക്യങ്ങൾ പഠിക്കൂ
          </p>
        </div>

        <div>
          <StreakBadge currentStreak={currentStreak} longestStreak={longestStreak} size="sm" showDetails />
        </div>
      </div>

      {/* Hero Daily Lesson Quick Action Card (Native Mobile App Card) */}
      {dailyData && (
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-xl shadow-indigo-600/20">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  Daily Lesson #{dailyData.lesson.lessonNumber}
                </span>
                {dailyData.lesson.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-400/30 backdrop-blur-md text-white border border-purple-300/30">
                    {dailyData.lesson.category.name} ({dailyData.lesson.category.malayalamName})
                  </span>
                )}
                {dailyData.lesson.level && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 backdrop-blur-md text-indigo-100 border border-white/10 hidden sm:inline-block">
                    {dailyData.lesson.level.code || dailyData.lesson.level.name}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-indigo-200">
                {dailyData.completedInLesson} of {dailyData.goal} Completed
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {dailyData.lesson.title}
              </h2>
              <p className="font-malayalam text-sm text-indigo-100 font-medium mt-0.5">
                {dailyData.lesson.malayalamTitle}
              </p>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, (dailyData.completedInLesson / dailyData.goal) * 100)}%`,
                }}
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/daily"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-indigo-950 font-black text-sm hover:bg-indigo-50 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} className="text-indigo-600" />
                <span>{isGoalFinished ? 'Review Today\'s 5 Sentences' : 'Start Today\'s 5 Sentences'}</span>
                <ChevronRight size={18} />
              </Link>

              <Link
                to="/learn"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-indigo-900/60 hover:bg-indigo-900/80 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <BookOpen size={16} />
                <span>Extra Learn (10, 15, 20+)</span>
              </Link>
            </div>
          </div>

          {/* Decorative background ambient circles */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-48 h-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
        </div>
      )}

      {/* Goal Progress Detailed Breakdown */}
      {dailyData && (
        <GoalProgressCard
          goal={dailyData.goal}
          todayTotalCompleted={dailyData.todayTotalCompleted}
        />
      )}

      {/* Mobile App Quick Hub Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/daily"
          className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all active:scale-95 flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily 5</h3>
            <p className="text-[11px] text-slate-400 font-malayalam">ദിവസേനയുള്ള 5 വാക്യം</p>
          </div>
        </Link>

        <Link
          to="/learn"
          className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all active:scale-95 flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Extra Learn</h3>
            <p className="text-[11px] text-slate-400 font-malayalam">കൂടുതൽ വാക്യങ്ങൾ</p>
          </div>
        </Link>

        <Link
          to="/practice"
          className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 transition-all active:scale-95 flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2">
            <Award size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quizzes</h3>
            <p className="text-[11px] text-slate-400 font-malayalam">ക്വിസ് പരീക്ഷണം</p>
          </div>
        </Link>

        <Link
          to="/bookmarks"
          className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all active:scale-95 flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
            <Bookmark size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bookmarks</h3>
            <p className="text-[11px] text-slate-400 font-malayalam">സേവ് ചെയ്തവ</p>
          </div>
        </Link>
      </div>

      {/* Overview Statistics Badges */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
              <BookOpen size={15} /> Sentences
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.totalSentencesLearned}
            </div>
            <span className="text-[10px] text-slate-400">Total learned</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-orange-500 text-xs font-bold mb-1">
              <Flame size={15} /> Streak
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.currentStreak} <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[10px] text-slate-400">Best: {stats.longestStreak}d</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
              <Calendar size={15} /> Active Days
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.totalLearningDays}
            </div>
            <span className="text-[10px] text-slate-400">Active days</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-teal-600 text-xs font-bold mb-1">
              <Sparkles size={15} /> Words
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.totalWordsLearned}
            </div>
            <span className="text-[10px] text-slate-400">Vocabulary</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-purple-600 text-xs font-bold mb-1">
              <Clock size={15} /> Time Spent
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.estimatedLearningTime}
            </div>
            <span className="text-[10px] text-slate-400">Estimated</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-pink-600 text-xs font-bold mb-1">
              <Award size={15} /> Quiz Score
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.averageQuizScore}%
            </div>
            <span className="text-[10px] text-slate-400">{stats.totalQuizzes} quizzes</span>
          </div>
        </div>
      )}

      {/* Analytics & Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <WeeklyProgressChart />
        <ActivityCalendar />
      </div>
    </div>
  );
};
