import cnchar from "cnchar";
import { solar2lunar } from "solarlunar";

import type { DivinationInput, DivinationResult, Hexagram } from "@/types";
import { deriveMainHexagram, deriveMutualHexagram, normalizeTrigramSeed, normalizeLineSeed } from "./hexagram-calculations";
import { getHexagramLines } from "./hexagrams";
import { trigrams } from "./trigrams";

const LATER_HEAVEN_NUMBERS = {
  qian: 1,
  dui: 2,
  li: 3,
  zhen: 4,
  xun: 5,
  kan: 6,
  gen: 7,
  kun: 8,
} as const;

const TRIGRAM_NAME_BY_NUMBER: Record<number, string> = {
  [LATER_HEAVEN_NUMBERS.qian]: "乾",
  [LATER_HEAVEN_NUMBERS.dui]: "兑",
  [LATER_HEAVEN_NUMBERS.li]: "离",
  [LATER_HEAVEN_NUMBERS.zhen]: "震",
  [LATER_HEAVEN_NUMBERS.xun]: "巽",
  [LATER_HEAVEN_NUMBERS.kan]: "坎",
  [LATER_HEAVEN_NUMBERS.gen]: "艮",
  [LATER_HEAVEN_NUMBERS.kun]: "坤",
};

const DIRECTION_TO_TRIGRAM: Record<string, number> = {
  "东": LATER_HEAVEN_NUMBERS.zhen,
  "东南": LATER_HEAVEN_NUMBERS.xun,
  "南": LATER_HEAVEN_NUMBERS.li,
  "西南": LATER_HEAVEN_NUMBERS.kun,
  "西": LATER_HEAVEN_NUMBERS.dui,
  "西北": LATER_HEAVEN_NUMBERS.qian,
  "北": LATER_HEAVEN_NUMBERS.kan,
  "东北": LATER_HEAVEN_NUMBERS.gen,
};

const SOUND_TO_TRIGRAM: Record<string, number> = {
  "鸟叫": LATER_HEAVEN_NUMBERS.xun,
  "狗吠": LATER_HEAVEN_NUMBERS.gen,
  "雷声": LATER_HEAVEN_NUMBERS.zhen,
  "风声": LATER_HEAVEN_NUMBERS.xun,
  "雨声": LATER_HEAVEN_NUMBERS.kan,
  "人声": LATER_HEAVEN_NUMBERS.dui,
  "车声": LATER_HEAVEN_NUMBERS.qian,
  "钟声": LATER_HEAVEN_NUMBERS.qian,
  "鼓声": LATER_HEAVEN_NUMBERS.zhen,
  "其他": LATER_HEAVEN_NUMBERS.kun,
};

const COLOR_TO_TRIGRAM: Record<string, number> = {
  "红色": LATER_HEAVEN_NUMBERS.li,
  "黄色": LATER_HEAVEN_NUMBERS.kun,
  "白色": LATER_HEAVEN_NUMBERS.qian,
  "黑色": LATER_HEAVEN_NUMBERS.kan,
  "青色": LATER_HEAVEN_NUMBERS.zhen,
  "绿色": LATER_HEAVEN_NUMBERS.xun,
  "紫色": LATER_HEAVEN_NUMBERS.li,
  "灰色": LATER_HEAVEN_NUMBERS.dui,
};

const OBJECT_FEATURES: Array<{ keywords: string[]; trigram: number }> = [
  { keywords: ["圆", "圆形", "球", "轮", "环"], trigram: LATER_HEAVEN_NUMBERS.qian },
  { keywords: ["方", "方形", "田", "土", "地"], trigram: LATER_HEAVEN_NUMBERS.kun },
  { keywords: ["尖", "火", "灯", "光", "亮"], trigram: LATER_HEAVEN_NUMBERS.li },
  { keywords: ["长", "木", "竿", "竹", "雷"], trigram: LATER_HEAVEN_NUMBERS.zhen },
  { keywords: ["风", "动", "布", "绳", "羽"], trigram: LATER_HEAVEN_NUMBERS.xun },
  { keywords: ["水", "弯", "沟", "洞", "流"], trigram: LATER_HEAVEN_NUMBERS.kan },
  { keywords: ["山", "石", "止", "静", "门"], trigram: LATER_HEAVEN_NUMBERS.gen },
  { keywords: ["牛", "土块", "母", "坠", "厚"], trigram: LATER_HEAVEN_NUMBERS.kun },
];

