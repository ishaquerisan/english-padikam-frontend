import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/apiServices';
import { Sentence, Category, Level, Lesson } from '../../types';
import { AdminNav } from './AdminNav';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  Volume2,
  Layers,
  Filter,
} from 'lucide-react';
import { AudioPlayer } from '../../components/AudioPlayer';

export const AdminSentences: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLessonId = searchParams.get('lessonId')
    ? parseInt(searchParams.get('lessonId')!, 10)
    : undefined;

  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);
  const [lessonId, setLessonId] = useState<number | undefined>(initialLessonId);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // New & Edit Sentence Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    lessonId: 1,
    categoryId: 1,
    levelId: 1,
    englishText: '',
    malayalamText: '',
    pronunciation: '',
    explanation: '',
    usageSituation: '',
    orderNumber: 1,
    status: 'ACTIVE',
  });

  const fetchFilters = async () => {
    try {
      const [catRes, lvlRes, lsnRes] = await Promise.all([
        adminService.getCategories(),
        adminService.getLevels(),
        adminService.getLessons({ limit: 100 }),
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (lvlRes.success) setLevels(lvlRes.data);
      if (lsnRes.success) setLessons(lsnRes.data);
    } catch (err) {
      console.error('Failed to load filter data:', err);
    }
  };

  const fetchSentences = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSentences({
        page,
        limit: 10,
        search,
        categoryId,
        levelId,
        lessonId,
        status: statusFilter || undefined,
      });
      if (res.success) {
        setSentences(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setTotalCount(res.meta.total);
        }
      }
    } catch (err) {
      console.error('Failed to load sentences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchSentences();
  }, [page, search, categoryId, levelId, lessonId, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      lessonId: lessons[0]?.id || 1,
      categoryId: categories[0]?.id || 1,
      levelId: levels[0]?.id || 1,
      englishText: '',
      malayalamText: '',
      pronunciation: '',
      explanation: '',
      usageSituation: '',
      orderNumber: 1,
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (sentence: Sentence) => {
    setEditingId(sentence.id);
    setFormData({
      lessonId: sentence.lessonId || 1,
      categoryId: sentence.categoryId || 1,
      levelId: sentence.levelId || 1,
      englishText: sentence.englishText || '',
      malayalamText: sentence.malayalamText || '',
      pronunciation: sentence.pronunciation || '',
      explanation: sentence.explanation || '',
      usageSituation: sentence.usageSituation || '',
      orderNumber: sentence.orderNumber || 1,
      status: sentence.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleSubmitSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateSentence(editingId, formData);
      } else {
        await adminService.createSentence(formData);
      }
      setShowModal(false);
      fetchSentences();
    } catch (err) {
      console.error('Failed to save sentence:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sentence permanently?')) return;
    try {
      await adminService.deleteSentence(id);
      setSentences((prev) => prev.filter((s) => s.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to delete sentence:', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryId(undefined);
    setLevelId(undefined);
    setLessonId(undefined);
    setStatusFilter('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || categoryId || levelId || lessonId || statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminNav
        title="Sentence Pool Inventory"
        subtitle="Manage all English phrases, Malayalam meanings, audio pronunciation, category tags, and CEFR levels."
        actionButton={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Add New Sentence
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search English or Malayalam..."
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

          {/* Category */}
          <div>
            <select
              value={categoryId || ''}
              onChange={(e) => {
                setCategoryId(e.target.value ? parseInt(e.target.value, 10) : undefined);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <select
              value={levelId || ''}
              onChange={(e) => {
                setLevelId(e.target.value ? parseInt(e.target.value, 10) : undefined);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All CEFR Levels</option>
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.code})
                </option>
              ))}
            </select>
          </div>

          {/* Lesson */}
          <div>
            <select
              value={lessonId || ''}
              onChange={(e) => {
                setLessonId(e.target.value ? parseInt(e.target.value, 10) : undefined);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Lessons</option>
              {lessons.map((lsn) => (
                <option key={lsn.id} value={lsn.id}>
                  Lesson #{lsn.lessonNumber}: {lsn.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{sentences.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalCount}</strong> sentences
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-14">ID</th>
                <th className="p-4">English Sentence</th>
                <th className="p-4">Malayalam Meaning & Pronunciation</th>
                <th className="p-4">Category & Lesson</th>
                <th className="p-4">Level</th>
                <th className="p-4">Audio</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading sentences...
                  </td>
                </tr>
              ) : sentences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No sentences found matching the criteria.
                  </td>
                </tr>
              ) : (
                sentences.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-slate-400">#{s.id}</td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm max-w-sm">
                        {s.englishText}
                      </div>
                      {s.usageSituation && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          💡 {s.usageSituation}
                        </div>
                      )}
                    </td>

                    <td className="p-4 max-w-sm">
                      <div className="font-malayalam text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                        {s.malayalamText}
                      </div>
                      <div className="font-malayalam text-indigo-600 dark:text-indigo-400 text-xs">
                        {s.pronunciation}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {s.category?.name || `Cat #${s.categoryId}`}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {s.lesson ? `Lesson #${s.lesson.id}` : `Lesson #${s.lessonId}`}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                        {s.level?.code || s.level?.name || `Lvl #${s.levelId}`}
                      </span>
                    </td>

                    <td className="p-4">
                      <AudioPlayer text={s.englishText} size="sm" />
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(s)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Sentence"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Sentence"
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

      {/* Add / Edit Sentence Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingId ? `Edit Sentence #${editingId}` : 'Add New Sentence to Pool'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitSentence} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  English Sentence Text *
                </label>
                <input
                  type="text"
                  required
                  value={formData.englishText}
                  onChange={(e) => setFormData({ ...formData, englishText: e.target.value })}
                  placeholder="e.g. Could you please give me directions?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Malayalam Meaning *
                </label>
                <input
                  type="text"
                  required
                  value={formData.malayalamText}
                  onChange={(e) => setFormData({ ...formData, malayalamText: e.target.value })}
                  placeholder="e.g. എനിക്ക് വഴി പറഞ്ഞു തരാമോ?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-malayalam"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Malayalam Pronunciation (Transliteration) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  placeholder="e.g. കുഡ് യു പ്ലീസ് ഗിവ് മീ ഡയറക്ഷൻസ്?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-malayalam"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    CEFR Level
                  </label>
                  <select
                    value={formData.levelId}
                    onChange={(e) =>
                      setFormData({ ...formData, levelId: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {levels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Lesson
                  </label>
                  <select
                    value={formData.lessonId}
                    onChange={(e) =>
                      setFormData({ ...formData, lessonId: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {lessons.map((lsn) => (
                      <option key={lsn.id} value={lsn.id}>
                        Lesson #{lsn.lessonNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Usage Situation
                  </label>
                  <input
                    type="text"
                    value={formData.usageSituation}
                    onChange={(e) => setFormData({ ...formData, usageSituation: e.target.value })}
                    placeholder="e.g. When asking someone for help in town"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Grammar / Context Explanation
                  </label>
                  <input
                    type="text"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="e.g. Polite request using 'could you'"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
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
                  {editingId ? 'Update Sentence' : 'Save Sentence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
