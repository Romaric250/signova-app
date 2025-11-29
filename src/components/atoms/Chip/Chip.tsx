import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  className = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        px-4 py-2 rounded-full
        ${selected ? 'bg-primary' : 'bg-gray-100'}
        ${className}
      `}
      activeOpacity={0.7}
    >
      <Text
        className={`
          text-sm font-medium
          ${selected ? 'text-white' : 'text-gray-700'}
        `}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

