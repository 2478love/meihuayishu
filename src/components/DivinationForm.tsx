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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            起卦方式
          </label>
          <select
            value={divinationType}
            onChange={(e) => {
              const value = e.target.value;
              if (isDivinationType(value)) {
                setDivinationType(value);
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          >
            <optgroup label="传统起卦法">
              <option value="time">时间起卦（年月日时）</option>
              <option value="number">数字起卦（报数起卦）</option>
              <option value="text">文字起卦（测字起卦）</option>
            </optgroup>
            <optgroup label="观物起卦法">
              <option value="direction">方位起卦（八方起卦）</option>
              <option value="sound">声音起卦（闻声起卦）</option>
              <option value="color">颜色起卦（观色起卦）</option>
              <option value="object">物象起卦（见物起卦）</option>
            </optgroup>
            <optgroup label="其他">
              <option value="manual">随机起卦（心动起卦）</option>
            </optgroup>
          </select>
        </div>

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
            
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              根据起卦时间的年、月、日、时辰进行起卦
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