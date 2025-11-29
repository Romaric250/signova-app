import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { TranslateNavigator } from './TranslateNavigator';
import { RealTimeModeSelectionScreen } from '@/screens/main/RealTimeModeSelectionScreen';
import { TranslateScreen } from '@/screens/main/TranslateScreen';
import { LiveCaptionsScreen } from '@/screens/main/LiveCaptionsScreen';
import { useAuthStore } from '@/store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer key={isAuthenticated ? 'main' : 'auth'}>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

