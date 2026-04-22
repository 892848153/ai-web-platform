import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { CreateDemandRequest } from '../../types/demands';
import { useDemandStore } from '../../store/useDemandStore';
import { useAuthStore } from '../../store/useAuthStore';

interface CreateDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateDemandModal({ isOpen, onClose, onSuccess }: CreateDemandModalProps) {
  const [formData, setFormData] = useState<CreateDemandRequest>({
    title: '',
    description: '',
    requester: '',
    department: '',
    budget: '',
    deadline: '',
    tags: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const { createDemand, loading, error } = useDemandStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        requester: user.username || user.email.split('@')[0]
      }));
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDemand(formData);
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        requester: '',
        department: '',
        budget: '',
        deadline: '',
        tags: []
      });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">发布新需求</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              需求标题 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
              placeholder="请输入需求标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              需求描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors resize-none"
              placeholder="请详细描述您的需求"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                需求方 *
              </label>
              <input
                type="text"
                required
                value={formData.requester}
                readOnly
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 cursor-not-allowed opacity-75"
                placeholder="请输入需求方名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                部门
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
                placeholder="请输入部门名称"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                预算 *
              </label>
              <input
                type="text"
                required
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
                placeholder="如：￥2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                截止日期 *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标签
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
                placeholder="输入标签后按回车添加"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 rounded-lg hover:bg-yellow-400/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-yellow-400 text-cyber-dark rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '发布中...' : '发布需求'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}