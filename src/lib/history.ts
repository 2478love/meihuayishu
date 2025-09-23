import { DivinationResult } from '@/types';

const HISTORY_KEY = 'divination_history';
const MAX_HISTORY_ITEMS = 50;

export interface HistoryItem extends DivinationResult {
  id: string;
  timestamp: Date;
  note?: string;
}

export function saveToHistory(result: DivinationResult, note?: string): void {
  if (typeof window === 'undefined') return;

  const history = getHistory();
  const newItem: HistoryItem = {
    ...result,
    id: generateId(),
    timestamp: new Date(),
    note
  };

  history.unshift(newItem);

  // 限制历史记录数量
  if (history.length > MAX_HISTORY_ITEMS) {
    history.pop();
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored);
    // 转换日期字符串为Date对象，并兼容旧数据缺失的新字段
    return history.map((item: HistoryItem) => ({
      ...item,
      method: item.method || '未记录起卦方式',
      detailLines: item.detailLines || [],
      seeds: item.seeds || { upper: 0, lower: 0, changing: 0 },
      timestamp: new Date(item.timestamp),
      time: new Date(item.time)
    }));
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function deleteFromHistory(id: string): void {
  if (typeof window === 'undefined') return;

  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function updateHistoryNote(id: string, note: string): void {
  if (typeof window === 'undefined') return;

  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (item) {
    item.note = note;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}