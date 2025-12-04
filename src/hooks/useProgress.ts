import { useState, useEffect } from 'react';
import { UserProgress } from '../types/user.types.ts';
import { progressApi } from '../services/api/progress.api.ts';
import { mockUser } from '../utils/mockData.ts';

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const data = await progressApi.getProgress();
      
      // Mock data for now
      const mockProgress: UserProgress = {
        streak: mockUser.learningStreak,
        signsLearned: mockUser.signsLearned,
        practiceTime: mockUser.practiceTime,
        lessonsCompleted: 12,
        level: mockUser.level,
        achievements: [],
      };
      
      setProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    refresh: fetchProgress,
  };
};

