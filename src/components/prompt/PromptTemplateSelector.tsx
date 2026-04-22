import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Filter, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { PromptTemplate } from '@/types/prompt';
import { PromptEngine } from '@/lib/prompt/PromptEngine';
import { TemplateManager } from '@/lib/prompt/TemplateManager';
import { cn } from '@/lib/utils';

interface PromptTemplateSelectorProps {
  onTemplateSelect: (template: PromptTemplate) => void;
  selectedTemplate?: PromptTemplate;
  className?: string;
}

export function PromptTemplateSelector({
  onTemplateSelect,
  selectedTemplate,
  className
}: PromptTemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const promptEngine = new PromptEngine();
  const templateManager = new TemplateManager();

  const allTemplates = [
    ...promptEngine.getTemplates(),
    ...templateManager.getAllTemplates()
  ];

  // 过滤模板
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.metadata.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.metadata.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['all', 'qa', 'analysis', 'creation', 'summary', 'workflow'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getCategoryLabel = (category: string) => {
    const labels = {
      all: '全部分类',
      qa: '问答',
      analysis: '分析',
      creation: '创作',
      summary: '总结',
      workflow: '工作流'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      all: '全部难度',
      beginner: '初级',
      intermediate: '中级',
      advanced: '高级'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className={cn("relative", className)}>
      {/* 模板选择器触发器 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full p-4 bg-cyber-dark border border-white/20 rounded-lg text-left hover:border-cyber-purple transition-colors"
      >
        <div className="flex-1">
          {selectedTemplate ? (
            <div>
              <div className="font-medium text-white">{selectedTemplate.name}</div>
              <div className="text-sm text-gray-400">{selectedTemplate.description}</div>
            </div>
          ) : (
            <div className="text-gray-400">选择Prompt模板...</div>
          )}
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* 下拉面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark border border-white/20 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
          >
            {/* 搜索和过滤器 */}
            <div className="p-4 border-b border-white/10">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索模板..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-purple transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-cyber-purple"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-cyber-purple"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {getDifficultyLabel(difficulty)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 模板列表 */}
            <div className="max-h-64 overflow-y-auto">
              {filteredTemplates.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>没有找到匹配的模板</p>
                </div>
              ) : (
                filteredTemplates.map((template, index) => (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onTemplateSelect(template);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0",
                      selectedTemplate?.id === template.id && "bg-cyber-purple/10 border-cyber-purple/30"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{template.name}</h4>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded",
                            getDifficultyColor(template.metadata.difficulty)
                          )}>
                            {getDifficultyLabel(template.metadata.difficulty)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.metadata.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 rounded text-xs bg-white/5 text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {template.metadata.tags.length > 3 && (
                            <span className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400">
                              +{template.metadata.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400 transition-colors" />
                        <button className="p-1 hover:bg-white/10 rounded transition-colors">
                          <Edit className="h-4 w-4 text-gray-400 hover:text-cyber-purple" />
                        </button>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* 底部操作 */}
            <div className="p-4 border-t border-white/10">
              <button className="flex items-center gap-2 w-full p-2 text-cyber-purple hover:bg-cyber-purple/10 rounded transition-colors">
                <Plus className="h-4 w-4" />
                创建自定义模板
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}