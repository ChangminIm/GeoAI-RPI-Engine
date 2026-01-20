
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
  AreaChart, Area
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
    <div className="space-y-12">
      {/* 점수 산출 근거 상세 */}
      <div className="bg-indigo-900 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-center md:text-left">최종 관계인구 지수 산출 근거 (Calculated Logic)</h3>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="flex flex-col items-center">
              <span className="text-indigo-300 text-xs font-bold mb-3">정서적 애착</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black">{data.metrics.emo}</span>
                <span className="text-indigo-500 text-sm font-bold">점</span>
                <span className="text-indigo-400 text-lg">×</span>
                <span className="text-2xl font-bold text-indigo-300">{data.weights.alpha.toFixed(2)}</span>
              </div>
            </div>
            <span className="text-3xl text-indigo-600 font-bold hidden md:block">+</span>
            <div className="flex flex-col items-center">
              <span className="text-indigo-300 text-xs font-bold mb-3">공간적 점유</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black">{data.metrics.spa}</span>
                <span className="text-indigo-500 text-sm font-bold">점</span>
                <span className="text-indigo-400 text-lg">×</span>
                <span className="text-2xl font-bold text-indigo-300">{data.weights.beta.toFixed(2)}</span>
              </div>
            </div>
            <span className="text-3xl text-indigo-600 font-bold hidden md:block">+</span>
            <div className="flex flex-col items-center">
              <span className="text-indigo-300 text-xs font-bold mb-3">사회적 교류</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black">{data.metrics.soc}</span>
                <span className="text-indigo-500 text-sm font-bold">점</span>
                <span className="text-indigo-400 text-lg">×</span>
                <span className="text-2xl font-bold text-indigo-300">{data.weights.gamma.toFixed(2)}</span>
              </div>
            </div>
            <span className="text-3xl text-indigo-600 font-bold hidden md:block">=</span>
            <div className="bg-white/10 px-10 py-6 rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-md">
              <span className="text-indigo-300 text-[10px] font-black uppercase block mb-2">종합 RPI 지수</span>
              <span className="text-6xl font-black text-white">{data.rpiScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '정서적 애착', weight: data.weights.alpha, score: data.metrics.emo, color: 'indigo', desc: '지역에 대한 심리적 본딩' },
          { label: '공간적 점유', weight: data.weights.beta, score: data.metrics.spa, color: 'emerald', desc: '물리적 체류 및 활동성' },
          { label: '사회적 교류', weight: data.weights.gamma, score: data.metrics.soc, color: 'amber', desc: '인적 네트워크 형성도' },
        ].map((item) => (
          <div key={item.label} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-${item.color}-500 mb-1 block`}>{item.desc}</span>
                <h4 className="text-xl font-bold text-slate-800">{item.label}</h4>
              </div>
              <div className={`px-3 py-1 bg-${item.color}-50 text-${item.color}-600 rounded-full text-xs font-black border border-${item.color}-100`}>
                중요도 {item.weight.toFixed(2)}
              </div>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900">{item.score}</span>
              <span className="text-slate-400 font-bold">점</span>
            </div>
            <div className="mt-6 w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div 
                className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
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
                  fillOpacity={0.2}
                  strokeWidth={4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-2.5 h-7 bg-rose-500 rounded-full"></span>
            단계별 관계 형성 궤적
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trajectory || []}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f43f5e" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorScore)"
                  dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-between px-6 py-4 bg-rose-50 rounded-3xl border border-rose-100">
             <div className="flex items-center gap-3">
               <span className="text-2xl">⚡</span>
               <div>
                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">분석된 결정적 시점</span>
                 <div className="text-sm font-black text-rose-700">{data.criticalPeriod}</div>
               </div>
             </div>
             <span className="text-xs font-bold text-rose-400 bg-white px-3 py-1 rounded-full shadow-sm">분석: 긍정적 유대감 형성</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-10 rounded-[4rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-white text-3xl font-black mb-2 flex items-center gap-3">
                <span className="w-2.5 h-8 bg-cyan-400 rounded-full"></span>
                시공간 지식 그래프
              </h3>
              <p className="text-slate-400 font-medium text-sm italic">텍스트 맥락에서 추출된 장소와 활동 간의 시맨틱 관계망</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-4 space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">추출된 핵심 엔티티</h4>
               <div className="flex flex-wrap gap-2">
                 {(data.knowledgeGraph?.nodes || []).map(node => (
                    <div key={node.id} className={`px-4 py-2 rounded-2xl border flex items-center gap-3 transition-all hover:scale-105 ${
                      node.type === 'Place' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                      node.type === 'Activity' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        node.type === 'Place' ? 'bg-cyan-400' : node.type === 'Activity' ? 'bg-indigo-400' : 'bg-emerald-400'
                      }`}></div>
                      <span className="font-bold text-sm">{node.label}</span>
                    </div>
                 ))}
               </div>
            </div>

            <div className="xl:col-span-8">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">연관 강도 분석</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(data.knowledgeGraph?.edges || []).slice(0, 10).map((edge, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between group/edge hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-200 font-bold text-sm">{edge.source}</span>
                        <div className="flex items-center">
                          <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                          <div className="w-12 h-[1px] bg-gradient-to-r from-slate-600 to-transparent"></div>
                        </div>
                        <span className="text-slate-200 font-bold text-sm">{edge.target}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-cyan-400">{(edge.strength * 100).toFixed(0)}%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Context Strength</span>
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
