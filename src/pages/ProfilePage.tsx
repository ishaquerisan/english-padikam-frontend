import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { categoryService, levelService } from '../services/apiServices';
import { Category, Level } from '../types';
import {
  User,
  Mail,
  Target,
  Award,
  CheckCircle2,
  LogOut,
  Save,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateUserData, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [englishLevel, setEnglishLevel] = useState(user?.englishLevel || 'Beginner');
  const [learningGoal, setLearningGoal] = useState(user?.learningGoal || 'Daily Conversation');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 5);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
    levelService.getAll().then((res) => {
      if (res.success && res.data) setLevels(res.data);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);

    try {
      const res = await authService.updateProfile({
        name,
        englishLevel,
        learningGoal,
        dailyGoal,
      });

      if (res.success) {
        updateUserData({ name, englishLevel, learningGoal, dailyGoal });
        setSuccessMessage('Settings and learning preferences saved successfully! (ക്രമീകരണങ്ങൾ സേവ് ചെയ്തു)');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          Account & Learning Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Settings & Preferences
        </h1>
        <p className="font-malayalam text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          നിങ്ങളുടെ ഇംഗ്ലീഷ് പഠന മുൻഗണനകളും വിഭാഗങ്ങളും ക്രമീകരിക്കൂ
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Profile Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <User size={16} /> Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Fixed)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-sm font-semibold text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Learning Preferences Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <SlidersHorizontal size={16} /> Learning Preferences & Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred English Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred English Level
              </label>
              <select
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {levels.length > 0 ? (
                  levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.name}>
                      {lvl.name} ({lvl.code} - {lvl.malayalamName})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Beginner">Beginner (A1 - തുടക്കക്കാർ)</option>
                    <option value="Elementary">Elementary (A2 - പ്രാഥമിക തലം)</option>
                    <option value="Intermediate">Intermediate (B1 - ഇടത്തരം)</option>
                    <option value="Upper Intermediate">Upper Intermediate (B2)</option>
                    <option value="Advanced">Advanced (C1 - വിദഗ്ദ്ധ തലം)</option>
                  </>
                )}
              </select>
            </div>

            {/* Daily Goal Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Goal Sentences
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={5}>5 sentences (Default & Recommended)</option>
                <option value={10}>10 sentences</option>
                <option value={15}>15 sentences</option>
                <option value={20}>20 sentences</option>
                <option value={30}>30 sentences</option>
              </select>
            </div>
          </div>

          {/* Preferred Default Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Focus Category
            </label>
            <select
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Daily Conversation">Daily Conversation (ദൈനംദിന സംഭാഷണം)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.malayalamName})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              This category and level will be prioritized for your personalized daily sentences.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
