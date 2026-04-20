import { useState } from 'react';
import { Search, Filter, ExternalLink, Star } from 'lucide-react';

const tools = [
  {
    id: 1,
    name: 'ChatGPT',
    category: '对话问答',
    description: 'OpenAI 推出的强大语言模型，适用于各种自然语言处理任务。',
    url: 'https://chat.openai.com',
    rating: 4.9,
    tags: ['通用', '写作', '编程'],
  },
  {
    id: 2,
    name: 'Midjourney',
    category: '图像生成',
    description: '通过文本描述生成高质量艺术图像的 AI 绘画工具。',
    url: 'https://www.midjourney.com',
    rating: 4.8,
    tags: ['设计', '绘画', '创意'],
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    category: '代码辅助',
    description: 'AI 结对程序员，提供代码自动补全和建议。',
    url: 'https://github.com/features/copilot',
    rating: 4.7,
    tags: ['编程', '效率', '开发'],
  },
  {
    id: 4,
    name: 'Notion AI',
    category: '办公效率',
    description: '集成在 Notion 中的 AI 助手，帮你写作、总结、做计划。',
    url: 'https://www.notion.so/product/ai',
    rating: 4.6,
    tags: ['笔记', '总结', '办公'],
  },
  {
    id: 5,
    name: 'Runway',
    category: '视频生成',
    description: '基于浏览器的 AI 视频剪辑和生成平台。',
    url: 'https://runwayml.com',
    rating: 4.5,
    tags: ['视频', '设计', '剪辑'],
  },
  {
    id: 6,
    name: 'Trae',
    category: '代码辅助',
    description: '新一代 AI 驱动的 IDE，为你提供无缝的智能编码体验。',
    url: 'https://www.trae.ai',
    rating: 4.9,
    tags: ['编程', 'IDE', '开发'],
  }
];

const categories = ['全部', '对话问答', '图像生成', '代码辅助', '办公效率', '视频生成'];

export default function ToolsSquare() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '全部' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-purple">
          AI 工具广场
        </h1>
        <p className="text-gray-400 max-w-2xl">
          发现、比较、使用最适合你的 AI 工具。从代码生成到文案创作，提升你的职场生产力。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between glass-panel p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索 AI 工具..."
            className="w-full bg-cyber-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-cyber-accent text-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <Filter className="h-5 w-5 text-cyber-accent shrink-0 mr-2" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-cyber-accent/20 border-cyber-accent text-cyber-accent shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="glass-panel p-6 group hover:border-cyber-accent/50 transition-all duration-300 hover:shadow-neon-blue flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyber-accent transition-colors">{tool.name}</h3>
                <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                  {tool.category}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">{tool.rating}</span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 flex-1">
              {tool.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {tool.tags.map((tag) => (
                <span key={tag} className="text-xs text-cyber-purple bg-cyber-purple/10 px-2 py-1 rounded-sm border border-cyber-purple/20">
                  #{tag}
                </span>
              ))}
            </div>
            
            <a 
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-sm text-white hover:bg-cyber-accent hover:text-cyber-dark hover:border-cyber-accent transition-all duration-300 font-medium group/btn"
            >
              <span>立即体验</span>
              <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-4">
            <Search className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl text-white mb-2">未找到匹配的工具</h3>
          <p className="text-gray-400">尝试更换搜索关键词或分类</p>
        </div>
      )}
    </div>
  );
}