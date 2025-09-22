import { DivinationInput, DivinationResult, Hexagram } from '@/types';
import { getHexagramByTrigrams } from './hexagrams';

export function performDivination(input: DivinationInput): DivinationResult {
  switch (input.type) {
    case 'time':
      return timeBasedDivination(input);
    case 'number':
      return numberBasedDivination(input);
    case 'manual':
      return manualDivination(input);
    case 'text':
      return textBasedDivination(input);
    case 'direction':
      return directionBasedDivination(input);
    case 'sound':
      return soundBasedDivination(input);
    case 'color':
      return colorBasedDivination(input);
    case 'object':
      return objectBasedDivination(input);
    default:
      throw new Error('未知的起卦类型');
  }
}

// 时间起卦法（年月日时起卦法）
function timeBasedDivination(input: DivinationInput): DivinationResult {
  const now = new Date();
  const year = input.year || now.getFullYear();
  const month = input.month || (now.getMonth() + 1);
  const day = input.day || now.getDate();
  const hour = input.hour || now.getHours();

  // 如果使用农历
  if (input.useLunar) {
    const lunarData = convertToLunar(year, month, day);
    const lunarYear = lunarData.year;
    const lunarMonth = lunarData.month;
    const lunarDay = lunarData.day;
    
    const totalForUpper = lunarYear + lunarMonth + lunarDay;
    const totalForLower = lunarYear + lunarMonth + lunarDay + getChineseHour(hour);
    const totalForChanging = totalForUpper + totalForLower;
    
    const upperTrigramNum = (totalForUpper % 8) || 8;
    const lowerTrigramNum = (totalForLower % 8) || 8;
    const changingLine = (totalForChanging % 6) || 6;
    
    const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
    if (!mainHexagram) {
      throw new Error('无法找到对应的卦象');
    }
    
    const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
    const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);
    
    return {
      mainHexagram,
      mutualHexagram,
      changingLine,
      changedHexagram,
      interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, '农历时间起卦', mutualHexagram),
      time: new Date()
    };
  }

  // 梅花易数时间起卦算法（公历）
  const chineseHour = getChineseHour(hour);
  const totalForUpper = year + month + day;
  const totalForLower = year + month + day + chineseHour;
  const totalForChanging = totalForUpper + totalForLower;

  const upperTrigramNum = (totalForUpper % 8) || 8;
  const lowerTrigramNum = (totalForLower % 8) || 8;
  const changingLine = (totalForChanging % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, '公历时间起卦', mutualHexagram),
    time: new Date()
  };
}

// 数字起卦法
function numberBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.numbers || input.numbers.length < 2) {
    throw new Error('数字起卦需要至少两个数字');
  }

  const [num1, num2, ...rest] = input.numbers;
  const num3 = rest.length > 0 ? rest[0] : (num1 + num2);

  const upperTrigramNum = (num1 % 8) || 8;
  const lowerTrigramNum = (num2 % 8) || 8;
  const changingLine = (num3 % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, '数字起卦', mutualHexagram),
    time: new Date()
  };
}

// 文字起卦法（测字起卦）
function textBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.text || input.text.length === 0) {
    throw new Error('文字起卦需要输入文字');
  }

  const text = input.text;
  const charCount = text.length;
  let strokeCount = 0;

  for (let i = 0; i < text.length; i++) {
    strokeCount += getCharacterStrokes(text[i]);
  }

  const upperTrigramNum = (charCount % 8) || 8;
  const lowerTrigramNum = (strokeCount % 8) || 8;
  const changingLine = ((charCount + strokeCount) % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, `文字起卦：${text}`, mutualHexagram),
    time: new Date()
  };
}

// 方位起卦法
function directionBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.direction) {
    throw new Error('方位起卦需要选择方位');
  }

  const directionMap: { [key: string]: number } = {
    '东': 3,    // 震卦
    '东南': 4,  // 巽卦
    '南': 9,    // 离卦
    '西南': 2,  // 坤卦
    '西': 7,    // 兑卦
    '西北': 6,  // 乾卦
    '北': 1,    // 坎卦
    '东北': 8,  // 艮卦
  };

  const directionNum = directionMap[input.direction] || 1;
  const now = new Date();
  const timeNum = now.getHours() + now.getMinutes();

  const upperTrigramNum = (directionNum % 8) || 8;
  const lowerTrigramNum = (timeNum % 8) || 8;
  const changingLine = ((directionNum + timeNum) % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, `方位起卦：${input.direction}`, mutualHexagram),
    time: new Date()
  };
}

