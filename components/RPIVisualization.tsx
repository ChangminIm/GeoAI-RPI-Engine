
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
  const radarData = [
    { subject: '정서(X_emo)', A: data.metrics?.emo || 0, fullMark: 100 },
    { subject: '공간(X_spa)', A: data.metrics?.spa || 0, fullMark: 100 },
    { subject: '교류(X_soc)', A: data.metrics?.soc || 0, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RPI 3대 지표 Radar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              핵심 지표 및 어텐션 가중치
            </h3>
            <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              EQUATION: RPI = Σ(W_i * X_i)
            </div>
          </div>
          
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fill: '#475569', fontWeight: 'bold' }} />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
              <div className="text-[11px] text-indigo-500 font-black mb-1">정서적 애착 (α)</div>
              <div className="text-2xl font-black text-indigo-700">{(data.weights?.alpha || 0).toFixed(2)}</div>
              <div className="text-[10px] text-indigo-400 font-bold mt-1">Score: {data.metrics?.emo || 0}</div>
            </div>
            <div className="text-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <div className="text-[11px] text-emerald-500 font-black mb-1">공간적 점유 (β)</div>
              <div className="text-2xl font-black text-emerald-700">{(data.weights?.beta || 0).toFixed(2)}</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">Score: {data.metrics?.spa || 0}</div>
            </div>
            <div className="text-center p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <div className="text-[11px] text-amber-500 font-black mb-1">사회적 교류 (γ)</div>
              <div className="text-2xl font-black text-amber-700">{(data.weights?.gamma || 0).toFixed(2)}</div>
              <div className="text-[10px] text-amber-400 font-bold mt-1">Score: {data.metrics?.soc || 0}</div>
            </div>
          </div>
        </div>

        {/* Sentiment Trajectory Line Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
            시계열 감성 궤적
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trajectory || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f43f5e" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 10, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500 font-bold">🎯</div>
              <div>
                <div className="text-[10px] text-slate-400 font-black uppercase">Critical Period</div>
                <div className="text-sm font-black text-slate-800">{data.criticalPeriod || 'N/A'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-black uppercase">Trajectory Type</div>
              <div className="text-sm font-black text-indigo-600">Ascending Path</div>
            </div>
          </div>
        </div>
      </div>

      {/* ST-KG Graph */}
      <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white text-xl font-black flex items-center gap-2">
              <span className="w-2 h-6 bg-cyan-400 rounded-full"></span>
              ST-KG: 시공간 지식 그래프 탐색기
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-700 px-3 py-1 rounded-full">Graph Database Mode</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {(data.knowledgeGraph?.nodes || []).map(node => (
              <div key={node.id} className={`px-5 py-2.5 rounded-2xl border transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3 ${
                node.type === 'Place' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                node.type === 'Activity' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                   node.type === 'Place' ? 'bg-cyan-400' : node.type === 'Activity' ? 'bg-indigo-400' : 'bg-emerald-400'
                }`}></div>
                <span className="text-[10px] font-black uppercase opacity-40">{node.type}</span>
                <span className="font-bold text-sm">{node.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(data.knowledgeGraph?.edges || []).slice(0, 8).map((edge, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase mb-3">
                  <span>Connection #{idx+1}</span>
                  <span className="text-cyan-400">Strength: {( (edge.strength || 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="font-bold">{edge.source}</span>
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  <span className="font-bold">{edge.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPIVisualization;
