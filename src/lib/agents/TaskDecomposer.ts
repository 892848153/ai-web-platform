import { WorkflowTemplate, Task } from '@/types/agent';

export class TaskDecomposer {
  private templates: WorkflowTemplate[] = [
    {
      id: 'complex-analysis',
      name: '复杂分析任务',
      description: '适用于需要多步骤分析的问题',
      taskTypes: ['analyzer', 'executor', 'summarizer'],
      prompts: {
        analyzer: '你是一个专业的任务分析专家。请分析用户的问题，将其分解为具体的子任务，并为每个子任务制定执行策略。',
        executor: '你是一个专业的任务执行专家。请根据分析结果，逐步执行每个子任务，并提供详细的执行结果。',
        summarizer: '你是一个专业的结果总结专家。请汇总所有子任务的执行结果，提供完整的解决方案和关键洞察。'
      }
    },
    {
      id: 'creative-work',
      name: '创意工作',
      description: '适用于创意内容生成任务',
      taskTypes: ['analyzer', 'executor'],
      prompts: {
        analyzer: '你是一个创意策划专家。请分析用户的创意需求，确定内容方向、风格和关键要素。',
        executor: '你是一个专业的内容创作者。请根据分析结果，创作高质量的内容，确保符合要求和风格。',
        summarizer: '你是一个专业的结果总结专家。请总结创意工作的关键成果和价值。'
      }
    },
    {
      id: 'problem-solving',
      name: '问题解决',
      description: '适用于具体问题的解决',
      taskTypes: ['analyzer', 'executor', 'summarizer'],
      prompts: {
        analyzer: '你是一个问题诊断专家。请分析问题的原因、影响范围和可能的解决方案。',
        executor: '你是一个解决方案实施专家。请选择最佳解决方案并详细说明实施步骤。',
        summarizer: '你是一个结果评估专家。请总结解决方案的关键点、预期效果和风险提示。'
      }
    }
  ];

  async decomposeTask(description: string): Promise<{ template: WorkflowTemplate; tasks: Omit<Task, 'id' | 'createdAt'>[] }> {
    // 分析任务类型
    const taskType = this.identifyTaskType(description);
    const template = this.selectTemplate(taskType, description);

    // 生成具体任务
    const tasks: Omit<Task, 'id' | 'createdAt'>[] = template.taskTypes.map((agentType, index) => ({
      title: this.generateTaskTitle(agentType, index + 1),
      description: this.generateTaskDescription(agentType, description),
      status: 'pending',
      agentType,
    }));

    return { template, tasks };
  }

  private identifyTaskType(description: string): string {
    const keywords = {
      analysis: ['分析', '研究', '调查', '评估', '诊断', '理解'],
      creative: ['创作', '设计', '编写', '制作', '生成', '构思'],
      problem: ['解决', '修复', '优化', '改进', '处理', '应对']
    };

    const lowerDesc = description.toLowerCase();

    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => lowerDesc.includes(word))) {
        return type;
      }
    }

    return 'analysis'; // 默认类型
  }

  private selectTemplate(taskType: string, description: string): WorkflowTemplate {
    const templateMap = {
      analysis: 'complex-analysis',
      creative: 'creative-work',
      problem: 'problem-solving'
    };

    const templateId = templateMap[taskType as keyof typeof templateMap] || 'complex-analysis';
    return this.templates.find(t => t.id === templateId) || this.templates[0];
  }

  private generateTaskTitle(agentType: string, index: number): string {
    const titles = {
      analyzer: `步骤${index}: 任务分析`,
      executor: `步骤${index}: 任务执行`,
      summarizer: `步骤${index}: 结果总结`
    };

    return titles[agentType as keyof typeof titles] || `步骤${index}: 任务处理`;
  }

  private generateTaskDescription(agentType: string, originalTask: string): string {
    const descriptions = {
      analyzer: `分析任务：${originalTask}。请深入理解需求，制定执行策略。`,
      executor: `执行任务：${originalTask}。请按照分析结果，具体执行任务。`,
      summarizer: `总结任务：${originalTask}。请汇总执行结果，提供完整解决方案。`
    };

    return descriptions[agentType as keyof typeof descriptions] || originalTask;
  }

  getTemplates(): WorkflowTemplate[] {
    return this.templates;
  }
}