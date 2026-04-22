import { UserBehavior, UserProfile } from '@/types/recommendation';

export class UserBehaviorTracker {
  private behaviors: Map<string, UserBehavior[]> = new Map();
  private profiles: Map<string, UserProfile> = new Map();

  track(userId: string, contentId: string, contentType: 'practice' | 'course' | 'module', action: UserBehavior['action'], duration?: number, metadata?: Record<string, any>) {
    const behavior: UserBehavior = {
      id: this.generateId(),
      userId,
      contentId,
      contentType,
      action,
      timestamp: new Date(),
      duration,
      metadata
    };

    if (!this.behaviors.has(userId)) {
      this.behaviors.set(userId, []);
    }
    this.behaviors.get(userId)!.push(behavior);

    // 更新用户画像
    this.updateUserProfile(userId, behavior);

    // 限制行为历史长度（保留最近1000条）
    const userBehaviors = this.behaviors.get(userId)!;
    if (userBehaviors.length > 1000) {
      this.behaviors.set(userId, userBehaviors.slice(-1000));
    }

    return behavior;
  }

  getUserBehaviors(userId: string): UserBehavior[] {
    return this.behaviors.get(userId) || [];
  }

  getUserProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  private updateUserProfile(userId: string, behavior: UserBehavior) {
    let profile = this.profiles.get(userId);

    if (!profile) {
      profile = {
        userId,
        preferredTags: [],
        skillLevel: 'beginner',
        interests: [],
        learningGoals: [],
        behaviorHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // 更新行为历史
    profile.behaviorHistory.push(behavior);

    // 分析偏好标签
    this.analyzePreferredTags(profile, behavior);

    // 分析技能水平
    this.analyzeSkillLevel(profile);

    // 分析兴趣
    this.analyzeInterests(profile, behavior);

    profile.updatedAt = new Date();
    this.profiles.set(userId, profile);
  }

  private analyzePreferredTags(profile: UserProfile, behavior: UserBehavior) {
    // 基于用户行为分析偏好标签
    const tagWeights: Record<string, number> = {};

    // 根据行为类型赋予权重
    const actionWeights = {
      view: 1,
      like: 3,
      bookmark: 4,
      share: 5,
      complete: 6
    };

    const weight = actionWeights[behavior.action];

    // 这里应该从内容中提取标签，简化处理
    const commonTags = ['开发', '产品', '运营', '职场办公', '数据分析', '人事', '销售', '设计'];
    const contentTypeTag = behavior.contentType === 'practice' ? '实践' : '学习';

    [contentTypeTag, ...commonTags].forEach(tag => {
      tagWeights[tag] = (tagWeights[tag] || 0) + weight;
    });

    // 更新偏好标签（取权重最高的前10个）
    profile.preferredTags = Object.entries(tagWeights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  private analyzeSkillLevel(profile: UserProfile) {
    const behaviors = profile.behaviorHistory;
    const recentBehaviors = behaviors.filter(b => {
      const daysDiff = (Date.now() - new Date(b.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30; // 最近30天
    });

    const totalInteractions = recentBehaviors.length;
    const completedItems = recentBehaviors.filter(b => b.action === 'complete').length;
    const avgDuration = recentBehaviors.reduce((sum, b) => sum + (b.duration || 0), 0) / totalInteractions;

    // 基于活跃度、完成率和学习时长判断技能水平
    if (totalInteractions > 50 && completedItems > 20 && avgDuration > 300) {
      profile.skillLevel = 'advanced';
    } else if (totalInteractions > 20 && completedItems > 5 && avgDuration > 180) {
      profile.skillLevel = 'intermediate';
    } else {
      profile.skillLevel = 'beginner';
    }
  }

  private analyzeInterests(profile: UserProfile, behavior: UserBehavior) {
    const interestWeights: Record<string, number> = {};

    // 基于内容类型分析兴趣
    const contentTypeInterests = {
      practice: '实践应用',
      course: '理论学习',
      module: '系统学习'
    };

    const interest = contentTypeInterests[behavior.contentType];
    interestWeights[interest] = (interestWeights[interest] || 0) + 1;

    // 更新兴趣列表
    profile.interests = Object.entries(interestWeights)
      .sort(([, a], [, b]) => b - a)
      .map(([interest]) => interest);
  }

  private generateId(): string {
    return `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 获取用户行为统计
  getUserStats(userId: string) {
    const behaviors = this.getUserBehaviors(userId);
    const recentBehaviors = behaviors.filter(b => {
      const daysDiff = (Date.now() - new Date(b.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // 最近7天
    });

    return {
      totalInteractions: behaviors.length,
      weeklyInteractions: recentBehaviors.length,
      favoriteActions: this.getMostFrequentActions(behaviors),
      averageSessionDuration: this.getAverageDuration(behaviors),
      lastActiveDate: behaviors.length > 0 ? behaviors[behaviors.length - 1].timestamp : null
    };
  }

  private getMostFrequentActions(behaviors: UserBehavior[]): Record<string, number> {
    const actionCounts: Record<string, number> = {};
    behaviors.forEach(b => {
      actionCounts[b.action] = (actionCounts[b.action] || 0) + 1;
    });
    return actionCounts;
  }

  private getAverageDuration(behaviors: UserBehavior[]): number {
    const durations = behaviors.filter(b => b.duration).map(b => b.duration!);
    return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  }
}