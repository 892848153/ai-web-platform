import { Task, Workflow } from '@/types/agent';

export class AgentOrchestrator {
  private apiKey = 'ak_2rU2Ai02G5b04d594p8Vp6Ip5RA0s';
  private modelName = 'longcat';

  async executeTask(task: Task, systemPrompt: string, context?: string): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: this.buildTaskPrompt(task, context) }
      ];

      const response = await fetch('https://api.openai-compatible.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Task execution error:', error);
      return this.getFallbackResponse(task);
    }
  }

  private buildTaskPrompt(task: Task, context?: string): string {
    let prompt = `任务标题: ${task.title}\n`;
    prompt += `任务描述: ${task.description}\n\n`;

    if (context) {
      prompt += `上下文信息:\n${context}\n\n`;
    }

    // 根据任务类型添加特定指导
    switch (task.agentType) {
      case 'analyzer':
        prompt += '请详细分析这个任务，包括：\n1. 核心需求分析\n2. 关键挑战识别\n3. 执行策略制定\n4. 预期结果定义';
        break;
      case 'executor':
        prompt += '请执行以下操作：\n1. 按照分析结果逐步执行\n2. 提供详细的执行过程\n3. 记录关键发现和结果\n4. 识别潜在问题';
        break;
      case 'summarizer':
        prompt += '请总结并整合：\n1. 汇总所有执行结果\n2. 提取关键洞察\n3. 提供完整解决方案\n4. 给出后续建议';
        break;
    }

    return prompt;
  }

  private getFallbackResponse(task: Task): string {
    const fallbackResponses = {
      analyzer: `基于任务"${task.title}"的分析：这是一个需要仔细考虑的复杂任务。建议从多个角度进行分析，识别关键要素和潜在挑战。`,
      executor: `任务"${task.title}"的执行结果：由于技术限制，无法完成完整的AI处理。建议手动执行相关步骤，或稍后重试。`,
      summarizer: `任务总结：基于可用信息，建议综合考虑各方面因素，制定完整的解决方案。`
    };

    return fallbackResponses[task.agentType] || '任务执行完成，但由于技术原因无法提供详细结果。';
  }

  async executeWorkflow(workflow: Workflow, onTaskUpdate: (task: Task) => void): Promise<Workflow> {
    const updatedWorkflow = { ...workflow };
    let context = '';

    for (let i = 0; i < updatedWorkflow.tasks.length; i++) {
      const task = updatedWorkflow.tasks[i];

      // 更新任务状态为处理中
      task.status = 'processing';
      onTaskUpdate(task);

      try {
        // 执行任务
        const result = await this.executeTask(task, this.getSystemPrompt(task.agentType), context);

        // 更新任务结果
        task.result = result;
        task.status = 'completed';
        task.completedAt = new Date();

        // 为下一个任务构建上下文
        context += `\n步骤${i + 1} (${task.title}) 的结果:\n${result}\n`;

        onTaskUpdate(task);
      } catch (error) {
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : '未知错误';
        onTaskUpdate(task);
        break;
      }
    }

    // 更新工作流状态
    updatedWorkflow.status = updatedWorkflow.tasks.every(t => t.status === 'completed') ? 'completed' : 'failed';
    updatedWorkflow.completedAt = new Date();

    if (updatedWorkflow.status === 'completed') {
      updatedWorkflow.result = context;
    }

    return updatedWorkflow;
  }

  private getSystemPrompt(agentType: string): string {
    const prompts = {
      analyzer: '你是一个专业的任务分析专家。你擅长将复杂问题分解为可管理的子任务，并提供清晰的分析框架。请保持逻辑清晰，分析深入。',
      executor: '你是一个专业的任务执行专家。你擅长按照既定策略执行具体任务，并提供详细的执行过程和结果。请确保执行完整，结果准确。',
      summarizer: '你是一个专业的结果总结专家。你擅长整合多方信息，提炼关键洞察，并提供完整的解决方案。请确保总结全面，建议具体。'
    };

    return prompts[agentType as keyof typeof prompts] || prompts.analyzer;
  }
}