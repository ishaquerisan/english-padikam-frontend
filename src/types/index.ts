export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  nativeLanguage: string;
  englishLevel: string;
  learningGoal: string;
  dailyGoal: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalSentencesLearned: number;
  totalWordsLearned: number;
  totalLearningDays: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  malayalamName: string;
  icon: string;
  description?: string;
  orderNumber: number;
  status: string;
  sentenceCount?: number;
}

export interface Level {
  id: number;
  name: string;
  code: string;
  malayalamName: string;
  description?: string;
  targetSentences: number;
  orderNumber: number;
}

export interface Vocabulary {
  id: number;
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  malayalamMeaning: string;
  englishMeaning?: string;
  exampleSentence?: string;
}

export interface Sentence {
  id: number;
  lessonId: number;
  categoryId: number;
  levelId: number;
  englishText: string;
  malayalamText: string;
  pronunciation: string;
  explanation: string;
  usageSituation: string;
  exampleResponse?: string | null;
  audioUrl?: string | null;
  orderNumber: number;
  status: string;
  category?: Category;
  level?: Level;
  lesson?: { id: number; title: string; malayalamTitle: string };
  vocabularies?: Vocabulary[];
  isLearned?: boolean;
  isBookmarked?: boolean;
  userStatus?: 'NOT_STARTED' | 'VIEWED' | 'LEARNED' | 'MASTERED';
}

export interface Lesson {
  id: number;
  lessonNumber: number;
  dayNumber?: number | null;
  title: string;
  malayalamTitle: string;
  description?: string;
  category?: Category;
  level?: Level;
  sentences?: Sentence[];
}

export interface DailyLessonResponse {
  date: string;
  goal: number;
  todayTotalCompleted: number;
  goalCompleted: boolean;
  extraCompleted: number;
  lessonCompleted: boolean;
  completedInLesson: number;
  remainingInLesson: number;
  lesson: Lesson;
  sentences: Sentence[];
}

export interface QuizOption {
  id: number;
  quizId: number;
  optionText: string;
  malayalamText?: string | null;
  orderNumber: number;
}

export interface Quiz {
  id: number;
  lessonId: number;
  sentenceId?: number | null;
  questionType: 'ENG_TO_MAL' | 'MAL_TO_ENG' | 'FILL_BLANK' | 'CORRECT_SENTENCE' | 'VOCAB_MEANING';
  question: string;
  malayalamQuestion?: string | null;
  explanation?: string | null;
  orderNumber: number;
  options: QuizOption[];
}

export interface CalendarDay {
  date: string;
  dayNumber: number;
  intensity: number; // 0, 1, 2, 3, 4
  sentencesLearned: number;
  vocabulariesLearned: number;
  quizzesCompleted: number;
  averageQuizScore?: number | null;
  estimatedTimeMinutes: number;
  isActiveDay: boolean;
}

export interface CalendarResponse {
  year: number;
  month: number;
  daysInMonth: number;
  totalSentencesInMonth: number;
  activeDaysInMonth: number;
  days: CalendarDay[];
}

export interface DayDetailResponse {
  date: string;
  totalSentences: number;
  vocabularyLearned: number;
  quizScore?: number | null;
  quizzesCompleted: number;
  estimatedLearningTimeMinutes: number;
  currentStreak: number;
  sentences: Sentence[];
}

export interface WeeklyProgressResponse {
  startDate: string;
  endDate: string;
  totalSentences: number;
  averagePerDay: number;
  activeDays: number;
  totalDays: number;
  breakdown: {
    day: string;
    date: string;
    sentences: number;
    isActive: boolean;
  }[];
}

export interface MonthlyProgressResponse {
  month: string;
  totalSentences: number;
  activeDays: number;
  averageDailyLearning: number;
  bestLearningDay: {
    date: string;
    sentences: number;
  };
  longestStreak: number;
  quizAverage?: number | null;
}

export interface UserStatisticsResponse {
  totalSentencesLearned: number;
  totalLearningDays: number;
  currentStreak: number;
  longestStreak: number;
  totalWordsLearned: number;
  averageDailySentences: number;
  totalQuizzes: number;
  averageQuizScore: number;
  estimatedLearningTime: string;
  estimatedMinutes: number;
}

export interface Bookmark {
  id: number;
  sentenceId: number;
  note?: string | null;
  createdAt: string;
  sentence: Sentence;
}
