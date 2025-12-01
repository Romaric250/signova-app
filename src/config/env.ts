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
// Fallback API key if not set in environment (for development only)
const FALLBACK_OPENAI_KEY = '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';

export const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY', FALLBACK_OPENAI_KEY);

export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';

