import { Clock, DollarSign, Users, ChevronRight } from 'lucide-react';

const rewards = [
  {
    id: 1,
    title: '需要一个定制的爬虫 AI 代理，能自动分析并提取数据',
    requester: '数据分析部 - 李总',
    budget: '￥2000',
    deadline: '2026-05-01',
    applicants: 3,
    status: '招募中',
    tags: ['Python', '爬虫', '大模型应用'],
  },
  {
    id: 2,
    title: '基于公司知识库的客服问答机器人调优',
    requester: '客户服务部 - 王经理',
    budget: '￥3500',
    deadline: '2026-04-30',
    applicants: 5,
    status: '进行中',
    tags: ['RAG', 'LangChain', '向量数据库'],
  },
  {
    id: 3,
    title: '自动化生成小红书爆款文案和配图的工作流搭建',
    requester: '市场营销部 - 张总监',
    budget: '￥1500',
    deadline: '2026-04-25',
    applicants: 8,
    status: '招募中',
    tags: ['Midjourney', 'Prompt', '自动化'],
  }
];

export default function RewardsSquare() {
  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyber-accent">
          需求悬赏广场
        </h1>
        <p className="text-gray-400 max-w-2xl">
          发布痛点需求，悬赏寻找 AI 达人。打破部门壁垒，用 AI 解决实际业务问题。
        </p>
      </div>

      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <div className="text-white text-xl font-bold">最新悬赏 <span className="text-yellow-400">({rewards.length})</span></div>
        <button className="cyber-button px-6 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] text-sm transition-all duration-300">
          发布需求
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="glass-panel p-6 flex flex-col md:flex-row gap-6 justify-between group hover:border-yellow-400/30 transition-all duration-300">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  reward.status === '招募中' 
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                    : 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                }`}>
                  {reward.status}
                </span>
                <span className="text-sm text-gray-500">{reward.requester}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">{reward.title}</h3>
              
              <div className="flex flex-wrap gap-2">
                {reward.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[200px]">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-2xl mb-2 md:mb-0">
                <DollarSign className="h-6 w-6" />
                {reward.budget}
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  截止: {reward.deadline}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  已有 {reward.applicants} 人申请
                </div>
              </div>
              
              <button className="mt-4 w-full md:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-white/5 hover:bg-yellow-400 hover:text-cyber-dark text-white rounded transition-colors group/btn text-sm font-medium">
                查看详情
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}