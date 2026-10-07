import React, { useEffect, useState } from 'react';
import { dailyService, learningService } from '../services/apiServices';
import { DailyLessonResponse } from '../types';
import { SentenceCard } from '../components/SentenceCard';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
  RotateCcw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export const DailyLessonPage: React.FC = () => {
  const [data, setData] = useState<DailyLessonResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [allFinishedCelebrated, setAllFinishedCelebrated] = useState<boolean>(false);
  const [isCompletingAll, setIsCompletingAll] = useState<boolean>(false);
  const { refreshUser, currentStreak } = useAuth();
  const navigate = useNavigate();

  const fetchLesson = async () => {
    try {
      const res = await dailyService.getToday();
      if (res.success && res.data) {
        setData(res.data);
        // Start from beginning or first unlearned
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to fetch daily lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();

    // Start learning session
    learningService
      .startSession()
      .then((res) => {
        if (res.success && res.data) {
          setSessionId(res.data.id);
          setSessionActive(true);
        }
      })
      .catch((err) => console.error('Failed to start learning session:', err));

    return () => {
      // End session on unmount
      if (sessionId) {
        learningService.endSession({
          sessionId,
          sentencesLearned: 5,
          durationSeconds: 120,
        });
      }
    };
  }, []);

  const handleCompleteCurrentSentence = async (sentenceId: number) => {
    try {
      await learningService.completeSentence(sentenceId);
      await refreshUser();

      // Update local sentence state
      setData((prev) => {
        if (!prev) return null;
        const updated = prev.sentences.map((s) =>
          s.id === sentenceId ? { ...s, isLearned: true, userStatus: 'LEARNED' as const } : s
        );
        const completedCount = updated.filter((s) => s.isLearned).length;
        const isAllDone = completedCount === updated.length;

        if (isAllDone && !allFinishedCelebrated) {
          setAllFinishedCelebrated(true);
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
          });
        }

        return {
          ...prev,
          sentences: updated,
          completedInLesson: completedCount,
          lessonCompleted: isAllDone,
        };
      });
    } catch (err) {
      console.error('Failed to complete sentence:', err);
    }
  };

  // Complete all sentences in today's lesson (triggered when clicking mark as learned on last sentence)
  const handleCompleteLessonBatch = async () => {
    if (!data || isCompletingAll) return;
    setIsCompletingAll(true);

    try {
      for (const sentence of data.sentences) {
        if (!sentence.isLearned) {
          await learningService.completeSentence(sentence.id);
        }
      }

      await refreshUser();

      setData((prev) => {
        if (!prev) return null;
        const updated = prev.sentences.map((s) => ({
          ...s,
          isLearned: true,
          userStatus: 'LEARNED' as const,
        }));

        return {
          ...prev,
          sentences: updated,
          completedInLesson: updated.length,
          lessonCompleted: true,
        };
      });

      setAllFinishedCelebrated(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to complete lesson batch:', err);
    } finally {
      setIsCompletingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
          <Sparkles size={24} />
        </div>
        <p className="text-slate-400 font-bold text-sm">ഇന്നത്തെ 5 വാക്യങ്ങൾ തയ്യാറാക്കുന്നു...</p>
      </div>
    );
  }

  if (!data || data.sentences.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">No sentences available for today</h2>
        <Link to="/dashboard" className="inline-block text-indigo-600 font-bold underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentSentence = data.sentences[currentIndex];
  const isLastSentence = currentIndex === data.sentences.length - 1;
  const isLessonComplete = data.sentences.every((s) => s.isLearned);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 pb-24 md:pb-8">
      {/* Top App Header with Progress Bar */}
      <div className="space-y-3">
        {/* App Bar Top Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Daily Lesson #{data.lesson.lessonNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-orange-500 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-200/60 dark:border-orange-800/60">
            <Flame size={14} className="fill-orange-500" />
            <span>{currentStreak}d</span>
          </div>
        </div>

        {/* Story-style Segmented Progress Bar */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {data.sentences.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className="h-2 rounded-full overflow-hidden transition-all duration-300 relative focus:outline-none"
              title={`Sentence ${idx + 1}`}
            >
              <div
                className={`w-full h-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-indigo-600 dark:bg-indigo-500 shadow-glow'
                    : s.isLearned
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Lesson Titles */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {data.lesson.title}
            </h1>
            <p className="font-malayalam text-xs font-semibold text-slate-500 dark:text-slate-400">
              {data.lesson.malayalamTitle}
            </p>
          </div>
          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {data.sentences.length}
          </span>
        </div>
      </div>

      {/* Main Sentence Flashcard in Interactive Walkthrough Mode */}
      {currentSentence && (
        <SentenceCard
          sentence={currentSentence}
          orderIndex={currentIndex + 1}
          totalInBatch={data.sentences.length}
          showNavControls={true}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < data.sentences.length - 1}
          onPrev={() => setCurrentIndex((c) => Math.max(0, c - 1))}
          onNext={() => setCurrentIndex((c) => Math.min(data.sentences.length - 1, c + 1))}
          onComplete={handleCompleteCurrentSentence}
          isCompleted={currentSentence.isLearned}
          showMarkOnlyOnLast={true}
        />
      )}

      {/* When Viewing the Last Sentence: Show Big Lesson Completion Action if not already complete */}
      {isLastSentence && !isLessonComplete && (
        <div className="glass-panel rounded-2xl p-4 border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 text-center space-y-2">
          <p className="text-xs font-malayalam font-bold text-emerald-800 dark:text-emerald-200">
            നിങ്ങൾ ഇന്നത്തെ 5 വാക്യങ്ങളും വായിച്ചു കഴിഞ്ഞു!
          </p>
          <button
            type="button"
            onClick={handleCompleteLessonBatch}
            disabled={isCompletingAll}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            <span>{isCompletingAll ? 'പൂർത്തിയാക്കുന്നു...' : '✨ Mark All as Learned & Complete Daily Goal'}</span>
          </button>
        </div>
      )}

      {/* Lesson Completed Celebration Banner */}
      {isLessonComplete && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/40 dark:from-slate-900 dark:via-emerald-950/40 dark:to-teal-950/30 text-center space-y-5 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-glow-green">
            <Award size={32} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              🎉 Daily 5 Goal Completed!
            </h2>
            <p className="font-malayalam text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-semibold max-w-md mx-auto">
              അഭിനന്ദനങ്ങൾ! നിങ്ങൾ ഇന്നത്തെ 5 വാക്യങ്ങളും വിജയകരമായി പൂർത്തിയാക്കി. നിങ്ങളുടെ സ്ട്രീക്ക് രേഖപ്പെടുത്തി!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              to="/practice"
              className="px-4 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Award size={16} /> Take Quiz
            </Link>

            <Link
              to="/learn"
              className="px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> Learn 5 More
            </Link>

            <Link
              to="/dashboard"
              className="px-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
