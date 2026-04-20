import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-cyber-gradient bg-fixed text-foreground flex flex-col relative">
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none z-0"></div>
      
      <Header />
      
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-8 relative z-10 bg-cyber-dark/80 backdrop-blur-md mt-auto">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AI 启航 - 职场人的一站式 AI 抗焦虑平台. 探索无尽边界.</p>
        </div>
      </footer>
    </div>
  );
}