export function performDivination(input: DivinationInput): DivinationResult {
  switch (input.type) {
    case "time":
      return timeBasedDivination(input);
    case "number":
      return numberBasedDivination(input);
    case "text":
      return textBasedDivination(input);
    case "direction":
      return directionBasedDivination(input);
    case "sound":
      return soundBasedDivination(input);
    case "color":
      return colorBasedDivination(input);
    case "object":
      return objectBasedDivination(input);
    case "manual":
      return manualDivination();
    default:
      throw new Error("未知的起卦类型");
  }
}

function timeBasedDivination(input: DivinationInput): DivinationResult {
  const context = resolveTemporalContext(input);
  const doubleHour = getChineseDoubleHour(context.hour);
  const minuteSeed = context.minute;

  const upperSeed = context.year + context.month + context.day;
  const lowerSeed = upperSeed + doubleHour;
  const upperTrigramNumber = normalizeTrigramSeed(upperSeed);
  const lowerTrigramNumber = normalizeTrigramSeed(lowerSeed);
  const changingSeed = upperTrigramNumber + lowerTrigramNumber + minuteSeed;

  const detailLines = [
    `年月日之和：${context.year} + ${context.month} + ${context.day} = ${upperSeed}`,
    `时辰入卦：${upperSeed} + ${doubleHour} = ${lowerSeed}`,
    `动爻取数：(${upperTrigramNumber} + ${lowerTrigramNumber} + ${minuteSeed})`,
  ];

  return buildResult({
    upperSeed,
    lowerSeed,
    changingSeed,
    method: context.label,
    detailLines,
    timestamp: context.timestamp,
  });
}

function numberBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.numbers || input.numbers.length < 2) {
    throw new Error("数字起卦需要至少两个数字");
  }

  const sanitized = input.numbers.map((num) => Math.abs(Math.round(num)));
  const first = sanitized[0] ?? 1;
  const second = sanitized[1] ?? 1;
  const third = sanitized[2] ?? first + second;

  const detailLines = [
    `报数上卦：${first}`,
    `报数下卦：${second}`,
    `动爻取数：${third}`,
  ];

  return buildResult({
    upperSeed: first,
    lowerSeed: second,
    changingSeed: third,
    method: "数字起卦（报数）",
    detailLines,
  });
}

function textBasedDivination(input: DivinationInput): DivinationResult {
  const rawText = input.text?.replace(/\s+/g, "") ?? "";
  const characters = Array.from(rawText);

  if (characters.length === 0) {
    throw new Error("文字起卦需要输入文字内容");
  }

  const charCount = characters.length;
  const strokeSum = characters.reduce((total, char) => total + getStrokeCount(char), 0);
  const changingSeed = charCount + strokeSum;

  const detailLines = [
    `字数上卦：${charCount}`,
    `笔画下卦：${strokeSum}`,
    `动爻取数：${changingSeed}`,
  ];

  return buildResult({
    upperSeed: charCount,
    lowerSeed: strokeSum,
    changingSeed,
    method: `文字起卦（${rawText}）`,
    detailLines,
  });
}

