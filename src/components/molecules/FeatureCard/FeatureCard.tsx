import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/atoms/Text';

interface FeatureCardProps {
  title: string;
  description: string;
  subtitle?: string;
  image?: string | number;
  onPress?: () => void;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  subtitle,
  image,
  onPress,
  className = '',
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={`mb-4 ${className}`}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View className="bg-[#e8e9e0] rounded-lg overflow-hidden mb-3" style={{ aspectRatio: 16 / 9 }}>
        {image && (
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
        {!image && (
          <View className="w-full h-full items-center justify-center bg-[#e8e9e0]">
            <View className="w-24 h-24 bg-gray-300 rounded-full" />
          </View>
        )}
      </View>
      <Text variant="h4" className="text-white font-bold mb-1">
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" className="text-white mb-1">
          {subtitle}
        </Text>
      )}
      <Text variant="small" className="text-white/80">
        {description}
      </Text>
    </Component>
  );
};

