import { User } from '@/types/auth.types';
import { Sign } from '@/types/sign.types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  learningStreak: 15,
  signsLearned: 342,
  practiceTime: 1470, // minutes
  level: 'intermediate',
  joinedDate: '2024-01-15',
};

export const mockSigns: Sign[] = [
  {
    id: '1',
    word: 'Hello',
    language: 'ASL',
    category: 'Greetings',
    difficulty: 'beginner',
    videoUrl: 'https://example.com/signs/hello-asl.mp4',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'A common greeting in American Sign Language',
    relatedSigns: ['Hi', 'Good morning', 'Welcome'],
    isFavorite: false,
  },
  {
    id: '2',
    word: 'Thank you',
    language: 'ASL',
    category: 'Greetings',
    difficulty: 'beginner',
    videoUrl: 'https://example.com/signs/thank-you-asl.mp4',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'Expressing gratitude',
    relatedSigns: ['Please', 'You\'re welcome'],
    isFavorite: true,
  },
  {
    id: '3',
    word: 'Please',
    language: 'ASL',
    category: 'Greetings',
    difficulty: 'beginner',
    videoUrl: 'https://example.com/signs/please-asl.mp4',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'Polite request',
    relatedSigns: ['Thank you', 'Sorry'],
    isFavorite: false,
  },
];

export const mockLessons = [
  {
    id: '1',
    title: 'Basic Greetings',
    description: 'Learn common greeting signs',
    difficulty: 'beginner',
    duration: 15, // minutes
    signsCount: 10,
    completed: false,
    progress: 0,
    thumbnail: 'https://via.placeholder.com/300x200',
  },
  {
    id: '2',
    title: 'Numbers 1-10',
    description: 'Master counting from one to ten',
    difficulty: 'beginner',
    duration: 20,
    signsCount: 10,
    completed: true,
    progress: 100,
    thumbnail: 'https://via.placeholder.com/300x200',
  },
];

