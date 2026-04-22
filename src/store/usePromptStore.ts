import { create } from 'zustand';
import { PromptEngine } from '@/lib/prompt/PromptEngine';
import { TemplateManager } from '@/lib/prompt/TemplateManager';
import { PromptTemplate, OptimizedPrompt } from '@/types/prompt';

interface PromptState {
  promptEngine: PromptEngine;
  templateManager: TemplateManager;
  currentTemplate: PromptTemplate | null;
  optimizedPrompt: OptimizedPrompt | null;
  isOptimizing: boolean;
  setCurrentTemplate: (template: PromptTemplate | null) => void;
  optimizePrompt: (originalPrompt: string, context: any) => Promise<void>;
  resetOptimization: () => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  promptEngine: new PromptEngine(),
  templateManager: new TemplateManager(),
  currentTemplate: null,
  optimizedPrompt: null,
  isOptimizing: false,

  setCurrentTemplate: (template: PromptTemplate | null) => {
    set({ currentTemplate: template });
  },

  optimizePrompt: async (originalPrompt: string, context: any) => {
    const { promptEngine } = get();
    set({ isOptimizing: true });

    try {
      const optimized = await promptEngine.optimizePrompt(originalPrompt, context);
      set({
        optimizedPrompt: optimized,
        currentTemplate: optimized.template,
        isOptimizing: false
      });
    } catch (error) {
      console.error('Prompt优化失败:', error);
      set({ isOptimizing: false });
    }
  },

  resetOptimization: () => {
    set({
      optimizedPrompt: null,
      currentTemplate: null
    });
  },
}));