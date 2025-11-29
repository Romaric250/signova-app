import React, { useState } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/organisms/Header';
import { SearchBar } from '@/components/molecules/SearchBar';
import { SignCard } from '@/components/molecules/SignCard';
import { Chip } from '@/components/atoms/Chip';
import { Text } from '@/components/atoms/Text';
import { mockSigns } from '@/utils/mockData';
import { Sign } from '@/types/sign.types';

export const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Greetings', 'Numbers', 'Colors', 'Family', 'Food'];

  const filteredSigns = mockSigns.filter((sign) => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSignPress = (sign: Sign) => {
    // TODO: Navigate to sign detail screen
    console.log('Sign pressed:', sign);
  };

  const handleFavoritePress = (sign: Sign) => {
    // TODO: Toggle favorite
    console.log('Favorite pressed:', sign);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Dictionary" />
      
      <View className="px-4 py-2">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search signs..."
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-2 border-b border-gray-200"
      >
        <View className="flex-row space-x-2">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
            />
          ))}
        </View>
      </ScrollView>

      <FlatList
        data={filteredSigns}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-4"
        columnWrapperClassName="justify-between mb-4"
        renderItem={({ item }) => (
          <View className="w-[48%]">
            <SignCard
              sign={item}
              onPress={() => handleSignPress(item)}
              onFavoritePress={() => handleFavoritePress(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text variant="body" className="text-gray-500">
              No signs found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