// 声音起卦法
function soundBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.sound) {
    throw new Error('声音起卦需要描述声音特征');
  }

  const soundTypes: { [key: string]: number } = {
    '鸟叫': 3,
    '狗吠': 7,
    '雷声': 3,
    '风声': 4,
    '雨声': 1,
    '人声': 2,
    '车声': 6,
    '钟声': 7,
    '鼓声': 8,
    '其他': 5
  };

  const soundNum = soundTypes[input.sound] || 5;
  const now = new Date();
  const timeNum = now.getSeconds() + now.getMilliseconds();

  const upperTrigramNum = (soundNum % 8) || 8;
  const lowerTrigramNum = (timeNum % 8) || 8;
  const changingLine = ((soundNum + timeNum) % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, `声音起卦：${input.sound}`, mutualHexagram),
    time: new Date()
  };
}

// 颜色起卦法
function colorBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.color) {
    throw new Error('颜色起卦需要选择颜色');
  }

  const colorMap: { [key: string]: number } = {
    '红色': 9,    // 离卦，火
    '黄色': 2,    // 坤卦，土
    '白色': 7,    // 兑卦，金
    '黑色': 1,    // 坎卦，水
    '青色': 3,    // 震卦，木
    '绿色': 4,    // 巽卦，木
    '紫色': 6,    // 乾卦
    '灰色': 8,    // 艮卦，土
  };

  const colorNum = colorMap[input.color] || 5;
  const now = new Date();
  const randomNum = Math.floor(Math.random() * 100) + now.getMinutes();

  const upperTrigramNum = (colorNum % 8) || 8;
  const lowerTrigramNum = (randomNum % 8) || 8;
  const changingLine = ((colorNum + randomNum) % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, `颜色起卦：${input.color}`, mutualHexagram),
    time: new Date()
  };
}

// 物象起卦法
function objectBasedDivination(input: DivinationInput): DivinationResult {
  if (!input.object) {
    throw new Error('物象起卦需要输入物体描述');
  }

  const objectCategories: { [key: string]: number } = {
    '圆形': 6,    // 乾卦，天
    '方形': 2,    // 坤卦，地
    '长形': 3,    // 震卦，雷
    '尖形': 9,    // 离卦，火
    '弯曲': 1,    // 坎卦，水
    '中空': 7,    // 兑卦，泽
    '静止': 8,    // 艮卦，山
    '流动': 4,    // 巽卦，风
  };

  let objectNum = 5;
  for (const [key, value] of Object.entries(objectCategories)) {
    if (input.object.includes(key)) {
      objectNum = value;
      break;
    }
  }

  const textLength = input.object.length;
  
  const upperTrigramNum = (objectNum % 8) || 8;
  const lowerTrigramNum = (textLength % 8) || 8;
  const changingLine = ((objectNum + textLength) % 6) || 6;

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, `物象起卦：${input.object}`, mutualHexagram),
    time: new Date()
  };
}

// 随机起卦（手动起卦）
function manualDivination(_input: DivinationInput): DivinationResult {
  const now = new Date();
  const randomSeed = now.getTime();
  
  const upperTrigramNum = ((Math.floor(randomSeed / 1000) % 8) || 8);
  const lowerTrigramNum = ((Math.floor(randomSeed / 100) % 8) || 8);
  const changingLine = ((Math.floor(randomSeed / 10) % 6) || 6);

  const mainHexagram = getHexagramByTrigrams(upperTrigramNum, lowerTrigramNum);
  if (!mainHexagram) {
    throw new Error('无法找到对应的卦象');
  }

  const mutualHexagram = calculateMutualHexagram(upperTrigramNum, lowerTrigramNum);
  const changedHexagram = calculateChangedHexagram(upperTrigramNum, lowerTrigramNum, changingLine);

  return {
    mainHexagram,
    mutualHexagram,
    changingLine,
    changedHexagram,
    interpretation: generateInterpretation(mainHexagram, changingLine, changedHexagram, '随机起卦', mutualHexagram),
    time: new Date()
  };
}

// 辅助函数：计算互卦
// 互卦是从主卦的234爻组成下卦，345爻组成上卦
function calculateMutualHexagram(upperTrigram: number, lowerTrigram: number): Hexagram | undefined {
  // 获取各爻的阴阳属性
  const upperLines = getTrigramLines(upperTrigram);
  const lowerLines = getTrigramLines(lowerTrigram);
  
  // 六爻从下到上为：lowerLines[0], lowerLines[1], lowerLines[2], upperLines[0], upperLines[1], upperLines[2]
  // 互卦：234爻为下卦，345爻为上卦
  const mutualLowerLines = [lowerLines[1], lowerLines[2], upperLines[0]];
  const mutualUpperLines = [lowerLines[2], upperLines[0], upperLines[1]];
  
  const mutualLowerTrigram = getTrigramFromLines(mutualLowerLines);
  const mutualUpperTrigram = getTrigramFromLines(mutualUpperLines);
  
  return getHexagramByTrigrams(mutualUpperTrigram, mutualLowerTrigram);
}

