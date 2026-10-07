import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StreakBadge } from './StreakBadge';
import {
  Menu,
  X,
  BookOpen,
  Sparkles,
  Award,
  Bookmark,
  History,
  Calendar,
  User as UserIcon,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, currentStreak, longestStreak } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-400/30'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`;

  const publicLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Padikam Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Padikam
              </span>
              <span className="font-malayalam text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                പഠിക്കാം
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClasses}>
                Dashboard
              </NavLink>
              <NavLink to="/daily" className={navLinkClasses}>
                <Sparkles size={16} />
                Daily 5
              </NavLink>
              <NavLink to="/learn" className={navLinkClasses}>
                Extra Learn
              </NavLink>
              <NavLink to="/practice" className={navLinkClasses}>
                Quizzes
              </NavLink>
              <NavLink to="/vocabulary" className={navLinkClasses}>
                Vocabulary
              </NavLink>
              <NavLink to="/activity" className={navLinkClasses}>
                Calendar
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/about" className={publicLinkClasses}>
                About
              </NavLink>
              <NavLink to="/how-it-works" className={publicLinkClasses}>
                How It Works
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Section: Streak Badge, Profile / Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <StreakBadge currentStreak={currentStreak} longestStreak={longestStreak} size="sm" showDetails />

              {/* Admin Badge if admin */}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  title="Admin Control Panel"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isAdminActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/40'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-900'
                  }`}
                >
                  <Shield size={14} />
                  Admin
                </Link>
              )}

              {/* Profile Link */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-300 dark:ring-indigo-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`
                }
                title={user?.name}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </NavLink>

              {/* More Menu Toggle Button for mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="More Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                Log In
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Secondary Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 space-y-1.5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-fade-in shadow-xl">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/bookmarks"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Bookmark size={18} className="text-pink-500" /> Bookmarked Sentences
              </NavLink>
              <NavLink
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <History size={18} className="text-emerald-500" /> Learning History
              </NavLink>
              <NavLink
                to="/vocabulary"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <BookOpen size={18} className="text-teal-500" /> Vocabulary Dictionary
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <UserIcon size={18} className="text-indigo-500" /> Profile & Settings
              </NavLink>

              {user?.role === 'ADMIN' && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100'
                    }`
                  }
                >
                  <Shield size={18} /> Admin Panel
                </NavLink>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-left pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div className="space-y-1.5 pt-1">
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={publicLinkClasses}
              >
                About
              </NavLink>
              <NavLink
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={publicLinkClasses}
              >
                How It Works
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

