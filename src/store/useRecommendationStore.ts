import { create } from 'zustand';
import { RecommendationEngine } from '@/lib/recommendation/RecommendationEngine';
import { RecommendationItem, UserBehavior } from '@/types/recommendation';

interface RecommendationState {
  recommendationEngine: RecommendationEngine;
  recommendations: RecommendationItem[];
  isLoading: boolean;
  error: string | null;
  getUserRecommendations: (userId: string) => Promise<void>;
  trackBehavior: (
    userId: string,
    contentId: string,
    contentType: 'practice' | 'course' | 'module',
    action: UserBehavior['action'],
    duration?: number
  ) => void;
  getSimilarContent: (contentId: string) => Promise<void>;
  clearRecommendations: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendationEngine: new RecommendationEngine(),
  recommendations: [],
  isLoading: false,
  error: null,

  getUserRecommendations: async (userId: string) => {
    const { recommendationEngine } = get();
    set({ isLoading: true, error: null });

    try {
      const recommendations = await recommendationEngine.getRecommendations(userId);
      set({ recommendations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取推荐失败',
        isLoading: false
      });
    }
  },

  trackBehavior: (
    userId: string,
    contentId: string,
    contentType: 'practice' | 'course' | 'module',
    action: UserBehavior['action'],
    duration?: number
  ) => {
    const { recommendationEngine } = get();
    try {
      recommendationEngine.trackUserBehavior(userId, contentId, contentType, action, duration);
    } catch (error) {
      console.error('跟踪用户行为失败:', error);
    }
  },

  getSimilarContent: async (contentId: string) => {
    const { recommendationEngine } = get();
    set({ isLoading: true, error: null });

    try {
      const similar = await recommendationEngine.getSimilarContent(contentId);
      set({ recommendations: similar, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取相似内容失败',
        isLoading: false
      });
    }
  },

  clearRecommendations: () => {
    set({ recommendations: [], error: null });
  },
}));