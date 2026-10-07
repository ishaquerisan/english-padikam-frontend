import React from 'react';
import { BookOpen, Sparkles, Heart, Target, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <img
          src="/logo.png"
          alt="Padikam Logo"
          className="w-20 h-20 rounded-3xl object-contain mx-auto shadow-lg hover:scale-105 transition-transform"
        />
        <div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            Our Vision & Mission
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Empowering Malayalam Speakers with Practical English
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Padikam (പഠിക്കാം) was born out of a simple reality: learning English through grammar rules often fails, while learning practical sentences used in daily life builds instant confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Sentence-Based Habit Formation
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Instead of memorizing dry grammar charts, you absorb 5 contextual English sentences every day. Over a year, that translates to over 1,800 real-world spoken sentences ready on the tip of your tongue.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Authentic Malayalam Meanings
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Direct literal machine translations sound robotic. Every Malayalam explanation in Padikam is written naturally so native Malayalam speakers grasp the true conversational nuance.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ready to Start Your English Speaking Journey?
        </h2>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
        >
          Create Free Account Today
        </Link>
      </div>
    </div>
  );
};
