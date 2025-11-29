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
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
  },
  SIGNS: {
    LIST: '/signs',
    SEARCH: '/signs/search',
    DETAIL: '/signs/:id',
    FAVORITES: '/signs/favorites',
    CATEGORIES: '/signs/categories',
  },
  LEARNING: {
    LESSONS: '/learning/lessons',
    LESSON_DETAIL: '/learning/lessons/:id',
    PROGRESS: '/learning/progress',
    ACHIEVEMENTS: '/learning/achievements',
  },
  TRANSLATE: {
    SPEECH_TO_SIGN: '/translate/speech',
    TEXT_TO_SIGN: '/translate/text',
    HISTORY: '/translate/history',
  },
};

