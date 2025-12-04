import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FeatureCard } from '../../components/molecules/FeatureCard';
import { ListItem } from '../../components/molecules/ListItem';
import { Text } from '../../components/atoms/Text';
import { Icon } from '../../components/atoms/Icon';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleRealTimePress = () => {
    navigation.navigate('RealTimeModeSelection' as never);
  };

  const handleLearnPress = () => {
    navigation.navigate('Learning' as never);
  };

  const handleDictionaryPress = () => {
    navigation.navigate('Dictionary' as never);
  };

  const handleOfflinePress = () => {
    // TODO: Navigate to offline mode
    console.log('Offline Mode pressed');
  };

  const handleFavoritesPress = () => {
    // TODO: Navigate to favorites
    console.log('Favorites pressed');
  };

  const handleRecentSignsPress = () => {
    // TODO: Navigate to recent signs
    console.log('Recent Signs pressed');
  };

  const handleProgressPress = () => {
    // TODO: Navigate to progress
    console.log('Progress pressed');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View style={{ width: 24 }} />
        <Text variant="h3" className="text-white font-bold">
          SignNova
        </Text>
        <TouchableOpacity onPress={handleSettingsPress} activeOpacity={0.7}>
          <Icon name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-20">
          {/* Real-Time Mode */}
          <FeatureCard
            title="Real-Time Mode"
            subtitle="Communicate with sign language"
            description="Start communicating in real-time with sign language."
            onPress={handleRealTimePress}
          />

          {/* Learn */}
          <FeatureCard
            title="Learn"
            subtitle="Interactive lessons and quizzes"
            description="Learn new signs and improve your skills."
            onPress={handleLearnPress}
          />

          {/* Dictionary */}
          <FeatureCard
            title="Dictionary"
            subtitle="Extensive sign language database"
            description="Look up signs and their meanings."
            onPress={handleDictionaryPress}
          />

          {/* Offline Mode */}
          <FeatureCard
            title="Offline Mode"
            subtitle="Learn on the go, anytime"
            description="Access lessons and signs without internet."
            onPress={handleOfflinePress}
          />

          {/* Quick Actions */}
          <View className="mt-6 mb-4">
            <Text variant="h4" className="text-white font-bold mb-4">
              Quick Actions
            </Text>
            
            <View className="bg-[#2a3a2e] rounded-lg overflow-hidden">
              <ListItem
                title="Favorites"
                leftIcon={<Icon name="heart-outline" size={24} color="#FFFFFF" />}
                onPress={handleFavoritesPress}
                variant="dark"
              />
              <View className="h-px bg-[#1a241e]" />
              <ListItem
                title="Recent Signs"
                leftIcon={<Icon name="time-outline" size={24} color="#FFFFFF" />}
                onPress={handleRecentSignsPress}
                variant="dark"
              />
              <View className="h-px bg-[#1a241e]" />
              <ListItem
                title="Progress"
                leftIcon={<Icon name="stats-chart-outline" size={24} color="#FFFFFF" />}
                onPress={handleProgressPress}
                variant="dark"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
