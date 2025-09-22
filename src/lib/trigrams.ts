import { Trigram } from '@/types';

export const trigrams: Record<number, Trigram> = {
  1: {
    name: '乾',
    symbol: '☰',
    number: 1,
    lines: [true, true, true],
    attribute: '健',
    direction: '西北',
    element: '金'
  },
  2: {
    name: '兑',
    symbol: '☱',
    number: 2,
    lines: [false, true, true],
    attribute: '悦',
    direction: '西',
    element: '金'
  },
  3: {
    name: '离',
    symbol: '☲',
    number: 3,
    lines: [true, false, true],
    attribute: '丽',
    direction: '南',
    element: '火'
  },
  4: {
    name: '震',
    symbol: '☳',
    number: 4,
    lines: [false, false, true],
    attribute: '动',
    direction: '东',
    element: '木'
  },
  5: {
    name: '巽',
    symbol: '☴',
    number: 5,
    lines: [true, true, false],
    attribute: '入',
    direction: '东南',
    element: '木'
  },
  6: {
    name: '坎',
    symbol: '☵',
    number: 6,
    lines: [false, true, false],
    attribute: '陷',
    direction: '北',
    element: '水'
  },
  7: {
    name: '艮',
    symbol: '☶',
    number: 7,
    lines: [true, false, false],
    attribute: '止',
    direction: '东北',
    element: '土'
  },
  8: {
    name: '坤',
    symbol: '☷',
    number: 8,
    lines: [false, false, false],
    attribute: '顺',
    direction: '西南',
    element: '土'
  }
};

export function getTrigramByNumber(num: number): Trigram {
  const remainder = num % 8;
  return trigrams[remainder === 0 ? 8 : remainder];
}