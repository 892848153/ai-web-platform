import { practices } from '../../data/bestPractices';

export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  tags: string[];
  prompt: string;
}

export interface SearchResult {
  item: KnowledgeItem;
  score: number;
}

export class KnowledgeBase {
  private knowledge: KnowledgeItem[];

  constructor() {
    this.knowledge = practices.map(practice => ({
      id: practice.id,
      title: practice.title,
      content: practice.content,
      tags: practice.tags,
      prompt: practice.prompt
    }));
  }

  /**
   * 简单的关键词匹配搜索（后续可以升级为向量搜索）
   */
  search(query: string, limit: number = 3): SearchResult[] {
    const queryLower = query.toLowerCase();

    // 扩展停用词列表，包含常见代词、问候词等
    const stopWords = [
      '如何', '怎么', '怎样', '什么', '哪里', '哪个', '哪些', '为什么', '吗', '呢', '吧', '啊',
      '你', '我', '他', '她', '它', '您', '你们', '我们', '他们',
      '好', '很', '非常', '太', '最', '更', '比较', '真', '挺', '蛮',
      '的', '了', '是', '在', '有', '和', '与', '或', '但', '而', '就', '都', '也', '还', '又', '再',
      '啊', '呀', '哦', '嗯', '喂', '嗨', '嘿', '哈', '呵'
    ];

    // 中文分词：按字符分割，并生成2-gram词组
    const chars = queryLower.split('').filter(char => char.trim() !== '');
    const bigrams = [];
    for (let i = 0; i < queryLower.length - 1; i++) {
      bigrams.push(queryLower.substring(i, i + 2));
    }

    // 过滤停用词，优先使用2-gram词组，单字符仅保留有意义的关键词
    const meaningfulChars = chars.filter(word =>
      word.length > 0 &&
      !stopWords.includes(word) &&
      /[一-龥]/.test(word) && // 只保留中文字符
      !/^[的了好是吧有在和与或但而就都也还又再]$/.test(word) // 排除常见虚词
    );

    const meaningfulBigrams = bigrams.filter(word =>
      word.length > 1 &&
      !stopWords.includes(word) &&
      !word.split('').every(char => stopWords.includes(char)) // 排除完全由停用词组成的词组
    );

    const queryWords = [
      ...meaningfulChars,
      ...meaningfulBigrams
    ];

    // 如果没有有效的关键词，直接返回空结果
    if (queryWords.length === 0) {
      console.log(`RAG搜索: "${query}" -> 无有效关键词，跳过知识库搜索`);
      return [];
    }

    const results = this.knowledge
      .map(item => {
        let score = 0;
        const searchText = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();

        // 关键词匹配评分
        for (const word of queryWords) {
          if (searchText.includes(word)) {
            score += 1;
            // 标题匹配权重更高
            if (item.title.toLowerCase().includes(word)) {
              score += 2;
            }
            // 标签匹配权重更高
            if (item.tags.some(tag => tag.toLowerCase().includes(word))) {
              score += 1.5;
            }
          }
        }

        return { item, score };
      })
      .filter(result => result.score > 0)
      // 提高匹配阈值，要求至少有一定相关性
      .filter(result => {
        const minScore = queryWords.length >= 2 ? 2 : 3; // 根据查询复杂度调整阈值
        return result.score >= minScore;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(`RAG搜索: "${query}" -> 关键词: [${queryWords.join(', ')}] -> 找到 ${results.length} 条结果`);
    return results;
  }

  /**
   * 构建 RAG 提示词
   */
  buildRagPrompt(query: string, searchResults: SearchResult[]): string {
    if (searchResults.length === 0) {
      return `请基于您的专业知识回答以下问题：\n\n问题：${query}`;
    }

    let prompt = `你是一个专业的 AI 助手，请基于以下相关知识库内容回答用户问题。\n\n`;
    prompt += `=== 相关知识库内容 ===\n\n`;

    searchResults.forEach((result, index) => {
      prompt += `【知识 ${index + 1}】\n`;
      prompt += `标题：${result.item.title}\n`;
      prompt += `内容：${result.item.content}\n`;
      prompt += `标签：${result.item.tags.join(', ')}\n`;
      prompt += `提示词模板：${result.item.prompt}\n\n`;
    });

    prompt += `=== 用户问题 ===\n`;
    prompt += `问题：${query}\n\n`;

    prompt += `=== 回答要求 ===\n`;
    prompt += `1. 优先基于上述知识库内容回答\n`;
    prompt += `2. 如果知识库中没有相关信息，请基于你的专业知识回答\n`;
    prompt += `3. 回答要详细、专业、有帮助\n`;
    prompt += `4. 如果适用，可以提供具体的代码示例或操作步骤\n\n`;

    prompt += `请给出完整的回答：`;

    return prompt;
  }

  /**
   * 获取所有标签
   */
  getAllTags(): string[] {
    const tagSet = new Set<string>();
    this.knowledge.forEach(item => {
      item.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  /**
   * 根据标签搜索
   */
  searchByTag(tag: string): KnowledgeItem[] {
    const tagLower = tag.toLowerCase();
    return this.knowledge.filter(item =>
      item.tags.some(itemTag => itemTag.toLowerCase().includes(tagLower))
    );
  }
}

// 导出单例实例
export const knowledgeBase = new KnowledgeBase();