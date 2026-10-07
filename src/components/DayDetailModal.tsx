import React, { useEffect, useState } from 'react';
import { X, BookOpen, Clock, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { DayDetailResponse, Sentence } from '../types';
import { activityService } from '../services/apiServices';
import { AudioPlayer } from './AudioPlayer';

interface DayDetailModalProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ date, isOpen, onClose }) => {
  const [data, setData] = useState<DayDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !date) return;

    setLoading(true);
    activityService
      .getDayDetail(date)
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((err) => console.error('Failed to load day details:', err))
      .finally(() => setLoading(false));
  }, [isOpen, date]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              Learning Activity Breakdown
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading learning breakdown...</div>
          ) : data ? (
            <>
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
                    <BookOpen size={14} /> Sentences
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.totalSentences}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
                    <Sparkles size={14} /> Words
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.vocabularyLearned}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
                    <Award size={14} /> Quiz Score
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.quizScore !== null ? `${data.quizScore}%` : 'N/A'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                  <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
                    <Clock size={14} /> Est. Time
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.estimatedLearningTimeMinutes}m
                  </span>
                </div>
              </div>

              {/* Sentences List */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                  Sentences Learned on this Day ({data.sentences.length})
                </h4>

                {data.sentences.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No sentences recorded for this date.</p>
                ) : (
                  <div className="space-y-3">
                    {data.sentences.map((sentence, idx) => (
                      <div
                        key={sentence.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                              {sentence.englishText}
                            </span>
                          </div>
                          <p className="font-malayalam text-sm font-semibold text-emerald-700 dark:text-emerald-400 pl-7">
                            {sentence.malayalamText}
                          </p>
                          <p className="font-malayalam text-xs text-slate-500 pl-7">
                            {sentence.pronunciation}
                          </p>
                        </div>
                        <AudioPlayer text={sentence.englishText} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-slate-400">No data found for this date.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
