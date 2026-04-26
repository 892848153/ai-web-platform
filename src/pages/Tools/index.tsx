import { useState } from 'react';
import { Search, Filter, ExternalLink, Star } from 'lucide-react';

const tools = [
  // 对话问答类
  {
    id: 1,
    name: 'ChatGPT',
    category: '对话问答',
    description: 'OpenAI 推出的强大语言模型，适用于各种自然语言处理任务，包括写作、编程、翻译等。',
    url: 'https://chat.openai.com',
    rating: 4.9,
    tags: ['通用', '写作', '编程'],
  },
  {
    id: 2,
    name: 'Claude',
    category: '对话问答',
    description: 'Anthropic 开发的 AI 助手，擅长长文理解、创意写作和代码分析。',
    url: 'https://claude.ai',
    rating: 4.8,
    tags: ['写作', '分析', '创意'],
  },
  {
    id: 3,
    name: '通义千问',
    category: '对话问答',
    description: '阿里云推出的 AI 语言模型，深度理解中文语境，适合国内用户使用。',
    url: 'https://tongyi.aliyun.com',
    rating: 4.7,
    tags: ['中文', '国产', '办公'],
  },
  {
    id: 4,
    name: 'Gemini',
    category: '对话问答',
    description: 'Google 开发的 AI 模型，强大的多模态理解和生成能力。',
    url: 'https://gemini.google.com',
    rating: 4.6,
    tags: ['多模态', '搜索', '分析'],
  },

  // 图像生成类
  {
    id: 5,
    name: 'Midjourney',
    category: '图像生成',
    description: '通过文本描述生成高质量艺术图像的 AI 绘画工具，以艺术性和创意性著称。',
    url: 'https://www.midjourney.com',
    rating: 4.8,
    tags: ['设计', '绘画', '创意'],
  },
  {
    id: 6,
    name: 'DALL-E 3',
    category: '图像生成',
    description: 'OpenAI 最新的图像生成模型，集成在 ChatGPT 中，生成质量极高。',
    url: 'https://openai.com/dall-e-3',
    rating: 4.7,
    tags: ['AI绘画', '创意', '设计'],
  },
  {
    id: 7,
    name: 'Stable Diffusion',
    category: '图像生成',
    description: '开源的文本到图像生成模型，可本地部署，高度可定制。',
    url: 'https://stability.ai',
    rating: 4.6,
    tags: ['开源', '本地部署', '定制'],
  },
  {
    id: 8,
    name: '文心一格',
    category: '图像生成',
    description: '百度推出的 AI 艺术和创意辅助平台，适合中文用户。',
    url: 'https://yige.baidu.com',
    rating: 4.5,
    tags: ['国产', '中文', '艺术'],
  },

  // 代码辅助类
  {
    id: 9,
    name: 'GitHub Copilot',
    category: '代码辅助',
    description: 'AI 结对程序员，提供代码自动补全、生成和建议，支持多种编程语言。',
    url: 'https://github.com/features/copilot',
    rating: 4.7,
    tags: ['编程', '效率', '开发'],
  },
  {
    id: 10,
    name: 'Trae',
    category: '代码辅助',
    description: '新一代 AI 驱动的 IDE，为你提供无缝的智能编码体验。',
    url: 'https://www.trae.ai',
    rating: 4.9,
    tags: ['编程', 'IDE', '开发'],
  },
  {
    id: 11,
    name: 'Cursor',
    category: '代码辅助',
    description: '基于 VS Code 的 AI 代码编辑器，集成了强大的 AI 编程助手。',
    url: 'https://cursor.sh',
    rating: 4.6,
    tags: ['编辑器', 'AI编程', '效率'],
  },
  {
    id: 12,
    name: 'CodeWhisperer',
    category: '代码辅助',
    description: 'Amazon 开发的 AI 代码生成工具，专为 AWS 云服务优化。',
    url: 'https://aws.amazon.com/codewhisperer',
    rating: 4.5,
    tags: ['AWS', '云服务', '代码生成'],
  },

  // 办公效率类
  {
    id: 13,
    name: 'Notion AI',
    category: '办公效率',
    description: '集成在 Notion 中的 AI 助手，帮你写作、总结、翻译、做计划。',
    url: 'https://www.notion.so/product/ai',
    rating: 4.6,
    tags: ['笔记', '总结', '办公'],
  },
  {
    id: 14,
    name: 'Microsoft Copilot',
    category: '办公效率',
    description: '微软办公套件的 AI 助手，深度集成在 Word、Excel、PowerPoint 中。',
    url: 'https://www.microsoft.com/microsoft-copilot',
    rating: 4.7,
    tags: ['Office', '办公套件', '集成'],
  },
  {
    id: 15,
    name: 'Grammarly',
    category: '办公效率',
    description: 'AI 写作助手，检查语法、拼写、标点，提升文档质量。',
    url: 'https://www.grammarly.com',
    rating: 4.5,
    tags: ['写作', '语法', '校对'],
  },
  {
    id: 16,
    name: '飞书智能助手',
    category: '办公效率',
    description: '飞书内置的 AI 助手，协助文档创作、会议总结、数据分析。',
    url: 'https://www.feishu.cn',
    rating: 4.6,
    tags: ['协作', '文档', '会议'],
  },

  // 视频生成类
  {
    id: 17,
    name: 'Runway',
    category: '视频生成',
    description: '基于浏览器的 AI 视频剪辑和生成平台，支持文本生成视频。',
    url: 'https://runwayml.com',
    rating: 4.5,
    tags: ['视频', '设计', '剪辑'],
  },
  {
    id: 18,
    name: 'Sora',
    category: '视频生成',
    description: 'OpenAI 开发的文本生成视频模型，能够创建逼真的视频内容。',
    url: 'https://openai.com/sora',
    rating: 4.8,
    tags: ['AI视频', '文本生成', '创意'],
  },
  {
    id: 19,
    name: 'Pika',
    category: '视频生成',
    description: 'AI 驱动的 3D 动画和视频生成平台，支持多种风格转换。',
    url: 'https://pika.art',
    rating: 4.4,
    tags: ['3D', '动画', '风格转换'],
  },

  // 音频处理类
  {
    id: 20,
    name: 'ElevenLabs',
    category: '音频处理',
    description: 'AI 语音生成平台，提供自然逼真的人声合成和语音克隆。',
    url: 'https://elevenlabs.io',
    rating: 4.7,
    tags: ['语音', '配音', '克隆'],
  },
  {
    id: 21,
    name: 'Descript',
    category: '音频处理',
    description: 'AI 驱动的音频视频编辑工具，支持语音转文字、AI 配音。',
    url: 'https://www.descript.com',
    rating: 4.6,
    tags: ['音频编辑', '字幕', '配音'],
  },
  {
    id: 22,
    name: '网易天音',
    category: '音频处理',
    description: '网易推出的 AI 音乐创作平台，支持智能作曲和伴奏生成。',
    url: 'https://tianyin.music.163.com',
    rating: 4.5,
    tags: ['音乐', '作曲', '伴奏'],
  },

  // 设计创意类
  {
    id: 23,
    name: 'Figma AI',
    category: '设计创意',
    description: 'Figma 的 AI 功能，智能生成设计元素、配色方案、布局建议。',
    url: 'https://www.figma.com/ai',
    rating: 4.6,
    tags: ['UI设计', '原型', '协作'],
  },
  {
    id: 24,
    name: 'Canva AI',
    category: '设计创意',
    description: 'Canva 的 AI 设计助手，一键生成海报、logo、社交媒体内容。',
    url: 'https://www.canva.com/ai-design-tool',
    rating: 4.7,
    tags: ['平面设计', '模板', '一键生成'],
  },
  {
    id: 25,
    name: 'LogoMaker AI',
    category: '设计创意',
    description: 'AI 驱动的 logo 设计工具，几分钟内生成专业的品牌标识。',
    url: 'https://www.logomaker.ai',
    rating: 4.4,
    tags: ['Logo', '品牌', '标识设计'],
  },

  // 数据分析类
  {
    id: 26,
    name: 'Tableau AI',
    category: '数据分析',
    description: 'Tableau 的 AI 功能，智能数据洞察、自然语言查询、自动可视化。',
    url: 'https://www.tableau.com/products/ai',
    rating: 4.6,
    tags: ['数据可视化', '商业智能', '洞察'],
  },
  {
    id: 27,
    name: 'Power BI Copilot',
    category: '数据分析',
    description: '微软 Power BI 的 AI 助手，用自然语言创建报表和数据分析。',
    url: 'https://powerbi.microsoft.com',
    rating: 4.5,
    tags: ['BI', '报表', '自然语言'],
  },
  {
    id: 28,
    name: 'DataRobot',
    category: '数据分析',
    description: '自动化机器学习平台，无需编程经验即可构建预测模型。',
    url: 'https://www.datarobot.com',
    rating: 4.4,
    tags: ['机器学习', '自动化', '预测'],
  }
];

