import { Practice } from '@/data/bestPractices';
import { RecommendationItem, UserProfile } from '@/types/recommendation';

export class ContentAnalyzer {
  private practices: Practice[];

  constructor(practices: Practice[]) {
    this.practices = practices;
  }

  // 分析内容特征
  analyzeContent(contentId: string, contentType: 'practice' | 'course' | 'module') {
    if (contentType === 'practice') {
      const practice = this.practices.find(p => p.id.toString() === contentId);
      if (!practice) return null;

      return {
        id: contentId,
        type: contentType,
        title: practice.title,
        tags: practice.tags,
        difficulty: this.extractDifficulty(practice.tags),
        domain: this.extractDomain(practice.tags),
        popularity: practice.views + practice.likes * 2,
        engagement: practice.likes / Math.max(practice.views, 1),
        contentLength: practice.content.length + practice.prompt.length,
        author: practice.author
      };
    }

    // 对于课程和模块，这里可以扩展分析逻辑
    return {
      id: contentId,
      type: contentType,
      title: '',
      tags: [],
      difficulty: 'beginner',
      domain: 'general',
      popularity: 0,
      engagement: 0,
      contentLength: 0,
      author: ''
    };
  }

  // 计算内容相似度
  calculateSimilarity(content1: any, content2: any): number {
    let similarity = 0;

    // 标签相似度 (40%)
    const tagSimilarity = this.calculateTagSimilarity(content1.tags, content2.tags);
    similarity += tagSimilarity * 0.4;

    // 难度相似度 (20%)
    const difficultySimilarity = this.calculateDifficultySimilarity(content1.difficulty, content2.difficulty);
    similarity += difficultySimilarity * 0.2;

    // 领域相似度 (20%)
    const domainSimilarity = content1.domain === content2.domain ? 1 : 0;
    similarity += domainSimilarity * 0.2;

    // 作者相似度 (10%)
    const authorSimilarity = content1.author === content2.author ? 1 : 0;
    similarity += authorSimilarity * 0.1;

    // 流行度相似度 (10%)
    const popularitySimilarity = this.calculatePopularitySimilarity(content1.popularity, content2.popularity);
    similarity += popularitySimilarity * 0.1;

    return Math.min(similarity, 1);
  }

