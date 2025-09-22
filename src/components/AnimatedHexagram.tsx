'use client';

import { Hexagram } from '@/types';
import { getHexagramLines } from '@/lib/hexagrams';
import { motion } from 'framer-motion';

interface AnimatedHexagramProps {
  hexagram: Hexagram;
  changingLine?: number;
  title?: string;
  delay?: number;
}

export default function AnimatedHexagram({
  hexagram,
  changingLine,
  title,
  delay = 0
}: AnimatedHexagramProps) {
  const lines = getHexagramLines(hexagram.upperTrigram, hexagram.lowerTrigram);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay,
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const lineVariants = {
    hidden: {
      opacity: 0,
      scaleX: 0,
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const glowAnimation = {
    boxShadow: [
      '0 0 6px rgba(248, 113, 113, 0.45)',
      '0 0 14px rgba(248, 113, 113, 0.65)',
      '0 0 6px rgba(248, 113, 113, 0.45)'
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut' as const
    }
  };

  return (
    <motion.div
      className="group relative flex h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white/95 via-white/70 to-white/30 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-900/70 dark:to-gray-900/40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ translateY: -4 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent dark:via-indigo-500/40" />
      {title && (
        <motion.span
          className="mb-4 inline-flex self-start items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.15 }}
        >
          {title}
        </motion.span>
      )}

      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        <span className="pointer-events-none absolute inset-0 flex justify-center text-[5.5rem] font-serif leading-none text-indigo-100/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:text-indigo-500/15">
          {hexagram.symbol}
        </span>
        <div className="relative flex flex-col items-center text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hexagram.name}
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">第{hexagram.number}卦</p>
        </div>
      </motion.div>

      <div className="mb-6 flex flex-1 flex-col items-stretch justify-center gap-3">
        {lines.map((isYang, index) => {
          const lineNumber = 6 - index;
          const isChanging = changingLine === lineNumber;

          return (
            <motion.div
              key={index}
              className="relative flex items-center gap-4 justify-center"
              variants={lineVariants}
            >
              <span className="w-6 text-xs font-medium text-gray-400 dark:text-gray-500 text-right">
                {lineNumber}
              </span>

              <motion.div
                className={`relative flex min-w-[200px] items-center justify-center gap-3 rounded-full px-4 py-2 transition-all ${isChanging ? 'bg-rose-100/70 ring-2 ring-rose-200/70 dark:bg-rose-500/15 dark:ring-rose-500/40' : 'bg-slate-100/50 ring-1 ring-slate-200/60 dark:bg-gray-800/60 dark:ring-gray-700/50'}`}
                animate={isChanging ? glowAnimation : {}}
              >
                {isYang ? (
                  <motion.div
                    className={`h-1.5 w-20 rounded-sm ${
                      isChanging
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                        : 'bg-gray-800 dark:bg-gray-200'
                    }`}
                    whileHover={{ scaleX: 1.05 }}
                    transition={{ type: "spring", stiffness: 420 }}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`h-1.5 w-10 rounded-sm ${
                        isChanging
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                          : 'bg-gray-800 dark:bg-gray-200'
                      }`}
                      whileHover={{ scaleX: 1.05 }}
                      transition={{ type: "spring", stiffness: 420 }}
                    />
                    <motion.div
                      className={`h-1.5 w-10 rounded-sm ${
                        isChanging
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                          : 'bg-gray-800 dark:bg-gray-200'
                      }`}
                      whileHover={{ scaleX: 1.05 }}
                      transition={{ type: "spring", stiffness: 420 }}
                    />
                  </div>
                )}
                {isChanging && (
                  <span className="absolute right-4 flex items-center gap-1 text-[10px] font-semibold text-rose-500 dark:text-rose-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500/80 dark:bg-rose-400/80" />
                    动
                  </span>
                )}
              </motion.div>

            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-auto space-y-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.6 }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {hexagram.meaning}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {hexagram.description}
        </p>
      </motion.div>
    </motion.div>
  );
}