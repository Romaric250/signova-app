import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  className = '',
  shadow = true,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={`
        bg-white rounded-lg p-4
        ${shadow ? 'shadow-md' : ''}
        ${className}
      `}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};

