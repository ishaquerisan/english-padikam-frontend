import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Volume2,
  Calendar,
  Layers,
  ArrowRight,
  Globe,
  Award,
  BookOpen,
} from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';

export const Home: React.FC = () => {
  const sampleSentence = {
    english: "I will call you back in a few minutes.",
    malayalam: "ഞാൻ കുറച്ച് മിനിറ്റുകൾക്കുള്ളിൽ നിങ്ങളെ തിരികെ വിളിക്കാം.",
    pronunciation: "ഐ വിൽ കോൾ യു ബാക്ക് ഇൻ എ ഫ്യൂ മിനിറ്റ്സ്.",
    explanation: "തിരക്കിലായിരിക്കുമ്പോൾ ഫോൺ വെച്ച ശേഷം വീണ്ടും വിളിക്കാമെന്ന് പറയാൻ ഇത് ഉപയോഗിക്കാം.",
    usage: "Daily phone conversation",
  };

  const featurePillars = [
    {
      icon: <Sparkles className="text-indigo-500" size={24} />,
      title: "Daily 5 Recommended Sentences",
      malTitle: "ദിവസവും 5 പ്രധാന വാക്യങ്ങൾ",
      desc: "Build a consistent habit with 5 practical sentences curated for real daily life situations.",
    },
    {
      icon: <Flame className="text-orange-500" size={24} />,
      title: "Streak & Active Learning Days",
      malTitle: "സ്ഥിരതയാർന്ന പഠനം (Streak)",
      desc: "Asia/Kolkata timezone calendar-based streak engine that tracks every meaningful learning activity.",
    },
    {
      icon: <Layers className="text-purple-500" size={24} />,
      title: "Unlimited Extra Learning",
      malTitle: "കൂടുതൽ പഠിക്കാനുള്ള സ്വാതന്ത്ര്യം",
      desc: "Never stop at 5! Continue learning 10, 15, 20, or 30+ sentences anytime from our 5,000+ sentence library.",
    },
    {
      icon: <Volume2 className="text-teal-500" size={24} />,
      title: "Audio Pronunciation & Phonetics",
      malTitle: "കൃത്യമായ ഉച്ചാരണം",
      desc: "Clear Malayalam phonetic guides and natural text-to-speech audio to speak English with confidence.",
    },
    {
      icon: <Calendar className="text-emerald-500" size={24} />,
      title: "GitHub-style Activity Heatmap",
      malTitle: "പഠന ചരിത്രവും കലണ്ടറും",
      desc: "Visual intensity heatmap tracking every sentence, quiz, and learning milestone you achieve.",
    },
    {
      icon: <Award className="text-pink-500" size={24} />,
      title: "Interactive Quizzes & Vocabulary",
      malTitle: "ക്വിസ്സുകളും പദസമ്പത്തും",
      desc: "Test your recall with Malayalam-English translation quizzes and build a powerful vocabulary.",
    },
  ];

  return (
    <div className="min-h-screen space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Padikam Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-contain shadow-xl hover:scale-105 transition-transform animate-float"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles size={16} className="text-indigo-500" />
            <span>മലയാളികൾക്കായി പ്രത്യേകം തയ്യാറാക്കിയ ഇംഗ്ലീഷ് ആപ്പ്</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Learn Practical English Every Day Through{' '}
            <span className="gradient-text">Real-Life Sentences.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Master spoken English with 5 practical sentences every single day. Complete with natural Malayalam meanings, phonetic pronunciation, and habit streaks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Learning Now — Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Log In to My Account
            </Link>
          </div>
        </div>

        {/* Live Interactive Sample Card */}
        <div className="mt-14 max-w-2xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Sample Daily Sentence
              </span>
              <span className="text-xs text-slate-400">Audio Preview Available</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                "{sampleSentence.english}"
              </h3>
              <AudioPlayer text={sampleSentence.english} size="md" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 mb-4 border border-slate-200/60 dark:border-slate-700 text-sm font-malayalam text-indigo-600 dark:text-indigo-400 font-semibold">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-0.5">ഉച്ചാരണം (Pronunciation):</span>
              {sampleSentence.pronunciation}
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-emerald-100 font-malayalam text-lg sm:text-xl font-bold">
              <span className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                മലയാള അർത്ഥം (Meaning):
              </span>
              {sampleSentence.malayalam}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Everything You Need to Speak Fluent English
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Designed specifically for the nuances and everyday conversations of Malayalam speakers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featurePillars.map((feat, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 hover:shadow-glow/10 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {feat.title}
              </h3>
              <p className="font-malayalam text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                {feat.malTitle}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 text-center space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            28 Real-Life Categories Covered
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From Daily Routine, Family, Friends, and Home to Office, Travel, Hospitals, Shopping, Bank, and Job Interviews.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto pt-4">
            {[
              'Daily Conversation', 'Home', 'Family', 'Friends', 'Office', 'Workplace',
              'Shopping', 'Restaurant', 'Travel', 'Hospital', 'Bank', 'Phone Calls',
              'Asking Directions', 'Interview', 'Customer Service', 'Public Places',
              'Weather', 'Technology', 'Meetings', 'Food', 'School', 'College'
            ].map((cat) => (
              <span
                key={cat}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="pt-6">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              Start Your Daily Streak <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
