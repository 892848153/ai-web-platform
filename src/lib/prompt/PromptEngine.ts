import { PromptTemplate, PromptContext, OptimizedPrompt } from '@/types/prompt';

export class PromptEngine {
  private templates: PromptTemplate[] = [
    {
      id: 'qa-basic',
      name: '基础问答',
      description: '适用于一般性的问答场景',
      category: 'qa',
      template: '你是一个专业的AI助手，请根据用户的问题提供准确、详细的回答。\n\n用户问题: {question}\n\n请提供清晰、有条理的回答。',
      variables: ['question'],
      examples: ['什么是人工智能？', '如何学习编程？'],
      metadata: {
        difficulty: 'beginner',
        estimatedTokens: 500,
        tags: ['问答', '基础']
      }
    },
    {
      id: 'analysis-complex',
      name: '复杂分析',
      description: '适用于需要深度分析的问题',
      category: 'analysis',
      template: '你是一个专业的分析专家。请对以下问题进行深入分析：\n\n问题: {question}\n\n请按照以下结构回答：\n1. 问题理解：分析问题的核心要点\n2. 关键因素：识别影响问题的主要因素\n3. 分析过程：详细的分析推理过程\n4. 结论建议：基于分析的结论和建议\n\n分析时请注意：\n- 逻辑清晰，推理严密\n- 考虑多个维度和角度\n- 提供具体可行的建议',
      variables: ['question'],
      examples: ['分析当前AI技术的发展趋势', '评估某个商业模式的优缺点'],
      metadata: {
        difficulty: 'advanced',
        estimatedTokens: 1500,
        tags: ['分析', '深度', '专业']
      }
    },
    {
      id: 'creative-content',
      name: '创意内容生成',
      description: '适用于创意写作和内容生成',
      category: 'creation',
      template: '你是一个富有创造力的内容专家。请根据以下要求创作内容：\n\n创作要求: {question}\n\n风格要求: {style}\n\n请创作出：\n1. 引人入胜的开头\n2. 内容丰富的主体\n3. 有力的结尾\n\n创作时请注意：\n- 语言生动，表达清晰\n- 内容原创，避免陈词滥调\n- 符合指定的风格和语调',
      variables: ['question', 'style'],
      examples: ['写一篇关于未来的科幻小说', '创作一个产品营销文案'],
      metadata: {
        difficulty: 'intermediate',
        estimatedTokens: 1000,
        tags: ['创意', '写作', '内容']
      }
    },
    {
      id: 'summary-comprehensive',
      name: '综合总结',
      description: '适用于信息总结和归纳',
      category: 'summary',
      template: '你是一个专业的信息整理专家。请对以下内容进行总结：\n\n待总结内容: {content}\n\n总结要求: {requirements}\n\n请提供：\n1. 核心要点：提取最关键的信息\n2. 重要细节：保留重要的支撑信息\n3. 逻辑结构：保持原有的逻辑关系\n4. 简洁表达：用简洁明了的语言表达\n\n总结时请注意：\n- 保持客观中立\n- 不遗漏重要信息\n- 逻辑清晰，条理分明',
      variables: ['content', 'requirements'],
      examples: ['总结一篇长文的主要内容', '归纳会议讨论的关键点'],
      metadata: {
        difficulty: 'intermediate',
        estimatedTokens: 800,
        tags: ['总结', '归纳', '整理']
      }
    },
    {
      id: 'workflow-orchestration',
      name: '工作流编排',
      description: '适用于多步骤任务的分解和执行',
      category: 'workflow',
      template: '你是一个专业的工作流编排专家。请将以下复杂任务分解为可执行的步骤：\n\n主任务: {task}\n\n任务背景: {context}\n\n请：\n1. 任务分解：将主任务分解为具体的子任务\n2. 优先级排序：确定各子任务的执行顺序\n3. 资源评估：分析每个子任务需要的资源和时间\n4. 风险评估：识别潜在的风险和挑战\n5. 执行计划：制定详细的执行计划\n\n编排时请注意：\n- 步骤清晰，可操作性强\n- 考虑依赖关系和时间约束\n- 提供备选方案和应急措施',
      variables: ['task', 'context'],
      examples: ['制定一个产品开发计划', '规划一次市场推广活动'],
      metadata: {
        difficulty: 'advanced',
        estimatedTokens: 2000,
        tags: ['工作流', '规划', '执行']
      }
    }
  ];

