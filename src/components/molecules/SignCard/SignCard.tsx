import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import { Sign } from '@/types/sign.types';

interface SignCardProps {
  sign: Sign;
  onPress: () => void;
  onFavoritePress: () => void;
  className?: string;
}

export const SignCard: React.FC<SignCardProps> = ({
  sign,
  onPress,
  onFavoritePress,
  className = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        bg-white rounded-xl overflow-hidden shadow-md
        ${className}
      `}
      activeOpacity={0.7}
    >
      <View className="relative">
        <Image
          source={{ uri: sign.thumbnail }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={onFavoritePress}
          className="absolute top-2 right-2 bg-white/90 rounded-full p-2"
          activeOpacity={0.7}
        >
          <Icon
            name={sign.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={sign.isFavorite ? '#EF4444' : '#6B7280'}
          />
        </TouchableOpacity>
        <View className="absolute bottom-2 left-2">
          <Badge label={sign.language} variant="primary" size="small" />
        </View>
      </View>
      <View className="p-4">
        <Text variant="h4" className="text-gray-900 mb-1">
          {sign.word}
        </Text>
        <Text variant="small" className="text-gray-500 mb-2">
          {sign.category}
        </Text>
        <Text variant="caption" className="text-gray-600" numberOfLines={2}>
          {sign.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

