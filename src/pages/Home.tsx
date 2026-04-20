import { Link } from 'react-router-dom';
import { Terminal, Bot, Cpu, GraduationCap, Briefcase, ArrowRight, Zap } from 'lucide-react';

const features = [
  {
    icon: Terminal,
    title: 'AI 工具广场',
    description: '汇聚全球顶尖 AI 工具，场景化分类，一键直达你的效率神器。',
    path: '/tools',
    color: 'text-cyber-accent',
    border: 'group-hover:border-cyber-accent',
    shadow: 'group-hover:shadow-neon-blue',
  },
  {
    icon: Bot,
    title: '智能问答助手',
    description: '搭载先进大模型 longcat，随时解答你的职场与技术难题。',
    path: '/qa',
    color: 'text-cyber-purple',
    border: 'group-hover:border-cyber-purple',
    shadow: 'group-hover:shadow-neon-purple',
  },
  {
    icon: Cpu,
    title: '最佳实践区',
    description: '探索真实的 AI 落地场景与模板，站在巨人的肩膀上起飞。',
    path: '/practices',
    color: 'text-cyber-green',
    border: 'group-hover:border-cyber-green',
    shadow: 'group-hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]',
  },
  {
    icon: GraduationCap,
    title: 'AI 学习中心',
    description: '从入门到精通，系统化掌握 AI 技能，打破职场技能焦虑。',
    path: '/learning',
    color: 'text-blue-400',
    border: 'group-hover:border-blue-400',
    shadow: 'group-hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]',
  },
  {
    icon: Briefcase,
    title: '需求悬赏广场',
    description: '发布你的痛点需求，让 AI 专家为你量身定制解决方案。',
    path: '/rewards',
    color: 'text-yellow-400',
    border: 'group-hover:border-yellow-400',
    shadow: 'group-hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]',
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-accent/30 bg-cyber-accent/10 text-cyber-accent mb-8 animate-float">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium tracking-wider">SYSTEM ONLINE. READY FOR INPUT.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="block text-white mb-2">职场人的终极</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent via-cyber-purple to-cyber-neon animate-pulse-glow">
            AI 效率加速器
          </span>
        </h1>
        
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          打破技术焦虑，掌握未来生产力。一站式整合顶级 AI 工具、最佳实践与智能问答，助你实现 10x 效率飞跃。
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link to="/qa" className="cyber-button group px-8 py-4 bg-cyber-accent/10 border border-cyber-accent text-cyber-accent rounded-lg flex items-center gap-2 hover:shadow-neon-blue">
            <Bot className="h-5 w-5" />
            <span>启动智能助手</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/tools" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <span>浏览工具广场</span>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className={`group glass-panel p-8 transition-all duration-300 hover:-translate-y-2 border border-white/5 ${feature.border} ${feature.shadow}`}
              >
                <div className={`h-12 w-12 rounded-lg bg-cyber-dark border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}