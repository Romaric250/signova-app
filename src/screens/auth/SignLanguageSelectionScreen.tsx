import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { Dropdown, DropdownOption } from '../../components/molecules/Dropdown';
import { AuthStackParamList } from '../../types/navigation.types.ts';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const signLanguages: DropdownOption[] = [
  { id: '1', label: 'Ghanaian Sign Language / American Sign Language', value: 'GSL/ASL' },
  { id: '2', label: 'British Sign Language', value: 'BSL' },
  { id: '3', label: 'French Sign Language', value: 'LSF' },
  { id: '4', label: 'Australian Sign Language', value: 'Auslan' },
];

export const SignLanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('GSL/ASL'); // Default to GSL/ASL

  const handleSelect = (option: DropdownOption) => {
    setSelectedLanguage(option.value);
  };

  const handleContinue = () => {
    // TODO: Save selected language
    console.log('Selected language:', selectedLanguage);
    // Navigate to Permissions screen
    navigation.navigate('Permissions');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-8">
          <Text variant="h2" className="text-white font-bold text-center mb-4">
            Select Your Sign Language
          </Text>
          <Text variant="body" className="text-white/80 text-center mb-8">
            Choose the sign language you want to learn or use
          </Text>

          <View className="mb-8">
            <Dropdown
              options={signLanguages}
              selectedValue={selectedLanguage}
              onSelect={handleSelect}
              placeholder="Select sign language"
            />
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            fullWidth
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

