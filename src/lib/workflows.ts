import { supabase } from './supabase';
import { Workflow, Task } from '../types/agent';

export interface DbWorkflow {
  id: string;
  title: string;
  description: string;
  status: 'created' | 'running' | 'completed' | 'failed';
  current_task_index: number;
  result?: string;
  created_at: string;
  completed_at?: string;
}

export interface DbTask {
  id: string;
  workflow_id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  agent_type: 'analyzer' | 'executor' | 'summarizer';
  result?: string;
  error?: string;
  task_index: number;
  created_at: string;
  completed_at?: string;
}

// 转换数据库记录为Workflow对象
function convertDbWorkflowToWorkflow(dbWorkflow: DbWorkflow, tasks: Task[]): Workflow {
  return {
    id: dbWorkflow.id,
    title: dbWorkflow.title,
    description: dbWorkflow.description,
    status: dbWorkflow.status,
    tasks,
    currentTaskIndex: dbWorkflow.current_task_index,
    result: dbWorkflow.result,
    createdAt: new Date(dbWorkflow.created_at),
    completedAt: dbWorkflow.completed_at ? new Date(dbWorkflow.completed_at) : undefined
  };
}

// 转换数据库记录为Task对象
function convertDbTaskToTask(dbTask: DbTask): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status,
    agentType: dbTask.agent_type,
    result: dbTask.result,
    error: dbTask.error,
    createdAt: new Date(dbTask.created_at),
    completedAt: dbTask.completed_at ? new Date(dbTask.completed_at) : undefined
  };
}

export const workflowsApi = {
  // 创建工作流
  async createWorkflow(workflow: Omit<Workflow, 'createdAt' | 'completedAt'>): Promise<Workflow> {
    try {
      // 插入工作流主记录
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .insert([{
          id: workflow.id,
          title: workflow.title,
          description: workflow.description,
          status: workflow.status,
          current_task_index: workflow.currentTaskIndex,
          result: workflow.result
        }])
        .select()
        .single();

      if (workflowError) throw workflowError;

      // 插入任务记录
      const tasksForDb = workflow.tasks.map((task, index) => ({
        id: task.id,
        workflow_id: workflow.id,
        title: task.title,
        description: task.description,
        status: task.status,
        agent_type: task.agentType,
        result: task.result,
        error: task.error,
        task_index: index,
        created_at: task.createdAt.toISOString(),
        completed_at: task.completedAt?.toISOString()
      }));

      const { error: tasksError } = await supabase
        .from('workflow_tasks')
        .insert(tasksForDb);

      if (tasksError) throw tasksError;

      return convertDbWorkflowToWorkflow(workflowData, workflow.tasks);
    } catch (error) {
      console.error('创建工作流失败:', error);
      throw error;
    }
  },

  // 获取所有工作流
  async getWorkflows(): Promise<Workflow[]> {
    try {
      // 获取工作流主记录
      const { data: workflowsData, error: workflowsError } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (workflowsError) throw workflowsError;

      // 获取所有相关任务
      const workflowIds = workflowsData.map(w => w.id);
      const { data: tasksData, error: tasksError } = await supabase
        .from('workflow_tasks')
        .select('*')
        .in('workflow_id', workflowIds)
        .order('task_index', { ascending: true });

      if (tasksError) throw tasksError;

      // 组合数据
      return workflowsData.map(workflowData => {
        const workflowTasks = tasksData
          .filter(task => task.workflow_id === workflowData.id)
          .map(convertDbTaskToTask);

        return convertDbWorkflowToWorkflow(workflowData, workflowTasks);
      });
    } catch (error) {
      console.error('获取工作流列表失败:', error);
      throw error;
    }
  },

  // 根据ID获取工作流
  async getWorkflowById(id: string): Promise<Workflow | null> {
    try {
      // 获取工作流主记录
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (workflowError) {
        if (workflowError.code === 'PGRST116') {
          return null; // 工作流不存在
        }
        throw workflowError;
      }

      // 获取相关任务
      const { data: tasksData, error: tasksError } = await supabase
        .from('workflow_tasks')
        .select('*')
        .eq('workflow_id', id)
        .order('task_index', { ascending: true });

      if (tasksError) throw tasksError;

      const tasks = tasksData.map(convertDbTaskToTask);
      return convertDbWorkflowToWorkflow(workflowData, tasks);
    } catch (error) {
      console.error('获取工作流详情失败:', error);
      throw error;
    }
  },

  // 更新工作流
  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    try {
      // 更新工作流主记录
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          current_task_index: updates.currentTaskIndex,
          result: updates.result
        })
        .eq('id', id)
        .select()
        .single();

      if (workflowError) throw workflowError;

      // 更新任务（如果需要）
      if (updates.tasks) {
        // 先删除现有任务
        await supabase
          .from('workflow_tasks')
          .delete()
          .eq('workflow_id', id);

        // 插入更新后的任务
        const tasksForDb = updates.tasks.map((task, index) => ({
          id: task.id,
          workflow_id: id,
          title: task.title,
          description: task.description,
          status: task.status,
          agent_type: task.agentType,
          result: task.result,
          error: task.error,
          task_index: index,
          created_at: task.createdAt.toISOString(),
          completed_at: task.completedAt?.toISOString()
        }));

        const { error: tasksError } = await supabase
          .from('workflow_tasks')
          .insert(tasksForDb);

        if (tasksError) throw tasksError;
      }

      // 重新获取完整的工作流数据
      return await this.getWorkflowById(id) as Workflow;
    } catch (error) {
      console.error('更新工作流失败:', error);
      throw error;
    }
  },

  // 更新任务
  async updateTask(workflowId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const updateData: any = {};

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.result !== undefined) updateData.result = updates.result;
      if (updates.error !== undefined) updateData.error = updates.error;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt?.toISOString();

      const { error } = await supabase
        .from('workflow_tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('workflow_id', workflowId);

      if (error) throw error;
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  },

  // 删除工作流
  async deleteWorkflow(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('删除工作流失败:', error);
      throw error;
    }
  }
};