export interface Trigram {
  name: string;
  symbol: string;
  number: number;
  lines: boolean[]; // true表示阳爻，false表示阴爻
  attribute: string;
  direction: string;
  element: string;
}

export interface Hexagram {
  name: string;
  upperTrigram: number;
  lowerTrigram: number;
  number: number;
  symbol: string;
  meaning: string;
  description: string;
}

export interface DivinationResult {
  mainHexagram: Hexagram;
  mutualHexagram?: Hexagram; // 互卦
  changingLine: number;
  changingHexagram?: Hexagram; // 变卦

  interpretation: string;
  time: Date;
}

export interface DivinationInput {
  type: 'time' | 'number' | 'manual' | 'text' | 'direction' | 'sound' | 'color' | 'object';
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  numbers?: number[];
  text?: string;
  direction?: string;
  sound?: string;
  color?: string;
  object?: string;
  useLunar?: boolean; // 是否使用农历
}