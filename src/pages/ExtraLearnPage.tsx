import React, { useEffect, useState } from 'react';
import { learningService, categoryService, levelService } from '../services/apiServices';
import { Sentence, Category, Level } from '../types';
import { SentenceCard } from '../components/SentenceCard';
import {
  Sparkles,
  Filter,
  RefreshCw,
  BookOpen,
  LayoutGrid,
  CreditCard,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

export const ExtraLearnPage: React.FC = () => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined);
  const [batchCount, setBatchCount] = useState<number>(5);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const { refreshUser } = useAuth();

  // Temporary filter state inside modal
  const [tempCategory, setTempCategory] = useState<number | undefined>(undefined);
  const [tempLevel, setTempLevel] = useState<number | undefined>(undefined);
  const [tempBatchCount, setTempBatchCount] = useState<number>(5);

  const fetchFilters = async () => {
    try {
      const [catRes, lvlRes] = await Promise.all([
        categoryService.getAll(),
        levelService.getAll(),
      ]);
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (lvlRes.success && lvlRes.data) setLevels(lvlRes.data);
    } catch (err) {
      console.error('Failed to load filter metadata:', err);
    }
  };

  const fetchNextSentences = async () => {
    setLoading(true);
    try {
      const res = await learningService.getNext({
        count: batchCount,
        categoryId: selectedCategory,
        levelId: selectedLevel,
      });
      if (res.success && res.data) {
        setSentences(res.data);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to load extra sentences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchNextSentences();
  }, [selectedCategory, selectedLevel, batchCount]);

  const handleSentenceComplete = async (sentenceId: number) => {
    try {
      await learningService.completeSentence(sentenceId);
      await refreshUser();
      setSentences((prev) =>
        prev.map((s) => (s.id === sentenceId ? { ...s, isLearned: true } : s))
      );
    } catch (err) {
      console.error('Failed to complete sentence:', err);
    }
  };

  const openFilterModal = () => {
    setTempCategory(selectedCategory);
    setTempLevel(selectedLevel);
    setTempBatchCount(batchCount);
    setIsFilterModalOpen(true);
  };

  const applyModalFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedLevel(tempLevel);
    setBatchCount(tempBatchCount);
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedLevel(undefined);
    setTempCategory(undefined);
    setTempLevel(undefined);
    setBatchCount(5);
    setTempBatchCount(5);
    setIsFilterModalOpen(false);
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const activeLevelObj = levels.find((l) => l.id === selectedLevel);
  const hasActiveFilters = selectedCategory !== undefined || selectedLevel !== undefined;
  const isAllBatchLearned = sentences.length > 0 && sentences.every((s) => s.isLearned);
  const currentSentence = sentences[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 pb-24 md:pb-8">
      {/* Top Header Row (Minimal & Clean) */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              Extra Learning
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Practice Sentences
          </h1>
        </div>

        {/* Action Controls: Mode Switch + On-Demand Filter Button */}
        <div className="flex items-center gap-2">
          {/* Flashcard / List Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('flashcard')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
              title="Flashcard Mode"
            >
              <CreditCard size={14} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
              title="List Mode"
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* On-demand Filter & Preferences Button */}
          <button
            type="button"
            onClick={openFilterModal}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
              hasActiveFilters
                ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-200 dark:ring-indigo-900'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={14} className={hasActiveFilters ? 'text-indigo-600' : ''} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            )}
          </button>

          {/* Refresh New Batch Button */}
          <button
            type="button"
            onClick={fetchNextSentences}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-50"
            title="Load New Batch"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Subtle Active Filter Chip (If filter is active) */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Filter:
            </span>
            {activeCategoryObj && (
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
                {activeCategoryObj.name}
              </span>
            )}
            {activeLevelObj && (
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
                {activeLevelObj.code} ({activeLevelObj.name})
              </span>
            )}
            <span className="text-slate-400">({batchCount} sentences)</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openFilterModal}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold mr-1"
            >
              Change
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title="Clear Filter"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Flashcard or List Walkthrough */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-2">
          <RefreshCw size={24} className="animate-spin mx-auto text-indigo-500" />
          <p className="text-xs font-bold">വാക്യങ്ങൾ ലോഡ് ചെയ്യുന്നു...</p>
        </div>
      ) : sentences.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No unlearned sentences matching current filters!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-malayalam max-w-sm mx-auto">
            തിരഞ്ഞെടുത്ത വിഭാഗത്തിലെ വാക്യങ്ങൾ പൂർത്തിയായി. മറ്റ് വിഭാഗം തിരഞ്ഞെടുക്കുകയോ ഫിൽട്ടർ മാറ്റുകയോ ചെയ്യാം.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={openFilterModal}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              Change Category
            </button>
          </div>
        </div>
      ) : viewMode === 'flashcard' ? (
        /* Flashcard Mode */
        <div className="space-y-4">
          {/* Progress dots / bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-400">
              Sentence {currentIndex + 1} of {sentences.length}
            </span>

            <div className="flex items-center gap-1.5">
              {sentences.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-indigo-600'
                      : s.isLearned
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                  title={`Sentence ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Flashcard Sentence Card */}
          {currentSentence && (
            <SentenceCard
              key={currentSentence.id}
              sentence={currentSentence}
              orderIndex={currentIndex + 1}
              totalInBatch={sentences.length}
              showNavControls={true}
              hasPrev={currentIndex > 0}
              hasNext={currentIndex < sentences.length - 1}
              onPrev={() => setCurrentIndex((c) => Math.max(0, c - 1))}
              onNext={() => setCurrentIndex((c) => Math.min(sentences.length - 1, c + 1))}
              onComplete={handleSentenceComplete}
              isCompleted={currentSentence.isLearned}
              showMarkOnlyOnLast={true}
            />
          )}

          {/* If reached last sentence and batch is complete, prompt for next batch */}
          {isAllBatchLearned && (
            <div className="glass-panel rounded-3xl p-6 border border-emerald-300 dark:border-emerald-800 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/40 animate-fade-in shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-glow-green">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                🎉 Batch of {sentences.length} Sentences Completed!
              </h4>
              <p className="font-malayalam text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                നിങ്ങൾ തിരഞ്ഞെടുത്ത വാക്യങ്ങൾ പഠിച്ചു കഴിഞ്ഞു.
              </p>
              <button
                type="button"
                onClick={fetchNextSentences}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all active:scale-95"
              >
                Load Next {batchCount} Sentences →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* List Mode (Vertical Stack) */
        <div className="space-y-4">
          {sentences.map((sentence, idx) => (
            <SentenceCard
              key={sentence.id}
              sentence={sentence}
              orderIndex={idx + 1}
              totalInBatch={sentences.length}
              compact={false}
              onComplete={handleSentenceComplete}
              isCompleted={sentence.isLearned}
              showMarkOnlyOnLast={false}
            />
          ))}

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={fetchNextSentences}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Sparkles size={16} /> Load Next {batchCount} Sentences
            </button>
          </div>
        </div>
      )}

      {/* On-Demand Filter & Preferences Bottom Sheet Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Filter & Learning Options
                  </h3>
                  <p className="text-[11px] text-slate-400 font-malayalam">
                    നിങ്ങൾക്ക് ആവശ്യമുള്ളപ്പോൾ മാത്രം ക്രമീകരിക്കൂ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Level Selector Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. English Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTempLevel(undefined)}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                    tempLevel === undefined
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  All Levels (A1 - C1)
                </button>
                {levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setTempLevel(lvl.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                      tempLevel === lvl.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>{lvl.code}</div>
                    <div className="text-[10px] opacity-80 font-normal">{lvl.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Category (വിഭാഗം)
              </label>
              <div className="relative">
                <select
                  value={tempCategory !== undefined ? tempCategory : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTempCategory(val ? parseInt(val, 10) : undefined);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10 cursor-pointer"
                >
                  <option value="">✨ All 28 Categories (എല്ലാ വിഭാഗങ്ങളും)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.malayalamName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Batch Size Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                3. Sentences per Batch
              </label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTempBatchCount(count)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      tempBatchCount === count
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold"
              >
                Reset
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyModalFilters}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md active:scale-95"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
