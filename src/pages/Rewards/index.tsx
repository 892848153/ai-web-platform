import { Clock, DollarSign, Users, ChevronRight, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemandStore } from '../../store/useDemandStore';
import { useAuthStore } from '../../store/useAuthStore';
import CreateDemandModal from '../../components/rewards/CreateDemandModal';
import { AuthModal } from '../../components/auth/AuthModal';

export default function RewardsSquare() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { demands, loading, error, fetchDemands } = useDemandStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const handleDemandClick = (demandId: number) => {
    navigate(`/rewards/${demandId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyber-accent">
          需求悬赏广场
        </h1>
        <p className="text-gray-400 max-w-2xl">
          发布痛点需求，悬赏寻找 AI 达人。打破部门壁垒，用 AI 解决实际业务问题。
        </p>
      </div>

      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <div className="text-white text-xl font-bold">最新悬赏 <span className="text-yellow-400">({demands.length})</span></div>
        <button
          onClick={() => {
            if (isAuthenticated) {
              setShowCreateModal(true);
            } else {
              setShowAuthModal(true);
            }
          }}
          className="cyber-button px-6 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] text-sm transition-all duration-300 flex items-center gap-2"
        >
          {isAuthenticated ? '发布需求' : (
            <>
              <Lock className="h-4 w-4" />
              登录后发布
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">加载中...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-400">{error}</div>
          <button
            onClick={fetchDemands}
            className="mt-4 px-4 py-2 bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 rounded-lg hover:bg-yellow-400/20 transition-colors"
          >
            重试
          </button>
        </div>
      ) : demands.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400">暂无悬赏需求</div>
          <button
            onClick={() => {
              if (isAuthenticated) {
                setShowCreateModal(true);
              } else {
                setShowAuthModal(true);
              }
            }}
            className="mt-4 px-6 py-2 bg-yellow-400 text-cyber-dark rounded-lg hover:bg-yellow-300 transition-colors font-medium flex items-center gap-2"
          >
            {isAuthenticated ? '发布第一个需求' : (
              <>
                <Lock className="h-4 w-4" />
                登录后发布
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {demands.map((demand) => (
            <div
              key={demand.id}
              className="glass-panel p-6 flex flex-col md:flex-row gap-6 justify-between group hover:border-yellow-400/30 transition-all duration-300 cursor-pointer"
              onClick={() => handleDemandClick(demand.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    demand.status === '招募中'
                      ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                      : demand.status === '进行中'
                      ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                      : demand.status === '已完成'
                      ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                      : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                  }`}>
                    {demand.status}
                  </span>
                  <span className="text-sm text-gray-500">{demand.requester}</span>
                  {demand.department && (
                    <span className="text-sm text-gray-500">({demand.department})</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">{demand.title}</h3>

                <div className="flex flex-wrap gap-2">
                  {demand.tags && demand.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[200px]">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-2xl mb-2 md:mb-0">
                  <DollarSign className="h-6 w-6" />
                  {demand.budget}
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    截止: {formatDate(demand.deadline)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    已有 {demand.applicants_count} 人申请
                  </div>
                </div>

                <div className="mt-4 w-full md:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-white/5 hover:bg-yellow-400 hover:text-cyber-dark text-white rounded transition-colors group/btn text-sm font-medium">
                  查看详情
                  <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateDemandModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchDemands}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}