import React, { useEffect, useState } from 'react';
import { bookmarkService } from '../services/apiServices';
import { Bookmark } from '../types';
import { BookmarkCheck, Trash2, BookOpen } from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';

export const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await bookmarkService.getAll();
      if (res.success) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (sentenceId: number) => {
    try {
      await bookmarkService.remove(sentenceId);
      setBookmarks((prev) => prev.filter((b) => b.sentenceId !== sentenceId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
          Saved Sentences
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          My Bookmarked Sentences
        </h1>
        <p className="font-malayalam text-sm font-semibold text-slate-500 dark:text-slate-400">
          നിങ്ങൾ സേവ് ചെയ്തു വെച്ച പ്രിയപ്പെട്ട വാക്യങ്ങൾ
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading your bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl space-y-3">
          <BookmarkCheck size={32} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No bookmarks yet</h3>
          <p className="text-xs font-malayalam text-slate-500">
            നിങ്ങൾ പഠിക്കുമ്പോൾ ഇഷ്ടപ്പെട്ട വാക്യങ്ങൾ ബുക്ക്‌മാർക്ക് ഐക്കൺ വഴി ഇവിടെ സൂക്ഷിക്കാം
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    "{b.sentence.englishText}"
                  </span>
                </div>
                <p className="font-malayalam font-bold text-base text-emerald-700 dark:text-emerald-400">
                  {b.sentence.malayalamText}
                </p>
                <p className="font-malayalam text-xs text-indigo-600 dark:text-indigo-400">
                  {b.sentence.pronunciation}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <AudioPlayer text={b.sentence.englishText} size="sm" />
                <button
                  type="button"
                  onClick={() => handleRemove(b.sentenceId)}
                  title="Remove bookmark"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
