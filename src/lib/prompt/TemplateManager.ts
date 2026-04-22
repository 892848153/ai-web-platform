import { PromptTemplate } from '@/types/prompt';

export class TemplateManager {
  private customTemplates: Map<string, PromptTemplate> = new Map();

  // 创建自定义模板
  createTemplate(template: Omit<PromptTemplate, 'id'>): PromptTemplate {
    const id = this.generateId();
    const newTemplate: PromptTemplate = {
      ...template,
      id
    };

    this.customTemplates.set(id, newTemplate);
    return newTemplate;
  }

  // 更新模板
  updateTemplate(id: string, updates: Partial<PromptTemplate>): boolean {
    const template = this.customTemplates.get(id);
    if (!template) return false;

    const updatedTemplate = { ...template, ...updates };
    this.customTemplates.set(id, updatedTemplate);
    return true;
  }

  // 删除模板
  deleteTemplate(id: string): boolean {
    return this.customTemplates.delete(id);
  }

  // 获取模板
  getTemplate(id: string): PromptTemplate | undefined {
    return this.customTemplates.get(id);
  }

  // 获取所有自定义模板
  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.customTemplates.values());
  }

  // 根据分类获取模板
  getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  // 根据标签搜索模板
  searchTemplatesByTags(tags: string[]): PromptTemplate[] {
    return this.getAllTemplates().filter(template =>
      template.metadata.tags.some(tag =>
        tags.some(searchTag =>
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      )
    );
  }

  // 验证模板
  validateTemplate(template: Partial<PromptTemplate>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.name || template.name.trim().length === 0) {
      errors.push('模板名称不能为空');
    }

    if (!template.template || template.template.trim().length === 0) {
      errors.push('模板内容不能为空');
    }

    if (!template.category) {
      errors.push('必须指定模板分类');
    }

    if (!template.variables || template.variables.length === 0) {
      errors.push('必须定义模板变量');
    }

    // 检查模板中的变量是否都定义了
    if (template.template && template.variables) {
      const usedVariables = template.template.match(/\{([^}]+)\}/g) || [];
      const definedVariables = new Set(template.variables);

      usedVariables.forEach(variable => {
        const varName = variable.slice(1, -1);
        if (!definedVariables.has(varName)) {
          errors.push(`模板中使用了未定义的变量: ${varName}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 导出模板
  exportTemplate(id: string): string | null {
    const template = this.customTemplates.get(id);
    if (!template) return null;

    return JSON.stringify(template, null, 2);
  }

  // 导入模板
  importTemplate(templateJson: string): PromptTemplate | null {
    try {
      const template = JSON.parse(templateJson) as PromptTemplate;
      const validation = this.validateTemplate(template);

      if (!validation.isValid) {
        throw new Error(`模板验证失败: ${validation.errors.join(', ')}`);
      }

      return this.createTemplate(template);
    } catch (error) {
      console.error('导入模板失败:', error);
      return null;
    }
  }

  // 复制模板
  duplicateTemplate(id: string): PromptTemplate | null {
    const template = this.customTemplates.get(id);
    if (!template) return null;

    const duplicated = this.createTemplate({
      ...template,
      name: `${template.name} (副本)`
    });

    return duplicated;
  }

  // 获取模板统计
  getTemplateStats() {
    const templates = this.getAllTemplates();
    const stats = {
      total: templates.length,
      byCategory: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      recentlyCreated: templates
        .sort((a, b) => {
          const dateA = a.metadata?.createdAt ? new Date(a.metadata.createdAt).getTime() : 0;
          const dateB = b.metadata?.createdAt ? new Date(b.metadata.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5)
    };

    // 按分类统计
    templates.forEach(template => {
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
    });

    // 按难度统计
    templates.forEach(template => {
      const difficulty = template.metadata.difficulty;
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
    });

    return stats;
  }

  // 清理未使用的模板
  cleanupUnusedTemplates(olderThanDays: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let deletedCount = 0;
    this.customTemplates.forEach((template, id) => {
      if (template.metadata?.createdAt) {
        const createdAt = new Date(template.metadata.createdAt);
        if (createdAt < cutoffDate) {
          this.customTemplates.delete(id);
          deletedCount++;
        }
      }
    });

    return deletedCount;
  }

  private generateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}