import Constants from 'expo-constants';

const getEnvVar = (key: string, defaultValue?: string): string => {
  const expoValue = Constants.expoConfig?.extra?.[key];
  const envValue = process.env[key];
  const value = expoValue || envValue || defaultValue || '';
  
  // Debug logging for OpenAI API key (only log first few chars for security)
  if (key === 'OPENAI_API_KEY' && value) {
    console.log(`[ENV] ${key} loaded: ${value.substring(0, 10)}...`);
  } else if (key === 'OPENAI_API_KEY' && !value) {
    console.warn(`[ENV] ${key} is not set! Available keys:`, Object.keys(Constants.expoConfig?.extra || {}));
  }
  
  return value;
};

export const API_BASE_URL = getEnvVar('API_BASE_URL', 'http://localhost:5000/api');
export const APP_ENV = getEnvVar('APP_ENV', 'development');
export const SENTRY_DSN = getEnvVar('SENTRY_DSN', '');
export const ANALYTICS_KEY = getEnvVar('ANALYTICS_KEY', '');
export const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY', '');

export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';

