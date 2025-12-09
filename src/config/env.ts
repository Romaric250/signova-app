import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ============================================
// 🔧 EASY SWITCH: Change this to toggle between local and production
// ============================================
const USE_LOCAL_BACKEND = true; // Set to true for local development, false for production
// ============================================

// ============================================
// 🔧 LOCAL IP CONFIGURATION (for physical devices)
// ============================================
// For physical devices, replace with your computer's local IP address
// Find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
// Example: 'http://192.168.1.100:5000/api'
// Leave empty to use platform defaults (10.0.2.2 for Android emulator, localhost for iOS simulator)
const LOCAL_IP = ''; // e.g., '192.168.1.100' (without http:// or /api)
// ============================================

// Backend URLs
const getLocalBackendUrl = (): string => {
  // If LOCAL_IP is set, use it for all platforms (physical devices)
  if (LOCAL_IP) {
    const url = `http://${LOCAL_IP}:5000/api`;
    console.log('🌐 Using configured LOCAL_IP:', url);
    return url;
  }

  // Platform-specific defaults
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    const url = 'http://10.0.2.2:5000/api';
    console.log('🤖 Android detected - using emulator URL:', url);
    return url;
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    const url = 'http://localhost:5000/api';
    console.log('🍎 iOS detected - using simulator URL:', url);
    return url;
  } else {
    // Web or other platforms
    const url = 'http://localhost:5000/api';
    console.log('🌐 Web/Other platform - using localhost:', url);
    return url;
  }
};

const BACKEND_URLS = {
  LOCAL: getLocalBackendUrl(),
  PRODUCTION: 'https://signova-backend.onrender.com/api',
};

const getEnvVar = (key: string, defaultValue?: string): string => {
  const expoValue = Constants.expoConfig?.extra?.[key];
  const envValue = process.env[key];
  const value = expoValue || envValue || defaultValue || '';
  return value;
};

// API URL - uses the toggle above
export const API_BASE_URL = USE_LOCAL_BACKEND 
  ? BACKEND_URLS.LOCAL 
  : BACKEND_URLS.PRODUCTION;

// Log the current backend URL for debugging
console.log('🌐 ========== API CONFIGURATION ==========');
console.log('📱 Platform:', Platform.OS);
console.log('🔧 USE_LOCAL_BACKEND:', USE_LOCAL_BACKEND);
console.log('🌐 API_BASE_URL:', API_BASE_URL);
if (USE_LOCAL_BACKEND && !LOCAL_IP && Platform.OS !== 'ios' && Platform.OS !== 'web') {
  console.log('⚠️  NOTE: If using a physical device, set LOCAL_IP in env.ts');
  console.log('   Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)');
}
console.log('==========================================');

export const APP_ENV = USE_LOCAL_BACKEND ? 'development' : 'production';
export const SENTRY_DSN = getEnvVar('SENTRY_DSN', '');
export const ANALYTICS_KEY = getEnvVar('ANALYTICS_KEY', '');

// OpenAI API Key - MUST be set in .env file, no hardcoded fallback
const getOpenAIKey = (): string => {
  const key = getEnvVar('OPENAI_API_KEY', '');
  
  // Log where the key is coming from for debugging
  if (key) {
    const source = Constants.expoConfig?.extra?.OPENAI_API_KEY 
      ? 'app.config.js (from .env)' 
      : process.env.OPENAI_API_KEY 
        ? 'process.env (from .env)' 
        : 'unknown source';
    console.log('🔑 OpenAI API Key loaded from:', source);
    console.log('🔑 Key prefix:', key.substring(0, 7) + '...');
  } else {
    console.warn('⚠️  OpenAI API Key NOT FOUND in environment variables!');
    console.warn('⚠️  Please create a .env file with: OPENAI_API_KEY=sk-your-key-here');
  }
  
  return key;
};

export const OPENAI_API_KEY = getOpenAIKey();

export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';

