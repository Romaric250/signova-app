import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../../utils/constants.ts';

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage directly on web for better compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    }
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    // Fallback to localStorage on web if AsyncStorage fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (fallbackError) {
        console.error(`Error setting item ${key} in localStorage fallback:`, fallbackError);
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage directly on web for better compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    }
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    // Fallback to localStorage on web if AsyncStorage fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (fallbackError) {
        console.error(`Error getting item ${key} from localStorage fallback:`, fallbackError);
        return null;
      }
    }
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage directly on web for better compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    }
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    // Fallback to localStorage on web if AsyncStorage fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (fallbackError) {
        console.error(`Error removing item ${key} from localStorage fallback:`, fallbackError);
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const setObject = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    if (Platform.OS === 'web') {
      // Use localStorage directly on web for better compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, jsonValue);
        return;
      }
    }
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting object ${key}:`, error);
    // Fallback to localStorage on web if AsyncStorage fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const jsonValue = JSON.stringify(value);
        window.localStorage.setItem(key, jsonValue);
      } catch (fallbackError) {
        console.error(`Error setting object ${key} in localStorage fallback:`, fallbackError);
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const getObject = async <T>(key: string): Promise<T | null> => {
  try {
    let jsonValue: string | null = null;
    if (Platform.OS === 'web') {
      // Use localStorage directly on web for better compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        jsonValue = window.localStorage.getItem(key);
      }
    } else {
      jsonValue = await AsyncStorage.getItem(key);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting object ${key}:`, error);
    // Fallback to localStorage on web if AsyncStorage fails
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const jsonValue = window.localStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (fallbackError) {
        console.error(`Error getting object ${key} from localStorage fallback:`, fallbackError);
        return null;
      }
    }
    return null;
  }
};

export const setOnboardingCompleted = async (completed: boolean): Promise<void> => {
  const value = completed.toString();
  console.log(`[${Platform.OS}] Setting onboarding completed to:`, value);
  
  try {
    await setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, value);
    
    // Verify it was saved immediately
    const saved = await getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    console.log(`[${Platform.OS}] Verified saved onboarding value immediately:`, saved);
    
    // On native, also verify after a small delay to ensure persistence
    if (Platform.OS !== 'web') {
      await new Promise(resolve => setTimeout(resolve, 200));
      const savedAgain = await getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      console.log(`[${Platform.OS}] Verified saved onboarding value after delay:`, savedAgain);
      
      if (savedAgain !== value) {
        console.error(`[${Platform.OS}] WARNING: Storage value changed! Expected: ${value}, Got: ${savedAgain}`);
        // Try saving again
        await setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, value);
      }
    }
  } catch (error) {
    console.error(`[${Platform.OS}] Error setting onboarding completed:`, error);
    throw error;
  }
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.warn(`[${Platform.OS}] getOnboardingCompleted timeout, returning false`);
        resolve(false);
      }, 2000); // 2 second timeout
    });

    const getValuePromise = (async () => {
      const value = await getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      console.log(`[${Platform.OS}] Retrieved onboarding value:`, value, `(type: ${typeof value})`);
      
      // Ensure we return a proper boolean, not a string
      const result = value === 'true' || value === true;
      console.log(`[${Platform.OS}] Converted to boolean:`, result, `(type: ${typeof result})`);
      return Boolean(result);
    })();

    return await Promise.race([getValuePromise, timeoutPromise]);
  } catch (error) {
    console.error(`[${Platform.OS}] Error getting onboarding completed:`, error);
    return false;
  }
};

export const setUserPreferences = async <T>(preferences: T): Promise<void> => {
  return setObject(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

export const getUserPreferences = async <T>(): Promise<T | null> => {
  return getObject<T>(STORAGE_KEYS.USER_PREFERENCES);
};

// Debug helper: Check if AsyncStorage is working
export const debugStorage = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    console.log('[WEB] Using localStorage, not AsyncStorage');
    return;
  }
  
  try {
    const testKey = '__storage_test__';
    const testValue = 'test_' + Date.now();
    
    // Test write
    await AsyncStorage.setItem(testKey, testValue);
    console.log(`[${Platform.OS}] Test write successful: ${testKey} = ${testValue}`);
    
    // Test read
    const readValue = await AsyncStorage.getItem(testKey);
    console.log(`[${Platform.OS}] Test read result: ${readValue}`);
    
    if (readValue === testValue) {
      console.log(`[${Platform.OS}] ✅ AsyncStorage is working correctly`);
    } else {
      console.error(`[${Platform.OS}] ❌ AsyncStorage read mismatch! Expected: ${testValue}, Got: ${readValue}`);
    }
    
    // Clean up
    await AsyncStorage.removeItem(testKey);
    
    // List all keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log(`[${Platform.OS}] All storage keys (${allKeys.length}):`, allKeys);
    
  } catch (error) {
    console.error(`[${Platform.OS}] ❌ AsyncStorage test failed:`, error);
  }
};

