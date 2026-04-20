import { useState, useEffect } from 'react';
import { Copy, Eye, ThumbsUp, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export interface Practice {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  tags: string[];
  content: string;
  prompt: string;
  created_at?: string;
}

export default function BestPractices() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    try {
      const { data, error } = await supabase
        .from('best_practices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPractices(data || []);
    } catch (error) {
      console.error('Error fetching practices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = Math.ceil(practices.length / itemsPerPage);
  const currentPractices = practices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-accent">
          最佳实践区
        </h1>
        <p className="text-gray-400 max-w-2xl">
          探索真实业务场景下的 AI 落地案例。一键复用高质量 Prompt 和工作流模板（数据已接入 Supabase 实时获取）。
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-cyber-green">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p>正在从 Supabase 加载最新最佳实践...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {currentPractices.map((practice) => (
          <div key={practice.id} className="glass-panel p-6 group hover:border-cyber-green/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-cyber-green transition-colors leading-tight">
                {practice.title}
              </h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              {practice.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {practice.tags.map((tag) => (
                <span key={tag} className="text-xs text-cyber-green bg-cyber-green/10 px-2 py-1 rounded-sm border border-cyber-green/20">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{practice.author}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {practice.views}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {practice.likes}</span>
              </div>
              
              <button 
                onClick={() => handleCopy(practice.id, practice.prompt)}
                className="flex items-center gap-2 text-xs font-medium text-cyber-dark bg-cyber-green hover:bg-cyber-green/90 px-3 py-1.5 rounded transition-colors shadow-[0_0_10px_rgba(0,255,102,0.3)]"
              >
                {copiedId === practice.id ? (
                  <>
                    <Check className="h-3 w-3" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    复用模板
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-cyber-light border border-white/10 text-gray-400 hover:text-cyber-green hover:border-cyber-green/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            上一页
          </button>
          <span className="text-gray-400 text-sm">
            第 <span className="text-cyber-green font-bold">{currentPage}</span> / {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-cyber-light border border-white/10 text-gray-400 hover:text-cyber-green hover:border-cyber-green/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            下一页
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}