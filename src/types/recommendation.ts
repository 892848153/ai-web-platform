export interface UserBehavior {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'practice' | 'course' | 'module';
  action: 'view' | 'like' | 'bookmark' | 'share' | 'complete';
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'course' | 'module';
  tags: string[];
  score: number;
  reason: string;
  metadata?: Record<string, any>;
}

export interface UserProfile {
  userId: string;
  preferredTags: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  learningGoals: string[];
  behaviorHistory: UserBehavior[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationContext {
  userId: string;
  currentPage: string;
  userProfile: UserProfile;
  sessionHistory: UserBehavior[];
}