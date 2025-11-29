import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { mockSigns } from '@/utils/mockData';
import { Sign } from '@/types/sign.types';

export const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const languages = ['ASL', 'BSL', 'LSF'];
  const categories = ['Greetings', 'Numbers', 'Colors', 'Family', 'Food'];

  const filteredSigns = mockSigns.filter((sign) => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = !selectedLanguage || sign.language === selectedLanguage;
    const matchesCategory = !selectedCategory || sign.category === selectedCategory;
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  const handleSignPress = (sign: Sign) => {
    // TODO: Navigate to sign detail screen
    console.log('Sign pressed:', sign);
  };

  const handleFavoritesPress = () => {
    // TODO: Navigate to favorites
    console.log('Favorites pressed');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      {/* Header */}
      <View className="px-4 py-3">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text variant="h3" className="text-white font-bold flex-1">
            Dictionary
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-[#2a3a2e] rounded-lg flex-row items-center px-4 py-3 mb-3">
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white text-base ml-3"
          />
        </View>

        {/* Favorites Link */}
        <TouchableOpacity onPress={handleFavoritesPress} className="mb-4">
          <Text variant="small" className="text-gray-400">
            Favorites
          </Text>
        </TouchableOpacity>

        {/* Filter Buttons */}
        <View className="flex-row space-x-3 mb-4">
          <TouchableOpacity
            className="bg-[#2a3a2e] rounded-lg px-4 py-3 flex-1 flex-row items-center justify-between"
            activeOpacity={0.7}
            onPress={() => {
              // TODO: Show language dropdown
              console.log('Language filter pressed');
            }}
          >
            <Text variant="body" className="text-white">
              Language
            </Text>
            <Icon name="chevron-down" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#2a3a2e] rounded-lg px-4 py-3 flex-1 flex-row items-center justify-between"
            activeOpacity={0.7}
            onPress={() => {
              // TODO: Show category dropdown
              console.log('Category filter pressed');
            }}
          >
            <Text variant="body" className="text-white">
              Category
            </Text>
            <Icon name="chevron-down" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Signs Section */}
      <View className="flex-1 px-4">
        <Text variant="h4" className="text-white font-bold mb-4">
          Signs
        </Text>
        <FlatList
          data={filteredSigns}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSignPress(item)}
              className="w-[48%] bg-white rounded-lg overflow-hidden"
              activeOpacity={0.7}
            >
              <View className="aspect-square bg-gray-100 items-center justify-center">
                <Icon name="image-outline" size={48} color="#9CA3AF" />
              </View>
              <View className="p-3">
                <Text variant="body" className="text-gray-900 text-center font-medium">
                  {item.word}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text variant="body" className="text-white/60">
                No signs found
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

