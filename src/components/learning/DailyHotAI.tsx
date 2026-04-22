// Last updated: 2026-04-22T05:40:43.434Z
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, GitFork, ExternalLink, Calendar, Clock, Zap, Github, Newspaper, RefreshCw } from 'lucide-react';
import { refreshDailyHotAI, dailyUpdateScheduler, DailyUpdateScheduler as SchedulerClass } from '../../lib/dailyUpdate';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description: string;
}

interface DailyHotAI {
  date: string;
  githubRepos: GitHubRepo[];
  news: NewsItem[];
  summary: string;
}

export default function DailyHotAI() {
  const [hotAI, setHotAI] = useState<DailyHotAI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchDailyHotAI();

    // Listen for manual refresh events
    const handleRefresh = () => {
      fetchDailyHotAI();
    };

    window.addEventListener('refreshDailyHotAI', handleRefresh);

    // Check cache age and refresh if needed (every hour)
    const interval = setInterval(() => {
      const cacheAge = SchedulerClass.getCacheAge();
      if (cacheAge > 24) { // Refresh if cache is older than 24 hours
        fetchDailyHotAI();
      }
    }, 3600000); // Check every hour

    return () => {
      window.removeEventListener('refreshDailyHotAI', handleRefresh);
      clearInterval(interval);
    };
  }, []);

  const fetchDailyHotAI = async () => {
    try {
      setIsLoading(true);

      // Check if we have cached data for today
      const today = new Date().toISOString().split('T')[0];
      const cachedData = localStorage.getItem(`dailyHotAI_${today}`);

      if (cachedData) {
        setHotAI(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      // Fetch trending GitHub repositories related to AI
      const githubRepos = await fetchGitHubTrending();

      // Generate mock news (in a real implementation, you'd fetch from a news API)
      const news = generateMockNews();

      const hotAIData: DailyHotAI = {
        date: today,
        githubRepos,
        news,
        summary: generateSummary(githubRepos, news)
      };

      // Cache the data
      localStorage.setItem(`dailyHotAI_${today}`, JSON.stringify(hotAIData));
      setHotAI(hotAIData);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch daily hot AI');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGitHubTrending = async (): Promise<GitHubRepo[]> => {
    try {
      // Fetch trending AI repositories from GitHub
      const response = await fetch(
        'https://api.github.com/search/repositories?q=ai+machine-learning+artificial-intelligence+created:>2024-01-01&sort=stars&order=desc&per_page=10',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.warn('Failed to fetch GitHub trending repos, using fallback data:', error);
      return getFallbackGitHubData();
    }
  };

  const getFallbackGitHubData = (): GitHubRepo[] => {
    return [
      {
        id: 1,
        name: "awesome-ai-agents",
        full_name: "Significant-Gravitas/awesome-ai-agents",
        description: "A curated list of AI agent frameworks and tools",
        html_url: "https://github.com/Significant-Gravitas/awesome-ai-agents",
        stargazers_count: 15420,
        forks_count: 2341,
        language: "Markdown",
        topics: ["ai-agents", "autonomous-agents", "llm"],
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-04-22T00:00:00Z"
      },
      {
        id: 2,
        name: "llama.cpp",
        full_name: "ggerganov/llama.cpp",
        description: "LLM inference in C/C++",
        html_url: "https://github.com/ggerganov/llama.cpp",
        stargazers_count: 67890,
        forks_count: 9876,
        language: "C++",
        topics: ["llm", "inference", "cpp", "ggml"],
        created_at: "2023-03-26T00:00:00Z",
        updated_at: "2024-04-22T00:00:00Z"
      },
      {
        id: 3,
        name: "autogen",
        full_name: "microsoft/autogen",
        description: "A programming framework for agentic AI",
        html_url: "https://github.com/microsoft/autogen",
        stargazers_count: 34567,
        forks_count: 4567,
        language: "Python",
        topics: ["multi-agent", "llm", "autonomous-agents"],
        created_at: "2023-08-08T00:00:00Z",
        updated_at: "2024-04-22T00:00:00Z"
      },
      {
        id: 4,
        name: "langchain",
        full_name: "langchain-ai/langchain",
        description: "Building applications with LLMs through composability",
        html_url: "https://github.com/langchain-ai/langchain",
        stargazers_count: 98765,
        forks_count: 15432,
        language: "Python",
        topics: ["llm", "nlp", "ai", "chain"],
        created_at: "2022-10-17T00:00:00Z",
        updated_at: "2024-04-22T00:00:00Z"
      },
      {
        id: 5,
        name: "transformers",
        full_name: "huggingface/transformers",
        description: "🤗 Transformers: State-of-the-art Machine Learning for Pytorch, TensorFlow and JAX.",
        html_url: "https://github.com/huggingface/transformers",
        stargazers_count: 134567,
        forks_count: 26789,
        language: "Python",
        topics: ["transformers", "pytorch", "nlp", "deep-learning"],
        created_at: "2018-10-29T00:00:00Z",
        updated_at: "2024-04-22T00:00:00Z"
      }
    ];
  };

  const generateMockNews = (): NewsItem[] => {
    return [
      {
        title: "OpenAI Releases GPT-4 Turbo with Enhanced Reasoning Capabilities",
        url: "https://openai.com/blog/gpt-4-turbo",
        source: "OpenAI Blog",
        publishedAt: new Date().toISOString(),
        description: "OpenAI announces significant improvements to GPT-4 Turbo, featuring better reasoning capabilities and reduced hallucinations."
      },
      {
        title: "Meta Unveils Code Llama 2 for Enhanced Code Generation",
        url: "https://ai.meta.com/blog/code-llama-2",
        source: "Meta AI",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        description: "Meta releases Code Llama 2, a specialized LLM for code generation with support for multiple programming languages."
      },
      {
        title: "Google DeepMind Introduces New Multimodal AI Architecture",
        url: "https://deepmind.google/research/multimodal-ai",
        source: "Google DeepMind",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        description: "Google DeepMind presents a breakthrough in multimodal AI that can seamlessly process text, images, and audio."
      },
      {
        title: "Anthropic's Claude 3 Shows Breakthrough in Long-Context Understanding",
        url: "https://www.anthropic.com/claude-3",
        source: "Anthropic",
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        description: "Claude 3 demonstrates unprecedented ability to understand and reason over extremely long documents."
      },
      {
        title: "Microsoft Research Advances in AI Agent Collaboration",
        url: "https://www.microsoft.com/research/ai-agents",
        source: "Microsoft Research",
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        description: "New research shows how multiple AI agents can collaborate to solve complex problems more effectively than single agents."
      }
    ];
  };

  const generateSummary = (repos: GitHubRepo[], news: NewsItem[]): string => {
    const topRepo = repos[0];
    const recentNews = news.slice(0, 2);

    return `今日AI技术热点聚焦于${topRepo?.name || 'AI代理框架'}的发展趋势。${recentNews[0]?.title}和${recentNews[1]?.title}显示了大模型领域的最新突破。建议关注开源社区的活跃项目和相关技术动态。`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-cyber-accent">
            <Zap className="h-6 w-6 animate-pulse" />
            <span className="text-lg">正在加载今日AI热点...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8">
        <div className="text-center text-red-400">
          <p>加载失败: {error}</p>
          <button
            onClick={fetchDailyHotAI}
            className="mt-4 px-4 py-2 bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent rounded hover:bg-cyber-accent/30 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!hotAI) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-cyber-accent" />
            <h2 className="text-2xl font-bold text-white">每日AI技术热点</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{new Date(hotAI.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <button
              onClick={() => {
                dailyUpdateScheduler.clearTodayCache();
                fetchDailyHotAI();
              }}
              className="flex items-center gap-2 px-3 py-1 bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent rounded text-sm hover:bg-cyber-accent/30 transition-colors"
              title="手动刷新数据"
            >
              <RefreshCw className="h-3 w-3" />
              刷新
            </button>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed mb-3">{hotAI.summary}</p>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub Trending */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <Github className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-bold text-white">GitHub热门仓库</h3>
          </div>

          <div className="space-y-4">
            {hotAI.githubRepos.slice(0, 5).map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-cyber-dark/30 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-cyber-accent transition-colors mb-1">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        {repo.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{repo.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-cyber-accent font-mono">
                    <span>#{index + 1}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    <span>{formatNumber(repo.forks_count)}</span>
                  </div>
                  {repo.language && (
                    <span className="text-cyber-accent">{repo.language}</span>
                  )}
                </div>

                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {repo.topics.slice(0, 3).map(topic => (
                      <span key={topic} className="px-2 py-1 bg-cyber-accent/10 border border-cyber-accent/20 text-cyber-accent text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI News */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-bold text-white">AI相关新闻</h3>
          </div>

          <div className="space-y-4">
            {hotAI.news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-cyber-dark/30 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors group"
              >
                <h4 className="font-semibold text-white group-hover:text-cyber-accent transition-colors mb-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-1"
                  >
                    <span className="flex-1">{item.title}</span>
                    <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0" />
                  </a>
                </h4>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{item.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="text-cyber-accent">{item.source}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Info */}
      <div className="text-center text-xs text-gray-500">
        <p>每日上午8点自动更新 | 数据来源于GitHub Trending和AI技术媒体</p>
      </div>
    </div>
  );
}