function directionBasedDivination(input: DivinationInput): DivinationResult {
  const direction = (input.direction ?? "").trim();
  if (!direction) {
    throw new Error("方位起卦需要选择方位");
  }

  const trigram = DIRECTION_TO_TRIGRAM[direction];
  if (!trigram) {
    throw new Error(`暂不支持的方位“${direction}”，请使用八正方位`);
  }

  const trigramName = TRIGRAM_NAME_BY_NUMBER[trigram] ?? `${trigram}`;

  const now = new Date();
  const doubleHour = getChineseDoubleHour(now.getHours());
  const temporalSeed = now.getFullYear() + (now.getMonth() + 1) + now.getDate() + doubleHour;
  const minuteSeed = now.getMinutes();
  const lowerTrigramNumber = normalizeTrigramSeed(temporalSeed);

  const detailLines = [
    `方位取数：${direction} → ${trigramName}卦`,
    `时空取数：${now.getFullYear()} + ${now.getMonth() + 1} + ${now.getDate()} + ${doubleHour} = ${temporalSeed}`,
    `动爻取数：(${trigram} + ${lowerTrigramNumber} + ${minuteSeed})`,
  ];

  return buildResult({
    upperSeed: trigram,
    lowerSeed: temporalSeed,
    changingSeed: trigram + lowerTrigramNumber + minuteSeed,
    method: `方位起卦（观方位：${direction}）`,
    detailLines,
    timestamp: now,
  });
}

function soundBasedDivination(input: DivinationInput): DivinationResult {
  const sound = (input.sound ?? "").trim();
  if (!sound) {
    throw new Error("声音起卦需要描述声音特征");
  }

  const trigram = SOUND_TO_TRIGRAM[sound] ?? SOUND_TO_TRIGRAM["其他"];
  const now = new Date();
  const doubleHour = getChineseDoubleHour(now.getHours());
  const minuteSeed = now.getMinutes();
  const temporalSeed = now.getFullYear() + (now.getMonth() + 1) + now.getDate() + doubleHour;
  const lowerTrigramNumber = normalizeTrigramSeed(temporalSeed);

  const detailLines = [
    `声音取象：${sound} → ${TRIGRAM_NAME_BY_NUMBER[trigram]}卦`,
    `时辰入卦：${now.getFullYear()} + ${now.getMonth() + 1} + ${now.getDate()} + ${doubleHour} = ${temporalSeed}`,
    `动爻取数：(${trigram} + ${lowerTrigramNumber} + ${minuteSeed})`,
  ];

  return buildResult({
    upperSeed: trigram,
    lowerSeed: temporalSeed,
    changingSeed: trigram + lowerTrigramNumber + minuteSeed,
    method: `声音起卦（闻声：${sound}）`,
    detailLines,
    timestamp: now,
  });
}

function colorBasedDivination(input: DivinationInput): DivinationResult {
  const color = (input.color ?? "").trim();
  if (!color) {
    throw new Error("颜色起卦需要选择颜色");
  }

  const trigram = COLOR_TO_TRIGRAM[color];
  if (!trigram) {
    throw new Error(`暂不支持的颜色“${color}”`);
  }

  const now = new Date();
  const doubleHour = getChineseDoubleHour(now.getHours());
  const seasonalSeed = (now.getMonth() + 1) + now.getDate() + doubleHour;
  const lowerTrigramNumber = normalizeTrigramSeed(seasonalSeed);

  const detailLines = [
    `颜色取象：${color} → ${TRIGRAM_NAME_BY_NUMBER[trigram]}卦`,
    `时节取数：${now.getMonth() + 1} + ${now.getDate()} + ${doubleHour} = ${seasonalSeed}`,
    `动爻取数：(${trigram} + ${lowerTrigramNumber})`,
  ];

  return buildResult({
    upperSeed: trigram,
    lowerSeed: seasonalSeed,
    changingSeed: trigram + lowerTrigramNumber,
    method: `颜色起卦（观色：${color}）`,
    detailLines,
    timestamp: now,
  });
}

