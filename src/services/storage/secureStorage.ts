import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../../utils/constants.ts';

// In-memory storage fallback for web
const memoryStorage: Record<string, string> = {};

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage as fallback for web
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    // Fallback to memory storage if SecureStore fails
    console.log(`SecureStore not available, using fallback storage for ${key}`);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage as fallback for web
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    // Fallback to memory storage if SecureStore fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStorage[key] || null;
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage as fallback for web
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    // Fallback to memory storage if SecureStore fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  return setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const removeAuthToken = async (): Promise<void> => {
  return removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
};

