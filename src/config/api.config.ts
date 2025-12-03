export const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    PREFERENCES: '/users/preferences',
  },
  SIGNS: {
    LIST: '/signs',
    SEARCH: '/signs/search',
    DETAIL: '/signs/:id',
    FAVORITES: '/signs/favorites',
    CATEGORIES: '/signs/categories',
  },
  PROGRESS: {
    GET: '/progress',
    UPDATE: '/progress/update',
    STREAK: '/progress/streak',
    ACHIEVEMENTS: '/progress/achievements',
  },
  TRANSLATE: {
    TRANSCRIBE: '/translate/transcribe',
    TEXT_TO_SIGN: '/translate/text-to-sign',
    HISTORY: '/translate/history',
  },
};

