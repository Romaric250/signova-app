import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/organisms/Header';
import { ListItem } from '../../components/molecules/ListItem';
import { Card } from '../../components/molecules/Card';
import { Avatar } from '../../components/atoms/Avatar';
import { Text } from '../../components/atoms/Text';
import { Icon } from '../../components/atoms/Icon';
import { useAuth } from '../../hooks/useAuth.ts';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Profile" />

      <ScrollView className="flex-1">
        <View className="p-4">
          <Card className="mb-6">
            <View className="items-center py-6">
              <Avatar
                source={user?.avatar ? { uri: user.avatar } : undefined}
                name={user?.name || 'User'}
                size="large"
                className="mb-4"
              />
              <Text variant="h3" className="mb-1">
                {user?.name || 'User'}
              </Text>
              <Text variant="body" className="text-gray-600 mb-2">
                {user?.email}
              </Text>
              <Text variant="small" className="text-gray-500">
                Level: {user?.level || 'Beginner'}
              </Text>
            </View>
          </Card>

          <Card className="mb-4">
            <ListItem
              title="Edit Profile"
              leftIcon={<Icon name="person-outline" size={24} color="#6B7280" />}
              rightIcon={<Icon name="chevron-forward" size={20} color="#9CA3AF" />}
              onPress={() => {
                // TODO: Navigate to profile edit
                console.log('Edit profile');
              }}
            />
            <ListItem
              title="Settings"
              leftIcon={<Icon name="settings-outline" size={24} color="#6B7280" />}
              rightIcon={<Icon name="chevron-forward" size={20} color="#9CA3AF" />}
              onPress={() => {
                // TODO: Navigate to settings
                console.log('Settings');
              }}
            />
            <ListItem
              title="Accessibility"
              leftIcon={<Icon name="accessibility-outline" size={24} color="#6B7280" />}
              rightIcon={<Icon name="chevron-forward" size={20} color="#9CA3AF" />}
              onPress={() => {
                // TODO: Navigate to accessibility
                console.log('Accessibility');
              }}
            />
          </Card>

          <Card className="mb-4">
            <ListItem
              title="Help & Support"
              leftIcon={<Icon name="help-circle-outline" size={24} color="#6B7280" />}
              rightIcon={<Icon name="chevron-forward" size={20} color="#9CA3AF" />}
              onPress={() => {
                // TODO: Navigate to help
                console.log('Help');
              }}
            />
            <ListItem
              title="About"
              leftIcon={<Icon name="information-circle-outline" size={24} color="#6B7280" />}
              rightIcon={<Icon name="chevron-forward" size={20} color="#9CA3AF" />}
              onPress={() => {
                // TODO: Navigate to about
                console.log('About');
              }}
            />
          </Card>

          <Card>
            <ListItem
              title="Sign Out"
              leftIcon={<Icon name="log-out-outline" size={24} color="#EF4444" />}
              onPress={logout}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

