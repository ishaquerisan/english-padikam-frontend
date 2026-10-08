import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import {
  signInWithGoogle as firebaseGoogleSignIn,
  logoutFirebase,
  isFirebaseConfigured,
} from '../config/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  isFirebaseReady: boolean;
  login: (token: string, user: User) => void;
  loginWithGoogle: (customSettings?: {
    englishLevel?: string;
    learningGoal?: string;
    dailyGoal?: number;
  }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserData: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('padikam_token') || localStorage.getItem('angleyam_token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(5);
  const isFirebaseReady = isFirebaseConfigured();

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('padikam_token') || localStorage.getItem('angleyam_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        if (res.data.streak) {
          setCurrentStreak(res.data.streak.current);
          setLongestStreak(res.data.streak.longest);
        } else {
          setCurrentStreak(res.data.user.currentStreak || 0);
          setLongestStreak(res.data.user.longestStreak || 0);
        }
        setDailyGoal(res.data.dailyGoal || res.data.user.dailyGoal || 5);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem('padikam_token');
      localStorage.removeItem('padikam_user');
      localStorage.removeItem('angleyam_token');
      localStorage.removeItem('angleyam_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('padikam_token', newToken);
    localStorage.setItem('padikam_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setCurrentStreak(newUser.currentStreak || 0);
    setLongestStreak(newUser.longestStreak || 0);
    setDailyGoal(newUser.dailyGoal || 5);
  };

  const loginWithGoogle = async (customSettings?: {
    englishLevel?: string;
    learningGoal?: string;
    dailyGoal?: number;
  }): Promise<User> => {
    // 1. Authenticate with Google popup via Firebase
    const googleResult = await firebaseGoogleSignIn();

    // 2. Exchange Firebase idToken with backend API
    const res = await authService.googleLogin({
      idToken: googleResult.idToken,
      email: googleResult.email,
      name: googleResult.displayName,
      photoUrl: googleResult.photoURL || undefined,
      englishLevel: customSettings?.englishLevel,
      learningGoal: customSettings?.learningGoal,
      dailyGoal: customSettings?.dailyGoal,
    });

    if (!res.success || !res.data) {
      throw new Error(res.message || 'Google authentication failed with backend server.');
    }

    // 3. Save session in frontend
    login(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('padikam_token');
    localStorage.removeItem('padikam_user');
    localStorage.removeItem('angleyam_token');
    localStorage.removeItem('angleyam_user');
    logoutFirebase();
    setToken(null);
    setUser(null);
    setCurrentStreak(0);
    setLongestStreak(0);
  };

  const updateUserData = (updated: Partial<User>) => {
    if (user) {
      const nextUser = { ...user, ...updated };
      setUser(nextUser);
      localStorage.setItem('padikam_user', JSON.stringify(nextUser));
      if (updated.currentStreak !== undefined) setCurrentStreak(updated.currentStreak);
      if (updated.longestStreak !== undefined) setLongestStreak(updated.longestStreak);
      if (updated.dailyGoal !== undefined) setDailyGoal(updated.dailyGoal);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        currentStreak,
        longestStreak,
        dailyGoal,
        isFirebaseReady,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
