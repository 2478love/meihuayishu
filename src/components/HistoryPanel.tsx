'use client';

import { useState, useEffect } from 'react';
import { HistoryItem, getHistory, deleteFromHistory, clearHistory } from '@/lib/history';
import { DivinationResult } from '@/types';

interface HistoryPanelProps {
  onSelect: (result: DivinationResult) => void;
  onClose: () => void;
}

export default function HistoryPanel({ onSelect, onClose }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条记录吗？')) {
      deleteFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleSelect = (item: HistoryItem) => {
    const result: DivinationResult = {
      mainHexagram: item.mainHexagram,
      changingLine: item.changingLine,
      changedHexagram: item.changedHexagram,
      interpretation: item.interpretation,
      time: item.time
    };
    onSelect(result);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-gray-900/95 border border-slate-200 dark:border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[82vh] flex flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">历史记录</h2>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
              >
                清空所有
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 py-10 text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
              暂无历史记录
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="border border-slate-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer bg-white/80 dark:bg-gray-900/60 hover:bg-indigo-50/70 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.mainHexagram.name}</h3>
                        {item.changedHexagram && (
                          <>
                            <span className="text-gray-400 dark:text-gray-500">→</span>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.changedHexagram.name}</h3>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        动爻：第{item.changingLine}爻
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </p>
                      {item.note && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                          备注：{item.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="rounded-md p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}