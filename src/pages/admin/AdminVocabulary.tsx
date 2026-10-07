import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/apiServices';
import { Vocabulary } from '../../types';
import { AdminNav } from './AdminNav';
import { AudioPlayer } from '../../components/AudioPlayer';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  BookOpen,
  Volume2,
  Sparkles,
} from 'lucide-react';

const PARTS_OF_SPEECH = [
  'Noun',
  'Verb',
  'Adjective',
  'Adverb',
  'Pronoun',
  'Preposition',
  'Conjunction',
  'Interjection',
  'Phrase / Idiom',
];

export const AdminVocabulary: React.FC = () => {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [search, setSearch] = useState<string>('');
  const [partOfSpeech, setPartOfSpeech] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    word: '',
    phonetic: '',
    partOfSpeech: 'Noun',
    malayalamMeaning: '',
    englishMeaning: '',
    exampleSentence: '',
  });

  const fetchVocabularies = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVocabularies({
        page,
        limit: 10,
        search,
        partOfSpeech: partOfSpeech || undefined,
      });
      if (res.success) {
        setVocabularies(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setTotalCount(res.meta.total);
        }
      }
    } catch (err) {
      console.error('Failed to load vocabularies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabularies();
  }, [page, search, partOfSpeech]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      word: '',
      phonetic: '',
      partOfSpeech: 'Noun',
      malayalamMeaning: '',
      englishMeaning: '',
      exampleSentence: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (v: Vocabulary) => {
    setEditingId(v.id);
    setFormData({
      word: v.word || '',
      phonetic: v.phonetic || '',
      partOfSpeech: v.partOfSpeech || 'Noun',
      malayalamMeaning: v.malayalamMeaning || '',
      englishMeaning: v.englishMeaning || '',
      exampleSentence: v.exampleSentence || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateVocabulary(editingId, formData);
      } else {
        await adminService.createVocabulary(formData);
      }
      setShowModal(false);
      fetchVocabularies();
    } catch (err) {
      console.error('Failed to save vocabulary:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vocabulary word?')) return;
    try {
      await adminService.deleteVocabulary(id);
      setVocabularies((prev) => prev.filter((v) => v.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to delete vocabulary word:', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setPartOfSpeech('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || partOfSpeech);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminNav
        title="Vocabulary & Word Bank"
        subtitle="Manage vocabulary words, phonetics, parts of speech, Malayalam translations, and example usage."
        actionButton={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Vocabulary Word
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by English word, phonetic, or Malayalam meaning..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Part of Speech Filter */}
          <div>
            <select
              value={partOfSpeech}
              onChange={(e) => {
                setPartOfSpeech(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Parts of Speech</option>
              {PARTS_OF_SPEECH.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{vocabularies.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalCount}</strong> vocabulary entries
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Vocabulary Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-14">ID</th>
                <th className="p-4">Word & Phonetics</th>
                <th className="p-4">Part of Speech</th>
                <th className="p-4">Malayalam Meaning</th>
                <th className="p-4">English Meaning & Example</th>
                <th className="p-4">Audio</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading vocabulary...
                  </td>
                </tr>
              ) : vocabularies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No vocabulary entries found matching the criteria.
                  </td>
                </tr>
              ) : (
                vocabularies.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-slate-400">#{v.id}</td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {v.word}
                      </div>
                      {v.phonetic && (
                        <div className="text-[11px] font-mono text-slate-400">{v.phonetic}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {v.partOfSpeech || 'Noun'}
                      </span>
                    </td>

                    <td className="p-4 font-malayalam text-emerald-700 dark:text-emerald-400 font-bold text-sm max-w-xs">
                      {v.malayalamMeaning}
                    </td>

                    <td className="p-4 max-w-sm">
                      {v.englishMeaning && (
                        <div className="text-slate-800 dark:text-slate-200 font-semibold">
                          {v.englishMeaning}
                        </div>
                      )}
                      {v.exampleSentence && (
                        <div className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                          "{v.exampleSentence}"
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <AudioPlayer text={v.word} size="sm" />
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(v)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Word"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Word"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-400">
              Page <strong className="text-slate-700 dark:text-slate-300">{page}</strong> of{' '}
              <strong className="text-slate-700 dark:text-slate-300">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Vocabulary Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingId ? `Edit Vocabulary #${editingId}` : 'Add Vocabulary Word'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    English Word *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    placeholder="e.g. Grateful"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Phonetic Transcription
                  </label>
                  <input
                    type="text"
                    value={formData.phonetic}
                    onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
                    placeholder="e.g. /ˈɡreɪtfʊl/"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Part of Speech *
                  </label>
                  <select
                    value={formData.partOfSpeech}
                    onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {PARTS_OF_SPEECH.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Malayalam Meaning *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.malayalamMeaning}
                    onChange={(e) =>
                      setFormData({ ...formData, malayalamMeaning: e.target.value })
                    }
                    placeholder="e.g. നന്ദിയുള്ള"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-malayalam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  English Meaning / Definition
                </label>
                <input
                  type="text"
                  value={formData.englishMeaning}
                  onChange={(e) => setFormData({ ...formData, englishMeaning: e.target.value })}
                  placeholder="e.g. Feeling or showing gratitude; thankful"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Example Sentence
                </label>
                <textarea
                  rows={2}
                  value={formData.exampleSentence}
                  onChange={(e) =>
                    setFormData({ ...formData, exampleSentence: e.target.value })
                  }
                  placeholder="e.g. I am very grateful for all your support."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  {editingId ? 'Update Word' : 'Save Word'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
