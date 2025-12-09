export const APP_NAME = 'SignNova';

export const SIGN_LANGUAGES = {
  ASL: 'American Sign Language',
  BSL: 'British Sign Language',
  ISL: 'Irish Sign Language',
  LSF: 'Langue des Signes Française',
  GSL: 'German Sign Language',
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const LESSON_CATEGORIES = {
  GREETINGS: 'Greetings',
  NUMBERS: 'Numbers',
  COLORS: 'Colors',
  FAMILY: 'Family',
  FOOD: 'Food',
  ANIMALS: 'Animals',
  TIME: 'Time',
  PLACES: 'Places',
  EMOTIONS: 'Emotions',
  ACTIONS: 'Actions',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData', // Store user data for session restoration
  USER_PREFERENCES: 'userPreferences',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
} as const;

export const TOUCH_TARGET_SIZE = 44; // Minimum touch target size in pixels

