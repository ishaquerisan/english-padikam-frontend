import api from '../api/client';
import {
  DailyLessonResponse,
  Sentence,
  CalendarResponse,
  DayDetailResponse,
  WeeklyProgressResponse,
  MonthlyProgressResponse,
  UserStatisticsResponse,
  Quiz,
  Bookmark,
  Category,
  Level,
  Vocabulary,
} from '../types';

export const categoryService = {
  async getAll(): Promise<{ success: boolean; data: Category[] }> {
    return (await api.get('/categories')) as any;
  },
};

export const levelService = {
  async getAll(): Promise<{ success: boolean; data: Level[] }> {
    return (await api.get('/levels')) as any;
  },
};

export const dailyService = {
  async getToday(): Promise<{ success: boolean; data: DailyLessonResponse }> {
    return (await api.get('/daily/today')) as any;
  },

  async getByDate(date: string): Promise<{ success: boolean; data: DailyLessonResponse }> {
    return (await api.get(`/daily/${date}`)) as any;
  },
};

export const learningService = {
  async getNext(params?: { count?: number; categoryId?: number; levelId?: number }): Promise<{ success: boolean; data: Sentence[] }> {
    return (await api.get('/learning/next', { params })) as any;
  },

  async startSentence(sentenceId: number): Promise<{ success: boolean; data: any }> {
    return (await api.post(`/learning/sentence/${sentenceId}/start`)) as any;
  },

  async completeSentence(sentenceId: number): Promise<{ success: boolean; data: any }> {
    return (await api.post(`/learning/sentence/${sentenceId}/complete`)) as any;
  },

  async startSession(): Promise<{ success: boolean; data: any }> {
    return (await api.post('/learning/session/start')) as any;
  },

  async endSession(data: { sessionId: number; sentencesLearned: number; durationSeconds: number }): Promise<{ success: boolean; data: any }> {
    return (await api.post('/learning/session/end', data)) as any;
  },
};

export const activityService = {
  async getCalendar(year?: number, month?: number): Promise<{ success: boolean; data: CalendarResponse }> {
    return (await api.get('/activity/calendar', { params: { year, month } })) as any;
  },

  async getHistory(params?: { filter?: string; page?: number; limit?: number; categoryId?: number; levelId?: number }): Promise<{ success: boolean; data: any[]; meta?: any }> {
    return (await api.get('/activity/history', { params })) as any;
  },

  async getDayDetail(date: string): Promise<{ success: boolean; data: DayDetailResponse }> {
    return (await api.get(`/activity/day/${date}`)) as any;
  },
};

export const progressService = {
  async getOverall(): Promise<{ success: boolean; data: UserStatisticsResponse }> {
    return (await api.get('/progress')) as any;
  },

  async getWeekly(): Promise<{ success: boolean; data: WeeklyProgressResponse }> {
    return (await api.get('/progress/weekly')) as any;
  },

  async getMonthly(): Promise<{ success: boolean; data: MonthlyProgressResponse }> {
    return (await api.get('/progress/monthly')) as any;
  },
};

export const quizService = {
  async getQuizzes(lessonId: number): Promise<{ success: boolean; data: Quiz[] }> {
    return (await api.get(`/quizzes/${lessonId}`)) as any;
  },

  async submitAnswer(quizId: number, selectedOptionId: number): Promise<{ success: boolean; data: any }> {
    return (await api.post(`/quizzes/${quizId}/submit`, { selectedOptionId })) as any;
  },
};

export const bookmarkService = {
  async getAll(): Promise<{ success: boolean; data: Bookmark[] }> {
    return (await api.get('/bookmarks')) as any;
  },

  async add(sentenceId: number, note?: string): Promise<{ success: boolean; data: any }> {
    return (await api.post(`/bookmarks/${sentenceId}`, { note })) as any;
  },

  async remove(sentenceId: number): Promise<{ success: boolean; data: any }> {
    return (await api.delete(`/bookmarks/${sentenceId}`)) as any;
  },
};

