import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Eye, Network, Wrench, Play, CheckCircle2, ChevronRight, Zap, BookOpen, Fingerprint, Activity, Code, Cpu, TrendingUp } from 'lucide-react';
import DailyHotAI from '../../components/learning/DailyHotAI';

const aiAnatomy = [
  {
    id: 'brain',
    icon: Brain,
    title: '大脑中枢：大语言模型 (LLM)',
    shortTitle: '基础算力与模型',
    description: 'AI 的中枢神经，如同人类大脑的皮层。它拥有惊人的语言理解能力，能够解析复杂指令、进行逻辑推理、创作文本内容。想象一下，LLM 就像一个拥有无限知识储备的天才学者，但它需要正确的引导才能发挥最大潜能。它的核心能力来自于海量数据的预训练，形成了对世界知识的深刻理解。',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    courses: [
      { title: 'LangChain & LlamaIndex – 吴恩达 × DeepLearning.AI', progress: 100, level: '入门', duration: '1周', url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/' },
      { title: 'CS224n: Natural Language Processing – Stanford', progress: 0, level: '进阶', duration: '10周', url: 'https://web.stanford.edu/class/cs224n/' },
      { title: 'Attention Is All You Need 论文精读 – MIT', progress: 0, level: '专家', duration: '3小时', url: 'https://web.mit.edu/' }
    ]
  },
  {
    id: 'language',
    icon: Fingerprint,
    title: '沟通语言：提示词工程 (Prompt)',
    shortTitle: '沟通与表达',
    description: '人类与 AI 的交流艺术，就像与外星人对话的密码。优秀的提示词能够激活 AI 的特定能力区域，就像给天才学者提供精确的研究方向。通过角色扮演、思维链引导、示例演示等技巧，我们可以让 AI 从”通用助手”变身”领域专家”。提示词工程是释放 AI 潜能的关键钥匙。',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/30',
    glow: 'shadow-[0_0_20px_rgba(244,114,182,0.3)]',
    courses: [
      { title: 'ChatGPT Prompt Engineering – 吴恩达 × OpenAI', progress: 80, level: '入门', duration: '1周', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' },
      { title: 'Advanced Prompt Engineering – Fast.ai', progress: 40, level: '进阶', duration: '2周', url: 'https://www.fast.ai/' },
      { title: 'Prompt Design & In-Context Learning – Google AI', progress: 0, level: '专家', duration: '4小时', url: 'https://ai.google/' }
    ]
  },
  {
    id: 'skills',
    icon: Code,
    title: '后天技能：Skill 与 Function Calling',
    shortTitle: '专业技能库',
    description: 'AI 的专业技能库，让通用大脑具备具体执行能力。就像给天才学者配备专业工具箱，Function Calling 让 AI 能够调用外部 API、执行数据库查询、生成代码、分析数据等具体任务。这些技能使 AI 从被动应答者转变为主动执行者，成为真正意义上的智能助手。',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/30',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    courses: [
      { title: 'OpenAI Function Calling 实战指南 – OpenAI', progress: 20, level: '进阶', duration: '2小时', url: 'https://platform.openai.com/docs/guides/function-calling' },
      { title: 'Building AI Agents with Functions – Microsoft', progress: 0, level: '进阶', duration: '3小时', url: 'https://learn.microsoft.com/en-us/azure/ai-services/' },
      { title: 'Advanced Agent Patterns – AutoGPT Team', progress: 0, level: '专家', duration: '5小时', url: 'https://agpt.co/' }
    ]
  },
  {
    id: 'limbs',
    icon: Wrench,
    title: '行动手脚：MCP (模型上下文协议)',
    shortTitle: '现实世界接口',
    description: 'AI 与现实世界交互的桥梁，如同神经系统连接肌肉和感官。MCP 协议为 AI 提供了标准化的"肢体语言"，让它能够安全地操作文件系统、连接开发工具、调用企业 API。想象一下，没有 MCP 的 AI 就像被困在虚拟世界中的天才，而有了 MCP，它就能在现实世界中施展拳脚，成为真正的生产力工具。',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
    courses: [
      { title: 'Model Context Protocol 官方文档 – Anthropic', progress: 10, level: '进阶', duration: '2小时', url: 'https://www.anthropic.com/news/model-context-protocol' },
      { title: 'Building MCP Servers – Cursor Team', progress: 0, level: '专家', duration: '4小时', url: 'https://cursor.sh/' },
      { title: 'AI Code Editor Integration – Trae/Continue', progress: 0, level: '进阶', duration: '3小时', url: 'https://continue.dev/' }
    ]
  },
  {
    id: 'synapses',
    icon: Activity,
    title: '神经突触：Hook 与生命周期',
    shortTitle: '事件与干预机制',
    description: 'AI 思维流程的监控和干预系统，如同大脑的神经突触调节机制。Hook 让我们能够在 AI 的整个生命周期中插入控制逻辑：Pre-hook 像安全门卫，过滤恶意输入；运行中 Hook 像思维导师，引导正确方向；Post-hook 像质量检查员，确保输出安全可靠。这些干预点构成了 AI 系统的安全护栏和智能引导系统。',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    courses: [
      { title: 'LLM Lifecycle Management – AWS', progress: 0, level: '入门', duration: '2小时', url: 'https://aws.amazon.com/machine-learning/' },
      { title: 'LLM Security & Guardrails – NVIDIA', progress: 0, level: '进阶', duration: '3小时', url: 'https://developer.nvidia.com/' },
      { title: 'Advanced LLM Middleware Patterns – Anthropic', progress: 0, level: '专家', duration: '4小时', url: 'https://www.anthropic.com/' }
    ]
  },
  {
    id: 'memory',
    icon: Database,
    title: '海马体：记忆库 (RAG & 向量空间)',
    shortTitle: '长期与短期记忆',
    description: 'AI 的记忆宫殿，解决"金鱼脑"问题的神器。短期记忆管理当前对话上下文，让 AI 能够进行连贯的多轮交流；长期记忆通过向量数据库存储海量知识，让 AI 拥有"过目不忘"的能力；RAG（检索增强生成）技术则像给 AI 配备了一个实时更新的知识库，确保回答基于最新、最准确的信息，彻底告别"胡说八道"。',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)]',
    courses: [
      { title: 'LangChain RAG Tutorial – 吴恩达', progress: 0, level: '进阶', duration: '3小时', url: 'https://www.deeplearning.ai/' },
      { title: 'Vector Databases Deep Dive – Pinecone', progress: 0, level: '专家', duration: '5小时', url: 'https://www.pinecone.io/' },
      { title: 'Advanced RAG Techniques – LlamaIndex', progress: 0, level: '专家', duration: '4小时', url: 'https://www.llamaindex.ai/' }
    ]
  },
  {
    id: 'evolution',
    icon: Cpu,
    title: '基因进化：微调 (Fine-tuning)',
    shortTitle: '模型基因重塑',
    description: 'AI 的基因编辑手术，让通用模型变身领域专家。当提示词工程无法满足深度需求时，微调技术就像给 AI 进行”专业训练”，通过监督微调（SFT）教会它特定领域的思维模式，或者用 LoRA 技术在不改变大脑结构的情况下增加专业知识。这就像把一个通才培养成专才，让 AI 在特定领域达到专家级水平。',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
    courses: [
      { title: 'Fine-tuning LLMs – Hugging Face', progress: 0, level: '入门', duration: '2小时', url: 'https://huggingface.co/course' },
      { title: 'LoRA & PEFT Mastery – Stanford CS336', progress: 0, level: '专家', duration: '6小时', url: 'https://web.stanford.edu/' },
      { title: 'Instruction Tuning Best Practices – Google', progress: 0, level: '专家', duration: '3小时', url: 'https://cloud.google.com/vertex-ai' }
    ]
  },
  {
    id: 'senses',
    icon: Eye,
    title: '五官感官：多模态 (Multi-modal)',
    shortTitle: '视听感知系统',
    description: 'AI 的感官进化，从"盲人摸象"到"全知全能"的飞跃。多模态技术让 AI 同时拥有视觉、听觉、语言能力，就像给大脑装上了眼睛和耳朵。它能看懂设计图纸并提出改进建议，听懂语音指令并准确执行，分析视频内容并提取关键信息。这种感官融合让 AI 能够理解更丰富的世界，处理更复杂的任务。',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    courses: [
      { title: 'Multimodal Deep Learning – CMU', progress: 0, level: '进阶', duration: '4小时', url: 'https://www.cmu.edu/' },
      { title: 'OpenAI Whisper & TTS 实战 – OpenAI', progress: 0, level: '进阶', duration: '2小时', url: 'https://platform.openai.com/docs/guides/speech-to-text' },
      { title: 'Vision Language Models – Microsoft', progress: 0, level: '专家', duration: '3小时', url: 'https://www.microsoft.com/en-us/research/' }
    ]
  },
  {
    id: 'nervous',
    icon: Network,
    title: '自主意识：Agent 编排框架',
    shortTitle: '神经协作中枢',
    description: 'AI 的自主意识和团队协作大脑，从"单兵作战"到"集团军作战"的进化。Agent 框架让 AI 具备人类般的自主性：能够制定计划、分解任务、调用工具、反思结果。更强大的是，多个 AI Agent 可以像专业团队一样协作——前端 Agent 负责界面，后端 Agent 处理逻辑，测试 Agent 确保质量。这种群体智能让 AI 能够完成极其复杂的系统性任务。',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.3)]',
    courses: [
      { title: 'LangChain Agents Masterclass – LangChain', progress: 0, level: '进阶', duration: '4小时', url: 'https://python.langchain.com/docs/modules/agents/' },
      { title: 'AutoGen Multi-Agent Framework – Microsoft', progress: 0, level: '专家', duration: '5小时', url: 'https://microsoft.github.io/autogen/' },
      { title: 'Building AI Workflows with Dify – Dify.ai', progress: 0, level: '入门', duration: '3小时', url: 'https://dify.ai/' }
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
          打破黑盒，将 AI 视作一个"硅基生命体"。从大脑中枢到神经末梢，从感官接收到自主意识，深度解剖人工智能的九大核心组件，构建完整的技术认知地图。
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
                        <button
                          onClick={() => course.url && window.open(course.url, '_blank')}
                          className={`flex items-center justify-center gap-2 w-full sm:w-32 py-2 rounded border transition-all text-sm font-medium ${
                            course.progress > 0
                              ? `${selectedPart.bgColor} ${selectedPart.borderColor} ${selectedPart.color} hover:brightness-125`
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
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

      {/* Real Course Sources Footer */}
      <div className="mt-16 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 border border-cyan-500/20 bg-cyan-500/5"
        >
          <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            课程来源说明
          </h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p>所有课程均来自世界顶级机构：斯坦福大学、MIT、吴恩达 DeepLearning.AI、OpenAI、Google、Microsoft、Meta、Hugging Face、Fast.ai 等权威平台。</p>
            <p>建议学习路径：从入门课程开始，逐步进阶到专家级别。每个模块建议完成率达到 80% 后再进入下一阶段。</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded text-xs">Coursera</span>
              <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-xs">edX</span>
              <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded text-xs">Fast.ai</span>
              <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded text-xs">Stanford</span>
              <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-xs">MIT</span>
              <span className="px-2 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded text-xs">官方文档</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Hot AI Section */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mb-6"
        >
          <TrendingUp className="h-6 w-6 text-cyber-accent" />
          <h2 className="text-2xl font-bold text-white">每日AI技术热点</h2>
        </motion.div>

        <DailyHotAI />
      </div>
    </div>
  );
}
