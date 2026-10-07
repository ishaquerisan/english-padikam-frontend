import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  MessageSquare,
  BookOpen,
  HelpCircle,
  BookA,
  Layers,
  Shield,
} from 'lucide-react';

interface AdminNavProps {
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminNav: React.FC<AdminNavProps> = ({ title, subtitle, actionButton }) => {
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/users', label: 'Users & Learners', icon: Users },
    { to: '/admin/sentences', label: 'Sentence Pool', icon: MessageSquare },
    { to: '/admin/lessons', label: 'Lessons', icon: BookOpen },
    { to: '/admin/quizzes', label: 'Quizzes & Practice', icon: HelpCircle },
    { to: '/admin/vocabulary', label: 'Vocabulary Bank', icon: BookA },
    { to: '/admin/levels', label: 'Levels & Categories', icon: Layers },
  ];


  const isTabActive = (to: string) => {
    if (to === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/analytics';
    }
    return location.pathname.startsWith(to);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <Shield size={12} /> Admin Portal
            </span>
          </div>
          {title && (
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {actionButton && <div className="flex items-center gap-2">{actionButton}</div>}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <Icon size={16} />
              {item.label}
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

