import React from 'react';
import { Sparkles, Flame, Layers, Award, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Sparkles size={24} className="text-indigo-600" />,
      title: "Receive Today's 5 Recommended Sentences",
      malTitle: "ദിവസവും 5 വാക്യങ്ങൾ സ്വന്തമാക്കുക",
      desc: "Every day, our algorithm recommends 5 structured, realistic sentences tailored to your CEFR English level and conversational goals.",
    },
    {
      step: "02",
      icon: <Flame size={24} className="text-orange-500" />,
      title: "Practice Audio, Pronunciation & Meanings",
      malTitle: "ഉച്ചാരണവും അർത്ഥവും പരിശീലിക്കുക",
      desc: "Listen to natural English voice audio, read Malayalam phonetic script, and understand situational usage.",
    },
    {
      step: "03",
      icon: <Layers size={24} className="text-purple-600" />,
      title: "Continue with Unlimited Extra Learning",
      malTitle: "ലക്ഷ്യം പൂർത്തിയാക്കി കൂടുതൽ പഠിക്കുക",
      desc: "Completed your daily 5? Don't stop! Keep learning 5, 10, 15, or 20 more sentences anytime to accelerate your fluency.",
    },
    {
      step: "04",
      icon: <Calendar size={24} className="text-emerald-600" />,
      title: "Build Streaks & Track Progress on Calendar",
      malTitle: "പഠന ചരിത്രം പരിശോധിക്കുക",
      desc: "Maintain your daily streak in Indian Standard Time (Asia/Kolkata) and view your monthly activity heatmap.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          How It Works
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          A Simple 4-Step Daily Learning Formula
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Consistency beats intensity. Learn just 5 sentences every day and transform your spoken English fluency.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center font-black text-xl text-slate-700 dark:text-slate-200 shadow-sm">
              {s.step}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {s.title}
              </h3>
              <p className="font-malayalam text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {s.malTitle}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 pt-1">
                {s.desc}
              </p>
            </div>
            <div className="hidden lg:block p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40">
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          Start Your Day 1 Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
