export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'qa' | 'analysis' | 'creation' | 'summary' | 'workflow';
  template: string;
  variables: string[];
  examples: string[];
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTokens: number;
    tags: string[];
    createdAt?: string;
  };
}

export interface PromptContext {
  taskType: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  domain: string;
  constraints?: string[];
  examples?: string[];
  previousContext?: string;
}

export interface OptimizedPrompt {
  originalPrompt: string;
  optimizedPrompt: string;
  systemPrompt: string;
  template: PromptTemplate;
  improvements: string[];
  estimatedQuality: number;
}