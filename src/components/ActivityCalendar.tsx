import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { CalendarResponse, CalendarDay } from '../types';
import { activityService } from '../services/apiServices';
import { DayDetailModal } from './DayDetailModal';

interface ActivityCalendarProps {
  initialYear?: number;
  initialMonth?: number;
  className?: string;
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  initialYear,
  initialMonth,
  className = '',
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(initialYear || today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth || today.getMonth() + 1);
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchCalendar = async (year: number, month: number) => {
    setLoading(true);
    try {
      const res = await activityService.getCalendar(year, month);
      if (res.success) {
        setCalendarData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`glass-panel rounded-3xl p-6 sm:p-7 relative ${className}`}>
      {/* Calendar Header with Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Activity Calendar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track daily learning intensity and review past days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-3 py-1.5 font-bold text-sm text-slate-800 dark:text-slate-200 min-w-[130px] text-center">
            {monthNames[currentMonth - 1]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Heatmap Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading activity heatmap...</div>
      ) : calendarData ? (
        <>
          <div className="grid grid-cols-7 gap-2 sm:gap-2.5 mb-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-1"
              >
                {day}
              </div>
            ))}

            {calendarData.days.map((day) => {
              const intensityClass = `calendar-cell-${day.intensity}`;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setSelectedDate(day.date)}
                  title={`${day.date}: ${day.sentencesLearned} sentences learned (${day.estimatedTimeMinutes} mins)`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all duration-200 hover:scale-105 hover:z-10 focus:ring-2 focus:ring-emerald-500 active:scale-95 cursor-pointer relative group ${intensityClass}`}
                >
                  <span className="font-semibold">{day.dayNumber}</span>
                  {day.sentencesLearned > 0 && (
                    <span className="text-[10px] opacity-90 hidden sm:inline">
                      {day.sentencesLearned}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend and Monthly Stats Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span>
                Active Days: <strong className="text-slate-800 dark:text-slate-200">{calendarData.activeDaysInMonth}</strong> / {calendarData.daysInMonth}
              </span>
              <span>
                Monthly Sentences: <strong className="text-emerald-600 dark:text-emerald-400">{calendarData.totalSentencesInMonth}</strong>
              </span>
            </div>

            {/* Intensity Legend */}
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded calendar-cell-0" title="0 sentences" />
              <div className="w-3.5 h-3.5 rounded calendar-cell-1" title="1-4 sentences" />
              <div className="w-3.5 h-3.5 rounded calendar-cell-2" title="5-9 sentences" />
              <div className="w-3.5 h-3.5 rounded calendar-cell-3" title="10-19 sentences" />
              <div className="w-3.5 h-3.5 rounded calendar-cell-4" title="20+ sentences" />
              <span>More</span>
            </div>
          </div>
        </>
      ) : null}

      {/* Date detail modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};
