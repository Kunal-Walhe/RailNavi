
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User as UserIcon, Loader2, Navigation, Sparkles, Wand2, Zap, AlertCircle } from 'lucide-react';
import { getSmartNavigationStream } from '../services/aiService';
import { Station } from '../types';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantProps {
  activeStation: Station;
}

const Assistant: React.FC<AssistantProps> = ({ activeStation }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: t('assistant.greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMsg: Message = { id: userMsgId, role: 'user', content: input };

    // Add user message and a placeholder for AI
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMsg, { id: aiMsgId, role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);

    // Local greeting check
    const lowerInput = input.trim().toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(g => lowerInput === g || lowerInput.startsWith(g + ' '));

    if (isGreeting) {
      setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          if (newMessages[lastIdx].id === aiMsgId) {
            newMessages[lastIdx] = {
              ...newMessages[lastIdx],
              content: t('assistant.greeting') // Reuse the official greeting
            };
          }
          return newMessages;
        });
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      const stream = await getSmartNavigationStream(input, activeStation);
      let fullText = '';

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;

        // Update the last message (the placeholder) with the streaming content
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          if (newMessages[lastIdx].id === aiMsgId) {
            newMessages[lastIdx] = { ...newMessages[lastIdx], content: fullText };
          }
          return newMessages;
        });
      }
    } catch (err) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        newMessages[lastIdx] = {
          ...newMessages[lastIdx],
          content: t('assistant.sync_error')
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)] animate-in slide-in-from-bottom-6 duration-700">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            {t('assistant.official_ai_assistant')}
            <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">
              <Zap size={12} fill="currentColor" /> {t('assistant.live_connected')}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-sm">{t('assistant.virtual_guide')} {activeStation.name} {t('schedule.division')}.</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-lg flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gray-50 dark:bg-slate-950/50 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 sm:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-blue-700 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-blue-700 dark:text-blue-400'
                }`}>
                {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[80%] p-4 sm:p-6 rounded-2xl text-sm leading-relaxed font-medium whitespace-pre-wrap shadow-sm ${msg.role === 'user'
                ? 'bg-blue-700 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-tl-none'
                }`}>
                {msg.content || (
                  <div className="flex gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 bg-blue-700 dark:bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-700 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-700 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder={t('assistant.placeholder')}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-inner font-medium text-sm sm:text-base"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Zap className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${isLoading ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`} size={18} />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white p-3 sm:p-4 rounded-lg transition-all shadow-lg shadow-blue-900/10 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-gray-600">
            {[
              t('assistant.hints.waiting_room'),
              t('assistant.hints.train_status'),
              t('assistant.hints.platform_dir'),
              t('assistant.hints.food_stall')
            ].map((hint, i) => (
              <button
                key={i}
                onClick={() => setInput(hint)}
                disabled={isLoading}
                className="text-[10px] font-bold bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all uppercase tracking-wide shadow-sm disabled:opacity-30"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <AlertCircle size={12} className="text-gray-400" />
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('assistant.official_service')}</p>
      </div>
    </div>
  );
};

export default Assistant;
