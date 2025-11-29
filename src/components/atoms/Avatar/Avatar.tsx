import React from 'react';
import { View, Image, Text } from 'react-native';
import { AvatarProps } from './Avatar.types';
import { getInitials } from '@/utils/helpers';

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  className = '',
  ...props
}) => {
  const getSizeClasses = () => {
    if (typeof size === 'number') {
      return { width: size, height: size, borderRadius: size / 2 };
    }
    switch (size) {
      case 'small':
        return 'w-10 h-10';
      case 'large':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  };

  const getTextSize = () => {
    if (typeof size === 'number') {
      return { fontSize: size * 0.4 };
    }
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const sizeClasses = typeof size === 'number' ? {} : getSizeClasses();
  const textSize = typeof size === 'number' ? {} : getTextSize();

  return (
    <View
      className={`
        rounded-full items-center justify-center bg-primary/20
        ${typeof size === 'string' ? sizeClasses : ''}
        ${className}
      `}
      style={typeof size === 'number' ? { ...sizeClasses, ...props.style } : props.style}
      {...props}
    >
      {source?.uri ? (
        <Image
          source={source}
          className="w-full h-full rounded-full"
          resizeMode="cover"
        />
      ) : (
        <Text
          className={`
            font-semibold text-primary
            ${typeof size === 'string' ? textSize : ''}
          `}
          style={typeof size === 'number' ? textSize : undefined}
        >
          {name ? getInitials(name) : '?'}
        </Text>
      )}
    </View>
  );
};

