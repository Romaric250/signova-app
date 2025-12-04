import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
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
  // Force boolean conversion
  const isChecked = checked === true || checked === 'true';
  const isDisabled = disabled === true || disabled === 'true';

  return (
    <View className={className}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isChecked ? '#38E078' : '#FFFFFF',
          borderColor: isChecked ? '#38E078' : '#D1D5DB',
          opacity: isDisabled ? 0.5 : 1,
        }}
        activeOpacity={0.7}
      >
        {isChecked && (
          <Icon name="checkmark" size={16} color="#FFFFFF" library="ionicons" />
        )}
      </TouchableOpacity>
    </View>
  );
};
