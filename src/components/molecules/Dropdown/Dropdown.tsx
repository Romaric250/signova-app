import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

export interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-[#2a3a2e] rounded-lg px-4 py-3 flex-row items-center justify-between"
        activeOpacity={0.7}
      >
        <Text variant="body" className="text-white flex-1">
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-end">
            <View className="bg-[#2a3a2e] rounded-t-3xl max-h-[50%]">
              <View className="flex-row items-center justify-between p-4 border-b border-[#1a241e]">
                <Text variant="h4" className="text-white font-bold">
                  {placeholder}
                </Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Icon name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    className={`
                      px-4 py-4 border-b border-[#1a241e]
                      ${selectedValue === item.value ? 'bg-[#1a241e]' : ''}
                    `}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text variant="body" className="text-white">
                        {item.label}
                      </Text>
                      {selectedValue === item.value && (
                        <Icon name="checkmark" size={20} color="#38E078" />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

