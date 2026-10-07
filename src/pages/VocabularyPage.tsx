import React, { useEffect, useState } from 'react';
import { vocabularyService } from '../services/apiServices';
import { Vocabulary } from '../types';
import { BookOpen, Search, Volume2, Sparkles } from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';

export const VocabularyPage: React.FC = () => {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchVocabulary = async () => {
    setLoading(true);
    try {
      const res = await vocabularyService.getAll({ page, limit: 24, search });
      if (res.success) {
        setVocabularies(res.data);
        if (res.meta) setTotalPages(res.meta.totalPages);
      }
    } catch (err) {
      console.error('Failed to load vocabulary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, [page, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            Word Bank
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Vocabulary Dictionary
          </h1>
          <p className="font-malayalam text-sm font-semibold text-slate-500 dark:text-slate-400">
            നിത്യജീവിതത്തിൽ ഉപയോഗിക്കുന്ന പ്രധാന ഇംഗ്ലീഷ് വാക്കുകളും മലയാള അർത്ഥങ്ങളും
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search words..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Grid of Vocabulary Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading vocabulary bank...</div>
      ) : vocabularies.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl">
          No vocabulary words matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabularies.map((v) => (
            <div
              key={v.id}
              className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {v.word}
                    </h3>
                    {v.partOfSpeech && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {v.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {v.phonetic && (
                    <span className="text-xs font-malayalam text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
                      {v.phonetic}
                    </span>
                  )}
                </div>

                <AudioPlayer text={v.word} size="sm" />
              </div>

              {/* Malayalam Meaning */}
              <div className="bg-teal-50/60 dark:bg-teal-950/40 rounded-xl p-3 border border-teal-200/60 dark:border-teal-900/40">
                <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 block mb-0.5">
                  Malayalam Meaning
                </span>
                <p className="font-malayalam font-bold text-base text-slate-800 dark:text-teal-100">
                  {v.malayalamMeaning}
                </p>
              </div>

              {v.englishMeaning && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {v.englishMeaning}
                </p>
              )}

              {v.exampleSentence && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 italic">
                  "{v.exampleSentence}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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
  );
};
