import Constants from 'expo-constants';

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key];
  return value || defaultValue || '';
};

export const API_BASE_URL = getEnvVar('API_BASE_URL', 'http://localhost:5000/api');
export const APP_ENV = getEnvVar('APP_ENV', 'development');
export const SENTRY_DSN = getEnvVar('SENTRY_DSN', '');
export const ANALYTICS_KEY = getEnvVar('ANALYTICS_KEY', '');

export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';

