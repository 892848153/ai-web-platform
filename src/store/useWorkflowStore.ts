import { create } from 'zustand';
import { Workflow } from '@/types/agent';
import { WorkflowEngine } from '@/lib/agents/WorkflowEngine';

interface WorkflowState {
  workflowEngine: WorkflowEngine;
  currentWorkflow: Workflow | null;
  workflows: Workflow[];
  isExecuting: boolean;
  loading: boolean;
  error: string | null;
  createWorkflow: (description: string, title?: string) => Promise<Workflow>;
  executeWorkflow: (workflowId: string) => Promise<void>;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  loadWorkflows: () => Promise<void>;
  deleteWorkflow: (workflowId: string) => Promise<void>;
  clearError: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowEngine: new WorkflowEngine(),
  currentWorkflow: null,
  workflows: [],
  isExecuting: false,
  loading: false,
  error: null,

  createWorkflow: async (description: string, title?: string) => {
    const { workflowEngine } = get();
    set({ loading: true, error: null });

    try {
      const workflow = await workflowEngine.createWorkflow(description, title);
      set((state) => ({
        workflows: [workflow, ...state.workflows],
        currentWorkflow: workflow,
        loading: false,
      }));
      return workflow;
    } catch (error) {
      set({ error: '创建工作流失败', loading: false });
      throw error;
    }
  },

  executeWorkflow: async (workflowId: string) => {
    const { workflowEngine } = get();
    set({ isExecuting: true, error: null });

    try {
      await workflowEngine.executeWorkflow(workflowId, (updatedWorkflow) => {
        set((state) => ({
          currentWorkflow: updatedWorkflow,
          workflows: state.workflows.map(w =>
            w.id === updatedWorkflow.id ? updatedWorkflow : w
          ),
        }));
      });
    } catch (error) {
      set({ error: '执行工作流失败', isExecuting: false });
      throw error;
    } finally {
      set({ isExecuting: false });
    }
  },

  setCurrentWorkflow: (workflow: Workflow | null) => {
    set({ currentWorkflow: workflow });
  },

  loadWorkflows: async () => {
    const { workflowEngine } = get();
    set({ loading: true, error: null });

    try {
      const workflows = await workflowEngine.getAllWorkflows();
      set({ workflows, loading: false });
    } catch (error) {
      set({ error: '加载工作流失败', loading: false });
    }
  },

  deleteWorkflow: async (workflowId: string) => {
    const { workflowEngine } = get();
    set({ loading: true, error: null });

    try {
      const success = await workflowEngine.deleteWorkflow(workflowId);
      if (success) {
        set((state) => ({
          workflows: state.workflows.filter(w => w.id !== workflowId),
          currentWorkflow: state.currentWorkflow?.id === workflowId ? null : state.currentWorkflow,
          loading: false,
        }));
      } else {
        set({ error: '删除工作流失败', loading: false });
      }
    } catch (error) {
      set({ error: '删除工作流失败', loading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));