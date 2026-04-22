import { Workflow, Task, WorkflowTemplate } from '@/types/agent';
import { TaskDecomposer } from './TaskDecomposer';
import { AgentOrchestrator } from './AgentOrchestrator';
import { workflowsApi } from '../workflows';

export class WorkflowEngine {
  private decomposer: TaskDecomposer;
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.decomposer = new TaskDecomposer();
    this.orchestrator = new AgentOrchestrator();
  }

  async createWorkflow(description: string, title?: string): Promise<Workflow> {
    // 分解任务
    const { template, tasks } = await this.decomposer.decomposeTask(description);

    // 创建工作流
    const workflow: Workflow = {
      id: this.generateId(),
      title: title || `工作流 ${new Date().toLocaleString('zh-CN')}`,
      description,
      status: 'created',
      tasks: tasks.map(task => ({
        ...task,
        id: this.generateId(),
        createdAt: new Date(),
      })),
      currentTaskIndex: 0,
      createdAt: new Date(),
    };

    // 保存到数据库
    const savedWorkflow = await workflowsApi.createWorkflow(workflow);
    return savedWorkflow;
  }

  async executeWorkflow(workflowId: string, onProgress?: (workflow: Workflow) => void): Promise<Workflow> {
    // 从数据库获取工作流
    const workflow = await workflowsApi.getWorkflowById(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // 更新工作流状态
    workflow.status = 'running';
    await workflowsApi.updateWorkflow(workflowId, { status: 'running' });
    if (onProgress) onProgress(workflow);

    try {
      // 执行工作流
      const updatedWorkflow = await this.orchestrator.executeWorkflow(
        workflow,
        async (task) => {
          // 更新任务状态到数据库
          await workflowsApi.updateTask(workflowId, task.id, {
            status: task.status,
            result: task.result,
            error: task.error,
            completedAt: task.completedAt
          });

          // 更新工作流当前任务索引
          const taskIndex = workflow.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            workflow.currentTaskIndex = taskIndex;
            await workflowsApi.updateWorkflow(workflowId, { currentTaskIndex: taskIndex });
          }

          if (onProgress) onProgress(workflow);
        }
      );

      // 更新工作流到数据库
      const finalWorkflow = await workflowsApi.updateWorkflow(workflowId, {
        status: updatedWorkflow.status,
        result: updatedWorkflow.result,
        currentTaskIndex: updatedWorkflow.currentTaskIndex
      });

      return finalWorkflow;
    } catch (error) {
      workflow.status = 'failed';
      await workflowsApi.updateWorkflow(workflowId, { status: 'failed' });
      if (onProgress) onProgress(workflow);
      throw error;
    }
  }

  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    return await workflowsApi.getWorkflowById(workflowId);
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return await workflowsApi.getWorkflows();
  }

  async deleteWorkflow(workflowId: string): Promise<boolean> {
    try {
      await workflowsApi.deleteWorkflow(workflowId);
      return true;
    } catch (error) {
      console.error('删除工作流失败:', error);
      return false;
    }
  }

  getWorkflowTemplates(): WorkflowTemplate[] {
    return this.decomposer.getTemplates();
  }

  private generateId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}