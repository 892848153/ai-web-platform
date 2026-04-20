import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      login({
        id: Math.random().toString(36).substring(7),
        email,
        username: isLogin ? email.split('@')[0] : username,
      });
      onClose();
    }, 500);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md p-8 glass-panel border-cyber-accent/30 shadow-neon-blue animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-cyber-accent transition-colors rounded-full hover:bg-white/5"
          >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-purple">
            {isLogin ? '终端访问授权' : '注册新终端'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin ? '请输入您的凭证以访问 AI 启航系统' : '创建您的 AI 启航系统访问凭证'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">用户名</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-cyber-accent/50" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-cyber-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all"
                  placeholder="Neo"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">电子邮箱</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-cyber-accent/50" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-cyber-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all"
                placeholder="neo@matrix.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">安全密钥</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-cyber-accent/50" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-cyber-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full cyber-button mt-6 px-4 py-3 rounded-lg bg-cyber-accent text-cyber-dark font-bold text-sm hover:shadow-neon-blue"
          >
            <span className="relative z-10">{isLogin ? '初始化连接' : '建立连接'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? '还没有访问权限？' : '已拥有访问权限？'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-cyber-accent hover:text-cyber-purple transition-colors font-medium hover:underline"
          >
            {isLogin ? '申请授权' : '直接登录'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}