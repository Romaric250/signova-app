import { create } from 'zustand';
import { User, AuthState } from '@/types/auth.types';
import { setAuthToken, removeAuthToken } from '@/services/storage/secureStorage';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: async (token) => {
    if (token) {
      await setAuthToken(token);
      set({ token });
    } else {
      await removeAuthToken();
      set({ token: null });
    }
  },

  login: async (user, token) => {
    await setAuthToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await removeAuthToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));

