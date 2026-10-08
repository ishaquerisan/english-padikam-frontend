import api from '../api/client';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const authService = {
  async register(data: any): Promise<AuthResponse> {
    return (await api.post('/auth/register', data)) as unknown as AuthResponse;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    return (await api.post('/auth/login', credentials)) as unknown as AuthResponse;
  },

  async googleLogin(data: {
    idToken: string;
    name?: string;
    email?: string;
    photoUrl?: string;
    englishLevel?: string;
    learningGoal?: string;
    dailyGoal?: number;
  }): Promise<AuthResponse> {
    return (await api.post('/auth/google', data)) as unknown as AuthResponse;
  },

  async getMe(): Promise<{ success: boolean; data: { user: User; streak: any; dailyGoal: number } }> {
    return (await api.get('/auth/me')) as any;
  },

  async updateProfile(profileData: any): Promise<{ success: boolean; data: User }> {
    return (await api.put('/users/profile', profileData)) as any;
  },
};
