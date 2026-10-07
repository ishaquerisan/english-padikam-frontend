import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Sparkles,
  BookOpen,
  Award,
  User,
  Bookmark,
  Calendar,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  // Check if current route is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-all"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 h-16 items-center px-2">
        {/* 1. Home / Dashboard */}
        <NavLink
          to="/dashboard"
          className={`flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-90 ${
            isActive('/dashboard')
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <Home size={21} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
            {isActive('/dashboard') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </NavLink>

        {/* 2. Extra Learn */}
        <NavLink
          to="/learn"
          className={`flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-90 ${
            isActive('/learn')
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <BookOpen size={21} strokeWidth={isActive('/learn') ? 2.5 : 2} />
            {isActive('/learn') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Learn</span>
        </NavLink>

        {/* 3. Daily 5 - Center Hero Action */}
        <NavLink
          to="/daily"
          className="flex flex-col items-center justify-center -mt-4 transition-all duration-200 active:scale-95 group"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 ${
              isActive('/daily')
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-indigo-500/40 ring-4 ring-indigo-100 dark:ring-indigo-950'
                : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/30'
            }`}
          >
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <span
            className={`text-[10px] mt-1 font-extrabold ${
              isActive('/daily')
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Daily 5
          </span>
        </NavLink>

        {/* 4. Quizzes / Practice */}
        <NavLink
          to="/practice"
          className={`flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-90 ${
            isActive('/practice')
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <Award size={21} strokeWidth={isActive('/practice') ? 2.5 : 2} />
            {isActive('/practice') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Practice</span>
        </NavLink>

        {/* 5. Profile & Settings */}
        <NavLink
          to="/profile"
          className={`flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-90 ${
            isActive('/profile') || isActive('/bookmarks') || isActive('/history')
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <User size={21} strokeWidth={isActive('/profile') ? 2.5 : 2} />
            {(isActive('/profile') || isActive('/bookmarks') || isActive('/history')) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