  // 优化Prompt
  async optimizePrompt(originalPrompt: string, context: PromptContext): Promise<OptimizedPrompt> {
    // 分析原始Prompt
    const analysis = this.analyzePrompt(originalPrompt, context);

    // 选择合适的模板
    const template = this.selectTemplate(analysis, context);

    // 构建优化后的Prompt
    const optimizedPrompt = this.buildOptimizedPrompt(template, originalPrompt, context);

    // 构建系统Prompt
    const systemPrompt = this.buildSystemPrompt(template, context);

    // 评估优化效果
    const improvements = this.identifyImprovements(originalPrompt, optimizedPrompt, template);
    const estimatedQuality = this.estimateQuality(optimizedPrompt, template, context);

    return {
      originalPrompt,
      optimizedPrompt,
      systemPrompt,
      template,
      improvements,
      estimatedQuality
    };
  }

  // 分析Prompt特征
  private analyzePrompt(prompt: string, context: PromptContext) {
    const analysis = {
      length: prompt.length,
      complexity: this.assessComplexity(prompt),
      taskType: this.identifyTaskType(prompt),
      keywords: this.extractKeywords(prompt),
      structure: this.analyzeStructure(prompt)
    };

    return analysis;
  }

  // 评估复杂度
  private assessComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const wordCount = prompt.split(/\s+/).length;
    const hasComplexStructures = /分析|评估|比较|设计|规划|策略|框架|系统|流程/.test(prompt);
    const hasMultipleRequirements = (prompt.match(/[。！？；]/g) || []).length > 2;

