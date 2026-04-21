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
      content: '🐱 你好！我是LongCat AI助手，专业的职场与技术顾问。我可以帮你解答：\n\n• **技术问题**：编程、算法、系统设计\n• **职场建议**：职业发展、团队协作、项目管理\n• **AI学习**：机器学习、深度学习、应用实践\n\n请问有什么需要我帮忙的吗？',
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
      // 尝试调用longcat API
      let assistantMessage: Message;

      try {
        // 使用正确的longcat API endpoint
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

        const response = await fetch('https://api.longcat.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'User-Agent': 'AI-Web-Platform/1.0',
          },
          body: JSON.stringify({
            model: 'longcat-v1', // 使用正确的模型名称
            messages: [
              {
                role: 'system',
                content: '你是一个专业的职场与技术AI助手，名为LongCat。你擅长解答技术问题、职场建议、编程指导等。请提供准确、有帮助、详细的回答。'
              },
              { role: 'user', content: userMessage.content }
            ],
            max_tokens: 1500,
            temperature: 0.8,
            top_p: 0.95,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('LongCat API Error:', response.status, errorText);
          throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid API response format');
        }

        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
        };
      } catch (apiError) {
        console.warn('API调用失败，使用模拟响应:', apiError);

        // 根据问题类型提供更相关的模拟响应
        const getMockResponse = (question: string) => {
          const lowerQuestion = question.toLowerCase();

          if (lowerQuestion.includes('代码') || lowerQuestion.includes('编程') || lowerQuestion.includes('开发')) {
            return `关于编程问题"${question}"，我建议：\n\n**技术方案**：\n1. 分析需求和技术栈\n2. 选择合适的设计模式\n3. 编写清晰、可维护的代码\n\n**最佳实践**：\n• 遵循SOLID原则\n• 编写单元测试\n• 代码审查\n\n需要具体的技术指导吗？`;
          }

          if (lowerQuestion.includes('职场') || lowerQuestion.includes('工作') || lowerQuestion.includes('管理')) {
            return `关于职场问题"${question}"，我的建议：\n\n**职业发展**：\n1. 明确职业目标\n2. 持续学习新技能\n3. 建立专业网络\n\n**工作方法**：\n• 优先级管理\n• 有效沟通\n• 团队协作\n\n需要更具体的职场建议吗？`;
          }

          if (lowerQuestion.includes('ai') || lowerQuestion.includes('人工智能') || lowerQuestion.includes('机器学习')) {
            return `关于AI技术"${question}"，关键点包括：\n\n**基础知识**：\n1. 机器学习原理\n2. 深度学习框架\n3. 实际应用场景\n\n**学习路径**：\n• 理论基础\n• 编程实践\n• 项目经验\n\n需要详细的AI学习指导吗？`;
          }

          // 通用响应
          return `关于"${question}"这个问题，我建议从以下几个角度思考：\n\n**问题分析**：\n1. 明确核心需求\n2. 识别关键因素\n3. 评估约束条件\n\n**解决方案**：\n• 制定具体步骤\n• 考虑风险因素\n• 准备备选方案\n\n需要我详细解释某个方面吗？`;
        };

        const mockResponse = getMockResponse(userMessage.content);

        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🤖 **LongCat AI (演示模式)**\n\n${mockResponse}\n\n⚠️ *当前使用演示响应，因为无法连接到LongCat AI服务。错误详情：${apiError instanceof Error ? apiError.message : '未知错误'}*\n\n请检查：\n1. API服务是否可用\n2. 网络连接状态\n3. API密钥配置`,
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('聊天错误:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，连接AI服务时遇到了问题。这可能是由于网络连接或API服务暂时不可用导致的。\n\n**建议操作：**\n1. 检查网络连接\n2. 稍后重试\n3. 如果问题持续存在，请联系技术支持\n\n您可以尝试重新发送您的问题。`,
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