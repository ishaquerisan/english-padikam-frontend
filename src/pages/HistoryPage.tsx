import React, { useEffect, useState } from 'react';
import { activityService } from '../services/apiServices';
import { Sentence } from '../types';
import { AudioPlayer } from '../components/AudioPlayer';
import { ActivityCalendar } from '../components/ActivityCalendar';
import { History, Calendar, Filter, BookOpen } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await activityService.getHistory({ filter, page, limit: 20 });
      if (res.success) {
        setHistory(res.data);
        if (res.meta) setTotalPages(res.meta.totalPages);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter, page]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          Activity Logs
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Learning History & Calendar
        </h1>
        <p className="font-malayalam text-sm font-semibold text-slate-500 dark:text-slate-400">
          നിങ്ങൾ ഇതുവരെ പഠിച്ച വാക്യങ്ങളുടെയും ദിനചര്യകളുടെയും പൂർണ്ണ വിവരങ്ങൾ
        </p>
      </div>

      {/* Activity Heatmap Calendar */}
      <ActivityCalendar />

      {/* Filters and History Records */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Sentence Completion Log
          </h2>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            {['today', 'week', 'month', 'all'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filter === f
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading history logs...</div>
        ) : history.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl">
            No learning activities recorded for the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                      {item.activityDate}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {item.sentence?.englishText}
                    </span>
                  </div>
                  <p className="font-malayalam font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                    {item.sentence?.malayalamText}
                  </p>
                  <p className="font-malayalam text-xs text-slate-400">
                    {item.sentence?.pronunciation}
                  </p>
                </div>

                {item.sentence && (
                  <AudioPlayer text={item.sentence.englishText} size="sm" className="flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
