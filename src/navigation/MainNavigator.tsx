import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { DictionaryScreen } from '../screens/main/DictionaryScreen';
import { LearningScreen } from '../screens/main/LearningScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { Icon } from '../components/atoms/Icon';

const Tab = createBottomTabNavigator<MainTabParamList>();

// App color palette
const colors = {
  primary: '#38E078', // Bright green - buttons, accents
  background: '#122117', // Dark green - main background
  surface: '#1A2E23', // Cards, surfaces
  surfaceLight: '#243D2E', // Borders, dividers
  text: '#FFFFFF', // White - primary text
  textMuted: '#6B8B73', // Muted text
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surfaceLight,
          borderTopWidth: 1,
          elevation: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
};

