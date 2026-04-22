import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Filter } from 'lucide-react';
import { useRecommendationStore } from '@/store/useRecommendationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationItem } from '@/types/recommendation';

interface RecommendationSectionProps {
  title?: string;
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
  onItemAction?: (action: 'view' | 'like' | 'bookmark', item: RecommendationItem) => void;
}

export function RecommendationSection({
  title = "为您推荐",
  userId,
  limit = 6,
  showHeader = true,
  className,
  onItemAction
}: RecommendationSectionProps) {
  const { user } = useAuthStore();
  const {
    recommendations,
    isLoading,
    error,
    getUserRecommendations,
    trackBehavior
  } = useRecommendationStore();

  const currentUserId = userId || user?.id || 'anonymous';

  useEffect(() => {
    if (currentUserId && currentUserId !== 'anonymous') {
      getUserRecommendations(currentUserId);
    }
  }, [currentUserId, getUserRecommendations]);

  const handleItemAction = (action: 'view' | 'like' | 'bookmark', item: RecommendationItem) => {
    if (currentUserId && currentUserId !== 'anonymous') {
      trackBehavior(
        currentUserId,
        item.id,
        item.type,
        action === 'view' ? 'view' : action === 'like' ? 'like' : 'bookmark'
      );
    }
    onItemAction?.(action, item);
  };

  const handleRefresh = () => {
    if (currentUserId && currentUserId !== 'anonymous') {
      getUserRecommendations(currentUserId);
    }
  };

  if (error) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">加载推荐内容时出错</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-purple/20 border border-cyber-purple/30 text-cyber-purple rounded-lg hover:bg-cyber-purple/30 transition-colors mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            重试
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="glass-panel p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-4"></div>
              <div className="h-3 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded mb-4 w-2/3"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-white/10 rounded w-16"></div>
                <div className="h-6 bg-white/10 rounded w-20"></div>
              </div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">暂无个性化推荐</h3>
          <p className="text-gray-500 mb-6">开始使用平台功能，我们将为您推荐相关内容</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-purple hover:bg-cyber-purple/80 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            刷新推荐
          </button>
        </div>
      </div>
    );
  }

  const displayRecommendations = recommendations.slice(0, limit);

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-cyber-purple" />
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <span className="px-2 py-1 rounded-full bg-cyber-purple/20 text-cyber-purple text-sm">
              {recommendations.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              title="刷新推荐"
            >
              <RefreshCw className="h-4 w-4" />
              刷新
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              title="筛选推荐"
            >
              <Filter className="h-4 w-4" />
              筛选
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRecommendations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RecommendationCard
              item={item}
              onAction={handleItemAction}
            />
          </motion.div>
        ))}
      </div>

      {recommendations.length > limit && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-gradient-to-r from-cyber-purple to-cyber-accent hover:from-cyber-purple/80 hover:to-cyber-accent/80 text-white rounded-lg transition-all duration-300">
            查看更多推荐
          </button>
        </div>
      )}
    </div>
  );
}