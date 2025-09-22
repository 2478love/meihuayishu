import { Hexagram } from '@/types';

// 完整的六十四卦数据
export const fullHexagrams: Hexagram[] = [
  // 乾宫八卦
  { name: '乾为天', upperTrigram: 1, lowerTrigram: 1, number: 1, symbol: '䷀', meaning: '元亨利贞', description: '天行健，君子以自强不息。龙跃于天，利见大人。' },
  { name: '天风姤', upperTrigram: 1, lowerTrigram: 5, number: 44, symbol: '䷫', meaning: '女壮，勿用取女', description: '天下有风，姤。后以施命诰四方。阴气萌生，须防小人。' },
  { name: '天山遁', upperTrigram: 1, lowerTrigram: 7, number: 33, symbol: '䷠', meaning: '亨，小利贞', description: '天下有山，遁。君子以远小人，不恶而严。退避保身，明哲保身。' },
  { name: '天地否', upperTrigram: 1, lowerTrigram: 8, number: 12, symbol: '䷋', meaning: '否之匪人，不利君子贞', description: '天地不交，否。君子以俭德辟难，不可荣以禄。' },
  { name: '风地观', upperTrigram: 5, lowerTrigram: 8, number: 20, symbol: '䷓', meaning: '盥而不荐，有孚颙若', description: '风行地上，观。先王以省方观民设教。' },
  { name: '山地剥', upperTrigram: 7, lowerTrigram: 8, number: 23, symbol: '䷖', meaning: '不利有攸往', description: '山附于地，剥。上以厚下，安宅。' },
  { name: '火地晋', upperTrigram: 3, lowerTrigram: 8, number: 35, symbol: '䷢', meaning: '康侯用锡马蕃庶，昼日三接', description: '明出地上，晋。君子以自昭明德。' },
  { name: '火天大有', upperTrigram: 3, lowerTrigram: 1, number: 14, symbol: '䷍', meaning: '元亨', description: '火在天上，大有。君子以遏恶扬善，顺天休命。' },

  // 坤宫八卦
  { name: '坤为地', upperTrigram: 8, lowerTrigram: 8, number: 2, symbol: '䷁', meaning: '元亨，利牝马之贞', description: '地势坤，君子以厚德载物。' },
  { name: '地雷复', upperTrigram: 8, lowerTrigram: 4, number: 24, symbol: '䷗', meaning: '亨。出入无疾，朋来无咎', description: '雷在地中，复。先王以至日闭关，商旅不行。' },
  { name: '地泽临', upperTrigram: 8, lowerTrigram: 2, number: 19, symbol: '䷒', meaning: '元亨利贞', description: '泽上有地，临。君子以教思无穷，容保民无疆。' },
  { name: '地天泰', upperTrigram: 8, lowerTrigram: 1, number: 11, symbol: '䷊', meaning: '小往大来，吉亨', description: '天地交，泰。后以财成天地之道，辅相天地之宜。' },
  { name: '雷天大壮', upperTrigram: 4, lowerTrigram: 1, number: 34, symbol: '䷡', meaning: '利贞', description: '雷在天上，大壮。君子以非礼弗履。' },
  { name: '泽天夬', upperTrigram: 2, lowerTrigram: 1, number: 43, symbol: '䷪', meaning: '扬于王庭，孚号有厉', description: '泽上于天，夬。君子以施禄及下，居德则忌。' },
  { name: '水天需', upperTrigram: 6, lowerTrigram: 1, number: 5, symbol: '䷄', meaning: '有孚，光亨，贞吉', description: '云上于天，需。君子以饮食宴乐。' },
  { name: '水地比', upperTrigram: 6, lowerTrigram: 8, number: 8, symbol: '䷇', meaning: '吉。原筮元永贞，无咎', description: '地上有水，比。先王以建万国，亲诸侯。' },

  // 震宫八卦
  { name: '震为雷', upperTrigram: 4, lowerTrigram: 4, number: 51, symbol: '䷲', meaning: '亨。震来虩虩，笑言哑哑', description: '洊雷，震。君子以恐惧修省。' },
  { name: '雷地豫', upperTrigram: 4, lowerTrigram: 8, number: 16, symbol: '䷏', meaning: '利建侯行师', description: '雷出地奋，豫。先王以作乐崇德。' },
  { name: '雷水解', upperTrigram: 4, lowerTrigram: 6, number: 40, symbol: '䷧', meaning: '利西南。无所往，其来复吉', description: '雷雨作，解。君子以赦过宥罪。' },
  { name: '雷风恒', upperTrigram: 4, lowerTrigram: 5, number: 32, symbol: '䷟', meaning: '亨无咎，利贞', description: '雷风，恒。君子以立不易方。' },
  { name: '地风升', upperTrigram: 8, lowerTrigram: 5, number: 46, symbol: '䷭', meaning: '元亨，用见大人', description: '地中生木，升。君子以顺德，积小以高大。' },
  { name: '水风井', upperTrigram: 6, lowerTrigram: 5, number: 48, symbol: '䷯', meaning: '改邑不改井', description: '木上有水，井。君子以劳民劝相。' },
  { name: '泽风大过', upperTrigram: 2, lowerTrigram: 5, number: 28, symbol: '䷛', meaning: '栋桡，利有攸往，亨', description: '泽灭木，大过。君子以独立不惧，遯世无闷。' },
  { name: '泽雷随', upperTrigram: 2, lowerTrigram: 4, number: 17, symbol: '䷐', meaning: '元亨利贞，无咎', description: '泽中有雷，随。君子以向晦入宴息。' },

  // 巽宫八卦
  { name: '巽为风', upperTrigram: 5, lowerTrigram: 5, number: 57, symbol: '䷸', meaning: '小亨，利有攸往', description: '随风，巽。君子以申命行事。' },
  { name: '风天小畜', upperTrigram: 5, lowerTrigram: 1, number: 9, symbol: '䷈', meaning: '亨。密云不雨', description: '风行天上，小畜。君子以懿文德。' },
  { name: '风火家人', upperTrigram: 5, lowerTrigram: 3, number: 37, symbol: '䷤', meaning: '利女贞', description: '风自火出，家人。君子以言有物，而行有恒。' },
  { name: '风雷益', upperTrigram: 5, lowerTrigram: 4, number: 42, symbol: '䷩', meaning: '利有攸往，利涉大川', description: '风雷，益。君子以见善则迁，有过则改。' },
  { name: '天雷无妄', upperTrigram: 1, lowerTrigram: 4, number: 25, symbol: '䷘', meaning: '元亨利贞', description: '天下雷行，无妄。先王以茂对时，育万物。' },
  { name: '火雷噬嗑', upperTrigram: 3, lowerTrigram: 4, number: 21, symbol: '䷔', meaning: '亨，利用狱', description: '雷电，噬嗑。先王以明罚敕法。' },
  { name: '山雷颐', upperTrigram: 7, lowerTrigram: 4, number: 27, symbol: '䷚', meaning: '贞吉。观颐，自求口实', description: '山下有雷，颐。君子以慎言语，节饮食。' },
  { name: '山风蛊', upperTrigram: 7, lowerTrigram: 5, number: 18, symbol: '䷑', meaning: '元亨，利涉大川', description: '山下有风，蛊。君子以振民育德。' },

  // 坎宫八卦
  { name: '坎为水', upperTrigram: 6, lowerTrigram: 6, number: 29, symbol: '䷜', meaning: '习坎，有孚维心亨', description: '水洊至，习坎。君子以常德行，习教事。' },
  { name: '水泽节', upperTrigram: 6, lowerTrigram: 2, number: 60, symbol: '䷻', meaning: '亨。苦节不可贞', description: '泽上有水，节。君子以制数度，议德行。' },
  { name: '水雷屯', upperTrigram: 6, lowerTrigram: 4, number: 3, symbol: '䷂', meaning: '元亨利贞', description: '云雷屯。君子以经纶。' },
  { name: '水火既济', upperTrigram: 6, lowerTrigram: 3, number: 63, symbol: '䷾', meaning: '亨小利贞', description: '水在火上，既济。君子以思患而预防之。' },
  { name: '泽火革', upperTrigram: 2, lowerTrigram: 3, number: 49, symbol: '䷰', meaning: '己日乃孚，元亨利贞', description: '泽中有火，革。君子以治历明时。' },
  { name: '雷火丰', upperTrigram: 4, lowerTrigram: 3, number: 55, symbol: '䷶', meaning: '亨，王假之', description: '雷电皆至，丰。君子以折狱致刑。' },
  { name: '地火明夷', upperTrigram: 8, lowerTrigram: 3, number: 36, symbol: '䷣', meaning: '利艰贞', description: '明入地中，明夷。君子以莅众，用晦而明。' },
  { name: '地水师', upperTrigram: 8, lowerTrigram: 6, number: 7, symbol: '䷆', meaning: '贞，丈人吉无咎', description: '地中有水，师。君子以容民畜众。' },

  // 艮宫八卦
  { name: '艮为山', upperTrigram: 7, lowerTrigram: 7, number: 52, symbol: '䷳', meaning: '艮其背，不获其身', description: '兼山，艮。君子以思不出其位。' },
  { name: '山火贲', upperTrigram: 7, lowerTrigram: 3, number: 22, symbol: '䷕', meaning: '亨。小利有攸往', description: '山下有火，贲。君子以明庶政，无敢折狱。' },
  { name: '山天大畜', upperTrigram: 7, lowerTrigram: 1, number: 26, symbol: '䷙', meaning: '利贞，不家食吉', description: '天在山中，大畜。君子以多识前言往行，以畜其德。' },
  { name: '山泽损', upperTrigram: 7, lowerTrigram: 2, number: 41, symbol: '䷨', meaning: '有孚，元吉无咎', description: '山下有泽，损。君子以惩忿窒欲。' },
  { name: '火泽睽', upperTrigram: 3, lowerTrigram: 2, number: 38, symbol: '䷥', meaning: '小事吉', description: '上火下泽，睽。君子以同而异。' },
  { name: '天泽履', upperTrigram: 1, lowerTrigram: 2, number: 10, symbol: '䷉', meaning: '履虎尾，不咥人，亨', description: '上天下泽，履。君子以辨上下，定民志。' },
  { name: '风泽中孚', upperTrigram: 5, lowerTrigram: 2, number: 61, symbol: '䷼', meaning: '豚鱼吉，利涉大川', description: '泽上有风，中孚。君子以议狱缓死。' },
  { name: '风山渐', upperTrigram: 5, lowerTrigram: 7, number: 53, symbol: '䷴', meaning: '女归吉，利贞', description: '山上有木，渐。君子以居贤德善俗。' },

  // 离宫八卦
  { name: '离为火', upperTrigram: 3, lowerTrigram: 3, number: 30, symbol: '䷝', meaning: '利贞，亨。畜牝牛，吉', description: '明两作，离。大人以继明照于四方。' },
  { name: '火山旅', upperTrigram: 3, lowerTrigram: 7, number: 56, symbol: '䷷', meaning: '小亨，旅贞吉', description: '山上有火，旅。君子以明慎用刑，而不留狱。' },
  { name: '火风鼎', upperTrigram: 3, lowerTrigram: 5, number: 50, symbol: '䷱', meaning: '元吉，亨', description: '木上有火，鼎。君子以正位凝命。' },
  { name: '火水未济', upperTrigram: 3, lowerTrigram: 6, number: 64, symbol: '䷿', meaning: '亨。小狐汔济', description: '火在水上，未济。君子以慎辨物居方。' },
  { name: '山水蒙', upperTrigram: 7, lowerTrigram: 6, number: 4, symbol: '䷃', meaning: '亨。匪我求童蒙', description: '山下出泉，蒙。君子以果行育德。' },
  { name: '风水涣', upperTrigram: 5, lowerTrigram: 6, number: 59, symbol: '䷺', meaning: '亨。王假有庙', description: '风行水上，涣。先王以享于帝，立庙。' },
  { name: '天水讼', upperTrigram: 1, lowerTrigram: 6, number: 6, symbol: '䷅', meaning: '有孚，窒惕中吉', description: '天与水违行，讼。君子以作事谋始。' },
  { name: '天火同人', upperTrigram: 1, lowerTrigram: 3, number: 13, symbol: '䷌', meaning: '同人于野，亨', description: '天与火，同人。君子以类族辨物。' },

  // 兑宫八卦
  { name: '兑为泽', upperTrigram: 2, lowerTrigram: 2, number: 58, symbol: '䷹', meaning: '亨，利贞', description: '丽泽，兑。君子以朋友讲习。' },
  { name: '泽水困', upperTrigram: 2, lowerTrigram: 6, number: 47, symbol: '䷮', meaning: '亨，贞大人吉', description: '泽无水，困。君子以致命遂志。' },
  { name: '泽地萃', upperTrigram: 2, lowerTrigram: 8, number: 45, symbol: '䷬', meaning: '亨。王假有庙', description: '泽上于地，萃。君子以除戎器，戒不虞。' },
  { name: '泽山咸', upperTrigram: 2, lowerTrigram: 7, number: 31, symbol: '䷞', meaning: '亨，利贞，取女吉', description: '山上有泽，咸。君子以虚受人。' },
  { name: '水山蹇', upperTrigram: 6, lowerTrigram: 7, number: 39, symbol: '䷦', meaning: '利西南，不利东北', description: '山上有水，蹇。君子以反身修德。' },
  { name: '地山谦', upperTrigram: 8, lowerTrigram: 7, number: 15, symbol: '䷎', meaning: '亨，君子有终', description: '地中有山，谦。君子以裒多益寡，称物平施。' },
  { name: '雷山小过', upperTrigram: 4, lowerTrigram: 7, number: 62, symbol: '䷽', meaning: '亨，利贞', description: '山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭。' },
  { name: '雷泽归妹', upperTrigram: 4, lowerTrigram: 2, number: 54, symbol: '䷵', meaning: '征凶，无攸利', description: '泽上有雷，归妹。君子以永终知敝。' }
];

// 创建六十四卦映射表
export const hexagramMap = new Map<string, Hexagram>();

fullHexagrams.forEach(hexagram => {
  const key = `${hexagram.upperTrigram}${hexagram.lowerTrigram}`;
  hexagramMap.set(key, hexagram);
});

// 获取完整的卦象数据
export function getFullHexagram(upper: number, lower: number): Hexagram {
  const key = `${upper}${lower}`;
  const hexagram = hexagramMap.get(key);

  if (hexagram) {
    return hexagram;
  }

  // 如果找不到，返回一个基础卦象
  return {
    name: `${getTrigramName(upper)}${getTrigramName(lower)}`,
    upperTrigram: upper,
    lowerTrigram: lower,
    number: 0,
    symbol: '卦',
    meaning: '待解',
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