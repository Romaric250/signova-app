import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/organisms/Header';
import { StatCard } from '@/components/molecules/StatCard';
import { Card } from '@/components/molecules/Card';
import { Text } from '@/components/atoms/Text';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { formatTime } from '@/utils/formatters';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { progress, loading, refresh } = useProgress();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Welcome back"
        subtitle={user?.name}
        user={user ? { name: user.name, avatar: user.avatar } : undefined}
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <View className="p-4 space-y-4">
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <StatCard
                title="Learning Streak"
                value={progress?.streak || 0}
                unit="days"
                icon="flame"
              />
            </View>
            <View className="w-1/2 px-2 mb-4">
              <StatCard
                title="Signs Learned"
                value={progress?.signsLearned || 0}
                icon="book"
              />
            </View>
            <View className="w-1/2 px-2 mb-4">
              <StatCard
                title="Practice Time"
                value={formatTime(progress?.practiceTime || 0)}
                icon="time"
              />
            </View>
            <View className="w-1/2 px-2 mb-4">
              <StatCard
                title="Level"
                value={progress?.level || 'Beginner'}
                icon="trophy"
              />
            </View>
          </View>

          <Card>
            <Text variant="h4" className="mb-2">
              Continue Learning
            </Text>
            <Text variant="body" className="text-gray-600">
              Pick up where you left off and keep building your skills.
            </Text>
          </Card>

          <Card>
            <Text variant="h4" className="mb-2">
              Daily Challenge
            </Text>
            <Text variant="body" className="text-gray-600">
              Complete today's challenge to maintain your streak!
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

