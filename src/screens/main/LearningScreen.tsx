import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/organisms/Header';
import { Card } from '../../components/molecules/Card';
import { ProgressBar } from '../../components/molecules/ProgressBar';
import { Text } from '../../components/atoms/Text';
import { Badge } from '../../components/atoms/Badge';
import { mockLessons } from '../../utils/mockData.ts';

export const LearningScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Learning Hub" />

      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          <Card>
            <Text variant="h4" className="mb-4">
              Your Progress
            </Text>
            <View className="space-y-4">
              <View>
                <View className="flex-row justify-between mb-2">
                  <Text variant="small" className="text-gray-600">
                    Overall Progress
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    45%
                  </Text>
                </View>
                <ProgressBar progress={45} />
              </View>
            </View>
          </Card>

          <View>
            <Text variant="h3" className="mb-4">
              Lessons
            </Text>
            {mockLessons.map((lesson) => (
              <Card
                key={lesson.id}
                onPress={() => {
                  // TODO: Navigate to lesson detail
                  console.log('Lesson pressed:', lesson.id);
                }}
                className="mb-4"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text variant="h4" className="mb-1">
                      {lesson.title}
                    </Text>
                    <Text variant="small" className="text-gray-600 mb-2">
                      {lesson.description}
                    </Text>
                    <View className="flex-row items-center space-x-2">
                      <Badge
                        label={lesson.difficulty}
                        variant="primary"
                        size="small"
                      />
                      <Text variant="caption" className="text-gray-500">
                        {lesson.duration} min • {lesson.signsCount} signs
                      </Text>
                    </View>
                  </View>
                </View>
                {lesson.progress > 0 && (
                  <ProgressBar progress={lesson.progress} height={6} />
                )}
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

