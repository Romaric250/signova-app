import React from 'react';
import { Switch as RNSwitch, View } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  className = '',
}) => {
  // Force boolean conversion
  const boolValue = value === true || value === 'true';
  const boolDisabled = disabled === true || disabled === 'true';

  return (
    <View className={className}>
      <RNSwitch
        value={boolValue}
        onValueChange={onValueChange}
        disabled={boolDisabled}
        trackColor={{ false: '#D1D5DB', true: '#38E078' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};
