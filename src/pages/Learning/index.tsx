import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Eye, Network, Wrench, Play, CheckCircle2, ChevronRight, Zap, BookOpen, Fingerprint, Activity, Code, Cpu } from 'lucide-react';

const aiAnatomy = [
  {
    id: 'brain',
    icon: Brain,
    title: '大脑中枢：大语言模型 (LLM)',
    shortTitle: '基础算力与模型',
    description: 'AI 的中枢神经。负责理解自然语言、逻辑推理、生成文本。如同人类的大脑，它是所有智能行为的发源地和基础算力来源。',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    courses: [
      { title: 'LLM 基础与 Transformer 架构剖析', progress: 100, level: '入门', duration: '2小时' },
      { title: '本地开源模型 (Ollama/vLLM) 部署实战', progress: 0, level: '专家', duration: '5小时' },
      { title: 'MoE (混合专家模型) 架构解析', progress: 0, level: '专家', duration: '3小时' }
    ]
  },
  {
    id: 'language',
    icon: Fingerprint,
    title: '沟通语言：提示词工程 (Prompt)',
    shortTitle: '沟通与表达',
    description: '人类与 AI 的交流协议。Prompt 是激活大脑特定区域的“咒语”，决定了 AI 的思考方向、角色设定和输出质量。',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/30',
    glow: 'shadow-[0_0_20px_rgba(244,114,182,0.3)]',
    courses: [
      { title: 'Prompt Engineering 基础结构 (CRISPE)', progress: 80, level: '入门', duration: '1.5小时' },
      { title: '思维链 (CoT) 与反思 (Reflexion) 技巧', progress: 40, level: '进阶', duration: '3小时' },
      { title: '少样本提示 (Few-Shot) 的艺术', progress: 0, level: '进阶', duration: '2小时' }
    ]
  },
  {
    id: 'skills',
    icon: Code,
    title: '后天技能：Skill 与 Function Calling',
    shortTitle: '专业技能库',
    description: 'AI 学习到的具体专业能力（Skill）。它使 AI 从“只会聊天的百科全书”转变为“可以执行特定任务（如写代码、查天气）的专业助手”。',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/30',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    courses: [
      { title: 'OpenAI Function Calling 机制解析', progress: 20, level: '进阶', duration: '3小时' },
      { title: '如何为 AI 编写原子化的 Skill', progress: 0, level: '进阶', duration: '2.5小时' },
      { title: '多 Skill 智能调度与组合策略', progress: 0, level: '专家', duration: '4小时' }
    ]
  },
  {
    id: 'limbs',
    icon: Wrench,
    title: '行动手脚：MCP (模型上下文协议)',
    shortTitle: '现实世界接口',
    description: 'AI 的物理执行器官。MCP (Model Context Protocol) 是一种标准化接口，让 AI 能够连接本地IDE、读写文件系统、操作企业级 API，从而真正在现实世界中"做事"。',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
    courses: [
      { title: 'MCP 协议架构与通信原理', progress: 10, level: '进阶', duration: '3小时' },
      { title: '编写自定义的 MCP Server', progress: 0, level: '专家', duration: '5小时' },
      { title: 'Cursor/Trae 中的 MCP 深度集成', progress: 0, level: '进阶', duration: '2小时' }
    ]
  },
  {
    id: 'synapses',
    icon: Activity,
    title: '神经突触：Hook 与生命周期',
    shortTitle: '事件与干预机制',
    description: 'AI 运行时的干预节点。Hook 允许我们在 AI 思考前（Pre-hook）、思考中、输出后（Post-hook）插入自定义逻辑，如安全拦截、数据脱敏或日志审计。',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    courses: [
      { title: '大模型应用生命周期管理', progress: 0, level: '入门', duration: '1小时' },
      { title: '利用 Hook 实现敏感词拦截与数据脱敏', progress: 0, level: '进阶', duration: '2.5小时' },
      { title: '基于 Middleware 的上下文动态注入', progress: 0, level: '专家', duration: '3小时' }
    ]
  },
  {
    id: 'memory',
    icon: Database,
    title: '海马体：记忆库 (RAG & 向量空间)',
    shortTitle: '长期与短期记忆',
    description: 'AI 的记忆系统。通过检索增强生成 (RAG) 解决幻觉，短期记忆管理当前对话，长期记忆（向量数据库）则沉淀海量企业私有知识。',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)]',
    courses: [
      { title: 'RAG 架构与文本切分 (Chunking) 策略', progress: 0, level: '进阶', duration: '4小时' },
      { title: 'Milvus / Qdrant 向量数据库原理实战', progress: 0, level: '专家', duration: '6小时' },
      { title: '记忆流管理：Mem0 与会话级记忆', progress: 0, level: '专家', duration: '4.5小时' }
    ]
  },
  {
    id: 'evolution',
    icon: Cpu,
    title: '基因进化：微调 (Fine-tuning)',
    shortTitle: '模型基因重塑',
    description: 'AI 的基因改造。当 Prompt 无法满足深度的垂直领域需求时，通过 SFT (监督微调) 或 LoRA 等技术，直接改变模型的“肌肉记忆”和基础能力。',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
    courses: [
      { title: 'Prompt 工程 vs RAG vs 微调 的边界', progress: 0, level: '入门', duration: '1.5小时' },
      { title: 'LoRA 与 PEFT 高效微调技术解析', progress: 0, level: '专家', duration: '5小时' },
      { title: '构建高质量的指令微调数据集', progress: 0, level: '专家', duration: '4小时' }
    ]
  },
  {
    id: 'senses',
    icon: Eye,
    title: '五官感官：多模态 (Multi-modal)',
    shortTitle: '视听感知系统',
    description: 'AI 的眼睛和耳朵。多模态模型 (如 GPT-4o, Claude 3.5 Sonnet) 让 AI 能够看懂设计图、听懂语音、分析视频流，彻底打破文本限制。',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    courses: [
      { title: '视觉大模型 (VLM) 与 OCR 解析', progress: 0, level: '进阶', duration: '3小时' },
      { title: 'Whisper 语音识别与 TTS 情感生成', progress: 0, level: '进阶', duration: '2.5小时' },
      { title: 'Sora 级视频生成模型原理解析', progress: 0, level: '专家', duration: '2小时' }
    ]
  },
  {
    id: 'nervous',
    icon: Network,
    title: '自主意识：Agent 编排框架',
    shortTitle: '神经协作中枢',
    description: 'AI 的自主意识与群体协作系统。通过 LangChain 或 Dify 这样的框架，赋予 AI 自主规划 (Planning)、反思错误、并调度多 Agent (如前端+后端+测试Agent) 协同工作的能力。',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.3)]',
    courses: [
      { title: 'ReAct 框架与 Agent 规划能力', progress: 0, level: '进阶', duration: '3小时' },
      { title: 'Multi-Agent 协作：AutoGen 与 MetaGPT', progress: 0, level: '专家', duration: '6小时' },
      { title: 'Dify 可视化智能体工作流搭建', progress: 0, level: '入门', duration: '2.5小时' }
    ]
  }
];