// 获取三爻卦的爻线（true为阳爻，false为阴爻）
function getTrigramLines(trigramNum: number): boolean[] {
  const trigramLines: { [key: number]: boolean[] } = {
    1: [true, true, true],   // 乾 ☰
    2: [true, true, false],  // 兑 ☱
    3: [true, false, true],  // 离 ☲
    4: [false, false, true], // 震 ☳
    5: [true, true, false],  // 巽 ☴
    6: [false, true, false], // 坎 ☵
    7: [true, false, false], // 艮 ☶
    8: [false, false, false] // 坤 ☷
  };
  
  return trigramLines[trigramNum] || [false, false, false];
}

// 从爻线获取三爻卦编号
function getTrigramFromLines(lines: boolean[]): number {
  const pattern = lines.map(l => l ? '1' : '0').join('');
  const trigramMap: { [key: string]: number } = {
    '111': 1,  // 乾
    '110': 2,  // 兑
    '101': 3,  // 离
    '001': 4,  // 震
    '011': 5,  // 巽
    '010': 6,  // 坎
    '100': 7,  // 艮
    '000': 8   // 坤
  };
  
  return trigramMap[pattern] || 8;
}

// 计算变卦
function calculateChangedHexagram(upperTrigram: number, lowerTrigram: number, changingLine: number): Hexagram | undefined {
  let newUpperTrigram = upperTrigram;
  let newLowerTrigram = lowerTrigram;

  // 动爻位置：1-3为下卦，4-6为上卦
  if (changingLine <= 3) {
    // 下卦变化
    newLowerTrigram = getChangedTrigram(lowerTrigram, changingLine);
  } else {
    // 上卦变化
    newUpperTrigram = getChangedTrigram(upperTrigram, changingLine - 3);
  }

  return getHexagramByTrigrams(newUpperTrigram, newLowerTrigram);
}

// 获取变化后的三元组
function getChangedTrigram(originalTrigram: number, _linePosition: number): number {
  const changes: [number, number][] = [
    [1, 8], [2, 7], [3, 6], [4, 5], [5, 4], [6, 3], [7, 2], [8, 1]
  ];

  const changeMap = new Map(changes);
  return changeMap.get(originalTrigram) || originalTrigram;
}

// 生成卦象解释（包含互卦信息）
function generateInterpretation(mainHexagram: Hexagram, changingLine: number, changedHexagram?: Hexagram, method?: string, mutualHexagram?: Hexagram): string {
  let interpretation = '';
  
  if (method) {
    interpretation += `起卦方法：${method}\n\n`;
  }
  
  interpretation += `【主卦】${mainHexagram.name}卦（${mainHexagram.symbol}）\n`;
  interpretation += `卦辞：${mainHexagram.meaning}\n`;
  interpretation += `解释：${mainHexagram.description}\n\n`;

  if (mutualHexagram) {
    interpretation += `【互卦】${mutualHexagram.name}卦（${mutualHexagram.symbol}）\n`;
    interpretation += `互卦含义：${mutualHexagram.meaning}\n`;
    interpretation += `过程：互卦代表事物发展的中间过程，显示了事情演变的内在动力\n\n`;
  }

  interpretation += `【动爻】第${changingLine}爻\n`;
  interpretation += `动爻含义：此爻发生变化，预示事物的转折点\n\n`;

  if (changedHexagram) {
    interpretation += `【变卦】${changedHexagram.name}卦（${changedHexagram.symbol}）\n`;
    interpretation += `变卦含义：${changedHexagram.meaning}\n`;
    interpretation += `趋势：从${mainHexagram.name}到${changedHexagram.name}，`;
    interpretation += `表示事物从"${mainHexagram.symbol}"的状态`;
    interpretation += `发展到"${changedHexagram.symbol}"的状态\n\n`;
  }

  interpretation += `【综合分析】\n`;
  interpretation += `主卦显示当前状态，`;
  if (mutualHexagram) {
    interpretation += `互卦揭示发展过程，`;
  }
  interpretation += `变卦预示最终方向。\n`;
  interpretation += `动爻位置影响变化的层面和时机。`;

  return interpretation;
}

// 获取中国时辰
function getChineseHour(hour: number): number {
  const chineseHours = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];
  return chineseHours[hour] || 1;
}

// 获取汉字笔画数（简化版）
function getCharacterStrokes(char: string): number {
  const strokeMap: { [key: string]: number } = {
    '一': 1, '二': 2, '三': 3, '四': 5, '五': 4,
    '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
    '天': 4, '地': 6, '人': 2, '水': 4, '火': 4,
    '木': 4, '金': 8, '土': 3, '日': 4, '月': 4,
  };
  
  if (strokeMap[char]) {
    return strokeMap[char];
  }
  
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    return (code % 20) + 5;
  }
  
  return 3;
}

// 农历转换（简化版）
function convertToLunar(year: number, month: number, day: number): { year: number, month: number, day: number } {
  const lunarYear = year - 1900 + 1;
  const lunarMonth = month;
  const lunarDay = day;
  
  return { year: lunarYear, month: lunarMonth, day: lunarDay };
}

// 导出获取当前时间函数
export function getCurrentTime() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours()
  };
}