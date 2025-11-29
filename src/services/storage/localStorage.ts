import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    throw error;
  }
};

export const setObject = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting object ${key}:`, error);
    throw error;
  }
};

export const getObject = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting object ${key}:`, error);
    return null;
  }
};

export const setOnboardingCompleted = async (completed: boolean): Promise<void> => {
  return setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed.toString());
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  const value = await getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  return value === 'true';
};

export const setUserPreferences = async <T>(preferences: T): Promise<void> => {
  return setObject(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

export const getUserPreferences = async <T>(): Promise<T | null> => {
  return getObject<T>(STORAGE_KEYS.USER_PREFERENCES);
};

