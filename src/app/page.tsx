'use client';

import { Fragment, useCallback, useState } from 'react';
import { DivinationInput, DivinationResult, Hexagram } from '@/types';
import { performDivination } from '@/lib/divination';
import { getFullHexagram } from '@/lib/hexagrams-data';
import { saveToHistory } from '@/lib/history';
import DivinationForm from '@/components/DivinationForm';
import AnimatedHexagram from '@/components/AnimatedHexagram';
import HistoryPanel from '@/components/HistoryPanel';
import AiInsightCard from '@/components/AiInsightCard';
import AiChatPanel from '@/components/AiChatPanel';
import { motion, AnimatePresence } from 'framer-motion';
import type { AiChatMessage, AiInsight } from '@/types/ai';

type InsightStatus = 'idle' | 'loading' | 'ready' | 'error';

function serializeResultForApi(result: DivinationResult) {
  return {
    ...result,
    time: result.time instanceof Date ? result.time.toISOString() : result.time,
  };
}

export default function Home() {
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [insightStatus, setInsightStatus] = useState<InsightStatus>('idle');
  const [insightError, setInsightError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const requestAiInsight = useCallback(async (targetResult: DivinationResult, question?: string) => {
    setInsightStatus('loading');
    setInsightError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'insight',
          result: serializeResultForApi(targetResult),
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'AI 请求失败');
      }

      setAiInsight({
        id: data?.id || `insight-${Date.now()}`,
        content: data?.content || '',
        generatedAt: new Date().toISOString(),
      });
      setInsightStatus('ready');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI 请求失败';
      setInsightStatus('error');
      setInsightError(message);
    }
  }, []);

  const handleRefreshInsight = () => {
    if (!result) return;
    void requestAiInsight(result);
  };

  const handleAskInsightQuestion = (question: string) => {
    if (!result) return;
    void requestAiInsight(result, question);
  };

  const handleSendChatMessage = async (message: string) => {
    if (!result) return;

    const content = message.trim();
    if (!content) return;

    const timestamp = new Date().toISOString();
    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: timestamp,
    };

    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setChatLoading(true);

    try {
      const historyTurns = chatMessages.map(({ role, content: text }) => ({
        role,
        content: text,
      }));

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'chat',
          result: serializeResultForApi(result),
          history: historyTurns,
          userInput: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'AI 对话失败');
      }

      const assistantMessage: AiChatMessage = {
        id: data?.id || `assistant-${Date.now()}`,
        role: 'assistant',
        content: data?.content || '',
        createdAt: new Date().toISOString(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'AI 对话失败';
      const assistantMessage: AiChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `抱歉，我未能完成本次回复：${messageText}`,
        createdAt: new Date().toISOString(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDivination = async (input: DivinationInput) => {
    try {
      setIsAnimating(true);

      // 添加短暂延迟以显示动画
      await new Promise(resolve => setTimeout(resolve, 500));

      const divinationResult = performDivination(input);

      // 使用增强的卦象数据
      const enhancedResult = {
        ...divinationResult,
        mainHexagram: getFullHexagram(
          divinationResult.mainHexagram.upperTrigram,
          divinationResult.mainHexagram.lowerTrigram
        ),
        mutualHexagram: divinationResult.mutualHexagram ?
          getFullHexagram(
            divinationResult.mutualHexagram.upperTrigram,
            divinationResult.mutualHexagram.lowerTrigram
          ) : undefined,
        changingHexagram: divinationResult.changingHexagram ?
          getFullHexagram(
            divinationResult.changingHexagram.upperTrigram,
            divinationResult.changingHexagram.lowerTrigram
          ) : undefined,

      };

      setResult(enhancedResult);
      saveToHistory(enhancedResult);
      setAiInsight(null);
      setChatMessages([]);
      setInsightStatus('loading');
      setInsightError(null);
      setChatLoading(false);
      void requestAiInsight(enhancedResult);
      setIsAnimating(false);
    } catch (error) {
      setIsAnimating(false);
      alert('起卦失败：' + (error as Error).message);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAiInsight(null);
    setInsightStatus('idle');
    setInsightError(null);
    setChatMessages([]);
    setChatLoading(false);
  };

  const handleSelectHistory = (historicalResult: DivinationResult) => {
    setResult(historicalResult);
    setShowHistory(false);
    setAiInsight(null);
    setChatMessages([]);
    setInsightStatus('loading');
    setInsightError(null);
    setChatLoading(false);
    void requestAiInsight(historicalResult);
  };

  const hexagramSequence: Array<{ key: 'main' | 'mutual' | 'changing'; hexagram: Hexagram; title: string; changingLine?: number }> = [];

  if (result) {
    hexagramSequence.push({
      key: 'main',
      hexagram: result.mainHexagram,
      title: '主卦',
      changingLine: result.changingLine,
    });

    if (result.mutualHexagram) {
      hexagramSequence.push({
        key: 'mutual',
        hexagram: result.mutualHexagram,
        title: '互卦',
      });
    }

    if (result.changingHexagram) {
      hexagramSequence.push({
        key: 'changing',
        hexagram: result.changingHexagram,
        title: '变卦',
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.15),_transparent_60%)]"></div>
        <div className="pointer-events-none absolute bottom-[-200px] right-[-120px] h-[360px] w-[360px] rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-transparent opacity-40 blur-3xl dark:from-indigo-500/30 dark:via-purple-500/30"></div>
      </div>
      <div className="relative z-10 container mx-auto py-8 px-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <div>
            {/* 顶部工具栏 */}
            <div className="flex items-center mb-8">
              <motion.h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                梅花易数
              </motion.h1>
            </div>

            <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              className="flex flex-col items-center justify-center min-h-[70vh]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-600 dark:text-gray-300">
                  宋代邵雍创立的占卜方法
                </p>
              </motion.div>

              {isAnimating ? (
                <motion.div
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="relative w-24 h-24">
                    <motion.div
                      className="absolute inset-0 border-4 border-blue-500 rounded-full"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                    />
                    <motion.div
                      className="absolute inset-2 border-4 border-purple-500 rounded-full"
                      animate={{
                        rotate: -360,
                        scale: [1, 0.9, 1],
                      }}
                      transition={{
                        rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                    />
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">正在起卦...</p>
                </motion.div>
              ) : (
                <DivinationForm onSubmit={handleDivination} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="w-full max-w-6xl mx-auto space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  卦象结果
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  起卦时间：{result.time.toLocaleString('zh-CN')}
                </p>
              </motion.div>

              <motion.div
                className="mb-6 flex flex-wrap items-center justify-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-400 dark:text-indigo-300/80">动爻</span>
                  第{result.changingLine}爻
                </span>
                {result.mutualHexagram && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-1.5 text-sm text-slate-700 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60 dark:text-gray-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-400/80">互卦</span>
                    {result.mutualHexagram.name}
                  </span>
                )}
                {result.changingHexagram && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50/80 px-4 py-1.5 text-sm text-purple-700 shadow-sm dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-purple-400 dark:text-purple-300/80">变卦</span>
                    {result.changingHexagram.name}
                  </span>
                )}
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch w-full">
                {hexagramSequence.map((item, index) => (
                  <Fragment key={item.key}>
                    <AnimatedHexagram
                      hexagram={item.hexagram}
                      changingLine={item.changingLine}
                      title={item.title}
                      delay={index * 0.2}
                    />
                    {index < hexagramSequence.length - 1 && (
                      <motion.div
                        className="flex items-center justify-center self-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + 0.2 }}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-50 text-2xl text-indigo-500 shadow-sm dark:from-indigo-500/20 dark:via-purple-500/20 dark:text-indigo-200">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </Fragment>
                ))}
              </div>


              <motion.div
                className="relative overflow-hidden rounded-2xl border border-slate-100/80 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-gray-700/70 dark:bg-gray-900/85"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 dark:from-indigo-500 dark:via-purple-500 dark:to-blue-500" />
                <div className="space-y-5">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">卦象解读</h3>
                    <span className="text-xs uppercase tracking-[0.3em] text-indigo-400 dark:text-indigo-300/80">Insights</span>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                    {result.interpretation
                      .split('\n')
                      .filter(Boolean)
                      .map((line, index) => (
                        <p
                          key={index}
                          className="whitespace-pre-wrap rounded-xl border border-transparent bg-slate-50/90 px-4 py-3 shadow-sm ring-1 ring-slate-100/60 transition hover:ring-indigo-200 dark:bg-gray-800/60 dark:text-gray-200 dark:ring-gray-700/60"
                        >
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105"
                >
                  重新起卦
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
          </div>

          <aside className="mt-8 lg:mt-0">
            <div className="flex flex-col gap-6 sticky top-8">
              <motion.button
                onClick={() => setShowHistory(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-indigo-100 bg-white/95 px-4 py-2 text-sm font-medium text-indigo-600 shadow-md transition hover:border-indigo-200 hover:shadow-lg dark:border-indigo-500/30 dark:bg-gray-900/90 dark:text-indigo-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>历史记录</span>
              </motion.button>

              <AiInsightCard
                status={insightStatus}
                insight={aiInsight}
                error={insightError}
                onRetry={handleRefreshInsight}
                onAsk={handleAskInsightQuestion}
              />

              <AiChatPanel
                messages={chatMessages}
                onSend={handleSendChatMessage}
                isBusy={chatLoading}
              />
            </div>
          </aside>
        </div>

        {/* 历史记录面板 */}
        <AnimatePresence>
          {showHistory && (
            <HistoryPanel
              onSelect={handleSelectHistory}
              onClose={() => setShowHistory(false)}
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
