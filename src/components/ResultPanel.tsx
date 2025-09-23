'use client';

import { DivinationResult } from '@/types';
import HexagramDisplay from './HexagramDisplay';

interface ResultPanelProps {
  result: DivinationResult;
  onReset: () => void;
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">卦象结果</h1>
        <p className="text-sm text-gray-600">
          起卦时间：{result.time.toLocaleString('zh-CN')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <HexagramDisplay
          hexagram={result.mainHexagram}
          changingLine={result.changingLine}
          title="主卦"
        />


      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">卦象解读</h3>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-gray-700 font-sans">
            {result.interpretation}
          </pre>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          重新起卦
        </button>
      </div>
    </div>
  );
}