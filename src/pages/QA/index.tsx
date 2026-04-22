import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Zap, Wifi, WifiOff } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MODEL_NAME = 'qwen-plus';

export default function QAAssistant() {
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

      try {
        console.log('尝试连接到通义千问 API代理...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒超时

        const response = await fetch('https://hzbrgdaudidzokewdpwz.supabase.co/functions/v1/qwen-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
              {
                role: 'system',
                content: '你是一个专业的职场与技术AI助手，名为通义千问。你擅长解答技术问题、职场建议、编程指导等。请提供准确、有帮助、详细的回答。'
              },
              { role: 'user', content: userMessage.content }
            ]
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // 首先获取响应文本以进行调试
        const responseText = await response.text();
        console.log('API response status:', response.status, 'text length:', responseText.length);

        if (!response.ok) {
          console.error('API proxy error:', response.status, responseText);
          let errorMsg = `API错误: ${response.status}`;
          try {
            const errorData = JSON.parse(responseText);
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // 如果无法解析JSON，使用默认错误信息
            errorMsg = `服务器错误: ${responseText.substring(0, 100)}`;
          }
          throw new Error(errorMsg);
        }

        // 尝试解析响应为JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError.message, 'Response:', responseText.substring(0, 200));
          throw new Error('服务器响应格式错误');
        }

        if (data.success && data.data) {
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.data.content,
          };
          apiSuccess = true;
          console.log('成功连接到通义千问 API');
          setApiStatus('connected');
        } else {
          console.log('响应格式无效:', data);
          throw new Error(data.error || '响应格式错误');
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

          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                const testResponse = await fetch('https://hzbrgdaudidzokewdpwz.supabase.co/functions/v1/qwen-chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [{ role: 'user', content: '测试连接' }]
                  }),
                });

                const responseText = await testResponse.text();
                console.log('Test response status:', testResponse.status, 'text:', responseText.substring(0, 100));

                if (testResponse.ok) {
                  try {
                    const data = JSON.parse(responseText);
                    if (data.success) {
                      setApiStatus('connected');
                      alert('✅ 通义千问 API 连接成功！');
                    } else {
                      throw new Error(data.error || '连接测试失败');
                    }
                  } catch (parseError) {
                    throw new Error('响应解析失败');
                  }
                } else {
                  let errorMsg = `连接失败: ${testResponse.status}`;
                  try {
                    const errorData = JSON.parse(responseText);
                    errorMsg = errorData.error || errorMsg;
                  } catch (e) {
                    errorMsg = `服务器错误: ${responseText.substring(0, 100)}`;
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