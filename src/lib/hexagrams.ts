import { Hexagram } from '@/types';
import { trigrams } from './trigrams';
import { hexagramMap } from './hexagrams-data';

export const hexagrams: Record<string, Hexagram> = {
  '11': { name: '乾', upperTrigram: 1, lowerTrigram: 1, number: 1, symbol: '☰☰', meaning: '元亨利贞', description: '天行健，君子以自强不息' },
  '88': { name: '坤', upperTrigram: 8, lowerTrigram: 8, number: 2, symbol: '☷☷', meaning: '元亨利牝马之贞', description: '地势坤，君子以厚德载物' },
  '16': { name: '屯', upperTrigram: 1, lowerTrigram: 6, number: 3, symbol: '☰☵', meaning: '元亨利贞勿用有攸往', description: '云雷屯，君子以经纶' },
  '71': { name: '蒙', upperTrigram: 7, lowerTrigram: 1, number: 4, symbol: '☶☰', meaning: '亨匪我求童蒙', description: '山下出泉，蒙' },
  '61': { name: '需', upperTrigram: 6, lowerTrigram: 1, number: 5, symbol: '☵☰', meaning: '有孚光亨贞吉', description: '云上於天，需' },
  '16_2': { name: '讼', upperTrigram: 1, lowerTrigram: 6, number: 6, symbol: '☰☵', meaning: '有孚窒惕中吉', description: '天与水违行，讼' },
  '86': { name: '师', upperTrigram: 8, lowerTrigram: 6, number: 7, symbol: '☷☵', meaning: '贞丈人吉无咎', description: '地中有水，师' },
  '68': { name: '比', upperTrigram: 6, lowerTrigram: 8, number: 8, symbol: '☵☷', meaning: '吉原筮元永贞', description: '水在地上，比' },
  '15': { name: '小畜', upperTrigram: 1, lowerTrigram: 5, number: 9, symbol: '☰☴', meaning: '亨密云不雨', description: '风行天上，小畜' },
  '12': { name: '履', upperTrigram: 1, lowerTrigram: 2, number: 10, symbol: '☰☱', meaning: '履虎尾不咥人亨', description: '天下有泽，履' },
  '18': { name: '泰', upperTrigram: 1, lowerTrigram: 8, number: 11, symbol: '☰☷', meaning: '小往大来吉亨', description: '天地交，泰' },
  '81': { name: '否', upperTrigram: 8, lowerTrigram: 1, number: 12, symbol: '☷☰', meaning: '否之匪人不利君子贞', description: '天地不交，否' },
  '13': { name: '同人', upperTrigram: 1, lowerTrigram: 3, number: 13, symbol: '☰☲', meaning: '同人於野亨', description: '天与火，同人' },
  '31': { name: '大有', upperTrigram: 3, lowerTrigram: 1, number: 14, symbol: '☲☰', meaning: '元亨', description: '火在天上，大有' },
  '87': { name: '谦', upperTrigram: 8, lowerTrigram: 7, number: 15, symbol: '☷☶', meaning: '亨君子有终', description: '地中有山，谦' },
  '48': { name: '豫', upperTrigram: 4, lowerTrigram: 8, number: 16, symbol: '☳☷', meaning: '利建侯行师', description: '雷出地奋，豫' },
  '25': { name: '随', upperTrigram: 2, lowerTrigram: 5, number: 17, symbol: '☱☴', meaning: '元亨利贞无咎', description: '泽中有雷，随' },
  '52': { name: '蛊', upperTrigram: 5, lowerTrigram: 2, number: 18, symbol: '☴☱', meaning: '元亨利涉大川', description: '山下有风，蛊' },
  '82': { name: '临', upperTrigram: 8, lowerTrigram: 2, number: 19, symbol: '☷☱', meaning: '元亨利贞', description: '地上有泽，临' },
  '28': { name: '观', upperTrigram: 2, lowerTrigram: 8, number: 20, symbol: '☱☷', meaning: '盥而不荐有孚颙若', description: '风行地上，观' },
  '43': { name: '噬嗑', upperTrigram: 4, lowerTrigram: 3, number: 21, symbol: '☳☲', meaning: '亨利用狱', description: '雷电噬嗑' },
  '34': { name: '贲', upperTrigram: 3, lowerTrigram: 4, number: 22, symbol: '☲☳', meaning: '亨小利有攸往', description: '山下有火，贲' },
  '78': { name: '剥', upperTrigram: 7, lowerTrigram: 8, number: 23, symbol: '☶☷', meaning: '不利有攸往', description: '山附於地，剥' },
  '84': { name: '复', upperTrigram: 8, lowerTrigram: 4, number: 24, symbol: '☷☳', meaning: '亨出入无疾', description: '地中有雷，复' },
  '14': { name: '无妄', upperTrigram: 1, lowerTrigram: 4, number: 25, symbol: '☰☳', meaning: '元亨利贞', description: '天下雷行，无妄' },
  '41': { name: '大畜', upperTrigram: 4, lowerTrigram: 1, number: 26, symbol: '☳☰', meaning: '利贞不家食吉', description: '天在山中，大畜' },
  '74': { name: '颐', upperTrigram: 7, lowerTrigram: 4, number: 27, symbol: '☶☳', meaning: '贞吉观颐', description: '山下有雷，颐' },
  '25_2': { name: '大过', upperTrigram: 2, lowerTrigram: 5, number: 28, symbol: '☱☴', meaning: '栋桡利有攸往亨', description: '泽灭木，大过' },
  '66': { name: '坎', upperTrigram: 6, lowerTrigram: 6, number: 29, symbol: '☵☵', meaning: '习坎有孚维心亨', description: '水洊至，习坎' },
  '33': { name: '离', upperTrigram: 3, lowerTrigram: 3, number: 30, symbol: '☲☲', meaning: '利贞亨畜牝牛吉', description: '明两作，离' }
};

