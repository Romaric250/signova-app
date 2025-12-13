import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

// App color palette
const colors = {
  primary: '#38E078',
  primaryDark: '#2BC066',
  background: '#122117',
  surface: '#1A2E23',
  surfaceLight: '#243D2E',
  text: '#FFFFFF',
  textSecondary: '#A0B8A8',
  textMuted: '#6B8B73',
  danger: '#EF4444',
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => console.log('Edit profile'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Accessibility',
      icon: 'accessibility-outline',
      onPress: () => console.log('Accessibility'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help'),
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => console.log('About'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text style={{ color: colors.text }} className="text-xl font-bold">
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-4 mt-4 p-6 rounded-2xl items-center" style={{ backgroundColor: colors.surface }}>
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: colors.primary }}
          >
            <Text style={{ color: colors.background }} className="text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={{ color: colors.text }} className="text-lg font-bold">
            {user?.name || 'User'}
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-sm mt-0.5">
            {user?.email || 'user@example.com'}
          </Text>
          <View className="flex-row items-center mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={{ color: colors.primary }} className="text-xs ml-1">
              Beginner
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row mx-4 mt-4">
          <View className="flex-1 p-4 rounded-xl mr-2 items-center" style={{ backgroundColor: colors.surface }}>
            <Text style={{ color: colors.primary }} className="text-xl font-bold">12</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">Signs Learned</Text>
          </View>
          <View className="flex-1 p-4 rounded-xl ml-2 items-center" style={{ backgroundColor: colors.surface }}>
            <Text style={{ color: colors.primary }} className="text-xl font-bold">3</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">Day Streak</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mx-4 mt-6 rounded-xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              onPress={item.onPress}
              className="flex-row items-center px-4 py-4"
              style={{ 
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: colors.surfaceLight,
              }}
            >
              <View className="w-8 h-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: colors.surfaceLight }}>
                <Ionicons name={item.icon as any} size={18} color={colors.textSecondary} />
              </View>
              <Text style={{ color: colors.text }} className="flex-1 text-sm">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mx-4 mt-4 p-4 rounded-xl flex-row items-center justify-center"
          style={{ backgroundColor: `${colors.danger}15` }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger }} className="text-sm font-semibold ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={{ color: colors.textMuted }} className="text-xs text-center mt-6">
          Signova v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

