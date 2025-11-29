export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  learningStreak: number;
  signsLearned: number;
  practiceTime: number; // minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  joinedDate: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

