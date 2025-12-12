import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { TranslateNavigator } from './TranslateNavigator';
import { RealTimeModeSelectionScreen } from '../screens/main/RealTimeModeSelectionScreen';
import { TranslateScreen } from '../screens/main/TranslateScreen';
import { LiveCaptionsScreen } from '../screens/main/LiveCaptionsScreen';
import { SignRecordingScreen } from '../screens/main/SignRecordingScreen';
import { useAuthStore } from '../store/authStore';
import { useSessionRestore } from '../hooks/useSessionRestore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isRestoring } = useSessionRestore();

  const handleNavigationReady = async () => {
    // Hide splash screen when navigation is ready and session restoration is complete
    if (!isRestoring) {
      try {
        console.log('[AppNavigator] Navigation container ready, hiding splash screen');
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('[AppNavigator] Error hiding splash screen:', error);
      }
    }
  };

  // Hide splash screen when session restoration is complete
  useEffect(() => {
    if (!isRestoring) {
      // Small delay to ensure navigation is rendered
      const timer = setTimeout(() => {
        handleNavigationReady();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isRestoring]);

  // Show loading screen while restoring session
  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#38E078" />
      </View>
    );
  }

  return (
    <NavigationContainer 
      key={isAuthenticated ? 'main' : 'auth'}
      onReady={handleNavigationReady}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="RealTimeModeSelection"
              component={RealTimeModeSelectionScreen}
            />
            <Stack.Screen name="TextToSign" component={TranslateScreen} />
            <Stack.Screen name="LiveCaptions" component={LiveCaptionsScreen} />
            <Stack.Screen name="SignRecording" component={SignRecordingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

