import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icon';
import { Avatar } from '../../atoms/Avatar';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  user?: { name: string; avatar?: string };
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
  user,
  className = '',
}) => {
  return (
    <SafeAreaView edges={['top']} className={`bg-white ${className}`}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress}
              className="mr-3"
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
          )}
          <View className="flex-1">
            {title && (
              <Text variant="h3" className="text-gray-900">
                {title}
              </Text>
            )}
            {subtitle && (
              <Text variant="small" className="text-gray-500 mt-1">
                {subtitle}
              </Text>
            )}
            {user && (
              <View className="flex-row items-center mt-1">
                <Avatar source={user.avatar ? { uri: user.avatar } : undefined} name={user.name} size="small" />
                <Text variant="body" className="text-gray-900 ml-2">
                  {user.name}
                </Text>
              </View>
            )}
          </View>
        </View>
        {rightAction && <View>{rightAction}</View>}
      </View>
    </SafeAreaView>
  );
};

