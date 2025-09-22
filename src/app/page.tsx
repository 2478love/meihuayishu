'use client';

import { useState } from 'react';
import { DivinationInput, DivinationResult } from '@/types';
import { performDivination } from '@/lib/divination';
import { getFullHexagram } from '@/lib/hexagrams-data';
import { saveToHistory } from '@/lib/history';
import DivinationForm from '@/components/DivinationForm';
import AnimatedHexagram from '@/components/AnimatedHexagram';
import HistoryPanel from '@/components/HistoryPanel';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
        changedHexagram: divinationResult.changedHexagram ?
          getFullHexagram(
            divinationResult.changedHexagram.upperTrigram,
            divinationResult.changedHexagram.lowerTrigram
          ) : undefined
      };

      setResult(enhancedResult);
      saveToHistory(enhancedResult);
      setIsAnimating(false);
    } catch (error) {
      setIsAnimating(false);
      alert('起卦失败：' + (error as Error).message);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  const handleSelectHistory = (historicalResult: DivinationResult) => {
    setResult(historicalResult);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.15),_transparent_60%)]"></div>
        <div className="pointer-events-none absolute bottom-[-200px] right-[-120px] h-[360px] w-[360px] rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-transparent opacity-40 blur-3xl dark:from-indigo-500/30 dark:via-purple-500/30"></div>
      </div>
      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* 顶部工具栏 */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            梅花易数
          </motion.h1>

          <motion.button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>历史记录</span>
          </motion.button>
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
                {result.changedHexagram && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-1.5 text-sm text-slate-700 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60 dark:text-gray-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-400/80">变卦</span>
                    {result.changedHexagram.name}
                  </span>
                )}
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch w-full">
                <AnimatedHexagram
                  hexagram={result.mainHexagram}
                  changingLine={result.changingLine}
                  title="主卦"
                  delay={0}
                />

                {result.mutualHexagram && (
                  <>
                    <motion.div
                      className="flex items-center justify-center self-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-50 text-2xl text-indigo-500 shadow-sm dark:from-indigo-500/20 dark:via-purple-500/20 dark:text-indigo-200">
                        →
                      </div>
                    </motion.div>

                    <AnimatedHexagram
                      hexagram={result.mutualHexagram}
                      title="互卦"
                      delay={0.2}
                    />
                  </>
                )}

                {result.changedHexagram && (
                  <>
                    <motion.div
                      className="flex items-center justify-center self-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-50 text-2xl text-indigo-500 shadow-sm dark:from-indigo-500/20 dark:via-purple-500/20 dark:text-indigo-200">
                        →
                      </div>
                    </motion.div>

                    <AnimatedHexagram
                      hexagram={result.changedHexagram}
                      title="变卦"
                      delay={0.4}
                    />
                  </>
                )}
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