import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { TranslateNavigator } from './TranslateNavigator';
import { RealTimeModeSelectionScreen } from '@/screens/main/RealTimeModeSelectionScreen';
import { TranslateScreen } from '@/screens/main/TranslateScreen';
import { LiveCaptionsScreen } from '@/screens/main/LiveCaptionsScreen';
import { SignRecordingScreen } from '@/screens/main/SignRecordingScreen';
import { useAuthStore } from '@/store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleNavigationReady = async () => {
    try {
      console.log('[AppNavigator] Navigation container ready, hiding splash screen');
      await SplashScreen.hideAsync();
    } catch (error) {
      console.warn('[AppNavigator] Error hiding splash screen:', error);
    }
  };

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