const categories = ['全部', '对话问答', '图像生成', '代码辅助', '办公效率', '视频生成', '音频处理', '设计创意', '数据分析'];

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
        <p className="text-gray-400 max-w-3xl">
          发现、比较、使用最适合你的 AI 工具。从代码生成到文案创作，从图像设计到视频制作，汇聚全球最优秀的 AI 工具，提升你的职场生产力和创造力。
        </p>
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          <div className="bg-cyber-purple/10 border border-cyber-purple/30 px-3 py-1 rounded-full text-sm text-cyber-purple">
            🔥 精选 28+ 优质工具
          </div>
          <div className="bg-cyber-accent/10 border border-cyber-accent/30 px-3 py-1 rounded-full text-sm text-cyber-accent">
            ⭐ 专业评分推荐
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm text-gray-400">
            🎯 按场景分类
          </div>
        </div>
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
          <div key={tool.id} className="glass-panel p-6 group hover:border-cyber-accent/50 transition-all duration-300 hover:shadow-neon-blue flex flex-col h-full hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-accent transition-colors truncate">{tool.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-cyber-purple/20 border border-cyber-purple/30 text-cyber-purple">
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">{tool.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">
              {tool.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {tool.tags.map((tag) => (
                <span key={tag} className="text-xs text-cyber-accent bg-cyber-accent/10 px-2 py-1 rounded-sm border border-cyber-accent/20 hover:bg-cyber-accent/20 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full py-3 bg-gradient-to-r from-cyber-purple/10 to-cyber-accent/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-sm text-white hover:from-cyber-purple/20 hover:to-cyber-accent/20 hover:border-cyber-accent transition-all duration-300 font-medium group/btn"
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

      {/* 底部统计和使用提示 */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 text-center">
          <div className="text-3xl font-bold text-cyber-purple mb-2">{tools.length}+</div>
          <div className="text-gray-400 text-sm">精选 AI 工具</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-3xl font-bold text-cyber-accent mb-2">{categories.length - 1}</div>
          <div className="text-gray-400 text-sm">专业分类</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">4.6+</div>
          <div className="text-gray-400 text-sm">平均评分</div>
        </div>
      </div>

      <div className="mt-8 glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-cyber-accent" />
          使用指南
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <h4 className="font-medium text-white mb-2">🔍 如何搜索</h4>
            <p>使用搜索框输入工具名称、功能描述或关键词，快速找到你需要的 AI 工具。</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">📁 分类浏览</h4>
            <p>点击分类标签按场景筛选工具，如对话问答、图像生成、代码辅助等。</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">⭐ 评分参考</h4>
            <p>每个工具都有用户评分，帮助你选择最受欢迎和实用的 AI 工具。</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🏷️ 标签系统</h4>
            <p>工具标签显示主要功能特点，帮你快速了解工具的核心能力。</p>
          </div>
        </div>
      </div>
    </div>
  );
}