// 简化版本，只实现基础卦象，其余可以后续扩展
const basicHexagramsMap: Record<string, Hexagram> = {
  '11': hexagrams['11'], // 乾
  '88': hexagrams['88'], // 坤
  '16': hexagrams['16'], // 屯
  '61': hexagrams['61'], // 需
  '13': hexagrams['13'], // 同人
  '31': hexagrams['31'], // 大有
  '15': hexagrams['15'], // 小畜
  '12': hexagrams['12'], // 履
  '18': hexagrams['18'], // 泰
  '81': hexagrams['81'], // 否
  '87': hexagrams['87'], // 谦
  '48': hexagrams['48'], // 豫
  '25': hexagrams['25'], // 随
  '52': hexagrams['52'], // 蛊
  '82': hexagrams['82'], // 临
  '28': hexagrams['28'], // 观
  '43': hexagrams['43'], // 噬嗑
  '34': hexagrams['34'], // 贲
  '78': hexagrams['78'], // 剥
  '84': hexagrams['84'], // 复
  '14': hexagrams['14'], // 无妄
  '41': hexagrams['41'], // 大畜
  '74': hexagrams['74'], // 颐
  '66': hexagrams['66'], // 坎
  '33': hexagrams['33']  // 离
};

export function getHexagramByTrigrams(upper: number, lower: number): Hexagram | undefined {
  const key = `${upper}${lower}`;

  // 优先使用完整的六十四卦数据
  const fullHexagram = hexagramMap.get(key);
  if (fullHexagram) {
    return fullHexagram;
  }

  // 如果找不到完整卦象，使用基础卦象
  if (basicHexagramsMap[key]) {
    return basicHexagramsMap[key];
  }

  // 返回一个通用的卦象结构
  return {
    name: `${getTrigramName(upper)}${getTrigramName(lower)}`,
    upperTrigram: upper,
    lowerTrigram: lower,
    number: 0,
    symbol: '卦象',
    meaning: '待解释',
    description: `上${getTrigramName(upper)}下${getTrigramName(lower)}`
  };
}

function getTrigramName(num: number): string {
  const names: Record<number, string> = {
    1: '乾', 2: '兑', 3: '离', 4: '震',
    5: '巽', 6: '坎', 7: '艮', 8: '坤'
  };
  return names[num] || '未知';
}

export function getHexagramLines(upper: number, lower: number): boolean[] {
  const lowerLines = getTrigramLines(lower);
  const upperLines = getTrigramLines(upper);

  // 六爻顺序：下卦三爻 + 上卦三爻（从下到上：1,2,3,4,5,6爻）
  const combined = [...lowerLines, ...upperLines];
  return combined;
}

function getTrigramLines(trigram: number): boolean[] {
  const normalized = ((trigram % 8) || 8);
  const data = trigrams[normalized];

  return data ? [...data.lines] : [false, false, false];
}
