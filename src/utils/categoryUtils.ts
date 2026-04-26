/**
 * Utility functions for managing categories in the best practices section
 */

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部', color: 'from-cyber-green to-cyber-accent', description: '显示所有最佳实践' },
  { id: '开发', name: '开发', color: 'from-blue-500 to-blue-600', description: '前端、后端、架构等技术实践' },
  { id: '产品', name: '产品', color: 'from-purple-500 to-purple-600', description: '产品设计、需求分析、用户体验' },
  { id: '数据分析', name: '数据分析', color: 'from-green-500 to-green-600', description: 'SQL优化、数据挖掘、业务分析' },
  { id: '运营', name: '运营', color: 'from-orange-500 to-orange-600', description: '社交媒体、内容创作、增长策略' },
  { id: '销售', name: '销售', color: 'from-red-500 to-red-600', description: '客户开发、商务拓展、营销文案' },
  { id: '设计', name: '设计', color: 'from-pink-500 to-pink-600', description: '视觉设计、AI生成、创意内容' },
  { id: '管理', name: '管理', color: 'from-indigo-500 to-indigo-600', description: '项目管理、团队协作、流程优化' },
];

/**
 * Get category by id
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(category => category.id === id);
}

/**
 * Get primary category from practice tags
 */
export function getPrimaryCategory(tags: string[]): string {
  // Priority order for categories
  const priorityOrder = ['开发', '产品', '数据分析', '运营', '销售', '设计', '管理'];

  for (const category of priorityOrder) {
    if (tags.includes(category)) {
      return category;
    }
  }

  return tags[0] || '其他';
}

/**
 * Filter practices by category
 */
export function filterPracticesByCategory(practices: any[], categoryId: string): any[] {
  if (categoryId === 'all') {
    return practices;
  }

  return practices.filter(practice =>
    practice.tags && practice.tags.includes(categoryId)
  );
}

/**
 * Get category statistics
 */
export function getCategoryStats(practices: any[]): Record<string, number> {
  const stats: Record<string, number> = {};

  // Initialize with all categories
  CATEGORIES.forEach(category => {
    stats[category.id] = 0;
  });

  // Count practices in each category
  practices.forEach(practice => {
    if (practice.tags) {
      practice.tags.forEach((tag: string) => {
        if (stats.hasOwnProperty(tag)) {
          stats[tag]++;
        }
      });
    }
  });

  return stats;
}