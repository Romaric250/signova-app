import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  library?: 'ionicons' | 'material';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  library = 'ionicons',
  className = '',
}) => {
  if (library === 'material') {
    return (
      <MaterialCommunityIcons
        name={name as any}
        size={size}
        color={color}
        className={className}
      />
    );
  }

  return (
    <Ionicons
      name={name as any}
      size={size}
      color={color}
      className={className}
    />
  );
};

