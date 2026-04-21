import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const API_KEY = 'ak_2rU2Ai02G5b04d594p8Vp6Ip5RA0s';
const MODEL_NAME = 'longcat';

export default function QAAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是基于 longcat 模型的智能问答助手。我可以帮助你解答职场和技术问题。请问有什么需要我帮忙的吗？',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      // 简单的聊天模式，直接调用API
      const response = await fetch('https://api.openai-compatible.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: '你是一个专业的职场与技术 AI 助手。请提供准确、有帮助的回答。' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，处理您的问题时遇到了错误：${error instanceof Error ? error.message : '未知错误'}。请稍后重试。`,
      };
      setMessages((prev) => [...prev, errorMessage]);
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
            <span className="font-bold tracking-wider">LONGCAT AI 终端</span>
          </div>
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
                    <span>Powered by longcat</span>
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
                <span className="animate-pulse">longcat 正在思考中...</span>
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
              <span className="text-[10px] text-gray-500">
                内容由 longcat AI 生成，可能会有误差，请注意甄别。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}