function objectBasedDivination(input: DivinationInput): DivinationResult {
  const description = (input.object ?? "").trim();
  if (!description) {
    throw new Error("物象起卦需要输入物体描述");
  }

  const trigram = determineObjectTrigram(description);
  const now = new Date();
  const doubleHour = getChineseDoubleHour(now.getHours());
  const textLength = Array.from(description).length || 1;
  const strokeSum = Array.from(description).reduce((total, char) => total + getStrokeCount(char), 0) || textLength;
  const temporalSeed = now.getFullYear() + (now.getMonth() + 1) + now.getDate() + doubleHour;

  const detailLines = [
    `物象取卦：${TRIGRAM_NAME_BY_NUMBER[trigram]}卦（${description}）`,
    `时辰入卦：${now.getFullYear()} + ${now.getMonth() + 1} + ${now.getDate()} + ${doubleHour} = ${temporalSeed}`,
    `动爻取数：(${trigram} + ${strokeSum})`,
  ];

  return buildResult({
    upperSeed: trigram,
    lowerSeed: temporalSeed,
    changingSeed: trigram + strokeSum,
    method: `物象起卦（观物：${description}）`,
    detailLines,
    timestamp: now,
  });
}

function manualDivination(): DivinationResult {
  const now = new Date();
  const baseSeed = now.getFullYear() + (now.getMonth() + 1) + now.getDate();
  const momentSeed = now.getHours() * 60 + now.getMinutes() + now.getSeconds();
  const milliSeed = now.getMilliseconds();

  const detailLines = [
    `年月日取数：${baseSeed}`,
    `时分秒取数：${momentSeed}`,
    `动爻取数：(${baseSeed} + ${momentSeed} + ${milliSeed})`,
  ];

  return buildResult({
    upperSeed: baseSeed,
    lowerSeed: momentSeed,
    changingSeed: baseSeed + momentSeed + milliSeed,
    method: "随机起卦（心动起卦）",
    detailLines,
    timestamp: now,
  });
}

interface TemporalContext {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  label: string;
  timestamp: Date;
}

function resolveTemporalContext(input: DivinationInput): TemporalContext {
  const now = new Date();

  const solarYear = input.year ?? now.getFullYear();
  const solarMonth = input.month ?? now.getMonth() + 1;
  const solarDay = input.day ?? now.getDate();
  const hour = input.hour ?? now.getHours();
  const minute = input.minute ?? now.getMinutes();
  const timestamp = new Date(solarYear, solarMonth - 1, solarDay, hour, minute, 0, 0);

  if (input.useLunar) {
    const lunar = solar2lunar(solarYear, solarMonth, solarDay);
    return {
      year: lunar.lYear,
      month: lunar.lMonth,
      day: lunar.lDay,
      hour,
      minute,
      label: "农历时间起卦（梅花易数年月日时）",
      timestamp,
    };
  }

  return {
    year: solarYear,
    month: solarMonth,
    day: solarDay,
    hour,
    minute,
    label: "公历时间起卦（梅花易数年月日时）",
    timestamp,
  };
}

interface BuildResultOptions {
  upperSeed: number;
  lowerSeed: number;
  changingSeed: number;
  method: string;
  detailLines?: string[];
  timestamp?: Date;
}

function buildResult({ upperSeed, lowerSeed, changingSeed, method, detailLines = [], timestamp }: BuildResultOptions): DivinationResult {
  const upperTrigram = normalizeTrigramSeed(upperSeed);
  const lowerTrigram = normalizeTrigramSeed(lowerSeed);
  const changingLine = normalizeLineSeed(changingSeed);

  const mainHexagram = getRequiredHexagram(upperTrigram, lowerTrigram);
  const mutualHexagram = deriveMutualHexagram(upperTrigram, lowerTrigram);
  const changingHexagram = deriveChangingHexagram(mainHexagram, changingLine);

  const interpretation = generateInterpretation({
    method,
    mainHexagram,
    mutualHexagram,
    changingHexagram,
    changingLine,
    detailLines,
  });

  return {
    mainHexagram,
    mutualHexagram,
    changingHexagram,
    changingLine,
    interpretation,
    time: timestamp ?? new Date(),
  };
}


