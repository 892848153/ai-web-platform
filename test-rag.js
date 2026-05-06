// 简单的RAG知识库测试脚本
console.log('=== 测试RAG知识库搜索功能 ===');

// 模拟知识库数据
const practices = [
  {
    id: 182,
    title: "全屋智能家居系统规划与设备选型指南",
    content: "完整的智能家居系统规划方案，包含需求分析、系统架构设计、设备选型和安装部署指导。",
    tags: ["智能家居", "物联网", "家庭自动化", "设备选型"],
    prompt: "请基于智能家居系统规划的专业知识，为用户提供详细的设备选型和系统设计方案。"
  },
  {
    id: 192,
    title: "智能家居安全防护与隐私保护策略",
    content: "智能家居安全防护体系构建，包含网络安全、数据隐私、设备安全等全方位保护策略。",
    tags: ["智能家居", "网络安全", "隐私保护", "数据加密"],
    prompt: "请为用户提供智能家居安全防护的专业建议和实施策略。"
  }
];

// 模拟搜索功能
function testSearch(query) {
  const queryLower = query.toLowerCase();
  const stopWords = ['如何', '怎么', '怎样', '什么', '哪里', '哪个', '哪些', '为什么', '吗', '呢', '吧', '啊'];

  // 改进的分词逻辑：按字符分割并过滤
  const queryWords = queryLower
    .split('')
    .filter(word => word.length > 0)
    .filter(word => !stopWords.includes(word))
    .filter(word => word.trim() !== '');

  // 也尝试2-gram分词
  const bigrams = [];
  for (let i = 0; i < queryLower.length - 1; i++) {
    const bigram = queryLower.substring(i, i + 2);
    if (!stopWords.includes(bigram) && bigram.trim() !== '') {
      bigrams.push(bigram);
    }
  }

  const allQueryWords = [...queryWords, ...bigrams];
  console.log(`搜索查询: "${query}" -> 单字: [${queryWords.join(', ')}] -> 双字: [${bigrams.join(', ')}]`);

  const results = practices
    .map(item => {
      let score = 0;
      const searchText = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();

      // 使用所有分词进行匹配
      for (const word of allQueryWords) {
        if (searchText.includes(word)) {
          score += 1;
          if (item.title.toLowerCase().includes(word)) {
            score += 2;
          }
          if (item.tags.some(tag => tag.toLowerCase().includes(word))) {
            score += 1.5;
          }
        }
      }

      return { item, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}

// 测试搜索
const testQuery = '智能家居系统如何设计';
const results = testSearch(testQuery);

console.log(`找到 ${results.length} 条相关结果:`);

results.forEach((result, index) => {
  console.log(`\n【结果 ${index + 1}】(匹配度: ${result.score})`);
  console.log(`标题: ${result.item.title}`);
  console.log(`内容: ${result.item.content}`);
  console.log(`标签: ${result.item.tags.join(', ')}`);
});