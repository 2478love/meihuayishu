'use client';

import { useEffect, useRef, useState } from 'react';
import type { AiChatMessage } from '@/types/ai';

interface AiChatPanelProps {
  messages: AiChatMessage[];
  onSend: (message: string) => void;
  isBusy: boolean;
}

const quickPrompts = ['事业发展', '感情走向', '财富机会', '健康提醒'];

export default function AiChatPanel({ messages, onSend, isBusy }: AiChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isBusy) return;
    onSend(`请结合卦象，进一步说明：${prompt}`);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-100/80 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-gray-700/70 dark:bg-gray-900/85">
      <div className="space-y-5">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI 占卜问答</h3>
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-400 dark:text-indigo-300/80">Conversational Guidance</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isBusy}
              className="rounded-full border border-indigo-200/70 px-3 py-1 text-xs text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-400/30 dark:text-indigo-300 dark:hover:border-indigo-400/50 dark:hover:text-indigo-200"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="h-72 space-y-3 overflow-y-auto rounded-xl border border-slate-100/70 bg-slate-50/80 p-4 text-sm leading-relaxed shadow-inner dark:border-gray-700/60 dark:bg-gray-800/60"
        >
          {messages.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              向 AI 提问，探索卦象在事业、感情或生活中的具体启示。
            </p>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-white text-gray-800 ring-1 ring-indigo-100/70 dark:bg-gray-900/70 dark:text-gray-100 dark:ring-indigo-500/20'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="mt-1 block text-[10px] opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="你的问题或想深入了解的方面..."
            disabled={isBusy}
            rows={3}
            className="w-full resize-none rounded-lg border border-indigo-200/70 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-500/30 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                if (input.trim() && !isBusy) {
                  onSend(input);
                  setInput('');
                }
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">Enter 换行 · Ctrl/⌘ + Enter 发送</span>
            <button
              type="submit"
              disabled={isBusy || !input.trim()}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-indigo-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? '生成中...' : '发送'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
