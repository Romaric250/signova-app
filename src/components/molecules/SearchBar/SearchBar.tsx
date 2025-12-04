import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  className = '',
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      <View className="flex-1">
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          leftIcon={<Icon name="search" size={20} color="#9CA3AF" />}
          rightIcon={
            value.length > 0 ? (
              <TouchableOpacity onPress={handleClear}>
                <Icon name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ) : undefined
          }
          className="border-gray-200"
        />
      </View>
    </View>
  );
};

