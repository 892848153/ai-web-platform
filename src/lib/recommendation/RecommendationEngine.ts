import { UserBehaviorTracker } from './UserBehaviorTracker';
import { ContentAnalyzer } from './ContentAnalyzer';
import { RecommendationItem, UserProfile, RecommendationContext } from '@/types/recommendation';
import { practices } from '@/data/bestPractices';

export class RecommendationEngine {
  private behaviorTracker: UserBehaviorTracker;
  private contentAnalyzer: ContentAnalyzer;

  constructor() {
    this.behaviorTracker = new UserBehaviorTracker();
    this.contentAnalyzer = new ContentAnalyzer(practices);
  }

  // 获取个性化推荐
  async getRecommendations(userId: string, context: Partial<RecommendationContext> = {}): Promise<RecommendationItem[]> {
    const userProfile = this.behaviorTracker.getUserProfile(userId);
    const userBehaviors = this.behaviorTracker.getUserBehaviors(userId);

    // 如果没有用户画像，返回热门推荐
    if (!userProfile || userBehaviors.length === 0) {
      return this.getPopularRecommendations();
    }

    // 混合多种推荐策略
    const contentBasedRecs = this.contentAnalyzer.recommendForUser(userProfile, 15);
    const collaborativeRecs = this.contentAnalyzer.recommendByCollaborativeFiltering(
      userId,
      this.behaviorTracker.getAllProfiles(),
      10
    );

    // 合并并去重推荐结果
    const allRecommendations = [...contentBasedRecs, ...collaborativeRecs];
    const uniqueRecommendations = this.deduplicateRecommendations(allRecommendations);

    // 根据上下文调整推荐
    const contextualRecs = this.applyContextualFiltering(uniqueRecommendations, context);

    // 最终排序和限制数量
    return this.finalRanking(contextualRecs).slice(0, 10);
  }

  // 跟踪用户行为
  trackUserBehavior(
    userId: string,
    contentId: string,
    contentType: 'practice' | 'course' | 'module',
    action: 'view' | 'like' | 'bookmark' | 'share' | 'complete',
    duration?: number,
    metadata?: Record<string, any>
  ) {
    return this.behaviorTracker.track(userId, contentId, contentType, action, duration, metadata);
  }

  // 获取用户统计数据
  getUserStats(userId: string) {
    return this.behaviorTracker.getUserStats(userId);
  }

  // 获取热门推荐（用于新用户或冷启动）
  private getPopularRecommendations(): RecommendationItem[] {
    const popularPractices = practices
      .sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))
      .slice(0, 10);

    return popularPractices.map(practice => ({
      id: practice.id.toString(),
      title: practice.title,
      description: practice.content.substring(0, 100) + '...',
      type: 'practice' as const,
      tags: practice.tags,
      score: 0.8,
      reason: '热门推荐，很多人都在学习',
      metadata: {
        author: practice.author,
        views: practice.views,
        likes: practice.likes
      }
    }));
  }

  // 去重推荐结果
  private deduplicateRecommendations(recommendations: RecommendationItem[]): RecommendationItem[] {
    const seen = new Set<string>();
    const unique: RecommendationItem[] = [];

    for (const rec of recommendations) {
      if (!seen.has(rec.id)) {
        seen.add(rec.id);
        unique.push(rec);
      }
    }

    return unique;
  }

  // 应用上下文过滤
  private applyContextualFiltering(
    recommendations: RecommendationItem[],
    context: Partial<RecommendationContext>
  ): RecommendationItem[] {
    let filtered = recommendations;

    // 基于当前页面过滤
    if (context.currentPage) {
      filtered = this.filterByPage(filtered, context.currentPage);
    }

    // 基于会话历史过滤
    if (context.sessionHistory && context.sessionHistory.length > 0) {
      filtered = this.filterBySessionHistory(filtered, context.sessionHistory);
    }

    return filtered;
  }

  // 基于页面类型过滤推荐
  private filterByPage(recommendations: RecommendationItem[], currentPage: string): RecommendationItem[] {
    switch (currentPage) {
      case '/practices':
        return recommendations.filter(rec => rec.type === 'practice');
      case '/learning':
        return recommendations.filter(rec => rec.type === 'course' || rec.type === 'module');
      default:
        return recommendations;
    }
  }

  // 基于会话历史过滤
  private filterBySessionHistory(
    recommendations: RecommendationItem[],
    sessionHistory: any[]
  ): RecommendationItem[] {
    const recentContentIds = new Set(
      sessionHistory.slice(-10).map(h => h.contentId)
    );

    // 降低最近浏览过的同类内容的分数
    return recommendations.map(rec => {
      if (recentContentIds.has(rec.id)) {
        return { ...rec, score: rec.score * 0.5 };
      }
      return rec;
    });
  }

  // 最终排序策略
  private finalRanking(recommendations: RecommendationItem[]): RecommendationItem[] {
    return recommendations.sort((a, b) => {
      // 主要按分数排序
      if (Math.abs(a.score - b.score) > 0.1) {
        return b.score - a.score;
      }

      // 分数相近时，考虑多样性
      return Math.random() - 0.5;
    });
  }

  // 获取分类推荐
  async getCategoryRecommendations(category: string, userId?: string): Promise<RecommendationItem[]> {
    let recommendations: RecommendationItem[];

    if (userId) {
      recommendations = await this.getRecommendations(userId);
    } else {
      recommendations = this.getPopularRecommendations();
    }

    // 按分类过滤
    return recommendations.filter(rec =>
      rec.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // 获取基于标签的推荐
  async getTagRecommendations(tags: string[], userId?: string): Promise<RecommendationItem[]> {
    let recommendations: RecommendationItem[];

    if (userId) {
      recommendations = await this.getRecommendations(userId);
    } else {
      recommendations = this.getPopularRecommendations();
    }

    // 按标签匹配度排序
    return recommendations
      .map(rec => ({
        ...rec,
        score: rec.score * this.calculateTagMatchScore(rec.tags, tags)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  private calculateTagMatchScore(itemTags: string[], targetTags: string[]): number {
    const matchCount = itemTags.filter(tag =>
      targetTags.some(targetTag =>
        tag.toLowerCase().includes(targetTag.toLowerCase()) ||
        targetTag.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;

    return matchCount / Math.max(targetTags.length, 1);
  }

  // 获取相似内容推荐
  async getSimilarContent(contentId: string, limit: number = 5): Promise<RecommendationItem[]> {
    const content = this.contentAnalyzer.analyzeContent(contentId, 'practice');
    if (!content) return [];

    const allPractices = practices
      .filter(p => p.id.toString() !== contentId)
      .map(practice => {
        const analysis = this.contentAnalyzer.analyzeContent(practice.id.toString(), 'practice');
        if (!analysis) return null;

        const similarity = this.contentAnalyzer.calculateSimilarity(content, analysis);

        return {
          id: practice.id.toString(),
          title: practice.title,
          description: practice.content.substring(0, 100) + '...',
          type: 'practice' as const,
          tags: practice.tags,
          score: similarity,
          reason: '与您查看的内容相似',
          metadata: {
            author: practice.author,
            views: practice.views,
            likes: practice.likes
          }
        };
      })
      .filter(Boolean) as RecommendationItem[];

    return allPractices
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}