  // 基于用户画像推荐内容
  recommendForUser(userProfile: UserProfile, limit: number = 10): RecommendationItem[] {
    const recommendations: RecommendationItem[] = [];

    // 分析用户已交互的内容
    const interactedContentIds = new Set(
      userProfile.behaviorHistory.map(b => b.contentId)
    );

    // 为每个实践内容计算推荐分数
    for (const practice of this.practices) {
      if (interactedContentIds.has(practice.id.toString())) {
        continue; // 跳过已交互的内容
      }

      const content = this.analyzeContent(practice.id.toString(), 'practice');
      if (!content) continue;

      const score = this.calculateRecommendationScore(content, userProfile);

      recommendations.push({
        id: practice.id.toString(),
        title: practice.title,
        description: practice.content.substring(0, 100) + '...',
        type: 'practice',
        tags: practice.tags,
        score,
        reason: this.generateRecommendationReason(content, userProfile),
        metadata: {
          author: practice.author,
          views: practice.views,
          likes: practice.likes
        }
      });
    }

    // 按分数排序并返回前N个
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // 基于内容的协同过滤推荐
  recommendByCollaborativeFiltering(targetUserId: string, userProfiles: UserProfile[], limit: number = 10): RecommendationItem[] {
    const targetProfile = userProfiles.find(p => p.userId === targetUserId);
    if (!targetProfile) return [];

    // 找到相似用户
    const similarUsers = this.findSimilarUsers(targetProfile, userProfiles);

    // 获取相似用户喜欢但目标用户未接触的内容
    const candidateItems = this.getCandidateItems(similarUsers, targetProfile);

    // 计算推荐分数
    const recommendations = candidateItems.map(item => {
      const score = this.calculateCollaborativeScore(item, similarUsers, targetProfile);
      return {
        ...item,
        score,
        reason: '基于相似用户的偏好推荐'
      };
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private calculateTagSimilarity(tags1: string[], tags2: string[]): number {
    if (tags1.length === 0 || tags2.length === 0) return 0;

    const set1 = new Set(tags1);
    const set2 = new Set(tags2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  private calculateDifficultySimilarity(difficulty1: string, difficulty2: string): number {
    const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const level1 = levels[difficulty1 as keyof typeof levels] || 1;
    const level2 = levels[difficulty2 as keyof typeof levels] || 1;

    const diff = Math.abs(level1 - level2);
    return Math.max(0, 1 - diff / 3);
  }

  private calculatePopularitySimilarity(popularity1: number, popularity2: number): number {
    const maxPopularity = Math.max(popularity1, popularity2, 1);
    const diff = Math.abs(popularity1 - popularity2);
    return Math.max(0, 1 - diff / maxPopularity);
  }

  private calculateRecommendationScore(content: any, userProfile: UserProfile): number {
    let score = 0;

    // 标签匹配度 (40%)
    const tagMatchScore = content.tags.filter((tag: string) =>
      userProfile.preferredTags.includes(tag)
    ).length / Math.max(content.tags.length, 1);
    score += tagMatchScore * 0.4;

    // 难度适配度 (30%)
    const difficultyScore = this.calculateDifficultyScore(content.difficulty, userProfile.skillLevel);
    score += difficultyScore * 0.3;

    // 兴趣匹配度 (20%)
    const interestScore = userProfile.interests.includes('实践应用') ? 1 : 0.5;
    score += interestScore * 0.2;

    // 流行度 (10%)
    const popularityScore = Math.min(content.popularity / 1000, 1);
    score += popularityScore * 0.1;

    return Math.min(score, 1);
  }

  private calculateDifficultyScore(contentDifficulty: string, userLevel: string): number {
    const difficultyMap = {
      '入门': 'beginner',
      '进阶': 'intermediate',
      '专家级': 'advanced'
    };

    const contentLevel = difficultyMap[contentDifficulty as keyof typeof difficultyMap] || 'beginner';

    if (contentLevel === userLevel) return 1;
    if ((contentLevel === 'intermediate' && userLevel === 'beginner') ||
        (contentLevel === 'advanced' && userLevel === 'intermediate')) {
      return 0.8; // 稍高难度的内容也有价值
    }
    if ((contentLevel === 'beginner' && userLevel === 'intermediate') ||
        (contentLevel === 'intermediate' && userLevel === 'advanced')) {
      return 0.6; // 稍低难度的内容作为复习
    }

    return 0.3; // 难度差距太大
  }

  private generateRecommendationReason(content: any, userProfile: UserProfile): string {
    const reasons: string[] = [];

    const matchingTags = content.tags.filter((tag: string) =>
      userProfile.preferredTags.includes(tag)
    );

    if (matchingTags.length > 0) {
      reasons.push(`匹配您的兴趣标签: ${matchingTags.join(', ')}`);
    }

    if (content.popularity > 500) {
      reasons.push('热门内容，很多人都在学习');
    }

    if (content.engagement > 0.1) {
      reasons.push('高质量内容，用户好评度高');
    }

    return reasons.length > 0 ? reasons.join('；') : '为您推荐的学习内容';
  }

  private findSimilarUsers(targetProfile: UserProfile, allProfiles: UserProfile[]) {
    return allProfiles
      .filter(p => p.userId !== targetProfile.userId)
      .map(profile => ({
        profile,
        similarity: this.calculateUserSimilarity(targetProfile, profile)
      }))
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
      .map(item => item.profile);
  }

  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    // 基于偏好标签的相似度
    const tagSimilarity = this.calculateTagSimilarity(user1.preferredTags, user2.preferredTags);

    // 基于技能水平的相似度
    const skillSimilarity = user1.skillLevel === user2.skillLevel ? 1 : 0.5;

    // 基于兴趣的相似度
    const interestSimilarity = this.calculateTagSimilarity(user1.interests, user2.interests);

    return (tagSimilarity * 0.5 + skillSimilarity * 0.3 + interestSimilarity * 0.2);
  }

  private getCandidateItems(similarUsers: UserProfile[], targetProfile: UserProfile): RecommendationItem[] {
    const targetInteractedIds = new Set(
      targetProfile.behaviorHistory.map(b => b.contentId)
    );

    const candidateMap = new Map<string, { item: RecommendationItem; userCount: number }>();

    for (const user of similarUsers) {
      const likedItems = user.behaviorHistory
        .filter(b => ['like', 'bookmark', 'complete'].includes(b.action))
        .map(b => b.contentId);

      for (const contentId of likedItems) {
        if (targetInteractedIds.has(contentId)) continue;

        const practice = this.practices.find(p => p.id.toString() === contentId);
        if (!practice) continue;

        if (!candidateMap.has(contentId)) {
          candidateMap.set(contentId, {
            item: {
              id: contentId,
              title: practice.title,
              description: practice.content.substring(0, 100) + '...',
              type: 'practice',
              tags: practice.tags,
              score: 0,
              reason: '',
              metadata: {
                author: practice.author,
                views: practice.views,
                likes: practice.likes
              }
            },
            userCount: 0
          });
        }
        candidateMap.get(contentId)!.userCount++;
      }
    }

    return Array.from(candidateMap.values())
      .filter(candidate => candidate.userCount >= 2) // 至少2个相似用户喜欢
      .map(candidate => candidate.item);
  }

  private calculateCollaborativeScore(item: RecommendationItem, similarUsers: UserProfile[], targetProfile: UserProfile): number {
    // 这里应该基于相似用户的交互行为计算分数
    // 简化处理，返回一个基础分数
    return 0.7;
  }

  private extractDifficulty(tags: string[]): string {
    if (tags.includes('专家级')) return 'advanced';
    if (tags.includes('进阶')) return 'intermediate';
    return 'beginner';
  }

  private extractDomain(tags: string[]): string {
    const domainMap: Record<string, string> = {
      '开发': 'development',
      '产品': 'product',
      '运营': 'operations',
      '数据分析': 'data',
      '设计': 'design',
      '销售': 'sales',
      '人事': 'hr'
    };

    for (const tag of tags) {
      if (domainMap[tag]) {
        return domainMap[tag];
      }
    }

    return 'general';
  }
}