'use client';

import { useState } from 'react';
import type { AiInsight } from '@/types/ai';

interface AiInsightCardProps {
  status: 'idle' | 'loading' | 'ready' | 'error';
  insight: AiInsight | null;
  error?: string | null;
  onRetry: () => void;
  onAsk: (question: string) => void;
}

export default function AiInsightCard({
  status,
  insight,
  error,
  onRetry,
  onAsk,
}: AiInsightCardProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) return;
    onAsk(question.trim());
    setQuestion('');
  };

  const isBusy = status === 'loading';

  return (
    <section className="relative overflow-hidden rounded-2xl border border-indigo-100/80 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-indigo-500/20 dark:bg-gray-900/85">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 dark:from-indigo-500 dark:via-purple-500 dark:to-blue-500" />
      <div className="space-y-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI 占卜解读</h3>
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-400 dark:text-indigo-300/80">Smart Insights</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            disabled={isBusy}
            className="rounded-lg border border-indigo-200/70 px-3 py-1 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:border-indigo-400/50 dark:hover:text-indigo-200"
          >
            重新生成
          </button>
        </header>

        <div className="min-h-[160px] rounded-xl border border-dashed border-indigo-200/70 bg-slate-50/90 p-4 text-sm leading-relaxed text-gray-700 shadow-inner dark:border-indigo-400/30 dark:bg-gray-800/60 dark:text-gray-200">
          {status === 'idle' && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              起卦完成后，AI 助手会自动给出卦象概览、动爻洞察与实用建议。
            </p>
          )}

          {status === 'loading' && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 rounded bg-indigo-100/60 dark:bg-indigo-500/20" />
              <div className="h-4 rounded bg-indigo-100/60 dark:bg-indigo-500/20" />
              <div className="h-4 rounded bg-indigo-100/60 dark:bg-indigo-500/20" />
              <div className="h-4 w-2/3 rounded bg-indigo-100/60 dark:bg-indigo-500/20" />
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <p className="font-medium text-red-500">AI 解读暂时不可用</p>
              <p className="text-sm text-red-400/90">
                {error || '请稍后重试，或检查是否已配置大模型 API。'}
              </p>
            </div>
          )}

          {status === 'ready' && insight && (
            <article className="space-y-4 whitespace-pre-wrap">
              {insight.content.split(/\n{2,}/).map((block, idx) => (
                <p key={idx} className="rounded-lg bg-white/70 px-3 py-2 shadow-sm ring-1 ring-indigo-100/60 dark:bg-gray-900/50 dark:ring-indigo-500/30">
                  {block}
                </p>
              ))}
              <p className="text-xs text-right text-indigo-400/80">
                生成于：{new Date(insight.generatedAt).toLocaleString('zh-CN')}
              </p>
            </article>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
            定制化提问
          </label>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：请针对创业方向给出提醒"
              disabled={isBusy}
              className="flex-1 rounded-lg border border-indigo-200/70 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-500/30 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              disabled={isBusy || !question.trim()}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-indigo-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              提交问题
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
