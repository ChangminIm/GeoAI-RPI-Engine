
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip
} from 'recharts';
import { AnalysisResult } from '../types';

interface Props {
  data: AnalysisResult;
}

const RPIVisualization: React.FC<Props> = ({ data }) => {
  const radarData = [
    { subject: '정서적 애착', A: data.metrics?.emo || 0, fullMark: 100 },
    { subject: '공간적 점유', A: data.metrics?.spa || 0, fullMark: 100 },
    { subject: '사회적 교류', A: data.metrics?.soc || 0, fullMark: 100 },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* 점수 산출 공식 보드 (Explainability) */}
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            <h3 className="text-indigo-300 text-xs font-black uppercase tracking-[0.4em]">최종 지수 산출 근거 (RPI Breakdown)</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: '정서적 애착', score: data.metrics.emo, weight: data.weights.alpha, color: 'indigo' },
                { label: '공간적 점유', score: data.metrics.spa, weight: data.weights.beta, color: 'emerald' },
                { label: '사회적 교류', score: data.metrics.soc, weight: data.weights.gamma, color: 'amber' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center hover:bg-white/10 transition-colors">
                  <span className="text-slate-400 text-[10px] font-black uppercase mb-3 block">{item.label}</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black text-white">{item.score}</span>
                    <span className="text-slate-500 font-bold">×</span>
                    <span className="text-xl font-bold text-indigo-400">{item.weight.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center shrink-0">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </div>

            <div className="bg-white text-slate-900 px-12 py-8 rounded-[2.5rem] shadow-2xl text-center min-w-[200px]">
              <span className="text-slate-400 text-[10px] font-black uppercase block mb-1">최종 관계인구 지수</span>
              <span className="text-6xl font-black tracking-tighter">{data.rpiScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 요인별 밸런스 */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-2.5 h-7 bg-indigo-600 rounded-full"></span>
            지표 밸런스 분석
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.25}
                  strokeWidth={4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 감성 궤적 */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-2.5 h-7 bg-rose-500 rounded-full"></span>
            관계 형성 감성 궤적
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trajectory || []}>
                <defs>
                  <linearGradient id="colorTrajectory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#f43f5e' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f43f5e" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTrajectory)"
                  dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex items-center justify-between p-6 bg-rose-50 rounded-3xl border border-rose-100/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-200">✨</div>
              <div>
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">결정적 순간</span>
                <div className="text-base font-black text-rose-800">{data.criticalPeriod}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 시공간 지식 그래프 */}
      <div className="bg-slate-950 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h3 className="text-white text-3xl font-black mb-2 flex items-center gap-4">
                <span className="w-2.5 h-10 bg-cyan-400 rounded-full"></span>
                시공간 지식 그래프
              </h3>
              <p className="text-slate-400 font-medium italic">텍스트 맥락에서 AI가 학습한 핵심 개체 연관 관계</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            <div className="xl:col-span-4 space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">추출된 핵심 요소</h4>
              <div className="flex flex-wrap gap-2">
                {(data.knowledgeGraph?.nodes || []).map(node => (
                  <div key={node.id} className={`px-5 py-2.5 rounded-2xl border flex items-center gap-3 transition-all hover:scale-105 ${
                    node.type === 'Place' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                    node.type === 'Activity' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                    'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      node.type === 'Place' ? 'bg-cyan-400' : node.type === 'Activity' ? 'bg-indigo-400' : 'bg-emerald-400'
                    }`}></div>
                    <span className="font-bold text-sm">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-8">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">연관 연산 분석</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.knowledgeGraph?.edges || []).slice(0, 8).map((edge, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all group/edge">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-200 font-black text-sm">{edge.source}</span>
                      <div className="w-8 h-[2px] bg-slate-700 group-hover/edge:bg-indigo-500 transition-colors"></div>
                      <span className="text-slate-200 font-black text-sm">{edge.target}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-black text-xs">{(edge.strength * 100).toFixed(0)}%</div>
                      <span className="text-[8px] font-bold text-slate-600 uppercase">Weight</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPIVisualization;