function deriveChangingHexagram(mainHexagram: Hexagram, changingLine: number): Hexagram | undefined {
  if (changingLine < 1 || changingLine > 6) {
    return undefined;
  }

  const baseLines = getHexagramLines(mainHexagram.upperTrigram, mainHexagram.lowerTrigram);
  if (baseLines.length !== 6) {
    return undefined;
  }

  const updatedLines = [...baseLines];
  const targetIndex = changingLine - 1;
  updatedLines[targetIndex] = !updatedLines[targetIndex];

  const lowerLines = updatedLines.slice(0, 3);
  const upperLines = updatedLines.slice(3);

  const lowerTrigram = resolveTrigramFromLines(lowerLines);
  const upperTrigram = resolveTrigramFromLines(upperLines);

  return getRequiredHexagram(upperTrigram, lowerTrigram);
}

function resolveTrigramFromLines(lines: boolean[]): number {
  for (const [key, trigram] of Object.entries(trigrams)) {
    if (trigram.lines.every((value, index) => value === lines[index])) {
      return Number(key);
    }
  }

  return LATER_HEAVEN_NUMBERS.kun;
}

function getRequiredHexagram(upperTrigram: number, lowerTrigram: number): Hexagram {
  const hexagram = deriveMainHexagram(upperTrigram, lowerTrigram);
  if (!hexagram) {
    const upperName = TRIGRAM_NAME_BY_NUMBER[upperTrigram] ?? `${upperTrigram}`;
    const lowerName = TRIGRAM_NAME_BY_NUMBER[lowerTrigram] ?? `${lowerTrigram}`;
    throw new Error(`未能找到卦象（上卦：${upperName} / 下卦：${lowerName}）`);
  }
  return hexagram;
}

interface InterpretationOptions {
  method: string;
  mainHexagram: Hexagram;
  mutualHexagram?: Hexagram;
  changingHexagram?: Hexagram;
  changingLine: number;
  detailLines: string[];
}

function generateInterpretation({ method, mainHexagram, mutualHexagram, changingHexagram, changingLine, detailLines }: InterpretationOptions): string {
  const lines: string[] = [];

  if (method) {
    lines.push(`起卦方法：${method}`);
  }

  if (detailLines.length > 0) {
    lines.push(...detailLines);
  }

  lines.push(`【主卦】${mainHexagram.name}（${mainHexagram.symbol}）`);
  lines.push(`卦辞：${mainHexagram.meaning}`);
  lines.push(`解读：${mainHexagram.description}`);

  if (mutualHexagram) {
    lines.push(`【互卦】${mutualHexagram.name}（${mutualHexagram.symbol}）`);
    lines.push(`互卦含义：${mutualHexagram.meaning}`);
  }

  if (changingHexagram) {
    lines.push(`【变卦】${changingHexagram.name}（${changingHexagram.symbol}）`);
    lines.push(`变卦含义：${changingHexagram.meaning}`);
  }

  lines.push(`【动爻】第${changingLine}爻`);

  lines.push("【综合分析】主卦体现事情现状，互卦刻画演变过程，变卦指示趋势走向。动爻为关键节点，应依卦象灵活推演吉凶。");

  return lines.join("\n");
}





function getChineseDoubleHour(hour: number): number {
  const normalizedHour = ((hour % 24) + 24) % 24;
  if (normalizedHour === 23) {
    return 1;
  }

  const mapping = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 1];
  return mapping[normalizedHour] ?? 1;
}

function getStrokeCount(char: string): number {
  try {
    const count = (cnchar as unknown as { stroke: (input: string) => number }).stroke(char);
    if (typeof count === "number" && count > 0 && Number.isFinite(count)) {
      return count;
    }
  } catch {
    // ignore and use fallback heuristics
  }

  if (/^[0-9]$/.test(char)) {
    return 1;
  }
  if (/^[a-zA-Z]$/.test(char)) {
    return 2;
  }

  return 4;
}

function determineObjectTrigram(description: string): number {
  for (const feature of OBJECT_FEATURES) {
    if (feature.keywords.some((keyword) => description.includes(keyword))) {
      return feature.trigram;
    }
  }

  const strokeSeed = Array.from(description).reduce((total, char) => total + getStrokeCount(char), 0);
  return normalizeTrigramSeed(strokeSeed);
}

export function getCurrentTime() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
}











