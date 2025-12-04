import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';

interface TabItem {
  name: string;
  label: string;
  icon: string;
  iconFocused: string;
}

interface BottomNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View className="flex-row bg-white border-t border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            className="flex-1 items-center justify-center py-3"
            activeOpacity={0.7}
          >
            <Icon
              name={isActive ? tab.iconFocused : tab.icon}
              size={24}
              color={isActive ? '#38E078' : '#6B7280'}
            />
            <Text
              variant="caption"
              className={`mt-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

