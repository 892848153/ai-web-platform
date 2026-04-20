import { Play, BookOpen, Target, CheckCircle2 } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'AI 基础认知与 Prompt 编写指南',
    level: '入门',
    progress: 100,
    modules: 5,
    completed: 5,
    description: '了解大语言模型的基本原理，掌握构建高质量提示词的核心框架。',
  },
  {
    id: 2,
    title: '办公场景下的 AI 效率工具流',
    level: '进阶',
    progress: 45,
    modules: 8,
    completed: 3,
    description: '深入学习如何将 AI 融入文档处理、数据分析和会议总结等日常办公场景。',
  },
  {
    id: 3,
    title: '基于本地大模型的私有化部署',
    level: '专家',
    progress: 0,
    modules: 12,
    completed: 0,
    description: '掌握 Ollama 等工具的使用，在本地部署和微调开源大模型。',
  }
];

export default function LearningCenter() {
  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyber-accent">
          AI 学习中心
        </h1>
        <p className="text-gray-400 max-w-2xl">
          阶梯式课程体系，从概念普及到深度应用，助你构建完整的 AI 技能树。
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="glass-panel p-6 flex flex-col md:flex-row gap-6 items-center group hover:border-blue-400/50 transition-all duration-300">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="aspect-video bg-cyber-dark rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-blue-400/30 transition-colors">
                <div className="absolute inset-0 bg-blue-400/5 group-hover:bg-blue-400/10 transition-colors"></div>
                <Play className="h-12 w-12 text-white/50 group-hover:text-blue-400 transition-colors" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs bg-black/50 border border-white/10 text-gray-300 backdrop-blur-sm">
                  {course.level}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{course.description}</p>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.completed} / {course.modules} 章节</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-cyber-dark h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-blue-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(96,165,250,0.5)]" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="mt-4 flex justify-end">
                  {course.progress === 100 ? (
                    <button className="flex items-center gap-2 px-4 py-2 rounded border border-white/20 bg-white/5 text-gray-400 cursor-default text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      已完成学习
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">
                      <Target className="h-4 w-4" />
                      {course.progress === 0 ? '开始学习' : '继续学习'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}