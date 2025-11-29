import { User } from './auth.types';

export interface UserProfile extends User {
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  signLanguage: string;
  avatarSkinTone?: string;
  signingSpeed: 'slow' | 'normal' | 'fast';
  handedness: 'left' | 'right';
  textSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  colorBlindMode: boolean;
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    achievements: boolean;
    lessons: boolean;
  };
}

export interface UserProgress {
  streak: number;
  signsLearned: number;
  practiceTime: number;
  lessonsCompleted: number;
  level: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