export const vocabularyService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<{ success: boolean; data: Vocabulary[]; meta?: any }> {
    return (await api.get('/vocabulary', { params })) as any;
  },

  async getById(id: number): Promise<{ success: boolean; data: Vocabulary }> {
    return (await api.get(`/vocabulary/${id}`)) as any;
  },
};

export const goalService = {
  async getGoal(): Promise<{ success: boolean; data: any }> {
    return (await api.get('/goals')) as any;
  },

  async updateGoal(data: { targetSentences: number; reminderEnabled?: boolean; reminderTime?: string }): Promise<{ success: boolean; data: any }> {
    return (await api.put('/goals', data)) as any;
  },
};

export const adminService = {
  async getAnalytics(): Promise<{ success: boolean; data: any }> {
    return (await api.get('/admin/analytics')) as any;
  },

  async getSentences(params?: any): Promise<{ success: boolean; data: Sentence[]; meta?: any }> {
    return (await api.get('/admin/sentences', { params })) as any;
  },

  async createSentence(data: any): Promise<{ success: boolean; data: Sentence }> {
    return (await api.post('/admin/sentences', data)) as any;
  },

  async updateSentence(id: number, data: any): Promise<{ success: boolean; data: Sentence }> {
    return (await api.put(`/admin/sentences/${id}`, data)) as any;
  },

  async deleteSentence(id: number): Promise<{ success: boolean; data: any }> {
    return (await api.delete(`/admin/sentences/${id}`)) as any;
  },

  async getUsers(params?: any): Promise<{ success: boolean; data: any[]; meta?: any }> {
    return (await api.get('/admin/users', { params })) as any;
  },

  async updateUser(id: number, data: any): Promise<{ success: boolean; data: any }> {
    return (await api.put(`/admin/users/${id}`, data)) as any;
  },

  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return (await api.get('/categories')) as any;
  },

  async getLevels(): Promise<{ success: boolean; data: Level[] }> {
    return (await api.get('/levels')) as any;
  },

  async getLessons(params?: any): Promise<{ success: boolean; data: any[]; meta?: any }> {
    return (await api.get('/admin/lessons', { params })) as any;
  },

  async createLesson(data: any): Promise<{ success: boolean; data: any }> {
    return (await api.post('/admin/lessons', data)) as any;
  },

  async updateLesson(id: number, data: any): Promise<{ success: boolean; data: any }> {
    return (await api.put(`/admin/lessons/${id}`, data)) as any;
  },

  async deleteLesson(id: number): Promise<{ success: boolean; data: any }> {
    return (await api.delete(`/admin/lessons/${id}`)) as any;
  },

  async getQuizzes(params?: any): Promise<{ success: boolean; data: any[]; meta?: any }> {
    return (await api.get('/admin/quizzes', { params })) as any;
  },

  async createQuiz(data: any): Promise<{ success: boolean; data: any }> {
    return (await api.post('/admin/quizzes', data)) as any;
  },

  async updateQuiz(id: number, data: any): Promise<{ success: boolean; data: any }> {
    return (await api.put(`/admin/quizzes/${id}`, data)) as any;
  },

  async deleteQuiz(id: number): Promise<{ success: boolean; data: any }> {
    return (await api.delete(`/admin/quizzes/${id}`)) as any;
  },

  async getVocabularies(params?: any): Promise<{ success: boolean; data: any[]; meta?: any }> {
    return (await api.get('/admin/vocabulary', { params })) as any;
  },

  async createVocabulary(data: any): Promise<{ success: boolean; data: any }> {
    return (await api.post('/admin/vocabulary', data)) as any;
  },

  async updateVocabulary(id: number, data: any): Promise<{ success: boolean; data: any }> {
    return (await api.put(`/admin/vocabulary/${id}`, data)) as any;
  },

  async deleteVocabulary(id: number): Promise<{ success: boolean; data: any }> {
    return (await api.delete(`/admin/vocabulary/${id}`)) as any;
  },
};


