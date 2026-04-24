import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Zap, Wifi, WifiOff, Database, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { knowledgeBase, KnowledgeBase } from '../../lib/rag/KnowledgeBase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MODEL_NAME = 'qwen-plus';

export default function QAAssistant() {
  const [useRAG, setUseRAG] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🤖 你好！我是通义千问 AI助手，专业的职场与技术顾问。我可以帮你解答：\n\n• **技术问题**：编程、算法、系统设计\n• **职场建议**：职业发展、团队协作、项目管理\n• **AI学习**：机器学习、深度学习、应用实践\n\n请问有什么需要我帮忙的吗？',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let assistantMessage: Message;
      let apiSuccess = false;
      let lastError = null;
      let ragContext = '';

      // RAG 知识库检索
      if (useRAG) {
        try {
          const searchResults = knowledgeBase.search(userMessage.content, 3);
          setSearchResults(searchResults);

          if (searchResults.length > 0) {
            // 先添加总结消息
            const summaryMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: `🎯 **智能知识库为您找到了 ${searchResults.length} 条相关知识**\n\n基于您的问题，我为您精选了以下专业知识，每条知识都经过智能匹配：`,
            };
            setMessages((prev) => [...prev, summaryMessage]);

            // 为每个搜索结果创建独立的消息
            searchResults.forEach((result, index) => {
              const matchLevel = result.score > 40 ? "🔍 高度匹配" : result.score > 25 ? "📖 相关匹配" : "💡 一般相关";
              const matchColor = result.score > 40 ? "🟢" : result.score > 25 ? "🟡" : "🔵";

              let knowledgeContent = `## ✨ ${result.item.title}\n\n`;
              knowledgeContent += `${result.item.content}\n\n`;
              knowledgeContent += `${matchColor} **${matchLevel}**\n`;
              knowledgeContent += `🏷️  **标签**: ${result.item.tags.join(', ')}\n\n`;
              knowledgeContent += `> 💡 知识ID: #${result.item.id}`;

              const knowledgeMessage: Message = {
                id: (Date.now() + index + 1).toString(),
                role: 'assistant',
                content: knowledgeContent,
              };

              // 延迟添加每条知识，创造逐个显示的效果
              setTimeout(() => {
                setMessages((prev: Message[]) => [...prev, knowledgeMessage]);
              }, (index + 1) * 500);
            });

            // 最后添加结束消息
            setTimeout(() => {
              const endMessage: Message = {
                id: (Date.now() + searchResults.length + 10).toString(),
                role: 'assistant',
                content: `🎓 **知识来源**: AI 启航专业知识库\n\n💬 *如需更详细解释、实际应用指导或有其他问题，欢迎随时提问！*`,
              };
              setMessages((prev: Message[]) => [...prev, endMessage]);
            }, (searchResults.length + 1) * 500);

            setIsLoading(false);
            return; // 直接返回，不再调用API
          }
        } catch (ragError) {
          console.log('RAG 检索失败:', ragError);
        }
      }

      try {
        console.log('尝试连接到通义千问 API代理...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒超时

        // 构建消息，包含 RAG 上下文
        const systemMessage = {
          role: 'system',
          content: useRAG && ragContext
            ? ragContext
            : '你是一个专业的职场与技术AI助手，名为通义千问。你擅长解答技术问题、职场建议、编程指导等。请提供准确、有帮助、详细的回答。'
        };

        const userPrompt = useRAG && ragContext ? ragContext : userMessage.content;

        // Direct integration with 通义千问 API
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_QWEN_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            input: {
              messages: [
                { role: systemMessage.role, content: systemMessage.content },
                { role: 'user', content: userPrompt }
              ]
            },
            parameters: {
              result_format: 'message'
            }
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('通义千问 API error:', response.status, errorText);
          let errorMsg = `通义千问 API错误: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMsg = errorData.message || errorData.error?.message || errorMsg;
          } catch (e) {
            errorMsg = `服务器错误: ${errorText.substring(0, 100)}`;
          }
          throw new Error(errorMsg);
        }

        // 解析响应
        const data = await response.json();

        if (data.output && data.output.choices && data.output.choices.length > 0) {
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.output.choices[0].message.content,
          };
          apiSuccess = true;
          console.log('成功连接到通义千问 API');
          setApiStatus('connected');
        } else {
          console.log('响应格式无效:', data);
          throw new Error('通义千问 API响应格式错误');
        }
      } catch (error) {
        console.log('API连接失败:', error.message);
        lastError = error;
      }

      if (!apiSuccess) {
        console.error('通义千问 API连接失败');
        setApiStatus('disconnected');
        throw new Error(`无法连接到通义千问 API: ${lastError?.message || '连接失败'}`);
      }

      // 只有当RAG没有找到结果时才添加API返回的消息
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (apiError) {
      console.error('Qwen API连接失败:', apiError);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **通义千问 AI 连接失败**\n\n无法连接到通义千问 AI服务，错误详情：\n\n${apiError instanceof Error ? apiError.message : '未知连接错误'}\n\n**可能的原因：**\n1. 通义千问 API服务暂时不可用\n2. 网络连接问题\n3. API密钥配置错误\n4. API端点地址已变更\n\n**建议操作：**\n• 检查网络连接\n• 稍后重试\n• 联系技术支持确认API状态\n• 验证API密钥和端点配置\n\n请确保通义千问 AI服务正常运行后再试。`,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setApiStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-1 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-purple/30 bg-cyber-purple/10 text-cyber-purple">
            <Bot className="h-5 w-5" />
            <span className="font-bold tracking-wider">通义千问 AI 终端</span>
          </div>

          {/* RAG 开关 */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Database className="h-4 w-4 text-cyber-accent" />
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useRAG}
                onChange={(e) => setUseRAG(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-cyber-purple focus:ring-cyber-purple"
              />
              RAG 知识库
            </label>
          </div>

          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                const testResponse = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_QWEN_API_KEY}`,
                  },
                  body: JSON.stringify({
                    model: MODEL_NAME,
                    input: {
                      messages: [{ role: 'user', content: '你好，测试连接' }]
                    },
                    parameters: {
                      result_format: 'message'
                    }
                  }),
                });

                if (testResponse.ok) {
                  const data = await testResponse.json();
                  if (data.output && data.output.choices && data.output.choices.length > 0) {
                    setApiStatus('connected');
                    alert('✅ 通义千问 API 连接成功！');
                  } else {
                    throw new Error('响应格式错误');
                  }
                } else {
                  const errorText = await testResponse.text();
                  let errorMsg = `连接失败: ${testResponse.status}`;
                  try {
                    const errorData = JSON.parse(errorText);
                    errorMsg = errorData.message || errorData.error?.message || errorMsg;
                  } catch (e) {
                    errorMsg = `服务器错误: ${errorText.substring(0, 100)}`;
                  }
                  setApiStatus('disconnected');
                  alert(`❌ ${errorMsg}`);
                }
              } catch (error) {
                setApiStatus('disconnected');
                alert(`❌ 连接错误: ${error.message}`);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 rounded text-xs"
          >
            测试连接
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-accent/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* 聊天记录区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={clsx(
                "shrink-0 h-10 w-10 rounded-xl flex items-center justify-center border shadow-lg",
                msg.role === 'user'
                  ? "bg-cyber-accent/20 border-cyber-accent/50 text-cyber-accent"
                  : "bg-cyber-purple/20 border-cyber-purple/50 text-cyber-purple"
              )}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={clsx(
                "p-4 rounded-2xl relative group",
                msg.role === 'user'
                  ? "bg-cyber-accent/10 border border-cyber-accent/30 text-white rounded-tr-sm"
                  : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm"
              )}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <div className="absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-cyber-purple">
                    <Zap className="h-3 w-3" />
                    <span>Powered by 通义千问</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] mr-auto">
              <div className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center border shadow-lg bg-cyber-purple/20 border-cyber-purple/50 text-cyber-purple">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 rounded-tl-sm flex items-center gap-2">
                <span className="animate-pulse">通义千问 正在思考中...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区 */}
        <div className="p-4 border-t border-white/10 bg-cyber-dark/50 z-10">
          <div className="space-y-3">
            {/* 输入框 */}
            <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
              <textarea
                className="w-full bg-cyber-dark border border-white/20 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-cyber-purple text-white transition-colors resize-none h-[52px] max-h-32 min-h-[52px] scrollbar-hide"
                placeholder="输入您的问题，按 Enter 发送，Shift + Enter 换行..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 h-[36px] w-[36px] flex items-center justify-center rounded-lg bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                {apiStatus === 'connected' ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-400" />
                    <span className="text-[10px] text-green-400">通义千问 AI 已连接</span>
                  </>
                ) : apiStatus === 'disconnected' ? (
                  <>
                    <WifiOff className="h-3 w-3 text-red-400" />
                    <span className="text-[10px] text-red-400">通义千问 AI 连接失败</span>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-500">连接状态: 检测中...</span>
                )}
              </div>
              {/* RAG 搜索结果显示 */}
              {useRAG && searchResults.length > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Search className="h-3 w-3 text-cyber-accent" />
                  <span className="text-[10px] text-cyber-accent">
                    检索到 {searchResults.length} 条相关知识
                  </span>
                </div>
              )}

              <span className="text-[10px] text-gray-500">
                内容由通义千问 AI 生成，可能会有误差，请注意甄别。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}