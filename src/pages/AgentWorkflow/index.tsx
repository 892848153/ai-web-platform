import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Bot, ArrowLeft, Play, Save, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { WorkflowProgress } from '@/components/agent/WorkflowProgress';
import { Workflow } from '@/types/agent';

export default function AgentWorkflow() {
  const {
    workflows,
    currentWorkflow,
    isExecuting,
    createWorkflow,
    executeWorkflow,
    setCurrentWorkflow,
    loadWorkflows,
    deleteWorkflow
  } = useWorkflowStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const handleCreateWorkflow = async () => {
    if (!newWorkflowDescription.trim()) return;

    try {
      const workflow = await createWorkflow(
        newWorkflowDescription,
        newWorkflowTitle.trim() || undefined
      );
      setShowCreateForm(false);
      setNewWorkflowTitle('');
      setNewWorkflowDescription('');
    } catch (error) {
      console.error('创建工作流失败:', error);
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await executeWorkflow(workflowId);
    } catch (error) {
      console.error('执行工作流失败:', error);
    }
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (window.confirm('确定要删除这个工作流吗？')) {
      deleteWorkflow(workflowId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {currentWorkflow && (
            <button
              onClick={() => setCurrentWorkflow(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-accent">
              Agent 工作流
            </h1>
            <p className="text-gray-400 mt-1">
              利用多Agent协作处理复杂任务，提升工作效率
            </p>
          </div>
        </div>

        {!currentWorkflow && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-purple hover:bg-cyber-purple/80 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            创建工作流
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {currentWorkflow ? (
          <motion.div
            key="workflow-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <WorkflowProgress workflow={currentWorkflow} />
          </motion.div>
        ) : (
          <motion.div
            key="workflow-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            {/* 创建工作流表单 */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-6 mb-8"
                >
                  <h3 className="text-xl font-bold text-white mb-4">创建新的工作流</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        工作流标题（可选）
                      </label>
                      <input
                        type="text"
                        value={newWorkflowTitle}
                        onChange={(e) => setNewWorkflowTitle(e.target.value)}
                        placeholder="为工作流起个名字..."
                        className="w-full bg-cyber-dark border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-purple transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        任务描述 *
                      </label>
                      <textarea
                        value={newWorkflowDescription}
                        onChange={(e) => setNewWorkflowDescription(e.target.value)}
                        placeholder="详细描述你需要完成的工作，AI将自动分解为多个步骤并分配给不同的Agent处理..."
                        rows={4}
                        className="w-full bg-cyber-dark border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-purple transition-colors resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCreateWorkflow}
                        disabled={!newWorkflowDescription.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-cyber-purple hover:bg-cyber-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        <Bot className="h-4 w-4" />
                        创建并分析
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewWorkflowTitle('');
                          setNewWorkflowDescription('');
                        }}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 工作流列表 */}
            <div className="grid gap-6">
              {workflows.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">还没有工作流</h3>
                  <p className="text-gray-500 mb-6">创建你的第一个Agent工作流来处理复杂任务</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-purple hover:bg-cyber-purple/80 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    创建工作流
                  </button>
                </div>
              ) : (
                workflows.map((workflow) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{workflow.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{workflow.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>任务数: {workflow.tasks.length}</span>
                          <span>状态: {workflow.status}</span>
                          <span>创建时间: {new Date(workflow.createdAt).toLocaleString('zh-CN')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          workflow.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          workflow.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          workflow.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {workflow.status === 'completed' ? '已完成' :
                           workflow.status === 'running' ? '执行中' :
                           workflow.status === 'failed' ? '失败' : '等待中'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {workflow.tasks.map((task, index) => (
                          <div
                            key={task.id}
                            className={`w-2 h-2 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'processing' ? 'bg-blue-500' :
                              task.status === 'failed' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}
                            title={task.title}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {workflow.status === 'created' && (
                          <button
                            onClick={() => handleExecuteWorkflow(workflow.id)}
                            disabled={isExecuting}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 rounded text-sm transition-colors disabled:opacity-50"
                          >
                            <Play className="h-3 w-3" />
                            执行
                          </button>
                        )}
                        <button
                          onClick={() => setCurrentWorkflow(workflow)}
                          className="flex items-center gap-1 px-3 py-1 bg-cyber-purple/20 border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/30 rounded text-sm transition-colors"
                        >
                          <Save className="h-3 w-3" />
                          查看详情
                        </button>
                        <button
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded text-sm transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}