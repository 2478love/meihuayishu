'use client';

import { Hexagram } from '@/types';
import { getHexagramLines } from '@/lib/hexagrams';

interface HexagramDisplayProps {
  hexagram: Hexagram;
  changingLine?: number;
  title?: string;
}

export default function HexagramDisplay({ hexagram, changingLine, title }: HexagramDisplayProps) {
  const lines = getHexagramLines(hexagram.upperTrigram, hexagram.lowerTrigram);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      )}

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{hexagram.name}卦</h2>
        <p className="text-gray-600">第{hexagram.number}卦</p>
      </div>

      <div className="flex flex-col items-center mb-6">
        {lines.map((isYang, index) => {
          const lineNumber = 6 - index; // 从上到下，第6爻到第1爻
          const isChanging = changingLine === lineNumber;

          return (
            <div key={index} className="mb-2 relative">
              <div className={`flex items-center justify-center ${isChanging ? 'bg-red-100 rounded px-2 py-1' : ''}`}>
                <span className="text-xs text-gray-500 mr-2 w-4">{lineNumber}</span>
                <div className="flex items-center">
                  {isYang ? (
                    <div className={`h-1 w-16 bg-gray-800 ${isChanging ? 'bg-red-600' : ''}`}></div>
                  ) : (
                    <div className="flex items-center">
                      <div className={`h-1 w-7 bg-gray-800 ${isChanging ? 'bg-red-600' : ''}`}></div>
                      <div className="w-2"></div>
                      <div className={`h-1 w-7 bg-gray-800 ${isChanging ? 'bg-red-600' : ''}`}></div>
                    </div>
                  )}
                </div>
                {isChanging && (
                  <span className="text-xs text-red-600 ml-2">动</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">{hexagram.meaning}</p>
        <p className="text-xs text-gray-500">{hexagram.description}</p>
      </div>
    </div>
  );
}