
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip
} from 'recharts';
import { AnalysisResult } from '../types';

interface Props {
  data: AnalysisResult;
}

const RPIVisualization: React.FC<Props> = ({ data }) => {
  // Ensure we have data for the charts
  const radarData = [
    { subject: '정서적 애착 (X_emo)', A: data.metrics?.emo || 0, fullMark: 100 },
    { subject: '공간적 점유 (X_spa)', A: data.metrics?.spa || 0, fullMark: 100 },
    { subject: '사회적 교류 (X_soc)', A: data.metrics?.soc || 0, fullMark: 100 },
  ];

  const trajectoryData = data.trajectory || [];
  const graphNodes = data.knowledgeGraph?.nodes || [];
  const graphEdges = data.knowledgeGraph?.edges || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RPI 3대 지표 Radar Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            RPI 3대 핵심 지표 (Radar)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                <Radar
                  name="RPI Metrics"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-indigo-50 rounded-xl">
              <div className="text-[10px] text-indigo-400 font-bold uppercase">Alpha (α)</div>
              <div className="text-sm font-black text-indigo-700">{( (data.weights?.alpha || 0) * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-xl">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">Beta (β)</div>
              <div className="text-sm font-black text-emerald-700">{( (data.weights?.beta || 0) * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-xl">
              <div className="text-[10px] text-amber-400 font-bold uppercase">Gamma (γ)</div>
              <div className="text-sm font-black text-amber-700">{( (data.weights?.gamma || 0) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* Sentiment Trajectory Line Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
            감성 궤적 (Sentiment Trajectory)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f43f5e" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <div className="text-[10px] text-rose-400 font-bold uppercase">Critical Period (결정적 시기)</div>
              <div className="text-sm font-bold text-rose-700">{data.criticalPeriod || '분석 중...'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ST-KG Knowledge Graph Representation */}
      <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full"></span>
            시공간 지식 그래프 (ST-KG Explorer)
          </h3>
          <div className="flex flex-wrap gap-4">
            {graphNodes.length > 0 ? graphNodes.map(node => (
              <div key={node.id} className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all hover:scale-105 cursor-default ${
                node.type === 'Place' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                node.type === 'Activity' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                <span className="text-xs font-bold uppercase opacity-60">{node.type}</span>
                <span className="font-bold">{node.label}</span>
              </div>
            )) : (
              <p className="text-slate-500 text-sm">노드 정보가 없습니다.</p>
            )}
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {graphEdges.length > 0 ? graphEdges.slice(0, 6).map((edge, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center">
                <span className="text-xs text-slate-400">{edge.source} ➔ {edge.target}</span>
                <span className="text-xs font-black text-cyan-400">{( (edge.strength || 0) * 100).toFixed(0)}%</span>
              </div>
            )) : (
              <p className="text-slate-500 text-sm col-span-full">관계 정보가 없습니다.</p>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default RPIVisualization;
