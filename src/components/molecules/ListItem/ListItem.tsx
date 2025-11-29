import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: 'light' | 'dark';
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  className = '',
  variant = 'light',
}) => {
  const Component = onPress ? TouchableOpacity : View;
  const isDark = variant === 'dark';

  return (
    <Component
      onPress={onPress}
      className={`
        flex-row items-center py-4 px-4
        ${onPress ? (isDark ? 'active:bg-[#1a241e]' : 'active:bg-gray-50') : ''}
        ${className}
      `}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {leftIcon && <View className="mr-3">{leftIcon}</View>}
      <View className="flex-1">
        <Text variant="body" className={isDark ? 'text-white' : 'text-gray-900'}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="small" className={isDark ? 'text-white/70' : 'text-gray-500 mt-1'}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightIcon && <View className="ml-3">{rightIcon}</View>}
    </Component>
  );
};

