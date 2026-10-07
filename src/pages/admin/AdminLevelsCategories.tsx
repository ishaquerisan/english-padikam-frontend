import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/apiServices';
import { Category, Level } from '../../types';
import { AdminNav } from './AdminNav';
import {
  Layers,
  Award,
  Search,
  BookOpen,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Tag,
} from 'lucide-react';

export const AdminLevelsCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [activeTab, setActiveTab] = useState<'levels' | 'categories'>('levels');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, lvlRes] = await Promise.all([
        adminService.getCategories(),
        adminService.getLevels(),
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (lvlRes.success) setLevels(lvlRes.data);
    } catch (err) {
      console.error('Failed to load levels & categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLevels = levels.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.malayalamName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.malayalamName.toLowerCase().includes(search.toLowerCase()) ||
      c.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminNav
        title="CEFR Levels & Domain Categories"
        subtitle="Explore learning taxonomy, difficulty benchmarks, and functional Malayalam-English domains."
      />

      {/* Toggle Tabs & Search */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Switcher Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('levels');
              setSearch('');
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'levels'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Award size={15} /> CEFR Levels ({levels.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              setSearch('');
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Tag size={15} /> Categories ({categories.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading data...
        </div>
      ) : activeTab === 'levels' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLevels.map((lvl) => (
            <div
              key={lvl.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
                    {lvl.code}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Order #{lvl.orderNumber}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {lvl.name}
                </h3>
                <div className="font-malayalam text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {lvl.malayalamName}
                </div>

                {lvl.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                    {lvl.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Target: <strong className="text-slate-700 dark:text-slate-300">{lvl.targetSentences}</strong> phrases
                </span>

                <Link
                  to={`/admin/sentences?levelId=${lvl.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
                >
                  View Sentences <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cat.icon || '💬'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                    {cat.status || 'ACTIVE'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {cat.name}
                </h3>
                <div className="font-malayalam text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {cat.malayalamName}
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Slug: <strong className="text-slate-700 dark:text-slate-300">{cat.slug}</strong>
                </span>

                <Link
                  to={`/admin/sentences?categoryId=${cat.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
                >
                  View Sentences <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