    if (wordCount > 100 || hasComplexStructures || hasMultipleRequirements) {
      return 'complex';
    } else if (wordCount > 50) {
      return 'medium';
    } else {
      return 'simple';
    }
  }

  // 识别任务类型
  private identifyTaskType(prompt: string): string {
    const taskPatterns = {
      analysis: /分析|研究|评估|诊断|调查|比较|对比/,
      creation: /创作|设计|编写|制作|生成|写|画|构思/,
      summary: /总结|归纳|概括|提炼|整理|简述/,
      qa: /什么|为什么|如何|怎样|是否|能否/,
      workflow: /计划|规划|步骤|流程|安排|制定|执行/
    };

    for (const [type, pattern] of Object.entries(taskPatterns)) {
      if (pattern.test(prompt)) {
        return type;
      }
    }

    return 'qa'; // 默认为问答类型
  }

  // 提取关键词
  private extractKeywords(prompt: string): string[] {
    const keywords = prompt
      .replace(/[，。！？；：""''（）【】\[\]]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)
      .slice(0, 10);

    return keywords;
  }

  // 分析结构
  private analyzeStructure(prompt: string) {
    return {
      hasQuestion: /[？?]/.test(prompt),
      hasInstructions: /请|要求|需要|应该/.test(prompt),
      hasConstraints: /限制|约束|条件|必须|不能/.test(prompt),
      hasExamples: /例如|比如|示例|举例/.test(prompt)
    };
  }

  // 选择合适模板
  private selectTemplate(analysis: any, context: PromptContext): PromptTemplate {
    // 基于任务类型选择
    const categoryTemplates = this.templates.filter(t => t.category === analysis.taskType);
    if (categoryTemplates.length > 0) {
      // 基于用户水平选择难度
      const difficultyMatch = categoryTemplates.filter(t => t.metadata.difficulty === context.userLevel);
      if (difficultyMatch.length > 0) {
        return difficultyMatch[0];
      }
      return categoryTemplates[0];
    }

    // 基于复杂度选择
    if (analysis.complexity === 'complex') {
      const complexTemplates = this.templates.filter(t => t.metadata.difficulty === 'advanced');
      if (complexTemplates.length > 0) {
        return complexTemplates[0];
      }
    }

    // 默认返回基础问答模板
    return this.templates.find(t => t.id === 'qa-basic') || this.templates[0];
  }

  // 构建优化后的Prompt
  private buildOptimizedPrompt(template: PromptTemplate, originalPrompt: string, context: PromptContext): string {
    let optimizedPrompt = template.template;

    // 替换变量
    template.variables.forEach(variable => {
      const placeholder = `{${variable}}`;
      let value = '';

      switch (variable) {
        case 'question':
          value = originalPrompt;
          break;
        case 'content':
          value = originalPrompt;
          break;
        case 'task':
          value = originalPrompt;
          break;
        case 'style':
          value = this.inferStyle(context);
          break;
        case 'requirements':
          value = this.inferRequirements(context);
          break;
        case 'context':
          value = context.previousContext || '无特殊背景信息';
          break;
        default:
          value = context.domain || '通用';
      }

      optimizedPrompt = optimizedPrompt.replace(new RegExp(placeholder, 'g'), value);
    });

    // 添加上下文信息
    if (context.constraints && context.constraints.length > 0) {
      optimizedPrompt += '\n\n额外约束：\n';
      context.constraints.forEach(constraint => {
        optimizedPrompt += `- ${constraint}\n`;
      });
    }

    if (context.examples && context.examples.length > 0) {
      optimizedPrompt += '\n\n参考示例：\n';
      context.examples.forEach(example => {
        optimizedPrompt += `- ${example}\n`;
      });
    }

    return optimizedPrompt;
  }

  // 构建系统Prompt
  private buildSystemPrompt(template: PromptTemplate, context: PromptContext): string {
    const basePrompt = template.metadata.tags.join('、');
    const levelPrompt = this.getUserLevelPrompt(context.userLevel);
    const domainPrompt = context.domain ? `专注于${context.domain}领域` : '通用领域';

    return `你是一个专业的AI助手，擅长${basePrompt}。${levelPrompt} ${domainPrompt}。请根据用户的具体需求，提供高质量、有针对性的回答。`;
  }

  // 推断风格
  private inferStyle(context: PromptContext): string {
    const styles = {
      beginner: '简单明了，易于理解',
      intermediate: '专业但不晦涩，逻辑清晰',
      advanced: '深入专业，包含技术细节'
    };

    return styles[context.userLevel] || styles.beginner;
  }

  // 推断要求
  private inferRequirements(context: PromptContext): string {
    return '准确、完整、有条理，符合用户的专业水平';
  }

  // 获取用户水平描述
  private getUserLevelPrompt(level: string): string {
    const prompts = {
      beginner: '使用简单易懂的语言，避免过于专业的术语',
      intermediate: '在保持易懂的同时，可以适当使用专业术语并提供解释',
      advanced: '可以使用专业术语，提供深入的技术细节和分析'
    };

    return prompts[level] || prompts.beginner;
  }

  // 识别改进点
  private identifyImprovements(original: string, optimized: string, template: PromptTemplate): string[] {
    const improvements: string[] = [];

    if (optimized.length > original.length * 1.5) {
      improvements.push('增加了详细的指导说明');
    }

    if (template.category !== 'qa') {
      improvements.push(`使用了专门的${template.name}模板`);
    }

    if (optimized.includes('步骤') || optimized.includes('结构')) {
      improvements.push('添加了清晰的结构化指导');
    }

    if (optimized.includes('注意') || optimized.includes('要求')) {
      improvements.push('增加了质量要求和注意事项');
    }

    return improvements;
  }

  // 评估质量
  private estimateQuality(prompt: string, template: PromptTemplate, context: PromptContext): number {
    let quality = 0.5; // 基础分数

    // 模板匹配度
    if (template.metadata.difficulty === context.userLevel) {
      quality += 0.2;
    }

    // 提示词完整性
    if (prompt.includes('步骤') || prompt.includes('结构')) {
      quality += 0.1;
    }

    // 约束条件
    if (context.constraints && context.constraints.length > 0) {
      quality += 0.1;
    }

    // 示例提供
    if (context.examples && context.examples.length > 0) {
      quality += 0.1;
    }

    return Math.min(quality, 1.0);
  }

  // 获取所有模板
  getTemplates(): PromptTemplate[] {
    return this.templates;
  }

  // 根据分类获取模板
  getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.templates.filter(t => t.category === category);
  }

  // 根据难度获取模板
  getTemplatesByDifficulty(difficulty: string): PromptTemplate[] {
    return this.templates.filter(t => t.metadata.difficulty === difficulty);
  }
}