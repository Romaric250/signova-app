export type SignLanguage = 'ASL' | 'BSL' | 'ISL' | 'LSF' | 'GSL';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Sign {
  id: string;
  word: string;
  language: SignLanguage;
  category: string;
  difficulty: DifficultyLevel;
  videoUrl: string;
  thumbnail: string;
  description: string;
  relatedSigns: string[];
  isFavorite: boolean;
}

export interface SignCategory {
  id: string;
  name: string;
  icon?: string;
  signCount: number;
}

export interface SignFilter {
  language?: SignLanguage;
  category?: string;
  difficulty?: DifficultyLevel;
  searchQuery?: string;
}

