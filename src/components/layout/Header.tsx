import { Link, useLocation } from 'react-router-dom';
import { Bot, Terminal, Cpu, GraduationCap, Briefcase, User as UserIcon, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthModal } from '../auth/AuthModal';

const navItems = [
  { path: '/tools', label: 'AI 工具广场', icon: Terminal },
  { path: '/qa', label: '智能问答助手', icon: Bot },
  { path: '/practices', label: '最佳实践区', icon: Cpu },
  { path: '/learning', label: 'AI 学习中心', icon: GraduationCap },
  { path: '/rewards', label: '需求悬赏广场', icon: Briefcase },
];

export function Header() {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-cyber-dark/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-light border border-cyber-accent/30 overflow-hidden">
            <div className="absolute inset-0 bg-cyber-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Bot className="h-6 w-6 text-cyber-accent group-hover:scale-110 transition-transform duration-300 relative z-10" />
          </div>
          <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-purple group-hover:shadow-neon-blue transition-all">
            AI 启航
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={twMerge(
                  clsx(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-cyber-accent",
                    isActive ? "text-cyber-accent" : "text-gray-400"
                  )
                )}
              >
                <Icon className={clsx("h-4 w-4", isActive && "animate-pulse-glow")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-cyber-accent">
                <UserIcon className="h-4 w-4" />
                <span>{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-cyber-neon transition-colors rounded-lg hover:bg-white/5"
                title="退出登录"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="cyber-button px-4 py-2 rounded-lg bg-cyber-light border border-cyber-accent/50 text-cyber-accent text-sm hover:shadow-neon-blue"
            >
              登录 / 注册
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}