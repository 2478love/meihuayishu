'use client';

import { useState, useEffect } from 'react';
import { DivinationInput } from '@/types';
import { getCurrentTime } from '@/lib/divination';

interface DivinationFormProps {
  onSubmit: (input: DivinationInput) => void;
}

const divinationTypeValues = [
  'time',
  'number',
  'manual',
  'text',
  'direction',
  'sound',
  'color',
  'object',
] as const;

type DivinationType = (typeof divinationTypeValues)[number];

const isDivinationType = (value: string): value is DivinationType =>
  (divinationTypeValues as readonly string[]).includes(value);

interface DivinationMethodOption {
  value: DivinationType;
  label: string;
  description: string;
  category: '传统起卦法' | '观物起卦法' | '其他';
  hint: string;
  tips: string[];
}

const divinationMethods: DivinationMethodOption[] = [
  {
    value: 'time',
    label: '时间起卦',
    description: '依据指定时刻的年、月、日、时、分推演卦象，适合记录事件发生的瞬间。',
    category: '传统起卦法',
    hint: '按真实时间',
    tips: [
      '支持公历与农历切换，传统时辰需勾选“使用农历”。',
      '分钟越精确，动爻定位越贴近实际情境。',
    ],
  },
  {
    value: 'number',
    label: '数字起卦',
    description: '通过报数、掷硬币或随机数字起卦，第三个数直接指向动爻。',
    category: '传统起卦法',
    hint: '报数推演',
    tips: [
      '至少输入两个数字，第三个数字可作为动爻依据。',
      '可选择有意义的数列，或使用随机方式生成。',
    ],
  },
  {
    value: 'text',
    label: '文字起卦',
    description: '自动统计文字字数与笔画推导卦象，适合测字、签文等场景。',
    category: '传统起卦法',
    hint: '测字启示',
    tips: [
      '请去除空格与标点，保持原始汉字或词句。',
      '长句会累加笔画，适合分析含义更丰富的问卦。',
    ],
  },
  {
    value: 'direction',
    label: '方位起卦',
    description: '从八方方位取象，结合当前时空推算互卦与动爻。',
    category: '观物起卦法',
    hint: '观察方向',
    tips: [
      '选择最先映入脑海或最有感应的方位。',
      '常用于来客、风向或突发灵感的指向分析。',
    ],
  },
  {
    value: 'sound',
    label: '声音起卦',
    description: '依据听到的声音类别定上卦，再以当下时间推导变爻。',
    category: '观物起卦法',
    hint: '闻声占卜',
    tips: [
      '记录第一印象的声源类型即可，系统自动取时辰。',
      '适合突如其来的叫声、铃声或环境噪音。',
    ],
  },
  {
    value: 'color',
    label: '颜色起卦',
    description: '根据醒目的颜色择卦，结合节气时序推演动爻。',
    category: '观物起卦法',
    hint: '观色取象',
    tips: [
      '选取最让你在意的主色调，支持梦境或现场感受。',
      '系统会结合月份与时辰，辅助判断天地气运。',
    ],
  },
  {
    value: 'object',
    label: '物象起卦',
    description: '通过物体的形状、材质与状态匹配卦象，无法匹配时以笔画补足。',
    category: '观物起卦法',
    hint: '见物取卦',
    tips: [
      '可描述形状、材质、动静等特征，关键词越明确越好。',
      '若无对应卦象，系统会用文字笔画重新推算。',
    ],
  },
  {
    value: 'manual',
    label: '随机起卦',
    description: '完全依据此刻的年、月、日、时、分、秒生成卦象，贴合当下心念。',
    category: '其他',
    hint: '心动即占',
    tips: [
      '静心聚焦问题，点击按钮即可生成随机卦象。',
      '适合作为快速灵感或无外物辅助时的选择。',
    ],
  },
];

const methodGroupOrder = ['传统起卦法', '观物起卦法', '其他'] as const;

const divinationMethodGroups = methodGroupOrder.map(category => ({
  title: category,
  items: divinationMethods.filter(method => method.category === category),
}));

const divinationMethodLookup = divinationMethods.reduce((acc, method) => {
  acc[method.value] = method;
  return acc;
}, {} as Record<DivinationType, DivinationMethodOption>);

