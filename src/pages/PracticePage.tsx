import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quizService, dailyService } from '../services/apiServices';
import { Quiz, QuizOption } from '../types';
import { Award, CheckCircle2, XCircle, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export const PracticePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [lessonId, setLessonId] = useState<number>(() => {
    const param = searchParams.get('lessonId');
    return param ? parseInt(param, 10) : 1;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { refreshUser } = useAuth();

  const fetchQuizzes = async (lId: number) => {
    setLoading(true);
    try {
      const res = await quizService.getQuizzes(lId);
      if (res.success && res.data && res.data.length > 0) {
        setQuizzes(res.data);
      } else {
        // Fallback to lesson 1
        const fallback = await quizService.getQuizzes(1);
        if (fallback.success) setQuizzes(fallback.data);
      }
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(lessonId);
  }, [lessonId]);

  const handleSubmitOption = async (optionId: number) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
    const currentQuiz = quizzes[currentQuizIndex];

    try {
      const res = await quizService.submitAnswer(currentQuiz.id, optionId);
      if (res.success && res.data) {
        setIsSubmitted(true);
        setIsCorrect(res.data.isCorrect);
        setCorrectOptionId(res.data.correctOptionId);

        if (res.data.isCorrect) {
          setScoreCount((s) => s + 1);
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        }
        await refreshUser();
      }
    } catch (err) {
      console.error('Failed to submit quiz answer:', err);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex((c) => c + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setIsCorrect(null);
      setCorrectOptionId(null);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    }
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setCorrectOptionId(null);
    setScoreCount(0);
    setQuizFinished(false);
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">Loading quiz questions...</div>;
  }

  if (quizzes.length === 0) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">No quiz questions found.</div>;
  }

  const currentQuiz = quizzes[currentQuizIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
            Interactive Quiz
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Lesson #{lessonId} Practice
          </h1>
        </div>

        <div className="flex items-center gap-2 font-bold text-sm text-slate-600 dark:text-slate-300">
          <Award size={18} className="text-amber-500" />
          <span>Score: {scoreCount} / {quizzes.length}</span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Question Index Progress */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>QUESTION {currentQuizIndex + 1} OF {quizzes.length}</span>
            <span>{currentQuiz.questionType.replace(/_/g, ' ')}</span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentQuiz.question}
            </h3>
            {currentQuiz.malayalamQuestion && (
              <p className="font-malayalam text-base font-semibold text-indigo-600 dark:text-indigo-400">
                {currentQuiz.malayalamQuestion}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const isRightAnswer = isSubmitted && opt.id === correctOptionId;
              const isWrongAnswer = isSubmitted && isSelected && !isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSubmitOption(opt.id)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 font-semibold text-sm ${
                    isRightAnswer
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-sm'
                      : isWrongAnswer
                      ? 'bg-red-100 dark:bg-red-950/80 border-red-500 text-red-900 dark:text-red-100'
                      : isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-malayalam text-base">{opt.optionText}</span>
                  </div>

                  {isRightAnswer && <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />}
                  {isWrongAnswer && <XCircle size={20} className="text-red-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {isSubmitted && (
            <div className={`p-4 rounded-2xl text-sm ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'}`}>
              <div className="font-bold mb-1">
                {isCorrect ? '✅ Correct Answer! Great Job!' : '❌ Incorrect.'}
              </div>
              {currentQuiz.explanation && (
                <p className="font-malayalam text-xs">{currentQuiz.explanation}</p>
              )}
            </div>
          )}

          {/* Next button */}
          {isSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                {currentQuizIndex < quizzes.length - 1 ? 'Next Question' : 'Complete Quiz'} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-glow">
            <Award size={32} />
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              You scored {scoreCount} out of {quizzes.length} ({Math.round((scoreCount / quizzes.length) * 100)}%)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Retake Quiz
            </button>
            <button
              type="button"
              onClick={() => setLessonId((l) => l + 1)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              Next Lesson Quiz <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
