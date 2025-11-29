import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from '../Icon';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  disabled = false,
  className = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        w-6 h-6 rounded border-2 items-center justify-center
        ${checked ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      activeOpacity={0.7}
    >
      {checked && (
        <Icon name="checkmark" size={16} color="#FFFFFF" library="ionicons" />
      )}
    </TouchableOpacity>
  );
};

