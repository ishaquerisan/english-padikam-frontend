import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className={`w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-sm text-slate-500 dark:text-slate-400 mt-16 ${isAuthenticated ? 'mb-16 md:mb-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen size={18} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">Padikam</span>
            <span className="font-malayalam font-bold text-indigo-600 dark:text-indigo-400 text-xs">
              (പഠിക്കാം)
            </span>
          </div>
          <p className="text-sm max-w-md leading-relaxed">
            The dedicated English learning web application specifically built for Malayalam speakers. Learn 5 practical everyday sentences every day with natural translations, pronunciations, and habit streaks.
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1 pt-2">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> for Kerala English Learners worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Learning Pathways
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/daily" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Today's Daily 5
              </Link>
            </li>
            <li>
              <Link to="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Extra Learning Mode
              </Link>
            </li>
            <li>
              <Link to="/practice" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Quizzes & Exercises
              </Link>
            </li>
            <li>
              <Link to="/vocabulary" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Daily Vocabulary Bank
              </Link>
            </li>
            <li>
              <Link to="/activity" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Activity Heatmap
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            About & Contact
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                About Padikam
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                User Settings & Goals
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
        © {new Date().getFullYear()} Padikam English Learning Platform. All rights reserved.
      </div>
    </footer>
  );
};