export default function LearningCenter() {
  const [activePart, setActivePart] = useState(aiAnatomy[0].id);

  const selectedPart = aiAnatomy.find(p => p.id === activePart)!;

  return (
    <div className="container mx-auto px-4 py-12 flex-1 flex flex-col">
      <div className="flex flex-col items-center mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm mb-6"
        >
          <Zap className="h-4 w-4" />
          <span>全新互动式学习体验</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyber-accent"
        >
          AI 构造学：从零解构人工智能
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl"
        >
          打破黑盒，将 AI 视作一个"硅基生命体"。通过探索它的感官、大脑、记忆与手脚，构建完整的技术认知地图。
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-1">
        
        {/* Left Side: Interactive Anatomy Map */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 relative">
          {/* A cool vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-purple-500/20 via-blue-500/20 to-rose-500/20 z-0 hidden lg:block"></div>
          
          {aiAnatomy.map((part, index) => {
            const isActive = activePart === part.id;
            const Icon = part.icon;
            return (
              <motion.button
                key={part.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActivePart(part.id)}
                className={`relative z-10 flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left border ${
                  isActive 
                    ? `bg-cyber-dark/80 ${part.borderColor} ${part.glow}` 
                    : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className={`shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${isActive ? part.bgColor : 'bg-white/5'}`}>
                  <Icon className={`h-6 w-6 ${isActive ? part.color : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {part.shortTitle}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{part.title.split('：')[1]}</div>
                </div>
                {isActive && (
                  <motion.div layoutId="activeIndicator" className={`absolute right-4 ${part.color}`}>
                    <ChevronRight className="h-5 w-5" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Right Side: Detailed Modules & Courses */}
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPart.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Detail Header */}
              <div className={`glass-panel p-8 mb-6 border-t-4 ${selectedPart.borderColor.replace('border-', 'border-t-')} relative overflow-hidden`}>
                <div className={`absolute -right-10 -top-10 opacity-10 ${selectedPart.color}`}>
                  <selectedPart.icon className="h-48 w-48" />
                </div>
                <h2 className={`text-3xl font-bold mb-4 ${selectedPart.color}`}>
                  {selectedPart.title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg relative z-10">
                  {selectedPart.description}
                </p>
              </div>

              {/* Courses List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  相关学习模块
                </h3>
                
                {selectedPart.courses.map((course, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    key={idx} 
                    className="glass-panel p-5 flex flex-col sm:flex-row gap-4 items-center group hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs px-2 py-1 rounded border ${
                          course.level === '入门' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                          course.level === '进阶' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                          'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        }`}>
                          {course.level}
                        </span>
                        <span className="text-xs text-gray-500">{course.duration}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                        {course.title}
                      </h4>
                      
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${selectedPart.bgColor.replace('bg-', 'bg-').replace('/10', '')}`} 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono text-gray-400 w-8">{course.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 w-full sm:w-auto flex justify-end">
                      {course.progress === 100 ? (
                        <button className="flex items-center justify-center gap-2 w-full sm:w-32 py-2 rounded bg-white/5 border border-white/10 text-gray-400 cursor-default text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          已掌握
                        </button>
                      ) : (
                        <button className={`flex items-center justify-center gap-2 w-full sm:w-32 py-2 rounded border transition-all text-sm font-medium ${
                          course.progress > 0 
                            ? `${selectedPart.bgColor} ${selectedPart.borderColor} ${selectedPart.color} hover:brightness-125` 
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}>
                          <Play className="h-4 w-4" />
                          {course.progress > 0 ? '继续学习' : '开始学习'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
