// 测试梅花易数卦象变化逻辑

// 模拟三卦数据
const trigrams = {
  1: { name: '乾', lines: [true, true, true] },
  2: { name: '兑', lines: [true, true, false] },
  3: { name: '离', lines: [true, false, true] },
  4: { name: '震', lines: [true, false, false] },
  5: { name: '巽', lines: [false, true, true] },
  6: { name: '坎', lines: [false, true, false] },
  7: { name: '艮', lines: [false, false, true] },
  8: { name: '坤', lines: [false, false, false] }
};

// 获取卦象六爻
function getHexagramLines(upperNum, lowerNum) {
  const lower = trigrams[lowerNum].lines;
  const upper = trigrams[upperNum].lines;
  return [...lower, ...upper];
}

// 从爻线获取三卦编号
function getTrigramFromLines(lines) {
  for (const [key, trigram] of Object.entries(trigrams)) {
    if (JSON.stringify(trigram.lines) === JSON.stringify(lines)) {
      return Number(key);
    }
  }
  return null;
}

// 测试三个例子
console.log('=== 测试例子 ===\n');

// 例子1: 地泽临（上8下2）第6爻动
console.log('1. 地泽临（第19卦）第6爻动：');
let lines1 = getHexagramLines(8, 2);
console.log('   原始六爻：', lines1.map(x => x ? '—' : '- -').join(' '));
lines1[5] = !lines1[5]; // 第6爻动
console.log('   第6爻动后：', lines1.map(x => x ? '—' : '- -').join(' '));
const newLower1 = lines1.slice(0, 3);
const newUpper1 = lines1.slice(3, 6);
console.log('   新下卦：', trigrams[getTrigramFromLines(newLower1)].name, '(', getTrigramFromLines(newLower1), ')');
console.log('   新上卦：', trigrams[getTrigramFromLines(newUpper1)].name, '(', getTrigramFromLines(newUpper1), ')');
console.log('   => 变卦应该是：山泽损（上7下2）\n');

// 例子2: 风山渐（上5下7）第6爻动
console.log('2. 风山渐（第53卦）第6爻动：');
let lines2 = getHexagramLines(5, 7);
console.log('   原始六爻：', lines2.map(x => x ? '—' : '- -').join(' '));
lines2[5] = !lines2[5]; // 第6爻动
console.log('   第6爻动后：', lines2.map(x => x ? '—' : '- -').join(' '));
const newLower2 = lines2.slice(0, 3);
const newUpper2 = lines2.slice(3, 6);
console.log('   新下卦：', trigrams[getTrigramFromLines(newLower2)].name, '(', getTrigramFromLines(newLower2), ')');
console.log('   新上卦：', trigrams[getTrigramFromLines(newUpper2)].name, '(', getTrigramFromLines(newUpper2), ')');
console.log('   => 变卦结果\n');

// 例子3: 天水讼（上1下6）第2爻动  
console.log('3. 天水讼（第6卦）第2爻动：');
let lines3 = getHexagramLines(1, 6);
console.log('   原始六爻：', lines3.map(x => x ? '—' : '- -').join(' '));
lines3[1] = !lines3[1]; // 第2爻动
console.log('   第2爻动后：', lines3.map(x => x ? '—' : '- -').join(' '));
const newLower3 = lines3.slice(0, 3);
const newUpper3 = lines3.slice(3, 6);
console.log('   新下卦：', trigrams[getTrigramFromLines(newLower3)].name, '(', getTrigramFromLines(newLower3), ')');
console.log('   新上卦：', trigrams[getTrigramFromLines(newUpper3)].name, '(', getTrigramFromLines(newUpper3), ')');
console.log('   => 变卦应该是：天泽履（上1下2）');