function MethodIcon({ type, active }: { type: DivinationType; active: boolean }) {
  const className = active
    ? 'h-5 w-5 text-white'
    : 'h-5 w-5 text-indigo-500 dark:text-indigo-300';
  const strokeWidth = 1.6;

  switch (type) {
    case 'time':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
          <circle cx="12" cy="12" r="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8v4l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'number':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 8h10M7 12h10M10 5v14M14 5v14" />
        </svg>
      );
    case 'text':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h14M12 6v12M8 18h8" />
          <path d="M8 12h8M8 15h6" />
        </svg>
      );
    case 'direction':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8l3 5-5 3 2-8z" />
        </svg>
      );
    case 'sound':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 10v4h2.5L11 17V7l-3.5 3H5z" />
          <path d="M15 10.5a2 2 0 010 3M17 9a4 4 0 010 6" />
        </svg>
      );
    case 'color':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="2.4" />
          <circle cx="14" cy="10" r="2.4" />
          <circle cx="12" cy="14" r="2.4" />
        </svg>
      );
    case 'object':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4l7 4v8l-7 4-7-4V8l7-4z" />
          <path d="M12 12l7-4" />
          <path d="M12 12l-7-4" />
          <path d="M12 12v8" />
        </svg>
      );
    case 'manual':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5l1.3 3.6 3.7 1.3-3.7 1.3L12 15l-1.3-3.8L7 9.9l3.7-1.3L12 5z" />
          <path d="M6 5.5l.6 1.6 1.6.6-1.6.6L6 10l-.6-1.7L3.8 7.7l1.6-.6L6 5.5z" />
          <path d="M18 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DivinationForm({ onSubmit }: DivinationFormProps) {
  const [divinationType, setDivinationType] = useState<DivinationType>('time');
  const [timeInput, setTimeInput] = useState(getCurrentTime());
  const [useLunar, setUseLunar] = useState(false);
  const [numbers, setNumbers] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [direction, setDirection] = useState<string>('东');
  const [sound, setSound] = useState<string>('鸟叫');
  const [color, setColor] = useState<string>('红色');
  const [objectDesc, setObjectDesc] = useState<string>('');
  const [errorField, setErrorField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const activeMethod = divinationMethodLookup[divinationType];

  useEffect(() => {
    setErrorField(null);
    setErrorMessage('');
  }, [divinationType]);

  const getFieldClass = (field: string, extra: string = '') => [
    'w-full rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors',
    extra,
    errorField === field
      ? 'border-red-500 focus:ring-red-500'
      : 'border border-gray-300 dark:border-gray-600 focus:ring-blue-500'
  ].filter(Boolean).join(' ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrorField(null);
    setErrorMessage('');

    let input: DivinationInput;

    switch (divinationType) {
      case 'time':
        input = {
          type: 'time',
          year: timeInput.year,
          month: timeInput.month,
          day: timeInput.day,
          hour: timeInput.hour,
          minute: timeInput.minute,
          useLunar: useLunar,
        };
        break;
      case 'number':
        const numberArray = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (numberArray.length < 2) {
          setErrorField('number');
          setErrorMessage('请输入至少两个有效数字，并使用逗号分隔');
          return;
        }
        input = {
          type: 'number',
          numbers: numberArray,
        };
        break;
      case 'text':
        if (!text.trim()) {
          setErrorField('text');
          setErrorMessage('请输入要测的文字内容');
          return;
        }
        input = {
          type: 'text',
          text: text.trim(),
        };
        break;
      case 'direction':
        input = {
          type: 'direction',
          direction: direction,
        };
        break;
      case 'sound':
        input = {
          type: 'sound',
          sound: sound,
        };
        break;
      case 'color':
        input = {
          type: 'color',
          color: color,
        };
        break;
      case 'object':
        if (!objectDesc.trim()) {
          setErrorField('object');
          setErrorMessage('请补充至少一个物体特征，便于起卦');
          return;
        }
        input = {
          type: 'object',
          object: objectDesc.trim(),
        };
        break;
      case 'manual':
        input = {
          type: 'manual',
        };
        break;
    }

    onSubmit(input);
  };

  const resetToCurrentTime = () => {
    setTimeInput(getCurrentTime());
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/80 border border-slate-100 dark:border-gray-700 backdrop-blur rounded-xl shadow-xl p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">梅花易数起卦</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              起卦方式
            </label>
            <span className="text-xs text-gray-400 dark:text-gray-500">点击卡片或下拉列表选择不同的起卦思路</span>
          </div>

          <div className="sm:hidden">
            <select
              value={divinationType}
              onChange={(event) => {
                const value = event.target.value;
                if (isDivinationType(value)) {
                  setDivinationType(value);
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {divinationMethodGroups.map(group => (
                <optgroup key={group.title} label={group.title}>
                  {group.items.map(method => (
                    <option key={method.value} value={method.value}>
                      {`${method.label}（${method.hint}）`}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="hidden space-y-5 sm:block">
            {divinationMethodGroups.map(group => (
              <div key={group.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400 dark:text-indigo-300/80">
                  {group.title}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.items.map(method => {
                    const isActive = method.value === divinationType;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setDivinationType(method.value)}
                        aria-pressed={isActive}
                        className={`relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500 ${isActive ? 'border-indigo-500 bg-indigo-50/80 shadow-lg dark:border-indigo-400/70 dark:bg-indigo-500/10' : 'border-transparent bg-slate-50/70 hover:border-indigo-200 dark:bg-gray-800/60 dark:hover:border-indigo-400/40'}`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isActive ? 'bg-indigo-500 text-white shadow-md dark:bg-indigo-500/80' : 'bg-white text-indigo-500 shadow-sm dark:bg-gray-900/70 dark:text-indigo-300'}`}>
                          <MethodIcon type={method.value} active={isActive} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {method.label}
                            </span>
                            <span className="rounded-full bg-indigo-100/70 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                              {method.hint}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {method.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeMethod?.tips.length ? (
          <div className="rounded-xl border border-indigo-100/80 bg-indigo-50/40 p-4 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
            <p className="mb-2 font-medium">使用建议</p>
            <ul className="space-y-1.5">
              {activeMethod.tips.map((tip, index) => (
                <li key={`${activeMethod.value}-tip-${index}`} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 dark:bg-indigo-300" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {divinationType === 'time' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">时间设置</label>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={useLunar}
                    onChange={(e) => setUseLunar(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  使用农历
                </label>
                <button
                  type="button"
                  onClick={resetToCurrentTime}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  使用当前时间
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">年</label>
                <input
                  type="number"
                  value={timeInput.year}
                  onChange={(e) => setTimeInput(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="1900"
                  max="2100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">月</label>
                <input
                  type="number"
                  value={timeInput.month}
                  onChange={(e) => setTimeInput(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">日</label>
                <input
                  type="number"
                  value={timeInput.day}
                  onChange={(e) => setTimeInput(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="31"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">时</label>
                <input
                  type="number"
                  value={timeInput.hour}
                  onChange={(e) => setTimeInput(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">分</label>
                <input
                  type="number"
                  value={timeInput.minute}
                  onChange={(e) => setTimeInput(prev => ({ ...prev, minute: Number.parseInt(e.target.value, 10) }))}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="0"
                  max="59"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据起卦时间的年、月、日、时辰和分钟进行起卦
            </p>
          </div>
        )}

        {divinationType === 'number' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输入数字
            </label>
            <input
              type="text"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              placeholder="请输入数字，用逗号分隔，如：3,7 或 15,28,43"
              className={getFieldClass('number', 'p-3')}
              aria-invalid={errorField === 'number'}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              至少输入两个数字，第三个数字可选（用于确定动爻）
            </p>
            {errorField === 'number' && (
              <p className="text-xs text-red-500">{errorMessage}</p>
            )}
          </div>
        )}

        {divinationType === 'text' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              输入文字
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入要测的文字，可以是单字、词语或句子"
              className={getFieldClass('text', 'p-3 h-24 resize-none')}
              aria-invalid={errorField === 'text'}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据文字的笔画数和字数进行起卦
            </p>
            {errorField === 'text' && (
              <p className="text-xs text-red-500">{errorMessage}</p>
            )}
          </div>
        )}

        {divinationType === 'direction' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              选择方位
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['东', '东南', '南', '西南', '西', '西北', '北', '东北'].map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setDirection(dir)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    direction === dir
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据所观察或感应到的方位进行起卦
            </p>
          </div>
        )}

        {divinationType === 'sound' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              选择声音类型
            </label>
            <select
              value={sound}
              onChange={(e) => setSound(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="鸟叫">鸟叫声</option>
              <option value="狗吠">狗吠声</option>
              <option value="雷声">雷声</option>
              <option value="风声">风声</option>
              <option value="雨声">雨声</option>
              <option value="人声">人声</option>
              <option value="车声">车声</option>
              <option value="钟声">钟声</option>
              <option value="鼓声">鼓声</option>
              <option value="其他">其他声音</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据听到的声音特征进行起卦
            </p>
          </div>
        )}

        {divinationType === 'color' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              选择颜色
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: '红色', bg: 'bg-red-500' },
                { name: '黄色', bg: 'bg-yellow-500' },
                { name: '白色', bg: 'bg-gray-200' },
                { name: '黑色', bg: 'bg-gray-900' },
                { name: '青色', bg: 'bg-cyan-500' },
                { name: '绿色', bg: 'bg-green-500' },
                { name: '紫色', bg: 'bg-purple-500' },
                { name: '灰色', bg: 'bg-gray-500' }
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    color === c.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${c.bg}`}></span>
                  <span className="text-sm">{c.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据看到的颜色进行起卦
            </p>
          </div>
        )}

        {divinationType === 'object' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              描述物体特征
            </label>
            <textarea
              value={objectDesc}
              onChange={(e) => setObjectDesc(e.target.value)}
              placeholder="请描述物体的形状、材质、用途等特征，如：圆形的、方形的、长形的、尖形的、弯曲的、中空的、静止的、流动的等"
              className={getFieldClass('object', 'p-3 h-24 resize-none')}
              aria-invalid={errorField === 'object'}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据物体的形状、性质等特征进行起卦
            </p>
            {errorField === 'object' && (
              <p className="text-xs text-red-500">{errorMessage}</p>
            )}
          </div>
        )}

        {divinationType === 'manual' && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              点击起卦按钮，系统将根据当前时刻随机生成卦象
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          开始起卦
        </button>
      </form>
    </div>
  );
}