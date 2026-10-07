import React, { useState, useRef } from 'react';
import { Sentence } from '../types';
import { AudioPlayer } from './AudioPlayer';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Info,
  Sparkles,
  BookOpen,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { bookmarkService } from '../services/apiServices';
import confetti from 'canvas-confetti';

interface SentenceCardProps {
  sentence: Sentence;
  onComplete?: (sentenceId: number) => Promise<void>;
  isCompleted?: boolean;
  orderIndex?: number;
  totalInBatch?: number;
  showNavControls?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  compact?: boolean;
  // Specific override if needed
  showMarkOnlyOnLast?: boolean;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  onComplete,
  isCompleted = false,
  orderIndex,
  totalInBatch,
  showNavControls = false,
  onNext,
  onPrev,
  hasPrev = false,
  hasNext = false,
  compact = false,
  showMarkOnlyOnLast = true,
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(sentence.isBookmarked || false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [localCompleted, setLocalCompleted] = useState<boolean>(isCompleted || sentence.isLearned || false);

  // Swipe gesture handling for mobile app experience
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasNext && onNext) {
      onNext();
    } else if (isRightSwipe && hasPrev && onPrev) {
      onPrev();
    }
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isBookmarked) {
        await bookmarkService.remove(sentence.id);
        setIsBookmarked(false);
      } else {
        await bookmarkService.add(sentence.id);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleComplete = async () => {
    if (localCompleted || isCompleting) return;
    setIsCompleting(true);
    try {
      if (onComplete) {
        await onComplete(sentence.id);
      }
      setLocalCompleted(true);
      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.75 },
      });
    } catch (err) {
      console.error('Failed to mark sentence complete:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  // Determine if this is the last sentence in the batch
  const isLastSentence = orderIndex !== undefined && totalInBatch !== undefined && orderIndex === totalInBatch;

  // The mark as learned action is only visible if:
  // 1. Not in sequential nav walkthrough mode (e.g. standalone list card), OR
  // 2. We are viewing the LAST sentence in the batch, OR
  // 3. showMarkOnlyOnLast is explicitly false
  const shouldShowMarkAsLearned = !showNavControls || !showMarkOnlyOnLast || isLastSentence || !hasNext;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`glass-panel rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-300 border select-none ${
        localCompleted
          ? 'border-emerald-300 dark:border-emerald-800/60 shadow-glow-green/20'
          : 'border-slate-200/90 dark:border-slate-800 shadow-soft hover:shadow-glow/10'
      }`}
    >
      {/* Top Header Row: Category Badge, Level, Order Index, Bookmark */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          {orderIndex !== undefined && totalInBatch !== undefined && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
              <span>{orderIndex}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span>{totalInBatch}</span>
            </span>
          )}

          {sentence.category && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {sentence.category.name}
            </span>
          )}

          {sentence.level && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
              {sentence.level.code}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {localCompleted && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={13} /> Learned
            </span>
          )}

          <button
            type="button"
            onClick={handleBookmarkToggle}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Sentence'}
            className={`p-2 rounded-full transition-all duration-200 active:scale-90 ${
              isBookmarked
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-500 hover:bg-amber-200'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={20} className="fill-amber-500" /> : <Bookmark size={20} />}
          </button>
        </div>
      </div>

      {/* Primary English Sentence (Visually Dominant) */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            "{sentence.englishText}"
          </h2>
          <AudioPlayer text={sentence.englishText} size="lg" className="flex-shrink-0" />
        </div>
      </div>

      {/* Malayalam Pronunciation Guide */}
      <div className="mb-4 bg-slate-50/90 dark:bg-slate-800/50 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5">
        <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider flex-shrink-0">
          ഉച്ചാരണം:
        </span>
        <p className="font-malayalam font-semibold text-base text-indigo-600 dark:text-indigo-400">
          {sentence.pronunciation}
        </p>
      </div>

      {/* Malayalam Meaning (Clearly Visible & Emphasized) */}
      <div className="mb-5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl p-4 sm:p-5 border border-emerald-200/70 dark:border-emerald-800/60 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
            മലയാള അർത്ഥം (Meaning)
          </span>
        </div>
        <p className="font-malayalam text-xl sm:text-2xl font-bold text-slate-900 dark:text-emerald-100 leading-relaxed">
          {sentence.malayalamText}
        </p>
      </div>

      {/* Detailed Explanation and Usage Section */}
      {!compact && (
        <div className="space-y-3 mb-5 text-sm">
          {sentence.explanation && (
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <Info size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">എപ്പോൾ ഉപയോഗിക്കാം: </span>
                <span className="font-malayalam">{sentence.explanation}</span>
              </div>
            </div>
          )}

          {sentence.usageSituation && (
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <MessageSquare size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">സാഹചര്യം: </span>
                <span>{sentence.usageSituation}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Tags */}
      {sentence.vocabularies && sentence.vocabularies.length > 0 && (
        <div className="mb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-2">
            പ്രധാന വാക്കുകൾ (Vocabulary):
          </span>
          <div className="flex flex-wrap gap-2">
            {sentence.vocabularies.map((v) => (
              <div
                key={v.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 text-xs text-indigo-800 dark:text-indigo-200 font-medium"
              >
                <BookOpen size={13} className="text-indigo-500" />
                <span className="font-bold">{v.word}</span>
                <span className="text-slate-400 font-malayalam">({v.malayalamMeaning})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action and Navigation Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        {showNavControls ? (
          <div className="flex items-center gap-3">
            {/* Previous Button */}
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[48px]"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* If NOT the last sentence, show Next as the primary action */}
            {!shouldShowMarkAsLearned ? (
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 transition-all active:scale-95 min-h-[48px]"
              >
                <span>Next Sentence</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              /* If ON THE LAST SENTENCE, show the prominent "Mark as Learned" section */
              <button
                type="button"
                onClick={handleComplete}
                disabled={localCompleted || isCompleting}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-200 active:scale-95 shadow-lg min-h-[48px] ${
                  localCompleted
                    ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/30 ring-2 ring-emerald-300 dark:ring-emerald-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30 animate-pulse'
                }`}
              >
                {localCompleted ? (
                  <>
                    <CheckCircle2 size={19} />
                    <span>Learned ✓ (പഠിച്ചു കഴിഞ്ഞു)</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={19} />
                    <span>{isCompleting ? 'Marking...' : '✨ Mark as Learned (പഠിച്ചു കഴിഞ്ഞു)'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          /* Standalone Card Mode */
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleComplete}
              disabled={localCompleted || isCompleting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md min-h-[44px] ${
                localCompleted
                  ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              {localCompleted ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Learned ✓</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{isCompleting ? 'Marking...' : 'Mark as Learned'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Mobile Swipe Hint */}
        {showNavControls && (
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2 block sm:hidden font-medium">
            💡 Swipe left/right or tap buttons to navigate
          </p>
        )}
      </div>
    </div>
  );
};
