import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import './global.css';

// Keep the splash screen visible while we fetch resources
// It will be hidden by NavigationContainer's onReady callback
SplashScreen.preventAutoHideAsync();

// Maximum time to show splash screen (safety fallback)
const MAX_SPLASH_TIME = 10000; // 10 seconds

export default function App() {
  useEffect(() => {
    // Safety fallback: Force hide splash screen after max time
    const timeoutId = setTimeout(() => {
      console.warn('[App] Force hiding splash screen after timeout');
      SplashScreen.hideAsync().catch(() => {});
    }, MAX_SPLASH_TIME);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Configure Android navigation bar
    if (Platform.OS === 'android') {
      // Hide the navigation bar completely
      NavigationBar.setVisibilityAsync('hidden');
      // Allow user to swipe from bottom to temporarily show it
      NavigationBar.setBehaviorAsync('overlay-swipe');
      // Set background to transparent when it does show
      NavigationBar.setBackgroundColorAsync('transparent');
      NavigationBar.setPositionAsync('absolute');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

