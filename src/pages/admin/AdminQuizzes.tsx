import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/apiServices';
import { Quiz, Lesson } from '../../types';
import { AdminNav } from './AdminNav';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  X,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'ENG_TO_MAL', label: 'English → Malayalam' },
  { value: 'MAL_TO_ENG', label: 'Malayalam → English' },
  { value: 'FILL_BLANK', label: 'Fill in the Blank' },
  { value: 'CORRECT_SENTENCE', label: 'Sentence Correction' },
  { value: 'VOCAB_MEANING', label: 'Vocabulary Meaning' },
];

export const AdminQuizzes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLessonId = searchParams.get('lessonId')
    ? parseInt(searchParams.get('lessonId')!, 10)
    : undefined;

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState<string>('');
  const [lessonId, setLessonId] = useState<number | undefined>(initialLessonId);
  const [questionType, setQuestionType] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    lessonId: 1,
    questionType: 'ENG_TO_MAL',
    question: '',
    malayalamQuestion: '',
    explanation: '',
    orderNumber: 1,
    options: [
      { optionText: '', malayalamText: '', isCorrect: true, orderNumber: 1 },
      { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 2 },
      { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 3 },
      { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 4 },
    ],
  });

  const fetchLessons = async () => {
    try {
      const res = await adminService.getLessons({ limit: 100 });
      if (res.success) setLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await adminService.getQuizzes({
        page,
        limit: 10,
        search,
        lessonId,
        questionType: questionType || undefined,
      });
      if (res.success) {
        setQuizzes(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setTotalCount(res.meta.total);
        }
      }
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [page, search, lessonId, questionType]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      lessonId: lessons[0]?.id || 1,
      questionType: 'ENG_TO_MAL',
      question: '',
      malayalamQuestion: '',
      explanation: '',
      orderNumber: 1,
      options: [
        { optionText: '', malayalamText: '', isCorrect: true, orderNumber: 1 },
        { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 2 },
        { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 3 },
        { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 4 },
      ],
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (quiz: any) => {
    setEditingId(quiz.id);
    const existingOptions = quiz.options && quiz.options.length === 4
      ? quiz.options
      : [
          { optionText: '', malayalamText: '', isCorrect: true, orderNumber: 1 },
          { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 2 },
          { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 3 },
          { optionText: '', malayalamText: '', isCorrect: false, orderNumber: 4 },
        ];

    setFormData({
      lessonId: quiz.lessonId || (quiz.lesson?.id || 1),
      questionType: quiz.questionType || 'ENG_TO_MAL',
      question: quiz.question || '',
      malayalamQuestion: quiz.malayalamQuestion || '',
      explanation: quiz.explanation || '',
      orderNumber: quiz.orderNumber || 1,
      options: existingOptions.map((opt: any, idx: number) => ({
        optionText: opt.optionText || '',
        malayalamText: opt.malayalamText || '',
        isCorrect: Boolean(opt.isCorrect),
        orderNumber: opt.orderNumber || idx + 1,
      })),
    });
    setShowModal(true);
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      (newOptions[index] as any)[field] = value;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateQuiz(editingId, formData);
      } else {
        await adminService.createQuiz(formData);
      }
      setShowModal(false);
      fetchQuizzes();
    } catch (err) {
      console.error('Failed to save quiz:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this quiz question?')) return;
    try {
      await adminService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setLessonId(undefined);
    setQuestionType('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || lessonId || questionType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminNav
        title="Quizzes & Practice Bank"
        subtitle="Manage interactive multiple choice questions, translations, sentence structure exercises, and answer explanations."
        actionButton={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Create Quiz Question
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
              placeholder="Search question text or explanation..."
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

          {/* Lesson Filter */}
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

          {/* Question Type Filter */}
          <div>
            <select
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Question Types</option>
              {QUESTION_TYPES.map((qt) => (
                <option key={qt.value} value={qt.value}>
                  {qt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result Stats */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-500">
            <span>
              Total: <strong className="text-slate-900 dark:text-white">{totalCount}</strong> questions
            </span>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{quizzes.length}</strong> matching questions
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading quiz questions...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="glass-panel p-16 text-center text-slate-400 rounded-3xl border border-slate-200 dark:border-slate-800">
            <HelpCircle size={36} className="mx-auto mb-2 opacity-40" />
            No quiz questions found matching the criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  {/* Top Bar: Question Type & Lesson */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase">
                      {q.questionType?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Lesson #{q.lesson?.lessonNumber || q.lessonId}
                    </span>
                  </div>

                  {/* Question Title */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {q.question}
                    </h4>
                    {q.malayalamQuestion && (
                      <p className="text-xs font-malayalam text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                        {q.malayalamQuestion}
                      </p>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options?.map((opt: any, idx: number) => (
                      <div
                        key={opt.id || idx}
                        className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                          opt.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate mr-1">
                          {idx + 1}. {opt.optionText}
                        </span>
                        {opt.isCorrect && (
                          <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300 font-medium">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">ID: #{q.id}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(q)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800">
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

      {/* Create / Edit Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingId ? `Edit Quiz #${editingId}` : 'Create New Quiz Question'}
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
                    Lesson *
                  </label>
                  <select
                    value={formData.lessonId}
                    onChange={(e) =>
                      setFormData({ ...formData, lessonId: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {lessons.map((lsn) => (
                      <option key={lsn.id} value={lsn.id}>
                        Lesson #{lsn.lessonNumber}: {lsn.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Question Type *
                  </label>
                  <select
                    value={formData.questionType}
                    onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    {QUESTION_TYPES.map((qt) => (
                      <option key={qt.value} value={qt.value}>
                        {qt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Question Prompt (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Choose the correct Malayalam meaning for: 'Good Morning'"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Malayalam Question (Optional)
                </label>
                <input
                  type="text"
                  value={formData.malayalamQuestion}
                  onChange={(e) =>
                    setFormData({ ...formData, malayalamQuestion: e.target.value })
                  }
                  placeholder="e.g. ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-malayalam"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  Multiple Choice Options (Select radio for the correct answer) *
                </label>
                {formData.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                      opt.isCorrect
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-400'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => handleOptionChange(idx, 'isCorrect', true)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-1"
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      required
                      value={opt.optionText}
                      onChange={(e) => handleOptionChange(idx, 'optionText', e.target.value)}
                      placeholder={`Option ${idx + 1} text`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={opt.malayalamText || ''}
                      onChange={(e) => handleOptionChange(idx, 'malayalamText', e.target.value)}
                      placeholder="Malayalam (opt)"
                      className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-malayalam"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Answer Explanation
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this option is correct to help learners"
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
                  {editingId ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
