import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/apiServices';
import { Lesson, Category, Level } from '../../types';
import { AdminNav } from './AdminNav';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const AdminLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    lessonNumber: 1,
    dayNumber: 1,
    categoryId: 1,
    levelId: 1,
    title: '',
    malayalamTitle: '',
    description: '',
    sentenceCount: 5,
    status: 'ACTIVE',
  });

  const fetchFilters = async () => {
    try {
      const [catRes, lvlRes] = await Promise.all([
        adminService.getCategories(),
        adminService.getLevels(),
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (lvlRes.success) setLevels(lvlRes.data);
    } catch (err) {
      console.error('Failed to load filters:', err);
    }
  };

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await adminService.getLessons({
        page,
        limit: 10,
        search,
        categoryId,
        levelId,
        status: statusFilter || undefined,
      });
      if (res.success) {
        setLessons(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setTotalCount(res.meta.total);
        }
      }
    } catch (err) {
      console.error('Failed to load lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [page, search, categoryId, levelId, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      lessonNumber: totalCount + 1,
      dayNumber: totalCount + 1,
      categoryId: categories[0]?.id || 1,
      levelId: levels[0]?.id || 1,
      title: '',
      malayalamTitle: '',
      description: '',
      sentenceCount: 5,
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (lesson: any) => {
    setEditingId(lesson.id);
    setFormData({
      lessonNumber: lesson.lessonNumber || 1,
      dayNumber: lesson.dayNumber || 1,
      categoryId: lesson.categoryId || (lesson.category?.id || 1),
      levelId: lesson.levelId || (lesson.level?.id || 1),
      title: lesson.title || '',
      malayalamTitle: lesson.malayalamTitle || '',
      description: lesson.description || '',
      sentenceCount: lesson.sentenceCount || 5,
      status: lesson.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateLesson(editingId, formData);
      } else {
        await adminService.createLesson(formData);
      }
      setShowModal(false);
      fetchLessons();
    } catch (err) {
      console.error('Failed to save lesson:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await adminService.deleteLesson(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryId(undefined);
    setLevelId(undefined);
    setStatusFilter('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || categoryId || levelId || statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminNav
        title="Curriculum & Lessons"
        subtitle="Manage progressive daily lessons, topic categorization, and CEFR level alignments."
        actionButton={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Create New Lesson
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              placeholder="Search lesson title or meaning..."
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

          {/* Category Filter */}
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

          {/* Level Filter */}
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

          {/* Status Filter */}
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
            Showing <strong className="text-slate-900 dark:text-white">{lessons.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalCount}</strong> lessons
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

      {/* Lessons Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-16">Lesson #</th>
                <th className="p-4">Title & Malayalam Meaning</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Sentence Pool</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading lessons...
                  </td>
                </tr>
              ) : lessons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No lessons found matching your filters.
                  </td>
                </tr>
              ) : (
                lessons.map((lsn: any) => (
                  <tr
                    key={lsn.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      #{lsn.lessonNumber}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {lsn.title}
                      </div>
                      <div className="font-malayalam text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                        {lsn.malayalamTitle}
                      </div>
                      {lsn.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {lsn.description}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {lsn.category?.name || 'Category'}
                      </div>
                      <div className="text-[11px] font-malayalam text-indigo-500">
                        {lsn.category?.malayalamName}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                        {lsn.level?.code || lsn.level?.name || 'A1'}
                      </span>
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/admin/sentences?lessonId=${lsn.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition-colors"
                        title="View sentences in this lesson"
                      >
                        <BookOpen size={13} />
                        {lsn.sentenceCount || 5} sentences
                        <ExternalLink size={11} className="opacity-70" />
                      </Link>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          lsn.status === 'ACTIVE'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {lsn.status === 'ACTIVE' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {lsn.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(lsn)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(lsn.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Lesson"
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

      {/* Add / Edit Lesson Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingId ? `Edit Lesson #${editingId}` : 'Create New Lesson'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Lesson Number *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.lessonNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, lessonNumber: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Sentence Count
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={formData.sentenceCount}
                    onChange={(e) =>
                      setFormData({ ...formData, sentenceCount: parseInt(e.target.value, 10) || 5 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Lesson Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Asking for Directions & Locations"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Malayalam Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.malayalamTitle}
                  onChange={(e) => setFormData({ ...formData, malayalamTitle: e.target.value })}
                  placeholder="e.g. വഴികളും സ്ഥലങ്ങളും ചോദിച്ചറിയൽ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-malayalam"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {levels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of what the learner will practice in this lesson"
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
                  {editingId ? 'Update Lesson' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
