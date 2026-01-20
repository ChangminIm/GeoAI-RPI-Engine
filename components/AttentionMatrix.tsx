
import React from 'react';

interface MatrixItem {
  source: string;
  target: string;
  strength: number;
}

interface Props {
  matrix: MatrixItem[];
}

const AttentionMatrix: React.FC<Props> = ({ matrix }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
      <h3 className="text-lg font-semibold mb-6 text-slate-800 flex items-center">
        <span className="w-2 h-6 bg-teal-500 rounded-full mr-3"></span>
        컨텍스트 연관성 맵 (Attention Relationship)
      </h3>
      <div className="flex flex-wrap gap-4">
        {matrix.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm"
          >
            <span className="font-medium text-slate-700">{item.source}</span>
            <svg className="w-4 h-4 mx-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="font-medium text-slate-700">{item.target}</span>
            <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded">
              {(item.strength * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500 italic">
        * 텍스트 맥락 내에서 각 요인이 서로의 형성에 기여하는 연관 가중치를 나타냅니다.
      </p>
    </div>
  );
};

export default AttentionMatrix;
