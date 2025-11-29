import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  className = '',
}) => {
  return (
    <View
      className={`
        bg-white rounded-lg p-4 shadow-md
        ${className}
      `}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text variant="small" className="text-gray-600">
          {title}
        </Text>
        {icon && <Icon name={icon} size={20} color="#38E078" />}
      </View>
      <View className="flex-row items-baseline">
        <Text variant="h3" className="text-gray-900">
          {value}
        </Text>
        {unit && (
          <Text variant="small" className="text-gray-500 ml-1">
            {unit}
          </Text>
        )}
        {trend && (
          <Icon
            name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={trend === 'up' ? '#10B981' : '#EF4444'}
            className="ml-2"
          />
        )}
      </View>
    </View>
  );
};

