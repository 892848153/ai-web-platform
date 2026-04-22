import React from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, Heart, User, TrendingUp } from 'lucide-react';
import { RecommendationItem } from '@/types/recommendation';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  item: RecommendationItem;
  onAction?: (action: 'view' | 'like' | 'bookmark', item: RecommendationItem) => void;
  className?: string;
  showReason?: boolean;
}

export function RecommendationCard({ item, onAction, className, showReason = true }: RecommendationCardProps) {
  const handleAction = (action: 'view' | 'like' | 'bookmark') => {
    onAction?.(action, item);
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'practice':
        return <TrendingUp className="h-4 w-4" />;
      case 'course':
        return <User className="h-4 w-4" />;
      case 'module':
        return <Star className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    const labels = {
      practice: '最佳实践',
      course: '课程',
      module: '学习模块'
    };
    return labels[item.type] || item.type;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "glass-panel p-6 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group",
        className
      )}
      onClick={() => handleAction('view')}
    >
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyber-purple/20 text-cyber-purple text-xs">
            {getTypeIcon()}
            <span>{getTypeLabel()}</span>
          </div>
          {item.score > 0 && (
            <div className={cn("flex items-center gap-1 text-xs", getScoreColor(item.score))}>
              <Star className="h-3 w-3 fill-current" />
              <span>{(item.score * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction('like');
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="点赞"
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction('bookmark');
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="收藏"
          >
            <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
          </button>
        </div>
      </div>

      {/* 标题和描述 */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-purple transition-colors">
        {item.title}
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {item.description}
      </p>

      {/* 标签 */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-gray-300"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-gray-400">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* 推荐理由 */}
      {showReason && item.reason && (
        <div className="bg-gradient-to-r from-cyber-purple/10 to-cyber-accent/10 border border-cyber-purple/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-cyber-purple">
            💡 {item.reason}
          </p>
        </div>
      )}

      {/* 元数据 */}
      {item.metadata && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          {item.metadata.author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{item.metadata.author}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            {item.metadata.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{item.metadata.views}</span>
              </div>
            )}
            {item.metadata.likes !== undefined && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{item.metadata.likes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}