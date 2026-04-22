import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, User, Tag, Users, Clock } from 'lucide-react';
import { useDemandStore } from '../../store/useDemandStore';
import { CreateApplicationRequest } from '../../types/demands';
import { useState } from 'react';

export default function DemandDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState<CreateApplicationRequest>({
    demand_id: parseInt(id || '0'),
    applicant_name: '',
    applicant_email: '',
    proposal: ''
  });

  const { currentDemand, loading, error, fetchDemandById, applyToDemand } = useDemandStore();

  useEffect(() => {
    if (id) {
      fetchDemandById(parseInt(id));
    }
  }, [id, fetchDemandById]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyToDemand({
        ...applicationData,
        demand_id: parseInt(id || '0')
      });
      setShowApplicationForm(false);
      setApplicationData({
        demand_id: parseInt(id || '0'),
        applicant_name: '',
        applicant_email: '',
        proposal: ''
      });
      // 可以添加成功提示
    } catch (error) {
      // Error is handled by the store
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (error || !currentDemand) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
        <div className="text-red-400 mb-4">{error || '需求不存在'}</div>
        <button
          onClick={() => navigate('/rewards')}
          className="px-4 py-2 bg-yellow-400 text-cyber-dark rounded-lg hover:bg-yellow-300 transition-colors"
        >
          返回悬赏广场
        </button>
      </div>
    );
  }

  const isDeadlinePassed = new Date(currentDemand.deadline) < new Date();

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <button
        onClick={() => navigate('/rewards')}
        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回悬赏广场
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-8">
          {/* 头部信息 */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  currentDemand.status === '招募中'
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    : currentDemand.status === '进行中'
                    ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                    : currentDemand.status === '已完成'
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                    : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                }`}>
                  {currentDemand.status}
                </span>
                {isDeadlinePassed && (
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-400/20 text-red-400 border border-red-400/30">
                    已过期
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{currentDemand.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{currentDemand.requester}</span>
                  {currentDemand.department && (
                    <span className="text-gray-500">({currentDemand.department})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>发布于 {formatDate(currentDemand.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-2xl mb-2">
                <DollarSign className="h-6 w-6" />
                {currentDemand.budget}
              </div>
              <div className="text-sm text-gray-400">
                截止: {formatDate(currentDemand.deadline)}
              </div>
            </div>
          </div>

          {/* 描述 */}
          {currentDemand.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">需求描述</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                {currentDemand.description}
              </div>
            </div>
          )}

          {/* 标签 */}
          {currentDemand.tags && currentDemand.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                相关技术
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentDemand.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 申请信息 */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>已有 {currentDemand.applicants_count} 人申请</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>最后更新 {formatDate(currentDemand.updated_at)}</span>
                </div>
              </div>

              {currentDemand.status === '招募中' && !isDeadlinePassed && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-6 py-2 bg-yellow-400 text-cyber-dark rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                >
                  立即申请
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 申请表单模态框 */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">申请需求</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={applicationData.applicant_name}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, applicant_name: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={applicationData.applicant_email}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, applicant_email: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors"
                  placeholder="请输入您的邮箱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  申请说明
                </label>
                <textarea
                  value={applicationData.proposal}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, proposal: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors resize-none"
                  placeholder="请描述您的相关经验、解决方案或想法..."
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-yellow-400 text-cyber-dark rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? '申请中...' : '提交申请'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}