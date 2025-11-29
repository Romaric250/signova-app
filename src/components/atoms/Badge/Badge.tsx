import React from 'react';
import { View, Text } from 'react-native';
import { BadgeProps } from './Badge.types';

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'error':
        return 'text-white';
      case 'warning':
        return 'text-gray-900';
      default:
        return 'text-gray-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1';
      default:
        return 'px-3 py-1.5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      default:
        return 'text-sm';
    }
  };

  return (
    <View
      className={`
        rounded-full items-center justify-center
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      <Text
        className={`
          font-medium
          ${getTextColor()}
          ${getTextSize()}
        `}
      >
        {label}
      </Text>
    </View>
  );
};

