import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { AuthStackParamList } from './types';
import { OnboardingScreen } from '@/screens/auth/OnboardingScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { SignLanguageSelectionScreen } from '@/screens/auth/SignLanguageSelectionScreen';
import { PermissionsScreen } from '@/screens/auth/PermissionsScreen';
import { useOnboarding } from '@/hooks/useOnboarding';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { isOnboardingCompleted, isLoading } = useOnboarding();
  const [isNavigatorReady, setIsNavigatorReady] = useState(false);

  // Show loading only briefly while checking onboarding (max 1 second)
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    // Force hide loading after 1 second max, even if still loading
    const timer = setTimeout(() => {
      setShowLoading(false);
      setIsNavigatorReady(true);
    }, 1000);
    
    if (!isLoading) {
      setShowLoading(false);
      // Small delay to ensure navigation is ready before marking as ready
      setTimeout(() => setIsNavigatorReady(true), 100);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Note: Splash screen hiding is handled by AppNavigator's NavigationContainer onReady

  if (showLoading && isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#38E078" />
      </View>
    );
  }

  // Ensure boolean conversion and valid route name
  // Default to Onboarding if still loading (fallback)
  const completed: boolean = isLoading ? false : Boolean(isOnboardingCompleted);
  const initialRoute: 'Login' | 'Onboarding' = completed ? 'Login' : 'Onboarding';

  console.log(`[AuthNavigator] Rendering navigation. Loading: ${isLoading}, Completed: ${completed}, InitialRoute: ${initialRoute}, NavigatorReady: ${isNavigatorReady}`);

  // Always render navigator - don't wait for anything
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right' as const,
      }}
      onReady={() => {
        console.log('[AuthNavigator] Stack navigator ready');
        setIsNavigatorReady(true);
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignLanguageSelection" component={SignLanguageSelectionScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
    </Stack.Navigator>
  );
};

