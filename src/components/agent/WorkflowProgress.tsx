import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Play, Bot } from 'lucide-react';
import { Workflow, Task } from '@/types/agent';
import { cn } from '@/lib/utils';

interface WorkflowProgressProps {
  workflow: Workflow;
  className?: string;
}

export function WorkflowProgress({ workflow, className }: WorkflowProgressProps) {
  const getTaskIcon = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Play className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTaskColor = (task: Task, index: number) => {
    if (task.status === 'completed') return 'border-green-500/30 bg-green-500/10';
    if (task.status === 'processing') return 'border-blue-500/30 bg-blue-500/10';
    if (task.status === 'failed') return 'border-red-500/30 bg-red-500/10';
    return 'border-gray-500/30 bg-gray-500/5';
  };

  const getAgentTypeLabel = (agentType: string) => {
    const labels = {
      analyzer: '分析专家',
      executor: '执行专家',
      summarizer: '总结专家'
    };
    return labels[agentType as keyof typeof labels] || agentType;
  };

  return (
    <div className={cn("glass-panel p-6", className)}>
      <div className="flex items-center gap-3 mb-6">
        <Bot className="h-6 w-6 text-cyber-purple" />
        <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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

      <div className="space-y-4">
        {workflow.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "border rounded-lg p-4 transition-all duration-300",
              getTaskColor(task, index)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getTaskIcon(task)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-white">{task.title}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-cyber-purple/20 text-cyber-purple">
                    {getAgentTypeLabel(task.agentType)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{task.description}</p>

                {task.result && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-black/30 rounded-lg p-3 mt-3"
                  >
                    <h5 className="text-sm font-medium text-cyber-purple mb-2">执行结果:</h5>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {task.result}
                    </div>
                  </motion.div>
                )}

                {task.error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
                    <h5 className="text-sm font-medium text-red-400 mb-1">错误信息:</h5>
                    <p className="text-sm text-red-300">{task.error}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>创建时间: {new Date(task.createdAt).toLocaleString('zh-CN')}</span>
                  {task.completedAt && (
                    <span>完成时间: {new Date(task.completedAt).toLocaleString('zh-CN')}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {workflow.result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-cyber-purple/10 to-cyber-accent/10 border border-cyber-purple/30 rounded-lg p-4"
        >
          <h4 className="font-medium text-cyber-purple mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            工作流总结
          </h4>
          <div className="text-sm text-gray-300 whitespace-pre-wrap">
            {workflow.result}
          </div>
        </motion.div>
      )}
    </div>
  );
}