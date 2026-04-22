export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  agentType: 'analyzer' | 'executor' | 'summarizer';
  result?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  status: 'created' | 'running' | 'completed' | 'failed';
  tasks: Task[];
  currentTaskIndex: number;
  result?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AgentConfig {
  type: 'analyzer' | 'executor' | 'summarizer';
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  taskTypes: Array<'analyzer' | 'executor' | 'summarizer'>;
  prompts: {
    analyzer: string;
    executor: string;
    summarizer: string;
  };
}